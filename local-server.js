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
import { registerAiTranscriptionRoute } from "./server/ai-transcription-route.js";
import { registerElevenLabsSpeechRoute } from "./server/elevenlabs-speech-route.js";

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
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    role: "student",
    enrolledAt: student.createdAt,
    progress: student.progress || {},
    reminderSettings: student.reminderSettings || { enabled: true, morning: "09:00", evening: "18:00" }
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
    || /^tomcodex\.(admin|apex|flow|lwc)MasteryScores\.v1(\.finalExam)?$/.test(key);
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
  const student = { id: randomBytes(12).toString("hex"), name, email, passwordSalt: passwordData.salt, passwordHash: passwordData.hash, progress: {}, createdAt, lastLoginAt: createdAt };
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

app.get(["/tutor-dashboard", "/tutor-dashboard.html", "/tutor-catalog"], (request, response) => {
  if (!authenticatedTutor(request)) return response.redirect("/index.html?tutor=required");
  return response.sendFile(resolve("tutor-dashboard.html"));
});

app.get("/academy-home.html", (request, response) => {
  if (!authenticatedStudent(request) && !authenticatedTutor(request)) return response.redirect("/index.html");
  return response.sendFile(resolve("academy-home.html"));
});

const protectedAcademyPages = [
  "course-admin.html",
  "course-apex.html",
  "course-flow.html",
  "course-lwc.html",
  "personalized-paths.html",
  "interview.html",
  "code-review-ai.html",
  "study-groups.html",
  "discussion-forums.html",
  "peer-review.html",
  "analytics.html",
  "analytics-enhanced.html",
  "gamification-dashboard.html"
];

app.get(protectedAcademyPages.map((page) => `/${page}`), (request, response) => {
  if (!authenticatedStudent(request) && !authenticatedTutor(request)) return response.redirect("/index.html");
  return response.sendFile(resolve(request.path.slice(1)));
});

app.get(["/learner-dashboard", "/dashboard.html"], (request, response) => {
  const session = authenticatedStudent(request);
  if (!session) return response.redirect("/index.html?student=required");
  return response.sendFile(resolve("dashboard.html"));
});

registerAiTrainerRoute(app);
registerAiEvaluatorRoute(app);
registerAiCodeReviewRoute(app);
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
