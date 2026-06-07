(function () {
  const config = window.TomCodexCourseConfig || {
    modules: window.TomCodexAdminModules,
    masteryKey: "tomcodex.adminMasteryScores.v1",
    courseName: "Salesforce Administrator",
    recordLabel: "Admin",
    moduleHours: 3
  };
  const modules = config.modules;
  const MASTERY_KEY = config.masteryKey;
  const courseName = config.courseName;
  const recordLabel = config.recordLabel;
  const moduleHours = config.moduleHours;
  const AUTH_SESSION_KEY = "tomcodex.authSession.v1";
  const FINAL_EXAM_KEY = `${MASTERY_KEY}.finalExam`;
  const FINAL_EXAM_QUESTION_COUNT = 60;
  const FINAL_EXAM_SECONDS = 60 * 60;
  const FINAL_EXAM_PASS_SCORE = 65;
  let currentModule = 0;
  let masteryScores = loadScores();
  let activeTestQuestions = [];
  let finalExamQuestions = [];
  let finalExamTimer;
  let finalExamSecondsLeft = FINAL_EXAM_SECONDS;
  const el = (id) => document.getElementById(id);
  const isLocalDevelopment = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const isAdmin = isLocalDevelopment || loadRole() === "admin";

  function loadScores() {
    try { return JSON.parse(localStorage.getItem(MASTERY_KEY)) || {}; } catch { return {}; }
  }
  function loadRole() {
    try {
      const session = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY));
      return session?.role === "admin" ? "admin" : "user";
    } catch {
      return "user";
    }
  }
  function saveScores() { localStorage.setItem(MASTERY_KEY, JSON.stringify(masteryScores)); }
  function scoreFor(index) { return Number(masteryScores[index]?.score) || 0; }
  function passed(index) { return scoreFor(index) >= 80; }
  function unlocked(index) { return isAdmin || index === 0 || passed(index - 1); }
  function allModulesPassed() { return modules.every((_, index) => passed(index)); }
  function finalExamUnlocked() { return isAdmin || allModulesPassed(); }

  function loadFinalExamResult() {
    try { return JSON.parse(localStorage.getItem(FINAL_EXAM_KEY)); } catch { return null; }
  }

  function saveFinalExamResult(result) {
    const previous = loadFinalExamResult();
    if (!previous || result.score >= previous.score) localStorage.setItem(FINAL_EXAM_KEY, JSON.stringify(result));
  }

  function renderNav() {
    el("moduleNav").innerHTML = modules.map((module, index) => {
      const isPassed = passed(index);
      const isUnlocked = unlocked(index);
      const status = isPassed ? `Passed: ${scoreFor(index)}% · ${moduleHours} hrs` : isAdmin ? `Admin access · ${moduleHours} hrs` : isUnlocked ? `Ready to learn · ${moduleHours} hrs` : "Locked: pass previous module";
      const icon = isPassed ? "\u2713" : isUnlocked ? index + 1 : "\uD83D\uDD12";
      return `<button type="button" data-module="${index}" ${isUnlocked ? "" : "disabled"} class="${index === currentModule ? "active" : ""} ${isPassed ? "done" : ""} ${isUnlocked ? "" : "locked"}"><span class="module-number">${icon}</span><span><strong>${module.title}</strong><span>${status}</span></span></button>`;
    }).join("");
    document.querySelectorAll("[data-module]").forEach((button) => button.addEventListener("click", () => {
      const index = Number(button.dataset.module);
      if (!unlocked(index)) return;
      currentModule = index;
      render();
    }));
  }

  function renderProgress() {
    const count = modules.filter((_, index) => passed(index)).length;
    const progress = Math.round(count / modules.length * 100);
    el("courseProgressText").textContent = `${progress}%`;
    el("completedModulesText").textContent = `${count} / ${modules.length}`;
    el("courseProgressBar").style.width = `${progress}%`;
  }

  function injectFinalExam() {
    if (el("finalExamSection")) return;
    el("moduleContent").insertAdjacentHTML("beforeend", `
      <section id="finalExamSection" class="final-exam-section">
        <div class="final-exam-intro">
          <div><span class="course-tag">Course certification test</span><h3>${courseName} final exam</h3><p>Complete a Salesforce certification-style exam after finishing the full course.</p></div>
          <div class="final-exam-facts"><span><strong>60</strong>MCQs</span><span><strong>60</strong>Minutes</span><span><strong>${FINAL_EXAM_PASS_SCORE}%</strong>Pass</span></div>
        </div>
        <div id="finalExamStatus" class="final-exam-status"></div>
        <button id="startFinalExamBtn" class="course-primary" type="button">Start final 60-question exam</button>
        <div id="finalExamPanel" class="final-exam-panel hidden">
          <div class="final-exam-toolbar"><div><span class="course-tag">Certification simulation</span><h3>${courseName} final exam</h3></div><div><span>Answered <strong id="finalExamAnswered">0 / 60</strong></span><span>Time left <strong id="finalExamTimer">60:00</strong></span></div></div>
          <div id="finalExamQuestions" class="final-exam-questions"></div>
          <button id="submitFinalExamBtn" class="course-primary" type="button">Submit final exam</button>
          <div id="finalExamResult" class="mastery-result hidden" aria-live="polite"></div>
        </div>
      </section>
    `);
    el("startFinalExamBtn").addEventListener("click", startFinalExam);
    el("submitFinalExamBtn").addEventListener("click", () => submitFinalExam(false));
    renderFinalExamStatus();
  }

  function renderFinalExamStatus() {
    const unlocked = finalExamUnlocked();
    const result = loadFinalExamResult();
    const status = el("finalExamStatus");
    el("startFinalExamBtn").disabled = !unlocked;
    el("startFinalExamBtn").textContent = result ? "Retake final 60-question exam" : "Start final 60-question exam";
    if (!unlocked) {
      const passedCount = modules.filter((_, index) => passed(index)).length;
      status.className = "final-exam-status locked";
      status.textContent = `Locked: pass all modules first. Current progress: ${passedCount} of ${modules.length} modules passed.`;
      return;
    }
    if (result) {
      status.className = `final-exam-status ${result.passed ? "passed" : "ready"}`;
      status.textContent = `${result.passed ? "Certification exam passed" : "Best attempt"}: ${result.score}% (${result.correctAnswers}/${FINAL_EXAM_QUESTION_COUNT} correct).`;
      return;
    }
    status.className = "final-exam-status ready";
    status.textContent = isAdmin && !allModulesPassed() ? "Admin preview access: final exam is ready." : "All modules passed. Your final exam is ready.";
  }

  function seededShuffle(items, seed) {
    const output = [...items];
    let value = seed;
    for (let index = output.length - 1; index > 0; index -= 1) {
      value = (value * 9301 + 49297) % 233280;
      const swapIndex = Math.floor(value / 233280 * (index + 1));
      [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
    }
    return output;
  }

  function buildFinalExamQuestions() {
    const allPoints = modules.flatMap((module) => module.points.map((point) => ({ module: module.title, point })));
    const prompts = [
      (module) => `Which statement is most accurate for ${module}?`,
      (module) => `During a ${module} implementation, which approach should be selected?`,
      (module) => `Which option demonstrates correct understanding of ${module}?`
    ];
    const candidates = allPoints.flatMap((item, pointIndex) => prompts.map((prompt, promptIndex) => {
      const distractors = seededShuffle(allPoints.filter((other) => other.point !== item.point).map((other) => other.point), pointIndex * 19 + promptIndex * 31 + modules.length).slice(0, 3);
      const options = seededShuffle([item.point, ...distractors], pointIndex * 41 + promptIndex * 17 + courseName.length);
      return { prompt: prompt(item.module), module: item.module, options, correctIndex: options.indexOf(item.point) };
    }));
    return seededShuffle(candidates, courseName.length * 97 + modules.length).slice(0, FINAL_EXAM_QUESTION_COUNT);
  }

  function formatExamTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const remainder = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainder}`;
  }

  function updateExamAnswered() {
    const answered = document.querySelectorAll("[data-final-answer]:checked").length;
    el("finalExamAnswered").textContent = `${answered} / ${FINAL_EXAM_QUESTION_COUNT}`;
  }

  function startFinalExam() {
    if (!finalExamUnlocked()) return;
    clearInterval(finalExamTimer);
    finalExamQuestions = buildFinalExamQuestions();
    finalExamSecondsLeft = FINAL_EXAM_SECONDS;
    el("finalExamResult").className = "mastery-result hidden";
    el("finalExamPanel").classList.remove("hidden");
    el("finalExamQuestions").innerHTML = finalExamQuestions.map((question, index) => `
      <fieldset class="final-exam-question">
        <legend><span>${index + 1}</span>${question.prompt}<small>${question.module}</small></legend>
        <div>${question.options.map((option, optionIndex) => `<label><input type="radio" name="finalQuestion${index}" value="${optionIndex}" data-final-answer><span><strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${option}</span></label>`).join("")}</div>
      </fieldset>
    `).join("");
    document.querySelectorAll("[data-final-answer]").forEach((input) => input.addEventListener("change", updateExamAnswered));
    updateExamAnswered();
    el("finalExamTimer").textContent = formatExamTime(finalExamSecondsLeft);
    finalExamTimer = setInterval(() => {
      finalExamSecondsLeft -= 1;
      el("finalExamTimer").textContent = formatExamTime(finalExamSecondsLeft);
      if (finalExamSecondsLeft <= 0) submitFinalExam(true);
    }, 1000);
    el("finalExamPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function submitFinalExam(timeExpired) {
    if (!finalExamQuestions.length) return;
    clearInterval(finalExamTimer);
    const answers = finalExamQuestions.map((_, index) => {
      const selected = document.querySelector(`input[name="finalQuestion${index}"]:checked`);
      return selected ? Number(selected.value) : -1;
    });
    const correctAnswers = answers.filter((answer, index) => answer === finalExamQuestions[index].correctIndex).length;
    const score = Math.round(correctAnswers / FINAL_EXAM_QUESTION_COUNT * 100);
    const passedExam = score >= FINAL_EXAM_PASS_SCORE;
    const result = { score, passed: passedExam, correctAnswers, completedAt: new Date().toISOString(), timeExpired };
    saveFinalExamResult(result);
    const box = el("finalExamResult");
    box.className = `mastery-result ${passedExam ? "passed" : "failed"}`;
    box.innerHTML = `<strong>${passedExam ? "Final exam passed" : "Final exam not passed"}: ${score}%</strong><p>${correctAnswers} of ${FINAL_EXAM_QUESTION_COUNT} answers were correct.${timeExpired ? " Time expired and the exam was submitted automatically." : ""} ${passedExam ? "You completed the certification simulation." : `Review the curriculum and score at least ${FINAL_EXAM_PASS_SCORE}% to pass.`}</p>`;
    if (passedExam) window.TomCodexLearning?.record("task", 100, `Passed ${recordLabel} final exam (${score}%)`);
    renderFinalExamStatus();
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function topicTitle(point) {
    return point.replace(/[.!?]+$/, "");
  }

  function topicCoverage(module, index) {
    const practice = module.practice[index] || module.practice[0];
    const question = module.questions[index] || module.questions[0];
    const isApex = courseName === "Apex Development";
    const implementation = isApex
      ? [
          "Clarify the requirement, transaction context, inputs, outputs, and failure behavior.",
          "Implement the smallest maintainable solution with bulk processing, security, and governor limits in mind.",
          "Write positive, negative, bulk, and permission-focused tests before deployment."
        ]
      : [
          "Translate the business request into users, data, access, automation, and reporting requirements.",
          "Configure and test the solution in a safe environment with representative user personas and records.",
          "Document the decision, validate acceptance criteria, deploy safely, and monitor adoption."
        ];
    const bestPractices = isApex
      ? ["Keep responsibilities small and names clear.", "Design for collections, security, and failure.", "Use assertions and operational logging."]
      : ["Use least privilege and standard features first.", "Name and document every important configuration.", "Test both expected and restricted user experiences."];
    const mistakes = isApex
      ? ["Writing SOQL or DML inside loops.", "Testing only code coverage instead of behavior.", "Ignoring sharing, CRUD/FLS, limits, or error handling."]
      : ["Building before confirming the business outcome.", "Testing only as an administrator.", "Skipping documentation, rollback, and post-release checks."];
    return { title: topicTitle(module.points[index]), concept: module.points[index], implementation, example: practice, bestPractices, mistakes, proof: question };
  }

  function renderTopicCoverage(module) {
    const topics = module.points.map((_, index) => topicCoverage(module, index));
    el("topicCoverageCount").textContent = `${topics.length} subcategories`;
    el("topicCoverage").innerHTML = topics.map((topic, index) => `
      <details class="topic-category" ${index === 0 ? "open" : ""}>
        <summary><span class="topic-number">${index + 1}</span><span><strong>${topic.title}</strong><small>Concept, implementation, example, standards, mistakes, and practice</small></span><span class="topic-toggle" aria-hidden="true">+</span></summary>
        <div class="topic-category-body">
          <div class="topic-detail topic-concept"><span>Concept</span><p>${topic.concept}</p></div>
          <div class="topic-detail topic-example"><span>Realistic example</span><p>${topic.example}</p></div>
          <div class="topic-detail topic-wide"><span>Implementation path</span><ol>${topic.implementation.map((item) => `<li>${item}</li>`).join("")}</ol></div>
          <div class="topic-detail"><span>Best practices</span><ul>${topic.bestPractices.map((item) => `<li>${item}</li>`).join("")}</ul></div>
          <div class="topic-detail topic-warning"><span>Common mistakes</span><ul>${topic.mistakes.map((item) => `<li>${item}</li>`).join("")}</ul></div>
          <div class="topic-detail topic-proof topic-wide"><span>Prove your skill</span><p>${topic.proof}</p></div>
        </div>
      </details>
    `).join("");
  }

  function render() {
    const module = modules[currentModule];
    const isPassed = passed(currentModule);
    el("moduleLabel").textContent = `Module ${currentModule + 1} of ${modules.length} · ${isAdmin ? "Admin access" : `About ${moduleHours} hours`}`;
    el("moduleTitle").textContent = module.title;
    el("moduleDescription").textContent = module.description;
    el("lessonPoints").innerHTML = module.points.map((item) => `<div>${item}</div>`).join("");
    renderTopicCoverage(module);
    el("resourceList").innerHTML = module.resources.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}<span>\u2197</span></a>`).join("");
    el("practiceList").innerHTML = module.practice.map((item) => `<div>${item}</div>`).join("");
    el("questionList").innerHTML = module.questions.map((item) => `<div>${item}</div>`).join("");
    el("completeModuleBtn").textContent = isPassed ? `Mastery passed: ${scoreFor(currentModule)}%` : "AI mastery test required";
    el("completeModuleBtn").classList.toggle("done", isPassed);
    el("startMasteryTestBtn").textContent = isPassed ? "Retake AI mastery test" : "Start AI mastery test";
    el("previousModuleBtn").disabled = currentModule === 0;
    el("nextModuleBtn").disabled = !isAdmin && !isPassed;
    el("nextModuleBtn").textContent = currentModule === modules.length - 1 ? isAdmin || isPassed ? "Go to final exam" : "Pass 80% to unlock final exam" : isAdmin || isPassed ? "Next module" : "Pass 80% to unlock next";
    el("masteryTestPanel").classList.add("hidden");
    el("masteryResult").className = "mastery-result hidden";
    renderNav();
    renderProgress();
    renderFinalExamStatus();
  }

  async function startTest() {
    const module = modules[currentModule];
    el("masteryTestPanel").classList.remove("hidden");
    el("masteryResult").className = "mastery-result hidden";
    el("masteryAnswerList").innerHTML = '<div class="mastery-loading">Zentom AI is generating 15 mastery questions...</div>';
    activeTestQuestions = await window.TomCodexAI.generateMasteryQuestions({
      course: courseName,
      module: module.title,
      lessonPoints: module.points,
      recallQuestions: module.questions,
      practice: module.practice,
      questionCount: 15
    });
    el("masteryAnswerList").innerHTML = activeTestQuestions.map((question, index) => `<div><label for="masteryAnswer${index}">Question ${index + 1} of 15: ${question.replace(/^\d+\.\s*/, "")}</label><textarea id="masteryAnswer${index}" data-mastery-answer placeholder="Explain clearly and include a Salesforce example."></textarea></div>`).join("");
    el("masteryTestPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showResult(result) {
    const box = el("masteryResult");
    box.className = `mastery-result ${result.passed ? "passed" : "failed"}`;
    box.innerHTML = `<strong>${result.passed ? "Passed" : "Not passed"}: ${result.score}%</strong><p>${result.summary}</p>${result.feedback?.length ? `<ul>${result.feedback.map((item) => `<li>${item.feedback}</li>`).join("")}</ul>` : ""}`;
  }

  async function submitTest() {
    const module = modules[currentModule];
    const answers = [...document.querySelectorAll("[data-mastery-answer]")].map((input) => input.value.trim());
    if (activeTestQuestions.length < 15 || answers.length < 15) {
      showResult({ score: 0, passed: false, summary: "The mastery test must contain and answer at least 15 questions.", feedback: [] });
      return;
    }
    if (answers.some((answer) => answer.length < 20)) {
      showResult({ score: 0, passed: false, summary: "Answer all 15 questions with at least 20 characters before submitting.", feedback: [] });
      return;
    }
    const button = el("submitMasteryTestBtn");
    button.disabled = true;
    button.textContent = "AI is evaluating...";
    const result = await window.TomCodexAI.evaluateMastery({ course: courseName, module: module.title, questions: activeTestQuestions, answers, lessonPoints: module.points, passScore: 80, minimumQuestionCount: 15 });
    button.disabled = false;
    button.textContent = "Submit answers to AI";
    const best = scoreFor(currentModule);
    if (result.score > best) {
      masteryScores[currentModule] = { score: result.score, passed: result.score >= 80, timestamp: new Date().toISOString() };
      saveScores();
    }
    if (result.score >= 80 && best < 80) window.TomCodexLearning?.record("task", 15, `Passed ${recordLabel} mastery: ${module.title} (${result.score}%)`);
    showResult(result);
    renderNav();
    renderProgress();
    renderFinalExamStatus();
    el("completeModuleBtn").textContent = passed(currentModule) ? `Mastery passed: ${scoreFor(currentModule)}%` : "AI mastery test required";
    el("completeModuleBtn").classList.toggle("done", passed(currentModule));
    el("nextModuleBtn").disabled = !isAdmin && !passed(currentModule);
    el("nextModuleBtn").textContent = currentModule === modules.length - 1 ? isAdmin || passed(currentModule) ? "Go to final exam" : "Pass 80% to unlock final exam" : isAdmin || passed(currentModule) ? "Next module" : "Pass 80% to unlock next";
  }

  el("completeModuleBtn").addEventListener("click", startTest);
  el("startMasteryTestBtn").addEventListener("click", startTest);
  el("submitMasteryTestBtn").addEventListener("click", submitTest);
  el("previousModuleBtn").addEventListener("click", () => { if (currentModule > 0) { currentModule -= 1; render(); } });
  el("nextModuleBtn").addEventListener("click", () => {
    if (currentModule === modules.length - 1) {
      if (!isAdmin && !passed(currentModule)) return;
      el("finalExamSection").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!isAdmin && !passed(currentModule)) return;
    currentModule += 1;
    render();
  });
  el("continueCourseBtn").addEventListener("click", () => {
    currentModule = modules.findIndex((_, index) => unlocked(index) && !passed(index));
    if (currentModule < 0) currentModule = modules.length - 1;
    render();
    el("moduleContent").scrollIntoView({ behavior: "smooth" });
  });
  injectFinalExam();
  render();
})();
