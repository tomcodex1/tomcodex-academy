/**
 * Salesforce Administrator Certification MCQ Simulator Engine
 */
(function () {
  // Elements
  const el = (id) => document.getElementById(id);

  // Constants
  const HISTORY_KEY = "tomcodex.adminPrepHistory.v1";
  const PASS_SCORE = 65; // Official passing score is 65%

  const CERT_DETAILS = {
    admin: {
      badge: "Salesforce Certified Administrator (SU26)",
      title: "Certification Exam Practice Simulator",
      desc: "Prepare for the official Salesforce Admin Exam with our premium 60-question multiple choice simulator. Track your accuracy by exam domains, analyze explanations, and build real test consistency."
    },
    pdi: {
      badge: "Salesforce Platform Developer I",
      title: "Platform Developer I Practice Simulator",
      desc: "Prepare for the official Salesforce Platform Developer I (PDI) certification. Practice programmatic development, Apex coding, Lightning Web Components, and integration concepts."
    },
    ai: {
      badge: "Salesforce AI Associate",
      title: "Salesforce AI Associate Practice Simulator",
      desc: "Prepare for the official Salesforce AI Associate certification. Practice core artificial intelligence concepts, ethical AI usage, CRM data requirements, and generative AI features."
    },
    agentforce: {
      badge: "Salesforce Agentforce Specialist",
      title: "Agentforce Specialist Practice Simulator",
      desc: "Prepare for the official Salesforce Agentforce Specialist certification. Practice configuring topics, actions, prompts, and autonomous agent systems within the Salesforce platform."
    }
  };

  // State Variables
  let sessionQuestions = [];
  let userAnswers = []; // holds selected option indices (-1 for unanswered)
  let checkedQuestions = []; // in instant mode, keeps track of which questions have had their answers checked
  let flaggedQuestions = new Set();
  let currentIndex = 0;
  let timeLeft = 0;
  let timerInterval = null;
  let examMode = "standard"; // 'standard' or 'quick'
  let feedbackStyle = "exam"; // 'exam' or 'instant'
  let attemptsHistory = [];
  let currentCertName = "Salesforce Certified Administrator";

  // Update Setup Banner based on selected certification
  function updateSetupBanner() {
    const certSelect = el("certSelect");
    if (!certSelect) return;
    const certValue = certSelect.value;
    const details = CERT_DETAILS[certValue] || CERT_DETAILS.admin;

    if (el("setupCertBadge")) el("setupCertBadge").textContent = details.badge;
    if (el("setupCertTitle")) el("setupCertTitle").textContent = details.title;
    if (el("setupCertDesc")) el("setupCertDesc").textContent = details.desc;
  }

  // Initialize
  function init() {
    loadHistory();
    renderSetupStats();
    updateSetupBanner();

    // Event Listeners
    if (el("certSelect")) el("certSelect").addEventListener("change", updateSetupBanner);
    if (el("startExamBtn")) el("startExamBtn").addEventListener("click", startExam);
    if (el("prevBtn")) el("prevBtn").addEventListener("click", goPrev);
    if (el("nextBtn")) el("nextBtn").addEventListener("click", goNext);
    if (el("checkAnswerBtn")) el("checkAnswerBtn").addEventListener("click", checkInstantAnswer);
    if (el("flagToggle")) el("flagToggle").addEventListener("change", toggleFlag);
    if (el("submitExamBtn")) el("submitExamBtn").addEventListener("click", () => submitExam(false));
    if (el("reviewExamBtn")) el("reviewExamBtn").addEventListener("click", showDetailedReview);
    if (el("exitExamBtn")) el("exitExamBtn").addEventListener("click", exitToSetup);
    if (el("clearHistoryBtn")) el("clearHistoryBtn").addEventListener("click", clearHistory);
  }

  // Load Attempt History from LocalStorage
  function loadHistory() {
    try {
      attemptsHistory = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) {
      attemptsHistory = [];
    }
  }

  // Save Attempt History to LocalStorage
  function saveHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(attemptsHistory));
    } catch (e) {}
  }

  // Render Stats on Setup Screen
  function renderSetupStats() {
    if (!attemptsHistory.length) {
      if (el("bestScoreText")) el("bestScoreText").textContent = "—";
      if (el("avgScoreText")) el("avgScoreText").textContent = "—";
      if (el("historyList")) el("historyList").innerHTML = `<p class="text-xs text-slate-400 text-center py-6">No previous attempts. Start an exam to record your history.</p>`;
      if (el("clearHistoryBtn")) el("clearHistoryBtn").classList.add("hidden");
      return;
    }

    const scores = attemptsHistory.map((h) => h.score);
    const bestScore = Math.max(...scores);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    if (el("bestScoreText")) el("bestScoreText").textContent = `${bestScore}%`;
    if (el("avgScoreText")) el("avgScoreText").textContent = `${avgScore}%`;
    if (el("clearHistoryBtn")) el("clearHistoryBtn").classList.remove("hidden");

    if (el("historyList")) {
      el("historyList").innerHTML = attemptsHistory
        .map(
          (attempt, idx) => {
            const certLabel = attempt.certName || "Salesforce Certified Administrator";
            const modeLabel = attempt.mode === "standard" ? "Standard Exam" : "Quick Practice";
            return `
              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <strong class="text-slate-800 block">${certLabel}</strong>
                  <span class="block text-[10px] text-slate-400 mt-0.5">${attempt.date} · ${modeLabel}</span>
                </div>
                <div class="text-right shrink-0">
                  <span class="font-black ${attempt.score >= PASS_SCORE ? "text-emerald-600" : "text-rose-600"}">${attempt.score}%</span>
                  <span class="block text-[9px] text-slate-400">${attempt.score >= PASS_SCORE ? "PASSED" : "FAILED"}</span>
                </div>
              </div>
            `;
          }
        )
        .join("");
    }
  }

  // Clear Attempt History
  function clearHistory() {
    if (confirm("Are you sure you want to clear all practice history?")) {
      attemptsHistory = [];
      saveHistory();
      renderSetupStats();
    }
  }

  // Shuffle Helper (Fisher-Yates)
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Start Exam
  function startExam() {
    const modeRadios = document.getElementsByName("examMode");
    for (const r of modeRadios) {
      if (r.checked) examMode = r.value;
    }

    const styleRadios = document.getElementsByName("feedbackStyle");
    for (const r of styleRadios) {
      if (r.checked) feedbackStyle = r.value;
    }

    // Determine target certification bank & label
    const certSelect = el("certSelect");
    const certValue = certSelect ? certSelect.value : "admin";
    const certText = certSelect ? certSelect.options[certSelect.selectedIndex].text.split(" (")[0] : "Salesforce Certified Administrator";
    currentCertName = certText;

    // Set label in test view
    if (el("activeExamLabel")) el("activeExamLabel").textContent = certText;

    let bank = [];
    if (certValue === "admin") {
      bank = window.ADMIN_PREP_QUESTIONS || [];
    } else if (certValue === "pdi") {
      bank = window.PDI_PREP_QUESTIONS || [];
    } else if (certValue === "ai") {
      bank = window.AI_PREP_QUESTIONS || [];
    } else if (certValue === "agentforce") {
      bank = window.AGENTFORCE_PREP_QUESTIONS || [];
    }

    // Prepare questions
    const shuffledBank = shuffle(bank);
    const questionLimit = examMode === "standard" ? 60 : 15;
    
    if (shuffledBank.length === 0) {
      alert("Error: Question bank is empty.");
      return;
    }

    sessionQuestions = shuffledBank.slice(0, Math.min(questionLimit, shuffledBank.length));
    userAnswers = new Array(sessionQuestions.length).fill(-1);
    checkedQuestions = [];
    flaggedQuestions.clear();
    currentIndex = 0;

    // Timer setup (Standard: 105 mins, Quick: 20 mins)
    timeLeft = examMode === "standard" ? 105 * 60 : 20 * 60;
    updateTimerDisplay();

    // Start timer interval
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        submitExam(true);
      }
    }, 1000);

    // Render Grid
    renderQuestionGrid();

    // View toggling
    el("setupState").classList.add("hidden");
    el("resultState").classList.add("hidden");
    el("testState").classList.remove("hidden");

    // Load first question
    loadQuestion(0);
    updateProgressCounter();
  }

  // Render question buttons in sidebar
  function renderQuestionGrid() {
    const grid = el("qGrid");
    grid.innerHTML = "";
    sessionQuestions.forEach((_, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "q-btn";
      btn.textContent = idx + 1;
      btn.id = `qbtn-${idx}`;
      btn.addEventListener("click", () => loadQuestion(idx));
      grid.appendChild(btn);
    });
  }

  // Load specific question
  function loadQuestion(idx) {
    // Save old state classes
    if (currentIndex >= 0 && currentIndex < sessionQuestions.length) {
      updateGridButtonClass(currentIndex);
    }

    currentIndex = idx;
    const q = sessionQuestions[idx];

    // Category & progress info
    if (el("questionCategory")) el("questionCategory").textContent = q.category;
    if (el("activeQuestionNum")) el("activeQuestionNum").textContent = `Question ${idx + 1} of ${sessionQuestions.length}`;
    if (el("questionText")) el("questionText").textContent = q.question;

    // Flag checkbox status
    const isFlagged = flaggedQuestions.has(idx);
    el("flagToggle").checked = isFlagged;
    el("flagContainer").classList.toggle("is-flagged", isFlagged);

    // Options mapping
    const container = el("optionsContainer");
    container.innerHTML = "";
    const isChecked = checkedQuestions.includes(idx);

    q.options.forEach((opt, optIdx) => {
      const optItem = document.createElement("div");
      optItem.className = "option-item";
      optItem.id = `opt-${optIdx}`;

      const isSelected = userAnswers[idx] === optIdx;
      if (isSelected) optItem.classList.add("selected");

      // Review feedback color overrides (Instant mode when checked)
      if (feedbackStyle === "instant" && isChecked) {
        if (optIdx === q.correctIndex) {
          optItem.classList.add("correct-answer");
        } else if (isSelected) {
          optItem.classList.add("wrong-answer");
        }
      }

      optItem.innerHTML = `
        <span class="option-letter">${String.fromCharCode(65 + optIdx)}</span>
        <span class="text-sm font-medium text-slate-700">${opt}</span>
      `;

      // Click listener (disable if already checked in instant feedback mode)
      if (feedbackStyle === "instant" && isChecked) {
        optItem.style.cursor = "default";
      } else {
        optItem.addEventListener("click", () => selectOption(optIdx));
      }

      container.appendChild(optItem);
    });

    // Check Answer button (for Instant Feedback)
    const checkBtn = el("checkAnswerBtn");
    const expBox = el("instantExplanation");

    if (feedbackStyle === "instant") {
      checkBtn.classList.remove("hidden");
      // Disable check button if not answered, or already checked
      const hasAnswered = userAnswers[idx] !== -1;
      checkBtn.disabled = !hasAnswered || isChecked;
      checkBtn.classList.toggle("opacity-50", !hasAnswered || isChecked);

      if (isChecked) {
        const isCorrect = userAnswers[idx] === q.correctIndex;
        expBox.classList.remove("hidden");
        expBox.className = `explanation-box ${isCorrect ? "correct" : "incorrect"}`;
        el("instantResultLabel").textContent = isCorrect ? "✓ Correct" : "✗ Incorrect";
        el("instantExplanationText").textContent = q.explanation;
      } else {
        expBox.classList.add("hidden");
      }
    } else {
      checkBtn.classList.add("hidden");
      expBox.classList.add("hidden");
    }

    // Set grid button to active class
    updateGridButtonClass(idx);
    el(`qbtn-${idx}`).classList.add("active");

    // Prev/Next buttons visibility
    el("prevBtn").disabled = idx === 0;
    el("prevBtn").classList.toggle("opacity-50", idx === 0);
    el("nextBtn").textContent = idx === sessionQuestions.length - 1 ? "Review & Finish" : "Next";
  }

  // Update specific grid button styling
  function updateGridButtonClass(idx) {
    const btn = el(`qbtn-${idx}`);
    if (!btn) return;
    btn.className = "q-btn"; // reset classes
    if (userAnswers[idx] !== -1) btn.classList.add("answered");
    if (flaggedQuestions.has(idx)) btn.classList.add("flagged");
  }

  // Select Option
  function selectOption(optIdx) {
    userAnswers[currentIndex] = optIdx;
    
    // Select styling update
    const options = el("optionsContainer").children;
    for (let i = 0; i < options.length; i++) {
      options[i].classList.toggle("selected", i === optIdx);
    }

    // Enable check answer button in instant mode
    if (feedbackStyle === "instant") {
      el("checkAnswerBtn").disabled = false;
      el("checkAnswerBtn").classList.remove("opacity-50");
    }

    updateProgressCounter();
    updateGridButtonClass(currentIndex);
    el(`qbtn-${currentIndex}`).classList.add("active"); // keep active highlight
  }

  // Flag Question Toggle
  function toggleFlag() {
    const isChecked = el("flagToggle").checked;
    if (isChecked) {
      flaggedQuestions.add(currentIndex);
    } else {
      flaggedQuestions.delete(currentIndex);
    }
    el("flagContainer").classList.toggle("is-flagged", isChecked);
    updateGridButtonClass(currentIndex);
    el(`qbtn-${currentIndex}`).classList.add("active");
  }

  // Check Answer instantly
  function checkInstantAnswer() {
    if (checkedQuestions.includes(currentIndex)) return;
    checkedQuestions.push(currentIndex);
    loadQuestion(currentIndex); // re-renders options with explanation box and coloring
  }

  // Go to previous question
  function goPrev() {
    if (currentIndex > 0) {
      loadQuestion(currentIndex - 1);
    }
  }

  // Go to next question (or submit)
  function goNext() {
    if (currentIndex < sessionQuestions.length - 1) {
      loadQuestion(currentIndex + 1);
    } else {
      submitExam(false);
    }
  }

  // Update timer display
  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    if (el("examTimer")) {
      el("examTimer").textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }

  // Update progress counter
  function updateProgressCounter() {
    const answered = userAnswers.filter((a) => a !== -1).length;
    if (el("answeredCount")) {
      el("answeredCount").textContent = `${answered} / ${sessionQuestions.length} Answered`;
    }
  }

  // Submit Exam
  function submitExam(autoSubmit = false) {
    if (!autoSubmit) {
      const unanswered = userAnswers.filter((a) => a === -1).length;
      let confirmMsg = "Are you sure you want to submit the exam?";
      if (unanswered > 0) {
        confirmMsg = `You have ${unanswered} unanswered questions remaining. Are you sure you want to submit the exam?`;
      }
      if (!confirm(confirmMsg)) return;
    }

    clearInterval(timerInterval);

    // Calculate score
    let correctCount = 0;
    const categoryTotals = {};
    const categoryCorrect = {};

    sessionQuestions.forEach((q, idx) => {
      const isCorrect = userAnswers[idx] === q.correctIndex;
      if (isCorrect) correctCount++;

      // Category tracking
      categoryTotals[q.category] = (categoryTotals[q.category] || 0) + 1;
      if (isCorrect) {
        categoryCorrect[q.category] = (categoryCorrect[q.category] || 0) + 1;
      }
    });

    const finalScore = Math.round((correctCount / sessionQuestions.length) * 100);

    // Save to history list
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    const attempt = {
      date: new Date().toLocaleDateString("en-US", options),
      score: finalScore,
      correctAnswers: correctCount,
      totalQuestions: sessionQuestions.length,
      mode: examMode,
      passed: finalScore >= PASS_SCORE,
      certName: currentCertName
    };
    
    attemptsHistory.unshift(attempt);
    saveHistory();

    // Render results
    renderResults(attempt, categoryTotals, categoryCorrect);

    // Switch view
    el("testState").classList.add("hidden");
    el("resultState").classList.remove("hidden");
  }

  // Render final results view
  function renderResults(attempt, categoryTotals, categoryCorrect) {
    const ring = el("resultScoreRing");
    ring.textContent = `${attempt.score}%`;
    ring.className = `flex h-28 w-28 items-center justify-center rounded-full text-3xl font-black text-white shadow-lg ${
      attempt.passed ? "bg-emerald-500" : "bg-rose-500"
    }`;

    el("resultTitle").textContent = attempt.passed ? "Practice Exam Passed!" : "Practice Exam Failed";
    el("resultSummary").textContent = `You scored ${attempt.score}% by answering ${attempt.correctAnswers} out of ${attempt.totalQuestions} questions correctly. (Passing score is ${PASS_SCORE}%)`;

    // Render categories progress
    const container = el("domainProgressContainer");
    container.innerHTML = "";
    
    const allCategories = [
      "Configuration and Setup",
      "Object Manager and Lightning App Builder",
      "Sales and Marketing Applications",
      "Service and Support Applications",
      "Data and Analytics Management",
      "Workflow/Process Automation"
    ];

    allCategories.forEach((cat) => {
      const total = categoryTotals[cat] || 0;
      if (total === 0) return; // skip if category had no questions in this session
      const correct = categoryCorrect[cat] || 0;
      const pct = Math.round((correct / total) * 100);

      const item = document.createElement("div");
      item.innerHTML = `
        <div class="flex justify-between text-xs font-bold">
          <span class="text-slate-700">${cat}</span>
          <span class="${pct >= PASS_SCORE ? "text-emerald-600" : "text-rose-600"}">${pct}% (${correct}/${total})</span>
        </div>
        <div class="category-bar-container">
          <div class="category-bar-fill ${pct >= PASS_SCORE ? "bg-emerald-500" : "bg-rose-500"}" style="width: ${pct}%"></div>
        </div>
      `;
      container.appendChild(item);
    });

    // Reset review list container
    el("reviewContainer").classList.add("hidden");
    el("reviewList").innerHTML = "";
  }

  // Show detailed question review at the end
  function showDetailedReview() {
    el("reviewContainer").classList.remove("hidden");
    const list = el("reviewList");
    list.innerHTML = "";

    sessionQuestions.forEach((q, idx) => {
      const selectedIdx = userAnswers[idx];
      const correctIdx = q.correctIndex;
      const isCorrect = selectedIdx === correctIdx;

      const div = document.createElement("div");
      div.className = "py-5 first:pt-0";
      
      let optionsHtml = q.options
        .map((opt, optIdx) => {
          let classes = "flex items-center gap-3 p-3 rounded-lg border text-sm ";
          if (optIdx === correctIdx) {
            classes += "border-emerald-500 bg-emerald-50/30 text-emerald-800 font-bold";
          } else if (optIdx === selectedIdx) {
            classes += "border-rose-500 bg-rose-50/30 text-rose-800 font-bold";
          } else {
            classes += "border-slate-200 bg-slate-50 text-slate-700";
          }

          const mark = optIdx === correctIdx ? "✓" : optIdx === selectedIdx ? "✗" : "";
          return `
            <div class="${classes}">
              <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                optIdx === correctIdx ? "bg-emerald-500 text-white" : optIdx === selectedIdx ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-600"
              } font-bold">${String.fromCharCode(65 + optIdx)}</span>
              <span class="flex-1">${opt}</span>
              <span class="text-xs font-black">${mark}</span>
            </div>
          `;
        })
        .join("");

      div.innerHTML = `
        <div class="flex items-start justify-between gap-4 mb-2">
          <div>
            <span class="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">${q.category}</span>
            <h3 class="text-sm font-bold text-slate-800 mt-1">Question ${idx + 1}: ${q.question}</h3>
          </div>
          <span class="text-xs font-bold ${isCorrect ? "text-emerald-600" : "text-rose-600"} shrink-0">
            ${isCorrect ? "Correct" : selectedIdx === -1 ? "Skipped" : "Incorrect"}
          </span>
        </div>
        <div class="space-y-2 mt-3">${optionsHtml}</div>
        <div class="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <strong class="text-slate-800 font-bold block mb-1">Explanation:</strong>
          <p class="text-slate-600 leading-relaxed">${q.explanation}</p>
        </div>
      `;
      list.appendChild(div);
    });

    el("reviewContainer").scrollIntoView({ behavior: "smooth" });
  }

  // Return to Setup Screen
  function exitToSetup() {
    clearInterval(timerInterval);
    loadHistory();
    renderSetupStats();
    el("resultState").classList.add("hidden");
    el("testState").classList.add("hidden");
    el("setupState").classList.remove("hidden");
  }

  // On DOM Load
  document.addEventListener("DOMContentLoaded", init);
})();
