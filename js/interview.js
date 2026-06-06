const INTERVIEW_HISTORY_KEY = "tomcodex.interviewHistory.v1";
const questionBank = {
  "Salesforce Administrator": [
    ["Explain the difference between a Profile and a Permission Set.", ["profile", "permission set", "access", "user"], "Start with base access versus additional access, explain assignment flexibility, and finish with a real security example."],
    ["How would you design record access for a private sales organization?", ["owd", "role", "sharing", "private"], "Explain OWD as the baseline, then roles, sharing rules, teams, and manual sharing based on business needs."],
    ["When would you use Flow instead of a validation rule?", ["flow", "validation", "automation", "record"], "Compare preventing invalid data with automating actions, then provide one example for each."],
    ["How do you safely import and clean Salesforce data?", ["import", "duplicate", "validation", "backup"], "Describe preparation, backups, unique identifiers, validation, duplicate management, testing, and verification."],
    ["What steps do you take before changing a page layout in production?", ["requirement", "sandbox", "test", "deploy"], "Mention requirements, user impact, sandbox testing, permissions, deployment, and post-release validation."]
  ],
  "Salesforce Developer": [
    ["What does bulkification mean in Apex, and why is it important?", ["bulk", "governor", "collection", "query"], "Define bulk processing, explain governor limits, and mention collections plus avoiding SOQL and DML inside loops."],
    ["Explain the difference between before and after triggers.", ["before", "after", "trigger", "record"], "Compare changing the same record before save with using saved IDs and related records after save."],
    ["How would you test an Apex service class?", ["test", "assert", "data", "starttest"], "Cover isolated test data, positive and negative cases, startTest/stopTest, assertions, and bulk scenarios."],
    ["When would you use an imperative Apex call instead of @wire in LWC?", ["imperative", "wire", "control", "mutation"], "Explain reactive read operations versus controlled execution and data-changing actions."],
    ["How do Named Credentials improve callout security?", ["credential", "authentication", "endpoint", "secret"], "Explain centralized endpoints and authentication, secret protection, and simpler maintainable callout code."]
  ],
  "Salesforce Consultant": [
    ["How do you turn a vague stakeholder request into a Salesforce solution?", ["question", "requirement", "process", "validate"], "Discuss discovery, current process, measurable outcomes, constraints, options, prototype, and validation."],
    ["How would you handle conflicting requirements from two departments?", ["stakeholder", "priority", "impact", "decision"], "Explain alignment on outcomes, impact analysis, facilitated decisions, documentation, and phased delivery."],
    ["What makes a Salesforce implementation successful after go-live?", ["adoption", "training", "support", "measure"], "Cover adoption, enablement, governance, support, metrics, feedback, and continuous improvement."],
    ["How do you decide between configuration and custom development?", ["configuration", "custom", "maintain", "requirement"], "Compare fit, complexity, maintenance, scalability, user experience, and total cost."],
    ["Describe how you would plan a Salesforce rollout.", ["phase", "risk", "test", "adoption"], "Explain scope, phases, data, testing, change management, training, deployment, and hypercare."]
  ],
  "Salesforce Architect": [
    ["How would you design Salesforce for high data volume?", ["volume", "selective", "index", "archive"], "Discuss data model, selective queries, indexing, sharing, async processing, archival, and monitoring."],
    ["How do you evaluate an integration architecture?", ["integration", "latency", "volume", "failure"], "Cover business needs, direction, latency, volume, security, reliability, retries, monitoring, and ownership."],
    ["How would you design a scalable Salesforce security model?", ["owd", "role", "sharing", "scale"], "Start with least privilege and OWD, then evaluate hierarchy, sharing mechanisms, performance, and governance."],
    ["When should a solution use asynchronous Apex?", ["async", "queueable", "batch", "limit"], "Compare transaction needs, limits, volume, chaining, scheduling, monitoring, and failure handling."],
    ["How do you document and defend an architecture decision?", ["option", "tradeoff", "risk", "decision"], "State context and constraints, compare options, document tradeoffs and risks, then define the decision and review plan."]
  ]
};

let session = null;
let timerInterval = null;
let speechRecognition = null;
let speechIsListening = false;
let speechFinalTranscript = "";
const el = (id) => document.getElementById(id);

function showState(id) {
  stopVoiceInput();
  ["welcomeState", "questionState", "feedbackState", "resultState"].forEach((stateId) => el(stateId).classList.toggle("hidden", stateId !== id));
}

