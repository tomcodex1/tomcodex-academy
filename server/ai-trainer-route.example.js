// Centralized Gemini trainer route for a secure Node/Express backend.
// SECURITY: GEMINI_API_KEY must only be read from backend environment variables.
const speedPrompts = {
  flash: `Use Flash Mode. Answer fast and concisely.
Return:
- Direct answer in 2-4 sentences
- One Salesforce example
- One short interview answer
- One quick recall question
Avoid long explanations.`,
  normal: `Use Normal Mode. Give a balanced Salesforce explanation.
Return:
- Simple meaning
- Why it matters
- Real example
- Hands-on practice
- Short interview answer`,
  deep: `Use Deep Trainer Mode. Teach thoroughly.
Return:
- Detailed concept explanation and tradeoffs
- Real project scenario
- Common mistakes and limits
- Hands-on assignment
- Interview answer
- Recall questions and next learning step`
};

function chooseEfficientMode(doubt = "") {
  const text = doubt.toLowerCase();
  const deepSignals = ["design", "architecture", "compare", "difference", "debug", "error", "scenario", "step by step", "explain deeply", "best practice"];
  if (deepSignals.some((signal) => text.includes(signal)) || doubt.length > 180) return "deep";
  if (doubt.length < 80 && !text.includes("why") && !text.includes("how")) return "flash";
  return "normal";
}

export function registerAiTrainerRoute(app) {
  app.get("/api/ai/status", (request, response) => {
    const provider = process.env.AI_PROVIDER || "gemini";
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const hasPersonalKey = Boolean(request.personalApiKey);
    const configured = (provider === "gemini" && Boolean(process.env.GEMINI_API_KEY)) || hasPersonalKey;
    response.status(configured ? 200 : 503).json({
      connected: configured,
      provider,
      model,
      message: configured ? "Gemini Flash is configured." : "Gemini API key is not configured on the backend."
    });
  });

  app.post("/api/ai/generate-mastery-questions", async (request, response) => {
    const provider = process.env.AI_PROVIDER || "gemini";
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const questionCount = Math.max(15, Number(request.body.questionCount) || 15);

    if (provider !== "gemini") {
      return response.status(400).json({ error: `Unsupported AI provider: ${provider}` });
    }
    const apiKey = request.personalApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return response.status(503).json({ error: "Gemini API key is not configured. Please configure a personal key or contact your administrator." });
    }

    const prompt = `Generate exactly ${questionCount} distinct Salesforce module mastery questions.
Course: ${request.body.course}
Module: ${request.body.module}
Lesson points: ${(request.body.lessonPoints || []).join(" | ")}
Practice tasks: ${(request.body.practice || []).join(" | ")}

Requirements:
- Include recall, scenario, troubleshooting, hands-on, and interview-style questions.
- Questions must test understanding, not memorization alone.
- Return only a valid JSON array of question strings.`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!geminiResponse.ok) {
      return response.status(502).json({ error: "Gemini question generation failed." });
    }

    const data = await geminiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") || "[]";
    let questions;
    try {
      questions = JSON.parse(text);
    } catch {
      return response.status(502).json({ error: "Gemini returned invalid question JSON." });
    }
    if (!Array.isArray(questions) || questions.length < 15) {
      return response.status(502).json({ error: "Gemini returned fewer than 15 questions." });
    }
    return response.json({ questions: questions.slice(0, questionCount), provider, model });
  });

  app.post("/api/ai/trainer", async (request, response) => {
    const provider = process.env.AI_PROVIDER || "gemini";
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const requestedSpeedMode = request.body.speedMode || process.env.AI_SPEED_MODE || "auto";
    const speedMode = requestedSpeedMode === "auto" ? chooseEfficientMode(request.body.doubt) : requestedSpeedMode;

    if (provider !== "gemini") {
      return response.status(400).json({ error: `Unsupported AI provider: ${provider}` });
    }
    const apiKey = request.personalApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return response.status(503).json({ error: "Gemini API key is not configured. Please configure a personal key or contact your administrator." });
    }

    const prompt = `${speedPrompts[speedMode] || speedPrompts.flash}

Topic: ${request.body.topic}
Answer mode: ${request.body.answerMode}
Student doubt: ${request.body.doubt}`;

    let geminiResponse;
    try {
      geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
    } catch {
      return response.status(502).json({ error: "Could not connect to Gemini. Check backend network access." });
    }

    if (!geminiResponse.ok) {
      return response.status(502).json({ error: `Gemini trainer request failed with status ${geminiResponse.status}.` });
    }

    const data = await geminiResponse.json();
    const answer = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") || "No answer was returned.";
    return response.json({ answer, provider, model, speedMode });
  });
}
