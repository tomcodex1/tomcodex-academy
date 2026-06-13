import { aiEngine } from "./ai-engine.js";

export function registerAiATSRoute(app) {
  app.post("/api/ai/ats-check", async (request, response) => {
    const resumeText = String(request.body?.resumeText || "").trim().slice(0, 8000);
    const jobDescription = String(request.body?.jobDescription || "").trim().slice(0, 4000);

    if (!resumeText || resumeText.length < 50) {
      return response.status(400).json({ error: "Please provide resume text (at least 50 characters) to analyse." });
    }

    try {
      const result = await aiEngine.run("ats-check", { resumeText, jobDescription }, request);
      return response.json(result);
    } catch (err) {
      const status = err.statusCode || 502;
      return response.status(status).json({ error: err.message || "ATS checker AI failed." });
    }
  });
}
