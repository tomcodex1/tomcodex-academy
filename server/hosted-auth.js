import { createHmac, randomBytes, randomInt, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { createAcademyAiHandler, aiEngine, buildSkillPassportUpdate, moduleProgression, evaluateCertificateEligibility } from "zentom-ai-core";

const scrypt = promisify(scryptCallback);
const SESSION_SECONDS = 7 * 24 * 60 * 60;
const RESET_SECONDS = 15 * 60;
const STUDENT_SET_KEY = "tomcodex:students";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ADMIN_LAB_ATTEMPTS_KEY = "tomcodex.adminLabAttempts.v1";
const SKILL_PASSPORT_KEY = "tomcodex.skillPassport.v1";
const MODULE_UNLOCKS_KEY = "tomcodex.moduleUnlocks.v1";
process.env.FREE_DAILY_AI_LIMIT ||= "50";
process.env.FOUNDER_DAILY_AI_LIMIT ||= "1000";

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redis(command) {
  const config = redisConfig();
  if (!config) throw new Error("Hosted student accounts require an Upstash Redis database connected to this Vercel project.");
  const response = await fetch(config.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.error) throw new Error(result.error || "Hosted account database request failed.");
  return result.result;
}

function secureMatch(value, expected) {
  const valueBuffer = Buffer.from(String(value || ""));
  const expectedBuffer = Buffer.from(String(expected || ""));
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

function sessionSecret() {
  return process.env.AUTH_SESSION_SECRET || "";
}

function readCookie(request, name) {
  const match = String(request.headers.cookie || "").split(";").find((cookie) => cookie.trim().startsWith(`${name}=`));
  return match ? decodeURIComponent(match.trim().slice(name.length + 1)) : "";
}

function createSession(response, payload) {
  const secret = sessionSecret();
  if (!secret) throw new Error("Add AUTH_SESSION_SECRET in Vercel environment variables.");
  const body = Buffer.from(JSON.stringify({ ...payload, expiresAt: Date.now() + SESSION_SECONDS * 1000 })).toString("base64url");
  const signature = createHmac("sha256", secret).update(body).digest("base64url");
  response.setHeader("Set-Cookie", `tomcodexHosted=${body}.${signature}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}`);
}

function readSession(request) {
  const secret = sessionSecret();
  const [body, signature] = readCookie(request, "tomcodexHosted").split(".");
  if (!secret || !body || !signature) return null;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  if (!secureMatch(signature, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

async function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = await scrypt(password, salt, 64);
  return { salt, hash: Buffer.from(hash).toString("hex") };
}

async function validPassword(password, student) {
  const candidate = await hashPassword(password, student.passwordSalt);
  return secureMatch(candidate.hash, student.passwordHash);
}

function validStudentPassword(password) {
  return typeof password === "string" && password.length >= 8
    && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
}

function studentKey(email) {
  return `tomcodex:student:${String(email).trim().toLowerCase()}`;
}

async function loadStudent(email) {
  const value = await redis(["GET", studentKey(email)]);
  return value ? JSON.parse(value) : null;
}

async function saveStudent(student) {
  await redis(["SET", studentKey(student.email), JSON.stringify(student)]);
  await redis(["SADD", STUDENT_SET_KEY, student.email]);
}

async function createStudent(student) {
  const created = await redis(["SET", studentKey(student.email), JSON.stringify(student), "NX"]);
  if (!created) return false;
  await redis(["SADD", STUDENT_SET_KEY, student.email]);
  return true;
}

async function loadStudentById(id) {
  if (!redisConfig()) return null;
  const emails = await redis(["SMEMBERS", STUDENT_SET_KEY]) || [];
  const students = (await Promise.all(emails.map(loadStudent))).filter(Boolean);
  return students.find((candidate) => candidate.id === id) || null;
}


function publicStudent(student) {
  const usage = student.usage || {
    requestsToday: 0,
    lastRequestDate: new Date().toISOString().split("T")[0]
  };
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    role: "student",
    enrolledAt: student.createdAt,
    progress: student.progress || {},
    tier: student.tier || "free",
    personalApiKey: student.personalApiKey || "",
    usage: {
      requestsToday: usage.requestsToday,
      lastRequestDate: usage.lastRequestDate,
      dailyLimit: 50
    }
  };
}

function configuredStudent() {
  const email = String(process.env.HOSTED_STUDENT_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.HOSTED_STUDENT_PASSWORD || "");
  if (!email || !password) return null;
  return {
    id: "hosted-student",
    name: String(process.env.HOSTED_STUDENT_NAME || "TomCodeX Student").trim(),
    email,
    password,
    role: "student",
    createdAt: process.env.HOSTED_STUDENT_ENROLLED_AT || new Date().toISOString(),
    progress: {}
  };
}

function requireStudent(request, response) {
  const session = readSession(request);
  if (session?.role !== "student") {
    response.status(401).json({ error: "Student sign-in is required." });
    return null;
  }
  return session;
}

function requireTutor(request, response) {
  const session = readSession(request);
  if (session?.role !== "tutor") {
    response.status(401).json({ error: "Tutor sign-in is required." });
    return null;
  }
  return session;
}

function supportedProgressKey(key) {
  return key === "salesforceMasterDashboard.v1"
    || key === "tomcodex.learningRecords.v1"
    || key === "tomcodex.interviewHistory.v1"
    || key === "tomcodex.courseEnrollments.v1"
    || key === "tomcodex.personalizedPath.v1"
    || key === "tomcodex.aiCodeReviews.v1"
    || key === "tomcodex.adminCourseProgress.v1"
    || key === ADMIN_LAB_ATTEMPTS_KEY
    || key === SKILL_PASSPORT_KEY
    || key === MODULE_UNLOCKS_KEY
    || /^tomcodex\.(admin|apex|flow|lwc)MasteryScores\.v1(\.finalExam)?$/.test(key);
}

function parseStudentProgress(student, key, fallback) {
  try {
    return JSON.parse(student.progress?.[key] || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function saveStudentProgressObject(student, key, value) {
  student.progress ||= {};
  student.progress[key] = JSON.stringify(value);
  student.progressUpdatedAt = new Date().toISOString();
}

async function persistAdminModuleOneSkillPassport({ userId, skillPassportUpdate, result }) {
  if (!redisConfig()) {
    return {
      browserOnly: true,
      bestScore: Number(skillPassportUpdate?.score || result?.data?.score || 0)
    };
  }

  const emails = await redis(["SMEMBERS", STUDENT_SET_KEY]) || [];
  const students = (await Promise.all(emails.map(loadStudent))).filter(Boolean);
  const student = students.find((candidate) => candidate.id === userId);
  if (!student) throw new Error("Student account not found.");

  const moduleId = skillPassportUpdate?.moduleId || "admin-module-1";
  const skillId = skillPassportUpdate?.skillId || "salesforce-platform-foundations";
  const score = Number(skillPassportUpdate?.score || result?.data?.score || 0);
  const passed = score >= 80;
  const attemptStatus = passed ? "Verified" : "Try Again";
  const timestamp = new Date().toISOString();

  const attemptHistory = parseStudentProgress(student, ADMIN_LAB_ATTEMPTS_KEY, {});
  const moduleAttempts = Array.isArray(attemptHistory[moduleId]) ? attemptHistory[moduleId] : [];
  const attempts = moduleAttempts.concat({
    attempt: moduleAttempts.length + 1,
    score,
    status: attemptStatus,
    feedback: skillPassportUpdate?.feedback || result?.data?.feedback || "",
    createdAt: timestamp
  });
  const bestScore = attempts.reduce((best, attempt) => Math.max(best, Number(attempt.score) || 0), 0);
  attemptHistory[moduleId] = attempts;
  attemptHistory[`${moduleId}:summary`] = {
    bestScore,
    status: bestScore >= 80 ? "Verified" : "Try Again",
    attempts: attempts.length,
    updatedAt: timestamp
  };

  const skillPassport = parseStudentProgress(student, SKILL_PASSPORT_KEY, {});
  skillPassport[skillId] = {
    module: "Admin Module 1",
    skill: "Salesforce Platform Foundations",
    score: bestScore,
    status: bestScore >= 80 ? "Verified" : "Try Again",
    pocStage: bestScore >= 80 ? "Foundation Started" : "Foundation In Progress",
    updatedAt: timestamp
  };

  const unlocks = parseStudentProgress(student, MODULE_UNLOCKS_KEY, {});
  unlocks[moduleId] = {
    labVerified: passed,
    modulePracticeCompleted: passed,
    skillPassportUpdated: true,
    nextModuleUnlockCandidate: passed,
    nextModuleAccess: student.tier === "founder" && passed ? "unlocked" : "upgrade_required",
    updatedAt: timestamp
  };

  saveStudentProgressObject(student, ADMIN_LAB_ATTEMPTS_KEY, attemptHistory);
  saveStudentProgressObject(student, SKILL_PASSPORT_KEY, skillPassport);
  saveStudentProgressObject(student, MODULE_UNLOCKS_KEY, unlocks);
  await saveStudent(student);

  return {
    attemptHistory: attemptHistory[moduleId],
    bestScore,
    skillPassportUpdate: skillPassport[skillId],
    unlock: unlocks[moduleId]
  };
}

async function persistDynamicSkillPassport({ student, moduleId, labId, skillId, score, passed, feedback }) {
  const attemptStatus = passed ? "Verified" : "Try Again";
  const timestamp = new Date().toISOString();

  const attemptHistory = parseStudentProgress(student, ADMIN_LAB_ATTEMPTS_KEY, {});
  const moduleAttempts = Array.isArray(attemptHistory[moduleId]) ? attemptHistory[moduleId] : [];
  const attempts = moduleAttempts.concat({
    attempt: moduleAttempts.length + 1,
    score,
    status: attemptStatus,
    feedback: feedback || "",
    createdAt: timestamp
  });
  const bestScore = attempts.reduce((best, attempt) => Math.max(best, Number(attempt.score) || 0), 0);
  attemptHistory[moduleId] = attempts;
  attemptHistory[`${moduleId}:summary`] = {
    bestScore,
    status: bestScore >= 80 ? "Verified" : "Try Again",
    attempts: attempts.length,
    updatedAt: timestamp
  };

  const moduleConfig = moduleProgression.find(m => m.moduleId === moduleId) || {};
  const moduleName = moduleConfig.moduleName || "Salesforce Module";
  const skillName = skillId
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const skillPassport = parseStudentProgress(student, SKILL_PASSPORT_KEY, {});
  skillPassport[skillId] = {
    module: moduleName,
    skill: skillName,
    score: bestScore,
    status: bestScore >= 80 ? "Verified" : "Try Again",
    pocStage: bestScore >= 80 ? "Foundation Started" : "Foundation In Progress",
    updatedAt: timestamp
  };

  const unlocks = parseStudentProgress(student, MODULE_UNLOCKS_KEY, {});
  unlocks[moduleId] = {
    labVerified: passed,
    modulePracticeCompleted: passed,
    skillPassportUpdated: true,
    nextModuleUnlockCandidate: passed,
    nextModuleAccess: student.tier === "founder" && passed ? "unlocked" : "upgrade_required",
    updatedAt: timestamp
  };

  saveStudentProgressObject(student, ADMIN_LAB_ATTEMPTS_KEY, attemptHistory);
  saveStudentProgressObject(student, SKILL_PASSPORT_KEY, skillPassport);
  saveStudentProgressObject(student, MODULE_UNLOCKS_KEY, unlocks);
  await saveStudent(student);

  return {
    attemptHistory: attemptHistory[moduleId],
    bestScore,
    skillPassportUpdate: skillPassport[skillId],
    unlock: unlocks[moduleId]
  };
}

function getDynamicUnlockDecision({ student, moduleId, tier }) {
  const currentConfig = moduleProgression.find(m => m.moduleId === moduleId);
  if (!currentConfig) {
    return {
      currentModuleId: moduleId,
      nextModuleId: "unknown",
      eligibleToUnlock: false,
      reason: `Module configuration not found for ${moduleId}.`
    };
  }

  const nextModuleId = currentConfig.nextModuleId;
  if (!nextModuleId) {
    return {
      currentModuleId: moduleId,
      nextModuleId: null,
      eligibleToUnlock: false,
      reason: `No subsequent module after ${moduleId}.`
    };
  }

  const nextConfig = moduleProgression.find(m => m.moduleId === nextModuleId);
  if (!nextConfig) {
    return {
      currentModuleId: moduleId,
      nextModuleId,
      eligibleToUnlock: false,
      reason: `Configuration not found for next module ${nextModuleId}.`
    };
  }

  const prerequisites = currentConfig.prerequisites || [];
  const attemptHistory = parseStudentProgress(student, ADMIN_LAB_ATTEMPTS_KEY, {});
  const summaryKey = `${moduleId}:summary`;
  const bestScore = attemptHistory[summaryKey]?.bestScore || 0;

  for (const prereq of prerequisites) {
    if (bestScore < prereq.minPassingScore) {
      return {
        currentModuleId: moduleId,
        nextModuleId,
        eligibleToUnlock: false,
        reason: `Lab score of ${bestScore}% is below the passing score of ${prereq.minPassingScore}%.`
      };
    }
  }

  if (nextConfig.requiredTier === "founder" && tier !== "founder") {
    return {
      currentModuleId: moduleId,
      nextModuleId,
      eligibleToUnlock: false,
      reason: `Module 2 requires Founder Access.`
    };
  }

  const mainPrereq = prerequisites[0] || {};
  return {
    currentModuleId: moduleId,
    nextModuleId,
    eligibleToUnlock: true,
    reason: `Lab score is ${bestScore}% and passing score is ${mainPrereq.minPassingScore || 80}%.`
  };
}

async function sendResetEmail(email, resetCode) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESET_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Password reset email is not configured. Add RESEND_API_KEY and RESET_FROM_EMAIL in Vercel.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your TomCodeX Academy password reset code",
      html: `<p>Your TomCodeX Academy password reset code is:</p><p style="font-size:24px;font-weight:700;letter-spacing:4px">${resetCode}</p><p>This code expires in 15 minutes. If you did not request it, you can ignore this email.</p>`
    })
  });
  if (!response.ok) throw new Error("Password reset email could not be sent.");
}

export function registerHostedAuthRoutes(app) {
  app.get("/api/auth/google", (request, response) => {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (clientID && clientSecret) {
      // Use x-forwarded headers from Vercel's edge proxy for correct https:// protocol
      const protocol = request.headers["x-forwarded-proto"] || request.protocol;
      const host = request.headers["x-forwarded-host"] || request.get("host");
      const redirectUri = encodeURIComponent(`${protocol}://${host}/api/auth/google/callback`);
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`;
      return response.redirect(googleAuthUrl);
    } else {
      return response.redirect("/google-mock-auth.html");
    }
  });

  app.get("/api/auth/google/callback", async (request, response) => {
    const mock = request.query.mock === "true";
    let email = "";
    let name = "";
    
    if (mock) {
      email = String(request.query.email || "").trim().toLowerCase();
      name = String(request.query.name || "").trim();
    } else {
      const code = request.query.code;
      const clientID = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = `${request.headers["x-forwarded-proto"] || request.protocol}://${request.headers["x-forwarded-host"] || request.get("host")}/api/auth/google/callback`;
      
      if (!code || !clientID || !clientSecret) {
        return response.redirect("/access.html?error=Google authentication failed");
      }
      
      try {
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            client_id: clientID,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code"
          })
        });
        
        const tokens = await tokenRes.json();
        if (!tokens.access_token) throw new Error("No access token returned");
        
        const infoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${tokens.access_token}` }
        });
        const profile = await infoRes.json();
        email = String(profile.email || "").trim().toLowerCase();
        name = String(profile.name || "").trim() || email.split("@")[0];
      } catch (error) {
        return response.redirect("/access.html?error=Google API token exchange failed");
      }
    }
    
    if (!email) {
      return response.redirect("/access.html?error=No email provided by Google account");
    }
    
    try {
      let student = await loadStudent(email);
      if (!student) {
        student = {
          id: `std_${randomBytes(16).toString("hex")}`,
          name: name || "Google Student",
          email,
          passwordHash: "",
          passwordSalt: "",
          createdAt: new Date().toISOString(),
          progress: {},
          tier: "free",
          personalApiKey: "",
          usage: {
            requestsToday: 0,
            lastRequestDate: new Date().toISOString().split("T")[0]
          }
        };
        await saveStudent(student);
      } else {
        student.usage ||= {
          requestsToday: 0,
          lastRequestDate: new Date().toISOString().split("T")[0]
        };
        student.lastLoginAt = new Date().toISOString();
        await saveStudent(student);
      }
      
      createSession(response, { email: student.email, role: "student" });
      return response.redirect("/learner-dashboard");
    } catch (error) {
      return response.redirect(`/access.html?error=${encodeURIComponent(error.message)}`);
    }
  });

  app.post("/api/student-signup", async (request, response) => {
    try {
      const name = String(request.body?.name || "").trim();
      const email = String(request.body?.email || "").trim().toLowerCase();
      const password = String(request.body?.password || "");
      if (name.length < 2 || !EMAIL_PATTERN.test(email)) return response.status(400).json({ error: "Enter a valid name and email address." });
      if (!validStudentPassword(password)) return response.status(400).json({ error: "Password must use at least 8 characters with uppercase, lowercase, and a number." });
      const passwordData = await hashPassword(password);
      const createdAt = new Date().toISOString();
      const student = { id: randomBytes(12).toString("hex"), name, email, passwordSalt: passwordData.salt, passwordHash: passwordData.hash, progress: {}, createdAt, lastLoginAt: createdAt };
      if (!await createStudent(student)) return response.status(409).json({ error: "A student account already exists for this email." });
      createSession(response, { role: "student", email });
      return response.status(201).json(publicStudent(student));
    } catch (error) {
      return response.status(503).json({ error: error.message });
    }
  });

  app.post("/api/student-login", async (request, response) => {
    const email = String(request.body?.email || "").trim().toLowerCase();
    const password = String(request.body?.password || "");
    try {
      const student = redisConfig() ? await loadStudent(email) : null;
      if (student && await validPassword(password, student)) {
        student.lastLoginAt = new Date().toISOString();
        await saveStudent(student);
        createSession(response, { role: "student", email });
        return response.json(publicStudent(student));
      }
      const fallback = configuredStudent();
      if (!fallback || !secureMatch(email, fallback.email) || !secureMatch(password, fallback.password)) {
        return response.status(401).json({ error: "Invalid student email or password." });
      }
      createSession(response, { role: "student", email });
      return response.json(publicStudent(fallback));
    } catch (error) {
      return response.status(503).json({ error: error.message });
    }
  });

  app.post("/api/student-forgot-password", async (request, response) => {
    try {
      const email = String(request.body?.email || "").trim().toLowerCase();
      const student = await loadStudent(email);
      if (!student) return response.json({ message: "If an account exists for this email, a reset code has been sent." });
      const resetCode = String(randomInt(100000, 1000000));
      await redis(["SET", `tomcodex:reset:${email}`, resetCode, "EX", RESET_SECONDS]);
      if (process.env.NODE_ENV === "test" || process.env.ALLOW_RESET_CODE_RESPONSE === "true") {
        return response.json({ message: "Reset code created.", resetCode });
      }
      await sendResetEmail(email, resetCode);
      return response.json({ message: "If an account exists for this email, a reset code has been sent." });
    } catch (error) {
      return response.status(503).json({ error: error.message });
    }
  });

  app.post("/api/student-reset-password", async (request, response) => {
    try {
      const email = String(request.body?.email || "").trim().toLowerCase();
      const resetCode = String(request.body?.resetCode || "").trim();
      const newPassword = String(request.body?.newPassword || "");
      if (!validStudentPassword(newPassword)) return response.status(400).json({ error: "Password must use at least 8 characters with uppercase, lowercase, and a number." });
      const expectedCode = await redis(["GET", `tomcodex:reset:${email}`]);
      if (!expectedCode || !secureMatch(resetCode, expectedCode)) return response.status(400).json({ error: "The reset code is invalid or expired." });
      const student = await loadStudent(email);
      if (!student) return response.status(404).json({ error: "Student account not found." });
      const passwordData = await hashPassword(newPassword);
      student.passwordSalt = passwordData.salt;
      student.passwordHash = passwordData.hash;
      student.passwordUpdatedAt = new Date().toISOString();
      await saveStudent(student);
      await redis(["DEL", `tomcodex:reset:${email}`]);
      return response.json({ message: "Password updated successfully." });
    } catch (error) {
      return response.status(503).json({ error: error.message });
    }
  });

  app.post("/api/tutor-login", (request, response) => {
    try {
      const configuredEmail = String(process.env.TUTOR_EMAIL || "").trim().toLowerCase();
      const configuredAccessCode = String(process.env.TUTOR_ACCESS_CODE || "");
      if (!configuredEmail || !configuredAccessCode) return response.status(503).json({ error: "Hosted tutor login is not configured. Add TUTOR_EMAIL and TUTOR_ACCESS_CODE in Vercel environment variables." });
      const email = String(request.body?.email || "").trim().toLowerCase();
      const accessCode = String(request.body?.accessCode || "");
      if (!secureMatch(email, configuredEmail) || !secureMatch(accessCode, configuredAccessCode)) return response.status(401).json({ error: "Invalid tutor email or access code." });
      createSession(response, { role: "tutor", email });
      return response.json({ email, role: "tutor" });
    } catch (error) {
      return response.status(503).json({ error: error.message });
    }
  });

  app.get("/api/student-progress", async (request, response) => {
    const session = requireStudent(request, response);
    if (!session) return;
    try {
      const student = redisConfig() ? await loadStudent(session.email) : configuredStudent();
      if (!student) return response.status(404).json({ error: "Student account not found." });
      return response.json({ student: publicStudent(student), progress: student.progress || {} });
    } catch (error) {
      return response.status(503).json({ error: error.message });
    }
  });

  app.put("/api/student-progress", async (request, response) => {
    const session = requireStudent(request, response);
    if (!session) return;
    try {
      if (!redisConfig()) return response.json({ saved: true, browserOnly: true });
      const student = await loadStudent(session.email);
      if (!student) return response.status(404).json({ error: "Student account not found." });
      const key = String(request.body?.key || "");
      const value = String(request.body?.value ?? "");
      if (!supportedProgressKey(key)) return response.status(400).json({ error: "Unsupported progress key." });
      if (value.length > 500000) return response.status(413).json({ error: "Progress value is too large." });
      student.progress ||= {};
      student.progress[key] = value;
      student.progressUpdatedAt = new Date().toISOString();
      await saveStudent(student);
      return response.json({ saved: true, key, updatedAt: student.progressUpdatedAt });
    } catch (error) {
      return response.status(503).json({ error: error.message });
    }
  });

  app.post("/api/student-upgrade", async (request, response) => {
    const session = requireStudent(request, response);
    if (!session) return;
    try {
      if (!redisConfig()) return response.json({ success: true, tier: "founder", browserOnly: true });
      const student = await loadStudent(session.email);
      if (!student) return response.status(404).json({ error: "Student account not found." });
      student.tier = "founder";
      await saveStudent(student);
      return response.json({ success: true, tier: "founder" });
    } catch (error) {
      return response.status(503).json({ error: error.message });
    }
  });

  app.put("/api/student-settings", async (request, response) => {
    const session = requireStudent(request, response);
    if (!session) return;
    try {
      if (!redisConfig()) {
        return response.json({
          success: true,
          student: {
            name: String(request.body?.name || "").trim(),
            personalApiKey: String(request.body?.personalApiKey || "").trim(),
            browserOnly: true
          }
        });
      }
      const personalApiKey = String(request.body?.personalApiKey ?? "").trim();
      const name = String(request.body?.name ?? "").trim();

      const student = await loadStudent(session.email);
      if (!student) return response.status(404).json({ error: "Student account not found." });

      if (personalApiKey !== undefined) student.personalApiKey = personalApiKey;
      if (name && name.length >= 2) student.name = name;

      await saveStudent(student);
      return response.json({ success: true, student: publicStudent(student) });
    } catch (error) {
      return response.status(503).json({ error: error.message });
    }
  });

  app.get("/api/tutor-students", async (request, response) => {
    if (!requireTutor(request, response)) return;
    try {
      const emails = await redis(["SMEMBERS", STUDENT_SET_KEY]) || [];
      const students = (await Promise.all(emails.map(loadStudent))).filter(Boolean).map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        joinedAt: student.createdAt,
        lastActiveAt: student.progressUpdatedAt || student.lastLoginAt || student.createdAt,
        phase: Object.keys(student.progress || {}).length ? "Learning in progress" : "Registered",
        activityCount: Object.keys(student.progress || {}).length,
        progressPercent: 0,
        currentCourse: "Academy learning path",
        tracks: []
      }));
      return response.json({ students, totals: { registered: students.length, active: students.filter((student) => student.phase === "Learning in progress").length, completed: 0, activities: students.reduce((sum, student) => sum + student.activityCount, 0) } });
    } catch (error) {
      return response.status(503).json({ error: error.message });
    }
  });

  app.post("/api/logout", (_request, response) => {
    response.setHeader("Set-Cookie", "tomcodexHosted=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0");
    return response.json({ signedOut: true });
  });

  app.get("/api/public-profile", async (request, response) => {
    try {
      const id = String(request.query.id || "").trim();
      if (!id) return response.status(400).json({ error: "Student ID is required." });
      
      let student = null;
      if (redisConfig()) {
        student = await loadStudentById(id);
      } else {
        const fallback = configuredStudent();
        if (fallback && fallback.id === id) {
          student = fallback;
        }
      }
      
      if (!student) {
        return response.status(404).json({ error: "Student account not found." });
      }
      
      return response.json({
        id: student.id,
        name: student.name,
        createdAt: student.createdAt,
        tier: student.tier || "free",
        progress: student.progress || {}
      });
    } catch (error) {
      return response.status(503).json({ error: error.message });
    }
  });

  app.get("/api/auth-session", async (request, response) => {
    const session = readSession(request);
    if (!session) return response.status(401).json({ authenticated: false });
    if (session.role === "student") {
      try {
        const student = redisConfig() ? await loadStudent(session.email) : configuredStudent();
        if (!student) return response.status(401).json({ authenticated: false });
        return response.json({ authenticated: true, role: "student", identity: publicStudent(student) });
      } catch (error) {
        return response.status(503).json({ error: error.message });
      }
    }
    return response.json({ authenticated: true, role: "tutor", identity: { email: session.email, role: "tutor", name: "Academy Tutor" } });
  });
}

export function registerHostedAcademyAiCoreRoute(app) {
  app.post("/api/ai/run", async (request, response, next) => {
    const session = readSession(request);
    if (session?.role !== "student") {
      return response.status(401).json({ error: "Student sign-in is required." });
    }

    try {
      const student = redisConfig() ? await loadStudent(session.email) : configuredStudent();
      if (!student) return response.status(404).json({ error: "Student account not found." });

      request.session = {
        user: {
          id: student.id,
          tier: student.tier || "free"
        }
      };

      return createAcademyAiHandler({
        async updateSkillPassport({ userId, update, aiResult }) {
          return persistAdminModuleOneSkillPassport({
            userId,
            skillPassportUpdate: update,
            result: aiResult
          });
        }
      })(request, response);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/ai/evaluate-screenshot", async (request, response) => {
    const session = readSession(request);
    if (!session) return response.status(401).json({ error: "Student sign-in is required." });
    const { image, mimeType, course, module } = request.body;
    if (!image || !mimeType) {
      return response.status(400).json({ error: "A valid screenshot image is required." });
    }
    
    try {
      const student = redisConfig() ? await loadStudent(session.email) : configuredStudent();
      if (!student) return response.status(404).json({ error: "Student account not found." });

      const apiKey = (student.personalApiKey || "").trim() || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return response.status(503).json({ error: "No Gemini API key is configured. Please add one in your Account Settings." });
      }

      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const prompt = `You are a Senior Salesforce Architect evaluating a student's screenshot proof for the "${course}" course, "${module}" lab.
      Analyze this image. Verify if it shows a correct Salesforce Setup configuration page, Object Manager layout, or schema matching the lab request.
      Return ONLY a valid JSON object (no markdown, no backticks, no code block formatting) containing exactly these fields:
      - score: integer from 0 to 100
      - passed: boolean (true if score >= 80)
      - feedback: constructive review feedback on what is visible in the image, pointing out standard Salesforce details and explaining next steps.`;

      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inlineData: { mimeType, data: image } }
              ]
            }
          ],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!geminiResponse.ok) {
        return response.status(502).json({ error: `Gemini screenshot evaluation failed with status ${geminiResponse.status}.` });
      }

      const data = await geminiResponse.json();
      const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") || "{}";
      
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        return response.status(502).json({ error: "Gemini returned invalid screenshot evaluation JSON." });
      }

      return response.json({
        score: Math.max(0, Math.min(100, Number(result.score) || 0)),
        passed: Boolean(result.passed),
        feedback: String(result.feedback || "Review completed."),
        source: "gemini-multimodal-api"
      });
    } catch (error) {
      return response.status(502).json({ error: "Could not connect to Gemini screenshot service." });
    }
  });

  app.post("/api/academy/verify-lab", async (request, response, next) => {
    let userId = request.body?.userId;
    let tier = request.body?.tier;

    const session = readSession(request);
    if (session && !userId) {
      try {
        const student = redisConfig() ? await loadStudent(session.email) : configuredStudent();
        if (student) userId = student.id;
      } catch (e) {
        // ignore
      }
    }

    if (!userId) {
      return response.status(401).json({ error: "Student sign-in or userId is required." });
    }

    try {
      let student = null;
      if (redisConfig()) {
        const emails = await redis(["SMEMBERS", STUDENT_SET_KEY]) || [];
        const students = (await Promise.all(emails.map(loadStudent))).filter(Boolean);
        student = students.find((candidate) => candidate.id === userId);
      } else {
        const fallback = configuredStudent();
        if (fallback?.id === userId) {
          student = fallback;
        }
      }

      if (!student) {
        return response.status(404).json({ error: "Student account not found." });
      }

      if (!tier) {
        tier = student.tier || "free";
      }

      const task = request.body?.task || "verify-lab";
      const params = request.body?.params || {};

      const result = await aiEngine.run(task, params, {
        userId,
        tier,
        personalApiKey: student.personalApiKey
      });

      let skillPassportUpdate = null;

      if (result.ok) {
        const resolvedModuleId = params.moduleId || result.data.moduleId || "admin-1";
        const resolvedLabId = params.labId || result.data.labId || "admin-1-lab-1";
        const resolvedSkillId = params.skillId || result.data.skillId || "salesforce-platform-foundations";

        skillPassportUpdate = buildSkillPassportUpdate({
          labResult: result.data,
          moduleId: resolvedModuleId,
          skillId: resolvedSkillId
        });

        await persistDynamicSkillPassport({
          student,
          moduleId: resolvedModuleId,
          labId: resolvedLabId,
          skillId: resolvedSkillId,
          score: result.data.score,
          passed: result.data.passed,
          feedback: result.data.feedback
        });
      }

      const resolvedModuleId = params.moduleId || (result.ok ? result.data.moduleId : "admin-1");
      const resolvedLabId = params.labId || (result.ok ? result.data.labId : "admin-1-lab-1");

      const unlockDecision = getDynamicUnlockDecision({
        student,
        moduleId: resolvedModuleId,
        tier
      });

      const attemptHistory = parseStudentProgress(student, ADMIN_LAB_ATTEMPTS_KEY, {});
      const skillPassport = parseStudentProgress(student, SKILL_PASSPORT_KEY, {});
      
      const currentAttempts = attemptHistory[resolvedModuleId] || [];
      const failedCount = currentAttempts.filter(a => a.status === "Try Again").length;
      const bestScore = currentAttempts.reduce((best, attempt) => Math.max(best, Number(attempt.score) || 0), 0);
      
      const verifiedAt = (attemptHistory[`${resolvedModuleId}:summary`]?.bestScore >= 80)
        ? (attemptHistory[`${resolvedModuleId}:summary`]?.updatedAt || new Date().toISOString())
        : null;

      return response.json({
        ok: result.ok,
        task: "verify-lab",
        data: {
          passed: result.ok ? result.data.passed : false,
          score: result.ok ? result.data.score : 0,
          feedback: result.ok ? result.data.feedback : (result.error?.message || "Lab verification failed."),
          criteriaResults: result.ok ? result.data.criteriaResults : []
        },
        skillPassportUpdate: skillPassportUpdate ? {
          moduleId: skillPassportUpdate.moduleId,
          skillId: skillPassportUpdate.skillId,
          labId: skillPassportUpdate.labId,
          status: skillPassportUpdate.status,
          score: skillPassportUpdate.score
        } : null,
        passportSummary: {
          attemptsCount: currentAttempts.length,
          failedAttemptsCount: failedCount,
          bestScore: bestScore,
          verifiedAt: verifiedAt
        },
        unlockDecision: {
          currentModuleId: resolvedModuleId,
          nextModuleId: unlockDecision.nextModuleId,
          eligibleToUnlock: unlockDecision.eligibleToUnlock,
          reason: unlockDecision.reason
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/academy/certificate-eligibility", async (request, response, next) => {
    let userId = request.body?.userId;
    let tier = request.body?.tier;

    const session = readSession(request);
    if (session && !userId) {
      try {
        const student = redisConfig() ? await loadStudent(session.email) : configuredStudent();
        if (student) userId = student.id;
      } catch (e) {
        // ignore
      }
    }

    if (!userId) {
      return response.status(401).json({ error: "Student sign-in or userId is required." });
    }

    try {
      let student = null;
      if (redisConfig()) {
        const emails = await redis(["SMEMBERS", STUDENT_SET_KEY]) || [];
        const students = (await Promise.all(emails.map(loadStudent))).filter(Boolean);
        student = students.find((candidate) => candidate.id === userId);
      } else {
        const fallback = configuredStudent();
        if (fallback?.id === userId) {
          student = fallback;
        }
      }

      if (!student) {
        return response.status(404).json({ error: "Student account not found." });
      }

      if (!tier) {
        tier = student.tier || "free";
      }

      const studentAttempts = parseStudentProgress(student, ADMIN_LAB_ATTEMPTS_KEY, {});
      const skillPassport = parseStudentProgress(student, SKILL_PASSPORT_KEY, {});

      const result = evaluateCertificateEligibility({
        studentAttempts,
        skillPassport,
        tier
      });

      return response.json(result);
    } catch (error) {
      next(error);
    }
  });
}

export async function checkAiQuota(request, response, next) {
  const session = readSession(request);
  if (!session) {
    return next();
  }
  
  try {
    const student = redisConfig() ? await loadStudent(session.email) : configuredStudent();
    if (!student) return response.status(404).json({ error: "Student account not found." });
    
    // Tier based content gating: Free users can only access the first module of any course
    if (student.tier !== "founder") {
      const moduleName = String(request.body?.module || "").trim().toLowerCase();
      if (moduleName) {
        const ALLOWED_FREE_MODULES = [
          "salesforce platform foundations",
          "basics",
          "platform foundations",
          "flow builder foundations",
          "apex and the salesforce runtime",
          "lwc and web platform foundations"
        ];
        if (!ALLOWED_FREE_MODULES.includes(moduleName)) {
          return response.status(403).json({
            error: "Founder Access Required",
            message: "This module is locked under the Free Starter tier. Please upgrade to Founder Access to unlock all modules."
          });
        }
      }
    }

    if (student.personalApiKey) {
      request.personalApiKey = student.personalApiKey;
      return next();
    }
    
    const today = new Date().toISOString().split("T")[0];
    student.usage ||= {
      requestsToday: 0,
      lastRequestDate: today
    };
    
    if (student.usage.lastRequestDate !== today) {
      student.usage.requestsToday = 0;
      student.usage.lastRequestDate = today;
    }
    
    if (request.method === "POST" && student.usage.requestsToday >= 50) {
      return response.status(429).json({
        error: "Daily AI Limit Reached",
        message: "You have reached your daily free AI quota (50 requests/day). Please configure your personal Gemini API Key in Settings for unlimited access, or wait until tomorrow for your quota to reset."
      });
    }
    
    if (request.method === "POST") {
      student.usage.requestsToday++;
      if (redisConfig()) {
        await saveStudent(student);
      }
    }
    next();
  } catch (error) {
    next();
  }
}