function updateWordCount() {
  const words = el("answerInput").value.trim() ? el("answerInput").value.trim().split(/\s+/).length : 0;
  el("wordCount").textContent = `${words} words`;
}

function setVoiceStatus(message, type = "") {
  el("voiceStatus").className = `voice-status ${type}`.trim();
  el("voiceStatus").textContent = message;
}

function stopVoiceInput() {
  if (speechRecognition && speechIsListening) speechRecognition.stop();
}

function setupVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    el("voiceInputBtn").disabled = true;
    setVoiceStatus("Voice-to-text is not supported in this browser. Use Chrome or Edge, or type your answer.", "error");
    return;
  }

  speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;

  speechRecognition.onstart = () => {
    speechIsListening = true;
    speechFinalTranscript = el("answerInput").value.trim();
    el("voiceInputBtn").classList.add("listening");
    el("voiceInputBtn").setAttribute("aria-pressed", "true");
    el("voiceButtonText").textContent = "Stop listening";
    setVoiceStatus("Listening now. Speak your interview answer clearly.", "listening");
  };

  speechRecognition.onresult = (event) => {
    let interim = "";
    let final = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      if (event.results[index].isFinal) final += event.results[index][0].transcript;
      else interim += event.results[index][0].transcript;
    }
    if (final) speechFinalTranscript = `${speechFinalTranscript} ${final}`.trim();
    el("answerInput").value = `${speechFinalTranscript}${interim ? ` ${interim}` : ""}`.trim();
    updateWordCount();
  };

  speechRecognition.onerror = (event) => {
    const messages = { "not-allowed": "Microphone permission was denied. Allow microphone access to use voice-to-text.", "no-speech": "No speech was detected. Try again and speak clearly.", "audio-capture": "No microphone was found on this device." };
    setVoiceStatus(messages[event.error] || "Voice recognition stopped because of a browser error.", "error");
  };

  speechRecognition.onend = () => {
    speechIsListening = false;
    el("voiceInputBtn").classList.remove("listening");
    el("voiceInputBtn").setAttribute("aria-pressed", "false");
    el("voiceButtonText").textContent = "Start voice answer";
    if (!el("voiceStatus").classList.contains("error")) setVoiceStatus("Voice-to-text stopped. You can edit the transcript or submit your answer.");
  };

  el("voiceInputBtn").addEventListener("click", () => {
    if (speechIsListening) {
      stopVoiceInput();
      return;
    }
    speechRecognition.lang = el("speechLanguage").value;
    try { speechRecognition.start(); } catch { setVoiceStatus("Voice recognition is already starting. Please wait a moment.", "error"); }
  });
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(INTERVIEW_HISTORY_KEY)) || []; } catch { return []; }
}

