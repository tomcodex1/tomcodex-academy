import { aiEngine } from "./ai-engine.js";

const supportedAudioTypes = new Set(["audio/webm", "audio/ogg", "audio/mp4", "audio/wav", "audio/mpeg"]);

export function registerAiTranscriptionRoute(app) {
  app.post("/api/ai/transcribe-interview", async (request, response) => {
    const audio = String(request.body?.audio || "");
    const mimeType = String(request.body?.mimeType || "").split(";")[0];
    const language = String(request.body?.language || "en-IN").slice(0, 20);
    const question = String(request.body?.question || "").trim().slice(0, 2000);

    if (!supportedAudioTypes.has(mimeType) || audio.length < 100) return response.status(400).json({ error: "A supported microphone recording is required." });
    if (audio.length > 14_000_000) return response.status(413).json({ error: "The recording is too long. Keep each answer under a few minutes." });

    try {
      const result = await aiEngine.run("transcribe", { audio, mimeType, language, question }, request);
      return response.json(result);
    } catch (err) {
      const status = err.statusCode || 502;
      return response.status(status).json({ error: err.message || "High-accuracy transcription failed." });
    }
  });
}
