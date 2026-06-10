import express from "express";
import path from "node:path";
import { registerAiTrainerRoute } from "../server/ai-trainer-route.example.js";
import { registerAiEvaluatorRoute } from "../server/ai-evaluator-route.example.js";
import { registerAiCodeReviewRoute } from "../server/ai-code-review-route.example.js";
import { registerAiInterviewRoute } from "../server/ai-interview-route.example.js";
import { registerAiTranscriptionRoute } from "../server/ai-transcription-route.js";
import { registerElevenLabsSpeechRoute } from "../server/elevenlabs-speech-route.js";
import { registerHostedAuthRoutes, checkAiQuota } from "../server/hosted-auth.js";

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

app.use(/\/api\/ai\/.*/, checkAiQuota);
registerAiTrainerRoute(app);
registerAiEvaluatorRoute(app);
registerAiCodeReviewRoute(app);
registerAiInterviewRoute(app);
registerAiTranscriptionRoute(app);
registerElevenLabsSpeechRoute(app);
registerHostedAuthRoutes(app);
app.use("/api", (_request, response) => response.status(404).json({ error: "API route not found." }));
app.get("/", (_request, response) => response.sendFile(path.resolve("index.html")));
app.get("/learner-dashboard", (_request, response) => response.sendFile(path.resolve("dashboard.html")));
app.use(express.static(path.resolve(".")));

export default app;
