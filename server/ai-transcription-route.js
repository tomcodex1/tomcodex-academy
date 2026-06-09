const supportedAudioTypes = new Set(["audio/webm", "audio/ogg", "audio/mp4", "audio/wav", "audio/mpeg"]);

export function registerAiTranscriptionRoute(app) {
  app.post("/api/ai/transcribe-interview", async (request, response) => {
    const provider = process.env.AI_PROVIDER || "gemini";
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const audio = String(request.body?.audio || "");
    const mimeType = String(request.body?.mimeType || "").split(";")[0];
    const language = String(request.body?.language || "en-IN").slice(0, 20);
    const question = String(request.body?.question || "").trim().slice(0, 2000);

    if (provider !== "gemini" || !process.env.GEMINI_API_KEY) return response.status(503).json({ error: "High-accuracy transcription requires a configured Gemini API key." });
    if (!supportedAudioTypes.has(mimeType) || audio.length < 100) return response.status(400).json({ error: "A supported microphone recording is required." });
    if (audio.length > 14_000_000) return response.status(413).json({ error: "The recording is too long. Keep each answer under a few minutes." });

    const prompt = `Transcribe this spoken Salesforce interview answer accurately.
Language/accent preference: ${language}
Interview question: ${question || "General Salesforce interview question"}

Important vocabulary: Salesforce, CRM, Trailhead, Apex, SOQL, SOSL, LWC, Lightning Web Components, Flow, record-triggered Flow, permission set, permission set group, profile, role hierarchy, organization-wide defaults, OWD, sharing rule, field-level security, Account, Contact, Opportunity, Case, AppExchange, OAuth, Named Credential, sandbox, DevOps.

Rules:
- Return only the spoken answer as plain text.
- Preserve the speaker's meaning and first-person wording.
- Correct obvious speech-recognition mistakes and Salesforce product terminology.
- Add light punctuation for readability.
- Do not answer the interview question or invent content that was not spoken.`;

    let geminiResponse;
    try {
      geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType, data: audio } }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 2048 }
        })
      });
    } catch {
      return response.status(502).json({ error: "Could not connect to the high-accuracy transcription service." });
    }

    if (!geminiResponse.ok) return response.status(502).json({ error: "High-accuracy transcription failed." });
    const data = await geminiResponse.json();
    const transcript = String(data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") || "").trim();
    if (!transcript) return response.status(502).json({ error: "No speech could be transcribed from the recording." });
    return response.json({ transcript, source: "recorded-audio-ai-transcription", provider, model });
  });
}
