// Mount this route in a secure Node/Express backend.
// The API key stays on the server and is never returned to the browser.
export function registerAiEvaluatorRoute(app) {
  app.post("/api/ai/evaluate-mastery", async (request, response) => {
    const { course, module, questions, answers, lessonPoints, passScore = 80, minimumQuestionCount = 15 } = request.body;

    if (!Array.isArray(questions) || !Array.isArray(answers) || questions.length < minimumQuestionCount || answers.length < minimumQuestionCount) {
      return response.status(400).json({ error: `A minimum of ${minimumQuestionCount} answered questions is required.` });
    }

    const apiKey = request.personalApiKey || process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (apiKey) {
      const prompt = `You are a Senior Salesforce Developer and Trainer evaluating a student's answers for the "${course}" course, "${module}" module.
Evaluate if the student has demonstrated mastery (overall score >= 80) of the concepts.

Lesson points to verify: ${(lessonPoints || []).join(" | ")}

For each of the ${questions.length} questions, review the student's answer:
- Assign a score from 0 to 100 based on technical accuracy, use of correct terminology, and practical explanation.
- Provide constructive feedback.

Questions:
${questions.map((q, idx) => `Q${idx+1}: ${q}`).join("\n")}

Student Answers:
${answers.map((a, idx) => `A${idx+1}: ${a}`).join("\n")}

Return ONLY a valid JSON object (no markdown, no backticks, no code block formatting) containing exactly these fields:
- score: integer from 0 to 100 (the average score across all questions)
- summary: concise summary of student's strength and areas of improvement
- feedback: array of objects, each containing:
  - question: exact question text
  - score: integer score for this question (0-100)
  - feedback: concise feedback for this answer`;

      try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        if (!geminiResponse.ok) throw new Error("Gemini evaluator failed");

        const data = await geminiResponse.json();
        const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") || "{}";
        const result = JSON.parse(text);

        const score = Math.max(0, Math.min(100, Number(result.score) || 0));
        return response.json({
          score,
          passed: score >= passScore,
          summary: result.summary || "AI mastery evaluation completed.",
          feedback: Array.isArray(result.feedback) ? result.feedback : [],
          source: "centralized-ai-api"
        });
      } catch (error) {
        return response.status(502).json({ error: "Gemini mastery evaluation failed." });
      }
    }

    // Fallback to generic AI provider configuration if no Gemini key is available
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
