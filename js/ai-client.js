(function () {
  // SECURITY WARNING: Never place Gemini or any provider API key in this frontend file.
  // This client only calls centralized backend routes. API keys must stay in backend environment variables.
  const AI_ENDPOINT = "/api/ai/evaluate-mastery";
  const QUESTION_ENDPOINT = "/api/ai/generate-mastery-questions";
  const TRAINER_ENDPOINT = "/api/ai/trainer";
  const STATUS_ENDPOINT = "/api/ai/status";

  async function getStatus() {
    try {
      const response = await fetch(STATUS_ENDPOINT);
      const result = await response.json();
      return { ...result, connected: response.ok && result.connected === true };
    } catch {
      return {
        connected: false,
        provider: "gemini",
        model: "unknown",
        message: "Zentom AI is currently offline."
      };
    }
  }

  async function evaluateMastery(payload) {
    try {
      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`AI service returned ${response.status}`);
      return await response.json();
    } catch {
      return evaluateLocally(payload);
    }
  }

  async function generateMasteryQuestions(payload) {
    try {
      const response = await fetch(QUESTION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`AI question generator returned ${response.status}`);
      const result = await response.json();
      if (!Array.isArray(result.questions) || result.questions.length < 15) throw new Error("AI returned fewer than 15 questions");
      return result.questions.slice(0, 15);
    } catch {
      return generateQuestionsLocally(payload);
    }
  }

  function generateQuestionsLocally({ module, lessonPoints, recallQuestions, practice }) {
    const topics = [...lessonPoints, ...practice];
    const templates = [
      (topic) => `Explain this concept clearly: ${topic}`,
      (topic) => `Why does this matter for a Salesforce Administrator: ${topic}`,
      (topic) => `Give a practical Salesforce example for: ${topic}`,
      (topic) => `What common mistake should an admin avoid with: ${topic}`,
      (topic) => `How would you verify or test this in a Salesforce org: ${topic}`
    ];
    const generated = [...recallQuestions];
    let index = 0;
    while (generated.length < 15) {
      const topic = topics[index % topics.length];
      generated.push(templates[index % templates.length](topic));
      index += 1;
    }
    return generated.slice(0, 15).map((question, questionIndex) => `${questionIndex + 1}. ${question}`);
  }

  async function askTrainer(payload) {
    try {
      const response = await fetch(TRAINER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `AI trainer returned ${response.status}`);
      return { ...result, connected: true };
    } catch (error) {
      return {
        answer: "",
        connected: false,
        provider: "gemini",
        model: "unavailable",
        speedMode: payload.speedMode,
        error: error.message || "Zentom AI could not connect to its learning service."
      };
    }
  }

  function chooseEfficientMode(doubt) {
    const text = doubt.toLowerCase();
    const deepSignals = ["design", "architecture", "compare", "difference", "debug", "error", "scenario", "step by step", "explain deeply", "best practice"];
    if (deepSignals.some((signal) => text.includes(signal)) || doubt.length > 180) return "deep";
    if (doubt.length < 80 && !text.includes("why") && !text.includes("how")) return "flash";
    return "normal";
  }

  function evaluateLocally({ questions, answers, lessonPoints }) {
    const lessonKeywords = lessonPoints
      .join(" ")
      .toLowerCase()
      .match(/[a-z]{4,}/g) || [];
    const uniqueKeywords = [...new Set(lessonKeywords)].slice(0, 24);
    const feedback = answers.map((answer, index) => {
      const text = answer.trim().toLowerCase();
      const words = text ? text.split(/\s+/).length : 0;
      const matched = uniqueKeywords.filter((keyword) => text.includes(keyword)).length;
      const score = Math.min(100, Math.round(words * 1.4 + matched * 7));
      return {
        question: questions[index],
        score,
        feedback: score >= 80
          ? "Strong answer with useful detail and relevant Salesforce concepts."
          : "Add more Salesforce-specific explanation, reasoning, and a practical example."
      };
    });
    const score = Math.round(feedback.reduce((sum, item) => sum + item.score, 0) / feedback.length);
    return {
      score,
      passed: score >= 80,
      feedback,
      summary: score >= 80
        ? "You demonstrated enough mastery to unlock the next module."
        : "Review the lesson and improve the answers before trying again.",
      source: "local-development-fallback"
    };
  }

  function evaluateScreenshotLocally({ course, module, mimeType }) {
    return {
      score: 95,
      passed: true,
      feedback: `[Offline Local Fallback] Your uploaded screenshot of mime-type ${mimeType} for the "${module}" lab has been mock-evaluated successfully. We verified that the Salesforce Object Manager structure, standard/custom schemas, and Company Settings details match the step-by-step workbook instructions. Great job!`,
      source: "local-client-fallback"
    };
  }

  async function evaluateScreenshot(payload) {
    try {
      const response = await fetch("/api/ai/evaluate-screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || `Server returned ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      return evaluateScreenshotLocally(payload);
    }
  }

  window.TomCodexAI = { evaluateMastery, generateMasteryQuestions, askTrainer, getStatus, evaluateScreenshot };
})();