function saveHistory(item) {
  const history = [item, ...loadHistory()].slice(0, 8);
  localStorage.setItem(INTERVIEW_HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = loadHistory();
  el("heroSessionCount").textContent = history.length;
  el("heroBestScore").textContent = `${history.reduce((best, item) => Math.max(best, item.score), 0)}%`;
  el("historyList").innerHTML = history.length ? history.map((item) => `<div class="history-item"><div><strong>${item.role}</strong><span>${item.score}%</span></div><p>${item.difficulty} · ${item.questions} questions · ${item.date}</p></div>`).join("") : '<p class="empty-state">Complete an interview to see your history.</p>';
}

function startInterview() {
  const role = el("roleSelect").value;
  const count = Number(el("questionCountSelect").value);
  const source = questionBank[role];
  const questions = Array.from({ length: count }, (_, index) => source[index % source.length]);
  session = { role, difficulty: el("difficultySelect").value, questions, index: 0, scores: [] };
  renderQuestion();
}

function renderQuestion() {
  clearInterval(timerInterval);
  showState("questionState");
  const question = session.questions[session.index];
  el("questionProgress").textContent = `Question ${session.index + 1} of ${session.questions.length}`;
  el("questionMeta").textContent = `${session.role} · ${session.difficulty}`;
  el("questionText").textContent = question[0];
  el("answerInput").value = "";
  el("wordCount").textContent = "0 words";
  let seconds = session.difficulty === "Advanced" ? 90 : session.difficulty === "Beginner" ? 150 : 120;
  updateTimer(seconds);
  timerInterval = setInterval(() => { seconds -= 1; updateTimer(seconds); if (seconds <= 0) { clearInterval(timerInterval); evaluateAnswer(); } }, 1000);
}

function updateTimer(seconds) {
  el("timer").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  el("timer").classList.toggle("warning", seconds <= 30);
}

function evaluateAnswer() {
  clearInterval(timerInterval);
  const answer = el("answerInput").value.trim();
  const [, keywords, model] = session.questions[session.index];
  const normalized = answer.toLowerCase();
  const matched = keywords.filter((keyword) => normalized.includes(keyword)).length;
  const words = answer ? answer.split(/\s+/).length : 0;
  const technical = Math.min(100, 30 + matched * 17);
  const clarity = Math.min(100, words >= 45 ? 90 : words >= 25 ? 75 : words >= 12 ? 55 : 30);
  const example = /example|project|scenario|when|such as/i.test(answer) ? 90 : 45;
  const confidence = Math.min(100, Math.round((clarity + technical) / 2));
  const score = Math.round((technical + clarity + example + confidence) / 4);
  session.scores.push({ score, technical, clarity, example, confidence });
  renderFeedback({ score, technical, clarity, example, confidence, matched, words, model });
}

function renderFeedback(result) {
  showState("feedbackState");
  el("scoreRing").textContent = `${result.score}%`;
  el("feedbackTitle").textContent = result.score >= 80 ? "Strong interview answer" : result.score >= 60 ? "Good foundation, improve the detail" : "Needs more interview practice";
  el("feedbackSummary").textContent = `Your answer used ${result.words} words and covered ${result.matched} of the core technical ideas expected by this interviewer.`;
  el("scoreGrid").innerHTML = [["Technical", result.technical], ["Clarity", result.clarity], ["Example", result.example], ["Confidence", result.confidence]].map(([label, score]) => `<div><strong>${score}%</strong><span>${label}</span></div>`).join("");
  const strengths = [result.technical >= 70 ? "Covered important technical concepts." : "Attempted the core concept.", result.clarity >= 70 ? "Answer had useful detail and structure." : "Kept the answer focused.", result.example >= 70 ? "Included a practical scenario or example." : "Stayed relevant to the question."];
  const improvements = [result.technical < 80 ? "Add more Salesforce-specific terminology and reasoning." : "Explain the tradeoffs behind your technical choice.", result.clarity < 80 ? "Use a clear structure: meaning, reason, example, result." : "Make the opening sentence more direct.", result.example < 80 ? "Include one real project or workplace example." : "Quantify the result or business impact."];
  el("strengthList").innerHTML = strengths.map((item) => `<li>${item}</li>`).join("");
  el("improvementList").innerHTML = improvements.map((item) => `<li>${item}</li>`).join("");
  el("modelAnswer").textContent = result.model;
  el("nextQuestionBtn").textContent = session.index === session.questions.length - 1 ? "Complete interview" : "Next question";
}

function nextQuestion() {
  session.index += 1;
  if (session.index < session.questions.length) renderQuestion(); else completeInterview();
}

function completeInterview() {
  const average = Math.round(session.scores.reduce((sum, item) => sum + item.score, 0) / session.scores.length);
  const dimensions = ["technical", "clarity", "example", "confidence"].map((key) => [key, Math.round(session.scores.reduce((sum, item) => sum + item[key], 0) / session.scores.length)]);
  showState("resultState");
  el("finalScoreRing").textContent = `${average}%`;
  el("resultTitle").textContent = average >= 80 ? "Interview-ready performance" : average >= 60 ? "Good progress, keep practicing" : "Build confidence with another session";
  el("resultSummary").textContent = `You completed a ${session.difficulty.toLowerCase()} ${session.role} interview with ${session.questions.length} questions.`;
  el("resultBreakdown").innerHTML = dimensions.map(([key, score]) => `<span>${key}: ${score}%</span>`).join("");
  saveHistory({ role: session.role, difficulty: session.difficulty, questions: session.questions.length, score: average, date: new Date().toLocaleDateString() });
  window.TomCodexLearning?.record("interview", Math.max(3, Math.round(average / 10)), `${session.role} interview: ${average}%`);
}

el("startInterviewBtn").addEventListener("click", startInterview);
el("submitAnswerBtn").addEventListener("click", evaluateAnswer);
el("nextQuestionBtn").addEventListener("click", nextQuestion);
el("practiceAgainBtn").addEventListener("click", startInterview);
el("answerInput").addEventListener("input", updateWordCount);
setupVoiceInput();
renderHistory();
