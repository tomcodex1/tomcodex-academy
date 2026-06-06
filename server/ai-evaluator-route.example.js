// Mount this route in a secure Node/Express backend.
// The API key stays on the server and is never returned to the browser.
export function registerAiEvaluatorRoute(app) {
  app.post("/api/ai/evaluate-mastery", async (request, response) => {
    const { course, module, questions, answers, lessonPoints, passScore = 80, minimumQuestionCount = 15 } = request.body;

    if (!Array.isArray(questions) || !Array.isArray(answers) || questions.length < minimumQuestionCount || answers.length < minimumQuestionCount) {
      return response.status(400).json({ error: `A minimum of ${minimumQuestionCount} answered questions is required.` });
    }

    if (!process.env.AI_API_KEY || !process.env.AI_API_URL) {
      return response.status(503).json({ error: "AI evaluator is not configured." });
    }

    const providerResponse = await fetch(process.env.AI_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL,
        task: "Evaluate Salesforce module mastery",
        rubric: {
          passScore,
          minimumQuestionCount,
          criteria: ["technical accuracy", "clarity", "Salesforce terminology", "practical example"]
        },
        course,
        module,
        lessonPoints,
        questions,
        answers
      })
    });

    if (!providerResponse.ok) {
      return response.status(502).json({ error: "AI provider evaluation failed." });
    }

    const result = await providerResponse.json();
    const score = Math.max(0, Math.min(100, Number(result.score) || 0));
    return response.json({
      score,
      passed: score >= passScore,
      summary: result.summary || "AI mastery evaluation completed.",
      feedback: Array.isArray(result.feedback) ? result.feedback : [],
      source: "centralized-ai-api"
    });
  });
}
