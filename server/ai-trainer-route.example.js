// AI Trainer Route — powered by the centralized AI Engine
import { aiEngine, chooseEfficientMode } from "./ai-engine.js";

export function registerAiTrainerRoute(app) {

  // Engine status check
  app.get("/api/ai/status", (request, response) => {
    const hasServerKey = Boolean(process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY);
    const hasPersonalKey = Boolean(request.personalApiKey);
    const provider = process.env.AI_PROVIDER || "gemini";
    return response.json({
      connected: hasServerKey || hasPersonalKey,
      provider,
      model: aiEngine.getModel(),
      message: hasServerKey || hasPersonalKey
        ? "Zentom AI is ready."
        : "No API key configured. Add your Gemini key in Settings.",
      source: "centralized-ai-engine"
    });
  });

  // Generate mastery questions
  app.post("/api/ai/generate-mastery-questions", async (request, response) => {
    const key = aiEngine.resolveKey(request);
    if (!key) return response.status(503).json({ error: "AI service not configured." });
    try {
      const result = await aiEngine.handleGenerateQuestions(request.body, key);
      return response.json(result);
    } catch (err) {
      return response.status(502).json({ error: err.message || "Failed to generate questions." });
    }
  });

  // AI Trainer (doubt answering)
  app.post("/api/ai/trainer", async (request, response) => {
    const key = aiEngine.resolveKey(request);
    const provider = process.env.AI_PROVIDER || "gemini";
    const hasServerKey = Boolean(process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY);
    const hasPersonalKey = Boolean(request.personalApiKey);
    if (!hasServerKey && !hasPersonalKey) {
      return response.status(503).json({ error: "AI service not configured." });
    }
    const allowedProviders = ["gemini", "openrouter", "groq"];
    if (!allowedProviders.includes(provider)) {
      return response.status(400).json({ error: `Provider ${provider} is not supported. Use gemini, openrouter, or groq.` });
    }
    try {
      const result = await aiEngine.handleTrain(request.body, key);
      return response.json(result);
    } catch (err) {
      return response.status(502).json({ error: err.message || "Trainer AI failed." });
    }
  });
}
