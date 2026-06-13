import { aiEngine } from "./ai-engine.js";

export function registerAiResumeRoute(app) {
  app.post("/api/ai/resume", async (request, response) => {
    const project = String(request.body?.project || "").trim().slice(0, 500);
    const role = String(request.body?.role || "").trim().slice(0, 500);
    const achievements = Array.isArray(request.body?.achievements) ? request.body.achievements : [];
    const tone = String(request.body?.tone || "STAR").trim().slice(0, 100);
    const customNotes = String(request.body?.customNotes || "").trim().slice(0, 4000);

    if (!project || !role) {
      return response.status(400).json({ error: "Provide a project name and target role to generate resume points." });
    }

    try {
      const result = await aiEngine.run("resume", { project, role, achievements, tone, customNotes }, request);
      return response.json(result);
    } catch (err) {
      const status = err.statusCode || 502;
      return response.status(status).json({ error: err.message || "Resume generator AI failed." });
    }
  });
}
