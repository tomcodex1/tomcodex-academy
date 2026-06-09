import express from "express";
import path from "node:path";
import { timingSafeEqual } from "node:crypto";
import { registerAiTrainerRoute } from "../server/ai-trainer-route.example.js";
import { registerAiEvaluatorRoute } from "../server/ai-evaluator-route.example.js";
import { registerAiCodeReviewRoute } from "../server/ai-code-review-route.example.js";
import { registerAiInterviewRoute } from "../server/ai-interview-route.example.js";
import { registerAiTranscriptionRoute } from "../server/ai-transcription-route.js";
import { registerElevenLabsSpeechRoute } from "../server/elevenlabs-speech-route.js";

const app = express();

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
registerAiTrainerRoute(app);
registerAiEvaluatorRoute(app);
registerAiCodeReviewRoute(app);
registerAiInterviewRoute(app);
registerAiTranscriptionRoute(app);
registerElevenLabsSpeechRoute(app);

function secureMatch(value, expected) {
  const valueBuffer = Buffer.from(String(value || ""));
  const expectedBuffer = Buffer.from(String(expected || ""));
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

function hostedStudent() {
  const email = String(process.env.HOSTED_STUDENT_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.HOSTED_STUDENT_PASSWORD || "");
  if (!email || !password) return null;
  return {
    id: "hosted-student",
    name: String(process.env.HOSTED_STUDENT_NAME || "TomCodeX Student").trim(),
    email,
    password,
    role: "student",
    enrolledAt: process.env.HOSTED_STUDENT_ENROLLED_AT || new Date().toISOString(),
    progress: {}
  };
}

app.post("/api/student-login", (request, response) => {
  const student = hostedStudent();
  if (!student) return response.status(503).json({ error: "Hosted student login is not configured. Add HOSTED_STUDENT_EMAIL and HOSTED_STUDENT_PASSWORD in Vercel environment variables." });
  const email = String(request.body?.email || "").trim().toLowerCase();
  const password = String(request.body?.password || "");
  if (!secureMatch(email, student.email) || !secureMatch(password, student.password)) {
    return response.status(401).json({ error: "Invalid student email or password." });
  }
  const { password: _password, ...publicStudent } = student;
  return response.json(publicStudent);
});

app.post("/api/tutor-login", (request, response) => {
  const configuredEmail = String(process.env.TUTOR_EMAIL || "").trim().toLowerCase();
  const configuredAccessCode = String(process.env.TUTOR_ACCESS_CODE || "");
  if (!configuredEmail || !configuredAccessCode) {
    return response.status(503).json({ error: "Hosted tutor login is not configured. Add TUTOR_EMAIL and TUTOR_ACCESS_CODE in Vercel environment variables." });
  }
  const email = String(request.body?.email || "").trim().toLowerCase();
  const accessCode = String(request.body?.accessCode || "");
  if (!secureMatch(email, configuredEmail) || !secureMatch(accessCode, configuredAccessCode)) {
    return response.status(401).json({ error: "Invalid tutor email or access code." });
  }
  return response.json({ email, role: "tutor" });
});

app.post(["/api/student-signup", "/api/student-forgot-password", "/api/student-reset-password"], (_request, response) => {
  return response.status(503).json({ error: "Hosted account registration and password reset require a persistent database. Sign in with the configured hosted student account." });
});

app.get("/api/student-progress", (_request, response) => {
  const student = hostedStudent();
  if (!student) return response.status(401).json({ error: "Hosted student login is not configured." });
  const { password: _password, ...publicStudent } = student;
  return response.json({ student: publicStudent, progress: {} });
});
app.put("/api/student-progress", (_request, response) => response.json({ saved: true, hosted: true }));
app.get("/api/tutor-students", (_request, response) => response.json({ students: [], totals: { registered: 0, active: 0, completed: 0, activities: 0 } }));
app.post("/api/logout", (_request, response) => response.json({ signedOut: true }));
app.use("/api", (_request, response) => response.status(404).json({ error: "API route not found." }));
app.get("/", (_request, response) => response.sendFile(path.resolve("index.html")));
app.use(express.static(path.resolve(".")));

export default app;
