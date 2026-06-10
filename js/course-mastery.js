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
  function getModuleState(index) {
    if (isAdmin) {
      return { state: "unlocked", label: "Admin access", canOpen: true };
    }

    const moduleId = `admin-${index + 1}`;
    
    // Check if verified
    const attempts = loadJson("tomcodex.adminLabAttempts.v1", {});
    const legacyId = `admin-module-${index + 1}`;
    const bestScore = attempts[`${moduleId}:summary`]?.bestScore || attempts[`${legacyId}:summary`]?.bestScore || 0;
    const isModuleVerified = bestScore >= 80;

    if (isModuleVerified) {
      return {
        state: "verified",
        label: `Verified · Score: ${bestScore}%`,
        canOpen: true
      };
    }

    // Check prerequisite (previous module must be verified)
    if (index > 0) {
      const prevModuleId = `admin-${index}`;
      const prevModuleIdLegacy = `admin-module-${index}`;
      const prevBestScore = attempts[`${prevModuleId}:summary`]?.bestScore || attempts[`${prevModuleIdLegacy}:summary`]?.bestScore || 0;
      const isPrevVerified = prevBestScore >= 80;

      if (!isPrevVerified) {
        const prevModule = modules[index - 1];
        return {
          state: "gated",
          label: `Locked - Complete ${prevModule.title} first`,
          canOpen: false
        };
      }
    }

    // Check tier eligibility
    let authUser = {};
    try {
      authUser = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1")) || JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1")) || {};
    } catch {}
    const currentTier = authUser.tier || "free";
    const requiredTier = index === 0 ? "free" : "founder";

    if (requiredTier === "founder" && currentTier !== "founder") {
      return {
        state: "paywall",
        label: "Locked - Founder Access required",
        canOpen: true
      };
    }

    return {
      state: "unlocked",
      label: "Available",
      canOpen: true
    };
  }

  function unlocked(index) {
    const modState = getModuleState(index);
    return modState.canOpen;
  }

  function lockReason(index) {
    const modState = getModuleState(index);
    if (modState.state === "paywall") return "paywall";
    if (modState.state === "gated") return "gated";
    return null;
  }
  function allModulesPassed() { return modules.every((_, index) => passed(index)); }
  function finalExamUnlocked() { return isAdmin || allModulesPassed(); }

  function loadFinalExamResult() {
    try { return JSON.parse(localStorage.getItem(FINAL_EXAM_KEY)); } catch { return null; }
  }

  function saveFinalExamResult(result) {
    const previous = loadFinalExamResult();
    if (!previous || result.score >= previous.score) localStorage.setItem(FINAL_EXAM_KEY, JSON.stringify(result));
  }

  function showPaywall(index) {
    const module = modules[index];
    el("moduleContent").innerHTML = `
      <div class="paywall-container p-8 text-center bg-brand-950 text-white rounded-2xl border border-brand-500 shadow-2xl relative overflow-hidden my-6">
        <div class="absolute inset-0 opacity-15" style="background-image:radial-gradient(circle at 50% 50%,#24b5ff 0,transparent 60%)"></div>
        <div class="relative z-10 max-w-xl mx-auto py-10">
          <span class="text-xs bg-lime/20 text-lime px-3 py-1 rounded-full font-bold uppercase tracking-wider">Founder Access Required</span>
          <h2 class="mt-6 text-3xl font-extrabold text-white">Unlock all modules in the program</h2>
          <p class="mt-4 text-slate-300 text-sm leading-6">
            You are currently on the <strong>Free Starter Access</strong> tier. Complete all 14 Salesforce Admin modules, get unlimited screenshot proof AI reviews, certification simulators, and verified completion credentials.
          </p>
          
          <div class="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 text-left text-xs space-y-2">
            <h4 class="font-bold text-cyan-200 uppercase tracking-widest text-slate-200">Locked Module Info</h4>
            <div class="flex justify-between">
              <span>Module ${index + 1}: ${module.title}</span>
              <span class="text-slate-400">Duration: ~${moduleHours} hours</span>
            </div>
            <p class="text-slate-400 font-medium">${module.description}</p>
          </div>

          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="pricing.html" class="rounded-lg bg-lime px-6 py-3 font-extrabold text-brand-950 text-center hover:bg-white transition" style="box-shadow: 0 4px 14px rgba(216,255,95,.4);">
              View Pricing plans
            </a>
            <button id="quickUpgradeBtn" class="rounded-lg border border-white/30 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10 transition">
              Quick Upgrade (Simulated)
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById("quickUpgradeBtn").addEventListener("click", async () => {
      const btn = document.getElementById("quickUpgradeBtn");
      btn.disabled = true;
      btn.textContent = "Upgrading...";
      try {
        const res = await fetch("/api/student-upgrade", { method: "POST" });
        const data = await res.json();
        if (res.ok && data.success) {
          const cachedUser = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1") || "{}");
          cachedUser.tier = "founder";
          cachedUser.upgradedAt = data.upgradedAt || new Date().toISOString();
          localStorage.setItem("tomcodex.auth.user.v1", JSON.stringify(cachedUser));

          const cachedIdentity = JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1") || "{}");
          cachedIdentity.tier = "founder";
          localStorage.setItem("tomcodex.authIdentity.v1", JSON.stringify(cachedIdentity));
          
          currentModule = index;
          render();
        }
      } catch {
        btn.textContent = "Error upgrading";
        btn.disabled = false;
      }
    });
  }

  function renderNav() {
    el("moduleNav").innerHTML = modules.map((module, index) => {
      const moduleState = getModuleState(index);
      
      let icon = "";
      let disabledAttr = "";
      let buttonClass = "";
      
      if (moduleState.state === "verified") {
        icon = "\u2713";
        buttonClass = "done";
      } else if (moduleState.state === "paywall") {
        icon = "★";
        buttonClass = "paywall-locked";
      } else if (moduleState.state === "gated") {
        icon = "\uD83D\uDD12";
        disabledAttr = "disabled";
        buttonClass = "locked";
      } else {
        icon = index + 1;
        buttonClass = "";
      }
      
      if (index === currentModule) buttonClass += " active";
      
      return `<button type="button" data-module="${index}" ${disabledAttr} class="${buttonClass}"><span class="module-number">${icon}</span><span><strong>${module.title}</strong><span>${moduleState.label}</span></span></button>`;
    }).join("");

    document.querySelectorAll("[data-module]").forEach((button) => button.addEventListener("click", () => {
      const index = Number(button.dataset.module);
      const moduleState = getModuleState(index);
      if (moduleState.state === "paywall") {
        showPaywall(index);
        return;
      }
      if (moduleState.state === "gated") return;
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
      <section id="finalExamSection" class="final-exam-section hidden">
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

  function renderFinalExamVisibility() {
    const section = el("finalExamSection");
    if (!section) return;
    const isFinalModule = currentModule === modules.length - 1;
    section.classList.toggle("hidden", !isFinalModule);
    if (!isFinalModule) {
      clearInterval(finalExamTimer);
      el("finalExamPanel")?.classList.add("hidden");
    }
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

  function examDistractors() {
    if (courseName === "Apex Development") return [
      "Process each record separately and place SOQL or DML inside loops.",
      "Run all logic without sharing or CRUD/FLS checks because Apex executes on the server.",
      "Deploy after reaching code coverage without asserting business behavior.",
      "Catch every exception silently so users never see an error.",
      "Put all trigger logic directly in one trigger without handler classes.",
      "Ignore governor limits until a production transaction fails.",
      "Hard-code record IDs and endpoints to finish the implementation faster.",
      "Use synchronous processing for every workload regardless of volume."
    ];
    if (courseName === "Salesforce Flow") return [
      "Perform Get Records and Update Records operations inside every loop iteration.",
      "Run in system context without reviewing user access or sensitive data exposure.",
      "Activate the Flow directly in production without tests or rollback planning.",
      "Build one large Flow with duplicated logic instead of reusable subflows.",
      "Omit fault paths and rely on users to report failures.",
      "Use Flow for every requirement even when Apex is the safer scalable choice.",
      "Allow record-triggered automation to update the same record without recursion controls.",
      "Test only the successful path as an administrator."
    ];
    if (courseName === "Lightning Web Components") return [
      "Manipulate the DOM directly and insert untrusted content with innerHTML.",
      "Call Apex repeatedly for data already available through Lightning Data Service.",
      "Keep all interface behavior in one large component with no clear responsibilities.",
      "Assume server-side Apex automatically enforces sharing, CRUD, and field access.",
      "Deploy the component without Jest tests, accessibility checks, or error states.",
      "Hard-code record IDs and navigation URLs in the component.",
      "Mutate component state during rendering and ignore lifecycle behavior.",
      "Hide server errors and leave users without loading or failure feedback."
    ];
    return [
      "Configure directly in production before confirming requirements or acceptance criteria.",
      "Grant broad administrator access instead of applying least privilege.",
      "Test only as a system administrator and assume every user has the same experience.",
      "Deploy without documentation, rollback planning, or post-release verification.",
      "Create custom configuration before evaluating standard Salesforce capabilities.",
      "Ignore data quality, reporting, and adoption impacts during design.",
      "Allow one urgent request to bypass governance and change review.",
      "Use manual workarounds instead of investigating the underlying process requirement."
    ];
  }

  function buildFinalExamQuestions() {
    const wrongApproaches = examDistractors();
    const prompts = [
      (item) => `A team is completing this task: ${item.practice} Which approach best supports a reliable solution?`,
      (item) => `During a ${item.module} implementation, which action follows recommended Salesforce practice?`,
      (item) => `Which option best demonstrates this ${item.module} objective: ${topicTitle(item.point)}?`
    ];
    const topics = modules.flatMap((module) => module.points.map((point, index) => ({ module: module.title, point, practice: module.practice[index] || module.practice[0] })));
    const candidates = topics.flatMap((item, pointIndex) => prompts.map((prompt, promptIndex) => {
      const distractors = seededShuffle(wrongApproaches, pointIndex * 19 + promptIndex * 31 + modules.length).slice(0, 3);
      const options = seededShuffle([item.point, ...distractors], pointIndex * 41 + promptIndex * 17 + courseName.length);
      return { prompt: prompt(item), module: item.module, options, correctIndex: options.indexOf(item.point) };
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

  // ── Check My Work: Lab Criteria Verification ─────────────────────────────

  // Map course names to criteria keys
  const COURSE_KEY_MAP = {
    "Salesforce Administrator": "admin",
    "Apex Development": "apex",
    "Salesforce Flow": "flow",
    "Lightning Web Components": "lwc"
  };

  function loadLabResults() {
    try { return JSON.parse(localStorage.getItem(MASTERY_KEY + ".labResults")) || {}; } catch { return {}; }
  }
  function loadJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  }
  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function saveLabResult(index, result) {
    const all = loadLabResults();
    if (!all[index] || result.score > (all[index].score || 0)) {
      all[index] = {
        score: result.score,
        passed: result.passed,
        timestamp: new Date().toISOString(),
        summary: result.summary,
        criteriaResults: result.criteriaResults || [],
        skillPassportUpdate: result.skillPassportUpdate || null,
        unlock: result.unlock || null
      };
      localStorage.setItem(MASTERY_KEY + ".labResults", JSON.stringify(all));
    }
  }
  function saveLabAttempt(index, result) {
    const key = "tomcodex.adminLabAttempts.v1";
    const all = loadJson(key, {});
    const formats = [`admin-module-${index + 1}`, `admin-${index + 1}`];
    formats.forEach(moduleId => {
      const attempts = Array.isArray(all[moduleId]) ? all[moduleId] : [];
      const attempt = {
        attempt: attempts.length + 1,
        score: result.score,
        status: result.passed ? "Verified" : "Try Again",
        feedback: result.summary,
        createdAt: new Date().toISOString()
      };
      all[moduleId] = attempts.concat(attempt);
      all[`${moduleId}:summary`] = {
        bestScore: all[moduleId].reduce((best, item) => Math.max(best, Number(item.score) || 0), 0),
        status: result.passed ? "Verified" : "Try Again",
        attempts: all[moduleId].length,
        updatedAt: attempt.createdAt
      };
    });
    saveJson(key, all);
  }
  function saveModuleUnlock(index, result) {
    const key = "tomcodex.moduleUnlocks.v1";
    const all = loadJson(key, {});
    const formats = [`admin-module-${index + 1}`, `admin-${index + 1}`];
    let authUser = {};
    try {
      authUser = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1")) || JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1")) || {};
    } catch {}
    
    const isUnlocked = result.unlockDecision ? result.unlockDecision.eligibleToUnlock : (authUser.tier === "founder" && result.passed);

    formats.forEach(moduleId => {
      all[moduleId] = {
        labVerified: Boolean(result.passed),
        modulePracticeCompleted: Boolean(result.passed),
        skillPassportUpdated: Boolean(result.skillPassportUpdate),
        nextModuleUnlockCandidate: Boolean(result.passed),
        nextModuleAccess: isUnlocked ? "unlocked" : "upgrade_required",
        updatedAt: new Date().toISOString()
      };
    });
    saveJson(key, all);
  }

  function renderLabCriteriaForm(criteria) {
    const form = el("labCriteriaForm");
    if (!form || !criteria?.length) return;
    form.innerHTML = criteria.map((c, i) => `
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <label class="block text-xs font-bold text-slate-700 mb-2" for="labAnswer_${c.id}">
          <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-extrabold mr-2">${i + 1}</span>
          ${c.question}
        </label>
        <input
          id="labAnswer_${c.id}"
          data-lab-criterion="${c.id}"
          type="${c.type === 'number' ? 'number' : 'text'}"
          placeholder="${c.placeholder || 'Your answer...'}"
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
        />
      </div>
    `).join("");
  }

  async function runCheckMyWork() {
    const courseKey = COURSE_KEY_MAP[courseName] || "admin";
    const criteriaKey = `${courseKey}-${currentModule}`;

    // Gather answers from the form
    const answerInputs = document.querySelectorAll("[data-lab-criterion]");
    if (!answerInputs.length) {
      alert("Criteria questions not loaded yet. Please wait.");
      return;
    }
    const studentAnswers = {};
    let anyEmpty = false;
    answerInputs.forEach(input => {
      const val = input.value.trim();
      studentAnswers[input.dataset.labCriterion] = val;
      if (!val) anyEmpty = true;
    });
    if (anyEmpty) {
      alert("Please answer all questions before checking your work.");
      return;
    }

    const btn = el("checkMyWorkBtn");
    btn.disabled = true;
    btn.innerHTML = `<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Verifying with AI...`;

    let authUser = {};
    try {
      authUser = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1")) || JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1")) || {};
    } catch {}

    const module = modules[currentModule];
    const moduleId = `admin-${currentModule + 1}`;
    const labId = `admin-${currentModule + 1}-lab-1`;

    try {
      const res = await fetch("/api/academy/verify-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "verify-lab",
          userId: authUser.userId || authUser.id || "student-demo-001",
          tier: authUser.tier || "free",
          params: {
            moduleId,
            labId,
            studentAnswers
          }
        })
      });
      if (!res.ok) throw new Error("Verification failed");
      const payload = await res.json();
      const result = normalizeAiRunLabResult(payload);
      renderLabVerifyResult(result);
      saveLabResult(currentModule, result);
      saveLabAttempt(currentModule, result);
      saveModuleUnlock(currentModule, result);
      if (result.passed) {
        window.TomCodexLearning?.record("task", 20, `Passed ${recordLabel} lab check: ${module.title} (${result.score}%)`);
        // Update Skill Passport
        try {
          const passport = JSON.parse(localStorage.getItem("tomcodex.skillPassport.v1") || "{}");
          const skillId = result.skillPassportUpdate?.skillId || "salesforce-platform-foundations";
          const skillName = skillId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          passport[skillId] = {
            module: module.title,
            skill: skillName,
            status: "Verified",
            pocStage: "Foundation Started",
            score: result.bestScore,
            verifiedAt: result.passportSummary?.verifiedAt || new Date().toISOString(),
            moduleName: module.title,
            ...(result.skillPassportUpdate || {})
          };
          localStorage.setItem("tomcodex.skillPassport.v1", JSON.stringify(passport));
        } catch {}
      }
    } catch (err) {
      alert("Could not connect to the verifier. Please try again.");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Check My Work`;
    }
  }

  function normalizeAiRunLabResult(payload) {
    const data = payload?.data || {};
    const criteriaResults = (data.criteriaResults || []).map((item) => ({
      ...item,
      feedback: item.passed ? "Correct." : item.hint || "Review the lab instructions and try again."
    }));
    return {
      passed: Boolean(data.passed),
      score: Number(data.score) || 0,
      passedCount: criteriaResults.filter(r => r.passed).length,
      totalCount: criteriaResults.length,
      criteriaResults,
      summary: data.feedback || (data.passed ? "Lab verified." : "Review the hints and try again."),
      skillPassportUpdate: payload?.skillPassportUpdate || null,
      unlockDecision: payload?.unlockDecision || null,
      passportSummary: payload?.passportSummary || null,
      bestScore: payload?.passportSummary?.bestScore || Number(data.score) || 0
    };
  }

  function renderLabVerifyResult(result) {
    const box = el("labVerifyResult");
    if (!box) return;
    box.classList.remove("hidden");
    box.className = `mt-5 rounded-2xl border-2 p-5 ${ result.passed ? "border-emerald-300 bg-emerald-50" : "border-rose-200 bg-rose-50" }`;
    
    const badge = el("labScoreBadge");
    badge.textContent = `${result.score}%`;
    badge.style.background = result.passed ? "#10b981" : "#ef4444";
    
    el("labVerifySummary").textContent = result.passed ? "Status: Verified" : "Status: Try Again";
    
    let nextModuleText = "";
    if (result.unlockDecision) {
      if (result.unlockDecision.eligibleToUnlock) {
        nextModuleText = "Admin Module 2 unlocked";
      } else {
        if (result.unlockDecision.reason && result.unlockDecision.reason.includes("Founder")) {
          nextModuleText = "Locked - Founder Access required";
        } else {
          nextModuleText = `Locked - ${result.unlockDecision.reason}`;
        }
      }
    } else {
      nextModuleText = result.passed ? "Admin Module 2 unlocked" : "Locked";
    }

    const skillId = result.skillPassportUpdate?.skillId || "salesforce-platform-foundations";
    const skillName = skillId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const attemptsCount = result.passportSummary?.attemptsCount || 1;
    const bestScore = result.bestScore || result.score;

    el("labVerifySubtitle").innerHTML = `
      <div class="mt-2 space-y-1 text-xs text-slate-700">
        <div><strong>Skill:</strong> ${skillName}</div>
        <div><strong>Attempts:</strong> ${attemptsCount}</div>
        <div><strong>Best Score:</strong> ${bestScore}%</div>
        <div><strong>Next Module:</strong> <span class="${result.unlockDecision?.eligibleToUnlock ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}">${nextModuleText}</span></div>
      </div>
    `;

    el("labCriteriaResults").innerHTML = (result.criteriaResults || []).map(r => `
      <div class="flex items-start gap-3 rounded-lg p-3 ${ r.passed ? "bg-emerald-100" : "bg-rose-100" }">
        <span class="text-base shrink-0">${r.passed ? "✅" : "❌"}</span>
        <div class="flex-1">
          <p class="text-xs font-bold text-slate-700">${r.question}</p>
          <p class="text-xs text-slate-600 mt-0.5">${r.feedback}</p>
        </div>
      </div>
    `).join("");
    
    if (!result.passed) {
      el("retryCheckBtn").classList.remove("hidden");
    } else {
      el("retryCheckBtn").classList.add("hidden");
    }
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function render() {
    const moduleState = getModuleState(currentModule);
    if (moduleState.state === "paywall") {
      showPaywall(currentModule);
      renderNav();
      renderProgress();
      return;
    }
    if (moduleState.state === "gated") {
      el("moduleContent").innerHTML = `
        <div class="p-8 text-center bg-slate-100 rounded-2xl border border-slate-200 my-6">
          <h2 class="text-xl font-bold text-slate-700">This module is locked</h2>
          <p class="mt-2 text-slate-500 text-sm">${moduleState.label}</p>
          <button id="backToAvailableBtn" class="mt-4 rounded-lg bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700 transition">
            Go back
          </button>
        </div>
      `;
      document.getElementById("backToAvailableBtn").addEventListener("click", () => {
        currentModule = 0;
        render();
      });
      renderNav();
      renderProgress();
      return;
    }

    const module = modules[currentModule];
    const isPassed = passed(currentModule);
    el("moduleLabel").textContent = `Module ${currentModule + 1} of ${modules.length} · ${isAdmin ? "Admin access" : `About ${moduleHours} hours`}`;
    el("moduleTitle").textContent = module.title;
    el("moduleDescription").textContent = module.description;

    const hasRich = Boolean(module.richContent);
    const richPanel = el("richModuleContent");
    const defaultPanel = el("defaultModuleContent");

    if (richPanel && defaultPanel) {
      richPanel.classList.toggle("hidden", !hasRich);
      defaultPanel.classList.toggle("hidden", hasRich);
    }

    if (hasRich) {
      el("richGoal").textContent = module.richContent.moduleGoal;
      el("richOutcomes").innerHTML = module.richContent.learningOutcomes.map((out) => `<li>${out}</li>`).join("");
      el("richExplanation").innerHTML = module.richContent.simpleExplanation;
      el("richBusiness").innerHTML = module.richContent.realBusinessExample;
      el("richWhereUsed").innerHTML = module.richContent.whereUsed;
      el("richStepByStep").innerHTML = module.richContent.stepByStepImplementation.map((step) => `<li>${step}</li>`).join("");
      el("richBestPractices").innerHTML = module.richContent.bestPractices.map((bp) => `<li>${bp}</li>`).join("");
      el("richCommonMistakes").innerHTML = module.richContent.commonMistakes.map((cm) => `<li>${cm}</li>`).join("");
      el("richWhyMatters").innerHTML = module.richContent.whyMattersInJob;
      el("richInterview").innerHTML = module.richContent.interviewQuestions.map((q) => `<li>${q}</li>`).join("");
      el("richLabDescription").innerHTML = module.richContent.handsOnLab.instructions;

      // Render Check My Work criteria form
      const courseKey = COURSE_KEY_MAP[courseName] || "admin";
      const labCriteria = module.labCriteria || window.TomCodexLabCriteria?.[`${courseKey}-${currentModule}`]?.criteria || [];
      renderLabCriteriaForm(labCriteria);

      // Restore previous result if exists
      const labResults = loadLabResults();
      if (labResults[currentModule]) {
        renderLabVerifyResult(labResults[currentModule]);
      } else {
        const box = el("labVerifyResult");
        if (box) box.classList.add("hidden");
      }
    } else {
      el("lessonPoints").innerHTML = module.points.map((item) => `<div>${item}</div>`).join("");
      renderTopicCoverage(module);
      el("resourceList").innerHTML = module.resources.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}<span>\u2197</span></a>`).join("");
      el("practiceList").innerHTML = module.practice.map((item) => `<div>${item}</div>`).join("");
      el("questionList").innerHTML = module.questions.map((item) => `<div>${item}</div>`).join("");
    }

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
    renderFinalExamVisibility();
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
  el("startMasteryTestBtnRich")?.addEventListener("click", startTest);
  el("checkMyWorkBtn")?.addEventListener("click", runCheckMyWork);
  el("retryCheckBtn")?.addEventListener("click", () => {
    el("labVerifyResult")?.classList.add("hidden");
    el("retryCheckBtn").classList.add("hidden");
    document.querySelectorAll("[data-lab-criterion]").forEach(i => i.value = "");
    el("labCriteriaForm")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
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
