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
  let currentModule = 0;
  let masteryScores = loadScores();
  let activeTestQuestions = [];
  const el = (id) => document.getElementById(id);
  const isAdmin = loadRole() === "admin";

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

  function render() {
    const module = modules[currentModule];
    const isPassed = passed(currentModule);
    el("moduleLabel").textContent = `Module ${currentModule + 1} of ${modules.length} · ${isAdmin ? "Admin access" : `About ${moduleHours} hours`}`;
    el("moduleTitle").textContent = module.title;
    el("moduleDescription").textContent = module.description;
    el("lessonPoints").innerHTML = module.points.map((item) => `<div>${item}</div>`).join("");
    el("resourceList").innerHTML = module.resources.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}<span>\u2197</span></a>`).join("");
    el("practiceList").innerHTML = module.practice.map((item) => `<div>${item}</div>`).join("");
    el("questionList").innerHTML = module.questions.map((item) => `<div>${item}</div>`).join("");
    el("completeModuleBtn").textContent = isPassed ? `Mastery passed: ${scoreFor(currentModule)}%` : "AI mastery test required";
    el("completeModuleBtn").classList.toggle("done", isPassed);
    el("startMasteryTestBtn").textContent = isPassed ? "Retake AI mastery test" : "Start AI mastery test";
    el("previousModuleBtn").disabled = currentModule === 0;
    el("nextModuleBtn").disabled = currentModule < modules.length - 1 && !isAdmin && !isPassed;
    el("nextModuleBtn").textContent = currentModule === modules.length - 1 ? "Continue in dashboard" : isAdmin || isPassed ? "Next module" : "Pass 80% to unlock next";
    el("masteryTestPanel").classList.add("hidden");
    el("masteryResult").className = "mastery-result hidden";
    renderNav();
    renderProgress();
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
    el("completeModuleBtn").textContent = passed(currentModule) ? `Mastery passed: ${scoreFor(currentModule)}%` : "AI mastery test required";
    el("completeModuleBtn").classList.toggle("done", passed(currentModule));
    el("nextModuleBtn").disabled = currentModule < modules.length - 1 && !isAdmin && !passed(currentModule);
    el("nextModuleBtn").textContent = currentModule === modules.length - 1 ? "Continue in dashboard" : isAdmin || passed(currentModule) ? "Next module" : "Pass 80% to unlock next";
  }

  el("completeModuleBtn").addEventListener("click", startTest);
  el("startMasteryTestBtn").addEventListener("click", startTest);
  el("submitMasteryTestBtn").addEventListener("click", submitTest);
  el("previousModuleBtn").addEventListener("click", () => { if (currentModule > 0) { currentModule -= 1; render(); } });
  el("nextModuleBtn").addEventListener("click", () => {
    if (currentModule === modules.length - 1) { window.location.href = "dashboard.html"; return; }
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
  render();
})();
