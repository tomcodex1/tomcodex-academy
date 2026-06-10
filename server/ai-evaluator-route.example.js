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

  // ── Trailhead-style "Check My Work" criteria verification ──────────────────
  app.post("/api/ai/verify-lab", async (request, response) => {
    const { courseKey, moduleIndex, moduleName, courseName, criteria, studentAnswers } = request.body;

    if (!Array.isArray(criteria) || criteria.length === 0) {
      return response.status(400).json({ error: "No criteria provided for verification." });
    }
    if (!studentAnswers || typeof studentAnswers !== "object") {
      return response.status(400).json({ error: "Student answers are required." });
    }

    // ── Rule-based verification (fast, no API key needed) ───────────────────
    function ruleCheck(criterion, answer) {
      const raw = String(answer || "").trim().toLowerCase();
      if (!raw || raw.length < 1) return { passed: false, confidence: "rule", feedback: "No answer provided. " + criterion.hint };

      if (criterion.type === "number") {
        const num = parseFloat(raw);
        if (isNaN(num)) return { passed: false, confidence: "rule", feedback: `Enter a number. ${criterion.hint}` };
        const min = criterion.minValue ?? 0;
        const max = criterion.maxValue ?? 9999;
        if (num >= min && num <= max) return { passed: true, confidence: "rule", feedback: `✅ Correct — ${num} is a valid value for this field.` };
        return { passed: false, confidence: "rule", feedback: `The number ${num} seems outside the expected range (${min}–${max}). ${criterion.hint}` };
      }

      if (criterion.acceptedValues?.length) {
        const match = criterion.acceptedValues.some(v => raw.includes(v.toLowerCase()));
        if (match) return { passed: true, confidence: "rule", feedback: "✅ Correct — this matches the expected value." };
        return { passed: false, confidence: "needs-ai", feedback: null }; // escalate to AI
      }

      if (criterion.minLength && raw.length >= criterion.minLength) {
        return { passed: true, confidence: "rule", feedback: "✅ Answer recorded — AI will verify the details." };
      }

      return { passed: false, confidence: "needs-ai", feedback: null };
    }

    // ── Run rule-based pass first ────────────────────────────────────────────
    const ruleResults = criteria.map(c => ({
      id: c.id,
      question: c.question,
      answer: studentAnswers[c.id] || "",
      ...ruleCheck(c, studentAnswers[c.id])
    }));

    const needsAI = ruleResults.filter(r => r.confidence === "needs-ai");
    const apiKey = request.personalApiKey || process.env.GEMINI_API_KEY;

    // ── AI verification for uncertain answers ────────────────────────────────
    if (needsAI.length > 0 && apiKey) {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const aiPrompt = `You are a Salesforce certification verifier checking student lab completion for the "${courseName}" course, "${moduleName}" module.

For each question below, decide if the student's answer is CORRECT based on Salesforce knowledge.
Be lenient with phrasing but strict on technical accuracy.

${needsAI.map((r, i) => `Q${i + 1}: ${r.question}\nStudent Answer: "${r.answer}"`).join("\n\n")}

Return ONLY valid JSON array (no markdown) with one object per question:
[{"id": "c1", "passed": true/false, "feedback": "brief explanation or hint"}]`;

      try {
        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }] }], generationConfig: { responseMimeType: "application/json" } })
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const aiText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
          const aiResults = JSON.parse(aiText);
          aiResults.forEach(aiR => {
            const target = ruleResults.find(r => r.id === aiR.id);
            if (target) {
              target.passed = aiR.passed;
              target.feedback = aiR.passed ? `✅ ${aiR.feedback}` : `❌ ${aiR.feedback}`;
              target.confidence = "ai";
            }
          });
        }
      } catch { /* fallback: mark uncertain as failed with hint */ }
    }

    // ── Fill any still-uncertain results ────────────────────────────────────
    ruleResults.forEach(r => {
      if (r.confidence === "needs-ai") {
        r.passed = false;
        const criterion = criteria.find(c => c.id === r.id);
        r.feedback = `Could not verify automatically. ${criterion?.hint || "Please double-check your answer."}`;
      }
      if (!r.feedback) r.feedback = r.passed ? "✅ Correct!" : `❌ Incorrect. ${criteria.find(c => c.id === r.id)?.hint || ""}`;
    });

    const passedCount = ruleResults.filter(r => r.passed).length;
    const score = Math.round((passedCount / criteria.length) * 100);
    const passed = score >= 80;

    return response.json({
      passed,
      score,
      passedCount,
      totalCount: criteria.length,
      criteriaResults: ruleResults,
      summary: passed
        ? `🎉 Lab verified! You passed ${passedCount}/${criteria.length} checks. Module unlocked!`
        : `You passed ${passedCount}/${criteria.length} checks (need 80%). Review the hints and try again.`
    });
  });
}
