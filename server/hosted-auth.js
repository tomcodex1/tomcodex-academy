import { createHmac, randomBytes, randomInt, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const SESSION_SECONDS = 7 * 24 * 60 * 60;
const RESET_SECONDS = 15 * 60;
const STUDENT_SET_KEY = "tomcodex:students";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function publicStudent(student) {
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    role: "student",
    enrolledAt: student.createdAt,
    progress: student.progress || {}
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
    || /^tomcodex\.(admin|apex|flow|lwc)MasteryScores\.v1(\.finalExam)?$/.test(key);
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
