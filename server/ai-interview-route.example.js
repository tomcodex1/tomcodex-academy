import { aiEngine } from "./ai-engine.js";

const allowedRoles = new Set(["Salesforce Administrator", "Salesforce Developer", "Salesforce Consultant", "Salesforce Architect"]);
const allowedDifficulties = new Set(["Beginner", "Intermediate", "Advanced"]);
const allowedFormats = new Set(["technical", "behavioral", "mixed"]);

export function registerAiInterviewRoute(app) {
  app.post("/api/ai/interview-questions", async (request, response) => {
    const role = String(request.body?.role || "");
    const difficulty = String(request.body?.difficulty || "");
    const format = String(request.body?.format || "");
    const count = Math.min(10, Math.max(3, Number(request.body?.count) || 5));
    const jobContext = String(request.body?.jobContext || "").trim().slice(0, 5000);
    if (!allowedRoles.has(role) || !allowedDifficulties.has(difficulty) || !allowedFormats.has(format)) return response.status(400).json({ error: "Select a supported interview setup." });

    try {
      const result = await aiEngine.run("interview", { role, difficulty, format, count, jobContext }, request);
      return response.json(result);
    } catch (err) {
      const status = err.statusCode || 502;
      return response.status(status).json({ error: err.message || "Failed to generate interview questions." });
    }
  });
}
