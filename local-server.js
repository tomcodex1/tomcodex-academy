import "dotenv/config";
import express from "express";
import { randomBytes, randomInt, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
import { registerAiTrainerRoute } from "./server/ai-trainer-route.example.js";
import { registerAiEvaluatorRoute } from "./server/ai-evaluator-route.example.js";
import { registerAiCodeReviewRoute } from "./server/ai-code-review-route.example.js";
import { registerAiInterviewRoute } from "./server/ai-interview-route.example.js";
import { registerAiResumeRoute } from "./server/ai-resume-route.js";
import { registerAiATSRoute } from "./server/ai-ats-route.js";
import { registerAiTranscriptionRoute } from "./server/ai-transcription-route.js";
import { registerElevenLabsSpeechRoute } from "./server/elevenlabs-speech-route.js";
import { createAcademyAiHandler, aiEngine, buildSkillPassportUpdate, moduleProgression, evaluateCertificateEligibility } from "zentom-ai-core";

const app = express();
const port = Number(process.env.PORT) || 3000;
const tutorSessions = new Map();
const studentSessions = new Map();
const passwordResets = new Map();
const TUTOR_SESSION_TTL = 8 * 60 * 60 * 1000;
const STUDENT_SESSION_TTL = 7 * 24 * 60 * 60 * 1000;
const RESET_CODE_TTL = 15 * 60 * 1000;
const studentStorePath = resolve(process.env.STUDENT_STORE_PATH || "data/learner-accounts.json");
const scrypt = promisify(scryptCallback);
const ADMIN_LAB_ATTEMPTS_KEY = "tomcodex.adminLabAttempts.v1";
const SKILL_PASSPORT_KEY = "tomcodex.skillPassport.v1";
const MODULE_UNLOCKS_KEY = "tomcodex.moduleUnlocks.v1";
process.env.FREE_DAILY_AI_LIMIT ||= "50";
process.env.FOUNDER_DAILY_AI_LIMIT ||= "1000";

app.use((_request, response, next) => {
  response.set({
    "Content-Security-Policy": "default-src 'self'; script-src 'self' https://cdn.tailwindcss.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src https://fonts.gstatic.com; img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    "Permissions-Policy": "camera=(), geolocation=(), payment=(), usb=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  });
  next();
});
app.use(express.json({ limit: "15mb" }));

function secureMatch(value, expected) {
  const valueBuffer = Buffer.from(String(value || ""));
  const expectedBuffer = Buffer.from(String(expected || ""));
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

function readCookie(request, name) {
  const cookies = String(request.headers.cookie || "").split(";");
  const match = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  return match ? decodeURIComponent(match.trim().slice(name.length + 1)) : "";
}

async function loadStudents() {
  try {
    const students = JSON.parse(await readFile(studentStorePath, "utf8"));
    return Array.isArray(students) ? students : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveStudents(students) {
  await mkdir(dirname(studentStorePath), { recursive: true });
  await writeFile(studentStorePath, `${JSON.stringify(students, null, 2)}\n`, "utf8");
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

function createStudentSession(response, student) {
  const token = randomBytes(32).toString("hex");
  studentSessions.set(token, { studentId: student.id, expiresAt: Date.now() + STUDENT_SESSION_TTL });
  response.setHeader("Set-Cookie", [
    `tomcodexStudent=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${STUDENT_SESSION_TTL / 1000}`,
    "tomcodexTutor=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0"
  ]);
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
    reminderSettings: student.reminderSettings || { enabled: true, morning: "09:00", evening: "18:00" },
    tier: student.tier || "free",
    personalApiKey: student.personalApiKey || "",
    usage: {
      requestsToday: usage.requestsToday,
      lastRequestDate: usage.lastRequestDate,
      dailyLimit: 50
    }
  };
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
    || /^tomcodex\.(admin|apex|flow|lwc|integration|agentforce|poc)MasteryScores\.v1(\.finalExam)?$/.test(key);
}

function authenticatedStudent(request) {
  const token = readCookie(request, "tomcodexStudent");
  const session = studentSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (token) studentSessions.delete(token);
    return null;
  }
  return session;
}

function authenticatedTutor(request) {
  const token = readCookie(request, "tomcodexTutor");
  const session = tutorSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (token) tutorSessions.delete(token);
    return null;
  }
  return session;
}

function trackCompletion(student) {
  let enrollments = {};
  try { enrollments = JSON.parse(student.progress?.["tomcodex.courseEnrollments.v1"] || "{}"); } catch {}
  return [
    ["Salesforce Admin", "admin", 14],
    ["Apex Development", "apex", 12],
    ["Salesforce Flow", "flow", 12],
    ["Lightning Web Components", "lwc", 12]
  ].map(([name, key, total]) => {
    let scores = {};
    try { scores = JSON.parse(student.progress?.[`tomcodex.${key}MasteryScores.v1`] || "{}"); } catch {}
    const completed = Object.values(scores).filter((entry) => Number(entry?.score) >= 80).length;
    const enrolledAt = enrollments[key]?.enrolledAt || (completed ? student.createdAt : null);
    return { name, key, total, completed, remaining: Math.max(0, total - completed), complete: completed >= total, enrolled: Boolean(enrolledAt), enrolledAt };
  });
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
  const students = await loadStudents();
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
  await saveStudents(students);

  return {
    attemptHistory: attemptHistory[moduleId],
    bestScore,
    skillPassportUpdate: skillPassport[skillId],
    unlock: unlocks[moduleId]
  };
}

async function persistDynamicSkillPassport({ student, moduleId, labId, skillId, score, passed, feedback, students }) {
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
  await saveStudents(students);

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


function tutorStudentSummary(student) {
  const tracks = trackCompletion(student);
  const enrolledTracks = tracks.filter((track) => track.enrolled);
  const completedModules = tracks.reduce((sum, track) => sum + track.completed, 0);
  const totalModules = enrolledTracks.reduce((sum, track) => sum + track.total, 0);
  const records = parseStudentProgress(student, "tomcodex.learningRecords.v1", []);
  const interviews = parseStudentProgress(student, "tomcodex.interviewHistory.v1", []);
  const codeReviews = parseStudentProgress(student, "tomcodex.aiCodeReviews.v1", []);
  const activities = [
    ...(Array.isArray(records) ? records : []),
    ...(Array.isArray(interviews) ? interviews : []),
    ...(Array.isArray(codeReviews) ? codeReviews : [])
  ];
  const activityTimes = activities
    .map((activity) => activity?.timestamp || activity?.createdAt || activity?.completedAt)
    .concat([student.lastLoginAt, student.progressUpdatedAt, student.createdAt])
    .filter(Boolean)
    .sort();
  const activeTrack = enrolledTracks.find((track) => !track.complete) || enrolledTracks.at(-1);
  let phase = "Registered";
  if (enrolledTracks.length) phase = completedModules ? "Learning in progress" : "Course enrolled";
  if (enrolledTracks.length && enrolledTracks.every((track) => track.complete)) phase = "Pathway completed";

  return {
    id: student.id,
    name: student.name,
    email: student.email,
    tier: student.tier || "free",
    joinedAt: student.createdAt,
    lastActiveAt: activityTimes.at(-1) || student.progressUpdatedAt || student.createdAt,
    phase,
    currentCourse: activeTrack?.name || "Not enrolled",
    activityCount: activities.length,
    completedModules,
    totalModules,
    progressPercent: totalModules ? Math.round((completedModules / totalModules) * 100) : 0,
    tracks: tracks.map(({ name, key, total, completed, complete, enrolled }) => ({ name, key, total, completed, complete, enrolled }))
  };
}

app.post("/api/student-signup", async (request, response) => {
  const name = String(request.body?.name || "").trim();
  const email = String(request.body?.email || "").trim().toLowerCase();
  const password = String(request.body?.password || "");
  if (name.length < 2 || !email.includes("@")) return response.status(400).json({ error: "Enter a valid name and email address." });
  if (!validStudentPassword(password)) return response.status(400).json({ error: "Password must use at least 8 characters with uppercase, lowercase, and a number." });

  const students = await loadStudents();
  if (students.some((student) => student.email === email)) return response.status(409).json({ error: "A student account already exists for this email." });
  const passwordData = await hashPassword(password);
  const createdAt = new Date().toISOString();
  const student = {
    id: randomBytes(12).toString("hex"),
    name,
    email,
    passwordSalt: passwordData.salt,
    passwordHash: passwordData.hash,
    progress: {},
    createdAt,
    lastLoginAt: createdAt,
    tier: "free",
    personalApiKey: ""
  };
  students.push(student);
  await saveStudents(students);
  const tutorToken = readCookie(request, "tomcodexTutor");
  if (tutorToken) tutorSessions.delete(tutorToken);
  createStudentSession(response, student);
  return response.status(201).json(publicStudent(student));
});

app.post("/api/student-login", async (request, response) => {
  const email = String(request.body?.email || "").trim().toLowerCase();
  const password = String(request.body?.password || "");
  const students = await loadStudents();
  const student = students.find((candidate) => candidate.email === email);
  if (!student || !(await validPassword(password, student))) return response.status(401).json({ error: "Invalid student email or password." });
  student.lastLoginAt = new Date().toISOString();
  await saveStudents(students);
  const tutorToken = readCookie(request, "tomcodexTutor");
  if (tutorToken) tutorSessions.delete(tutorToken);
  createStudentSession(response, student);
  return response.json(publicStudent(student));
});

app.post("/api/student-forgot-password", async (request, response) => {
  const email = String(request.body?.email || "").trim().toLowerCase();
  const students = await loadStudents();
  const student = students.find((candidate) => candidate.email === email);
  if (!student) return response.status(404).json({ error: "No student account was found for this email." });
  const resetCode = String(randomInt(100000, 1000000));
  passwordResets.set(email, { resetCode, expiresAt: Date.now() + RESET_CODE_TTL });
  return response.json({ message: "Reset code created.", resetCode });
});

app.post("/api/student-reset-password", async (request, response) => {
  const email = String(request.body?.email || "").trim().toLowerCase();
  const resetCode = String(request.body?.resetCode || "").trim();
  const newPassword = String(request.body?.newPassword || "");
  const reset = passwordResets.get(email);
  if (!reset || reset.expiresAt < Date.now() || !secureMatch(resetCode, reset.resetCode)) return response.status(400).json({ error: "The reset code is invalid or expired." });
  if (!validStudentPassword(newPassword)) return response.status(400).json({ error: "Password must use at least 8 characters with uppercase, lowercase, and a number." });

  const students = await loadStudents();
  const student = students.find((candidate) => candidate.email === email);
  if (!student) return response.status(404).json({ error: "Student account not found." });
  const passwordData = await hashPassword(newPassword);
  student.passwordSalt = passwordData.salt;
  student.passwordHash = passwordData.hash;
  student.passwordUpdatedAt = new Date().toISOString();
  await saveStudents(students);
  passwordResets.delete(email);
  return response.json({ message: "Password updated successfully." });
});

app.post("/api/student-upgrade", async (request, response) => {
  const session = authenticatedStudent(request);
  if (!session) return response.status(401).json({ error: "Student sign-in is required." });
  const students = await loadStudents();
  const student = students.find((candidate) => candidate.id === session.studentId);
  if (!student) return response.status(404).json({ error: "Student account not found." });
  student.tier = "founder";
  student.upgradedAt = new Date().toISOString();
  await saveStudents(students);
  return response.json({ success: true, tier: "founder", upgradedAt: student.upgradedAt });
});

app.put("/api/student-settings", async (request, response) => {
  const session = authenticatedStudent(request);
  if (!session) return response.status(401).json({ error: "Student sign-in is required." });
  const personalApiKey = String(request.body?.personalApiKey ?? "").trim();
  const name = String(request.body?.name ?? "").trim();

  const students = await loadStudents();
  const student = students.find((candidate) => candidate.id === session.studentId);
  if (!student) return response.status(404).json({ error: "Student account not found." });

  if (personalApiKey !== undefined) student.personalApiKey = personalApiKey;
  if (name && name.length >= 2) student.name = name;

  await saveStudents(students);
  return response.json({ success: true, student: publicStudent(student) });
});

app.post("/api/ai/evaluate-screenshot", async (request, response) => {
  const session = authenticatedStudent(request);
  if (!session) return response.status(401).json({ error: "Student sign-in is required." });
  const { image, mimeType, course, module } = request.body;
  if (!image || !mimeType) {
    return response.status(400).json({ error: "A valid screenshot image is required." });
  }
  const students = await loadStudents();
  const student = students.find((candidate) => candidate.id === session.studentId);
  if (!student) return response.status(404).json({ error: "Student account not found." });

  let apiKey = (student.personalApiKey || "").trim();
  const isGeminiKey = apiKey.startsWith("AIza") || apiKey.startsWith("AQ.");
  if (!isGeminiKey) {
    apiKey = process.env.GEMINI_API_KEY;
  }
  if (!apiKey) {
    return response.status(503).json({ error: "No Gemini API key is configured on the server. Please contact support." });
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const prompt = `You are a Senior Salesforce Architect evaluating a student's screenshot proof for the "${course}" course, "${module}" lab.
  Analyze this image. Verify if it shows a correct Salesforce Setup configuration page, Object Manager layout, or schema matching the lab request.
  Return ONLY a valid JSON object (no markdown, no backticks, no code block formatting) containing exactly these fields:
  - score: integer from 0 to 100
  - passed: boolean (true if score >= 80)
  - feedback: constructive review feedback on what is visible in the image, pointing out standard Salesforce details and explaining next steps.`;

  try {
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

app.put("/api/student-progress", async (request, response) => {
  const session = authenticatedStudent(request);
  if (!session) return response.status(401).json({ error: "Student sign-in is required." });
  const key = String(request.body?.key || "");
  const value = String(request.body?.value ?? "");
  if (!supportedProgressKey(key)) return response.status(400).json({ error: "Unsupported progress key." });
  if (value.length > 500000) return response.status(413).json({ error: "Progress value is too large." });

  const students = await loadStudents();
  const student = students.find((candidate) => candidate.id === session.studentId);
  if (!student) return response.status(404).json({ error: "Student account not found." });
  student.progress ||= {};
  student.progress[key] = value;
  student.progressUpdatedAt = new Date().toISOString();
  await saveStudents(students);
  return response.json({ saved: true, key, updatedAt: student.progressUpdatedAt });
});

app.get("/api/student-progress", async (request, response) => {
  const session = authenticatedStudent(request);
  if (!session) return response.status(401).json({ error: "Student sign-in is required." });
  const students = await loadStudents();
  const student = students.find((candidate) => candidate.id === session.studentId);
  if (!student) return response.status(404).json({ error: "Student account not found." });
  return response.json({ student: publicStudent(student), progress: student.progress || {} });
});

app.get("/api/student-reminders", async (request, response) => {
  const session = authenticatedStudent(request);
  if (!session) return response.status(401).json({ error: "Student sign-in is required." });
  const students = await loadStudents();
  const student = students.find((candidate) => candidate.id === session.studentId);
  if (!student) return response.status(404).json({ error: "Student account not found." });
  const tracks = trackCompletion(student);
  const enrollmentDates = tracks.filter((track) => track.enrolledAt).map((track) => track.enrolledAt).sort();
  return response.json({
    enrolledAt: enrollmentDates[0] || null,
    settings: student.reminderSettings || { enabled: true, morning: "09:00", evening: "18:00" },
    incompleteTracks: tracks.filter((track) => track.enrolled && !track.complete),
    totalRemaining: tracks.filter((track) => track.enrolled).reduce((sum, track) => sum + track.remaining, 0)
  });
});

app.put("/api/student-reminders", async (request, response) => {
  const session = authenticatedStudent(request);
  if (!session) return response.status(401).json({ error: "Student sign-in is required." });
  const students = await loadStudents();
  const student = students.find((candidate) => candidate.id === session.studentId);
  if (!student) return response.status(404).json({ error: "Student account not found." });
  student.reminderSettings = {
    enabled: Boolean(request.body?.enabled),
    morning: "09:00",
    evening: "18:00",
    updatedAt: new Date().toISOString()
  };
  await saveStudents(students);
  return response.json({ settings: student.reminderSettings });
});

app.post("/api/tutor-login", (request, response) => {
  const configuredEmail = process.env.TUTOR_EMAIL;
  const configuredAccessCode = process.env.TUTOR_ACCESS_CODE;
  if (!configuredEmail || !configuredAccessCode) {
    return response.status(503).json({ error: "Tutor access is not configured on this academy server." });
  }

  const email = String(request.body?.email || "").trim().toLowerCase();
  const accessCode = String(request.body?.accessCode || "");
  const valid = secureMatch(email, configuredEmail.trim().toLowerCase())
    && secureMatch(accessCode, configuredAccessCode);
  if (!valid) return response.status(401).json({ error: "Invalid tutor email or access code." });

  const token = randomBytes(32).toString("hex");
  const studentToken = readCookie(request, "tomcodexStudent");
  if (studentToken) studentSessions.delete(studentToken);
  tutorSessions.set(token, { email, expiresAt: Date.now() + TUTOR_SESSION_TTL });
  response.setHeader("Set-Cookie", [
    `tomcodexTutor=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${TUTOR_SESSION_TTL / 1000}`,
    "tomcodexStudent=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0"
  ]);
  return response.json({ email, role: "tutor" });
});

app.get("/api/tutor-students", async (request, response) => {
  if (!authenticatedTutor(request)) return response.status(401).json({ error: "Tutor sign-in is required." });
  const students = await loadStudents();
  const summaries = students.map(tutorStudentSummary).sort((a, b) => String(b.lastActiveAt).localeCompare(String(a.lastActiveAt)));
  return response.json({
    students: summaries,
    totals: {
      registered: summaries.length,
      active: summaries.filter((student) => student.phase === "Learning in progress").length,
      completed: summaries.filter((student) => student.phase === "Pathway completed").length,
      activities: summaries.reduce((sum, student) => sum + student.activityCount, 0)
    }
  });
});

app.post("/api/logout", (request, response) => {
  const tutorToken = readCookie(request, "tomcodexTutor");
  const studentToken = readCookie(request, "tomcodexStudent");
  if (tutorToken) tutorSessions.delete(tutorToken);
  if (studentToken) studentSessions.delete(studentToken);
  response.setHeader("Set-Cookie", [
    "tomcodexTutor=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0",
    "tomcodexStudent=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0"
  ]);
  return response.json({ signedOut: true });
});

app.get("/api/auth-session", async (request, response) => {
  const studentSession = authenticatedStudent(request);
  if (studentSession) {
    const students = await loadStudents();
    const student = students.find((candidate) => candidate.id === studentSession.studentId);
    if (student) return response.json({ authenticated: true, role: "student", identity: publicStudent(student) });
  }
  const tutorSession = authenticatedTutor(request);
  if (tutorSession) return response.json({ authenticated: true, role: "tutor", identity: { name: "Academy Tutor", email: tutorSession.email, role: "tutor" } });
  return response.status(401).json({ authenticated: false });
});

app.get("/api/public-profile", async (request, response) => {
  try {
    const id = String(request.query.id || "").trim();
    if (!id) return response.status(400).json({ error: "Student ID is required." });
    
    const students = await loadStudents();
    const student = students.find((candidate) => candidate.id === id);
    if (!student) return response.status(404).json({ error: "Student account not found." });
    
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

// Rate Limit Middleware
async function checkAiQuota(request, response, next) {
  const session = authenticatedStudent(request);
  if (!session) {
    return next();
  }
  
  const students = await loadStudents();
  const student = students.find((candidate) => candidate.id === session.studentId);
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
      message: "You have reached your daily free AI quota (50 requests/day). Please configure your personal API Key in Settings for unlimited access, or wait until tomorrow for your quota to reset."
    });
  }
  
  if (request.method === "POST") {
    student.usage.requestsToday++;
    await saveStudents(students);
  }
  next();
}

// Google OAuth Integration
app.get("/api/auth/google", (request, response) => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (clientID && clientSecret) {
    const redirectUri = encodeURIComponent(`${request.protocol}://${request.get('host')}/api/auth/google/callback`);
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
    const redirectUri = `${request.protocol}://${request.get('host')}/api/auth/google/callback`;
    
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
  
  const students = await loadStudents();
  let student = students.find((candidate) => candidate.email === email);
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
    students.push(student);
  } else {
    student.usage ||= {
      requestsToday: 0,
      lastRequestDate: new Date().toISOString().split("T")[0]
    };
  }
  
  student.lastLoginAt = new Date().toISOString();
  await saveStudents(students);
  
  const tutorToken = readCookie(request, "tomcodexTutor");
  if (tutorToken) tutorSessions.delete(tutorToken);
  
  createStudentSession(response, student);
  return response.redirect("/learner-dashboard");
});

app.get(["/", "/index.html"], (request, response, next) => {
  const studentSession = authenticatedStudent(request);
  if (studentSession) return response.redirect("/dashboard.html");
  const tutorSession = authenticatedTutor(request);
  if (tutorSession) return response.redirect("/tutor-dashboard.html");
  next();
});

app.get(["/tutor-dashboard", "/tutor-dashboard.html", "/tutor-catalog"], (request, response) => {
  if (!authenticatedTutor(request)) return response.redirect("/access.html?tutor=required");
  return response.sendFile(resolve("tutor-dashboard.html"));
});

app.get("/academy-home.html", (request, response) => {
  if (!authenticatedStudent(request) && !authenticatedTutor(request)) return response.redirect("/access.html");
  return response.sendFile(resolve("academy-home.html"));
});

const protectedAcademyPages = [
  "course-admin.html",
  "course-apex.html",
  "course-flow.html",
  "course-lwc.html",
  "course-integration.html",
  "course-agentforce.html",
  "course-poc.html",
  "personalized-paths.html",
  "interview.html",
  "code-review-ai.html",
  "resume-generator.html",
  "study-groups.html",
  "discussion-forums.html",
  "peer-review.html",
  "analytics.html",
  "gamification-dashboard.html"
];

app.get(protectedAcademyPages.map((page) => `/${page}`), (request, response) => {
  if (!authenticatedStudent(request) && !authenticatedTutor(request)) return response.redirect("/access.html");
  return response.sendFile(resolve(request.path.slice(1)));
});

app.get(["/learner-dashboard", "/dashboard.html"], (request, response) => {
  const session = authenticatedStudent(request);
  if (!session) return response.redirect("/access.html?student=required");
  return response.sendFile(resolve("dashboard.html"));
});

app.use(/\/api\/ai\/.*/, checkAiQuota);

app.post("/api/academy/verify-lab", async (request, response, next) => {
  let userId = request.body?.userId;
  let tier = request.body?.tier;

  const session = authenticatedStudent(request);
  if (session && !userId) {
    userId = session.studentId;
  }

  if (!userId) {
    return response.status(401).json({ error: "Student sign-in or userId is required." });
  }

  try {
    const students = await loadStudents();
    const student = students.find((candidate) => candidate.id === userId);
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
        feedback: result.data.feedback,
        students
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

  const session = authenticatedStudent(request);
  if (session && !userId) {
    userId = session.studentId;
  }

  if (!userId) {
    return response.status(401).json({ error: "Student sign-in or userId is required." });
  }

  try {
    const students = await loadStudents();
    const student = students.find((candidate) => candidate.id === userId);
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

app.post("/api/ai/run", async (request, response, next) => {
  const session = authenticatedStudent(request);
  if (!session) return response.status(401).json({ error: "Student sign-in is required." });

  try {
    const students = await loadStudents();
    const student = students.find((candidate) => candidate.id === session.studentId);
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

registerAiTrainerRoute(app);
registerAiEvaluatorRoute(app);
registerAiCodeReviewRoute(app);
registerAiResumeRoute(app);
registerAiATSRoute(app);
registerAiInterviewRoute(app);
registerAiTranscriptionRoute(app);
registerElevenLabsSpeechRoute(app);
app.use("/api", (_request, response) => response.status(404).json({ error: "API route not found." }));
app.use("/api", (error, _request, response, _next) => {
  console.error(error);
  if (response.headersSent) return;
  response.status(500).json({ error: "The academy server could not complete this request." });
});
app.use(express.static("."));

app.listen(port, () => {
  const configured = Boolean(process.env.GEMINI_API_KEY);
  console.log(`Zentom Academy: http://localhost:${port}`);
  console.log(`Gemini Flash: ${configured ? "configured" : "not configured"}`);
});
