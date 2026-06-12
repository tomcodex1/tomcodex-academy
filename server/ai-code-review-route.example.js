import { aiEngine } from "./ai-engine.js";

const allowedTypes = new Set(["apex", "trigger", "lwc", "flow", "configuration"]);
const allowedFocus = new Set(["full", "security", "performance", "testing"]);

export function registerAiCodeReviewRoute(app) {
  app.post("/api/ai/code-review", async (request, response) => {
    const artifactType = String(request.body?.artifactType || "");
    const focus = String(request.body?.focus || "");
    const context = String(request.body?.context || "").trim().slice(0, 4000);
    const artifact = String(request.body?.artifact || "").trim();
    if (!allowedTypes.has(artifactType) || !allowedFocus.has(focus)) return response.status(400).json({ error: "Select a supported artifact type and review focus." });
    if (artifact.length < 20) return response.status(400).json({ error: "Provide at least 20 characters to review." });
    if (artifact.length > 100000) return response.status(413).json({ error: "The review artifact is too large." });

    try {
      const result = await aiEngine.run("code-review", { artifactType, focus, context, artifact }, request);
      return response.json(result);
    } catch (err) {
      const status = err.statusCode || 502;
      return response.status(status).json({ error: err.message || "Code review AI failed." });
    }
  });
}
