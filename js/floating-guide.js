(function () {
  if (document.getElementById("tcGlobalGuideButton")) return;

  const pageContexts = {
    "index.html": "TomCodex AI Academy programs and learning guidance",
    "access.html": "Password-free academy preview access",
    "dashboard.html": "Student dashboard and continuous Salesforce learning",
    "interview.html": "Salesforce AI Interviewer practice",
    "analytics.html": "Learning analytics, heatmap, records, and progress curves",
    "course-admin.html": "Salesforce Administrator learning program",
    "course-apex.html": "Apex Development learning program"
  };

  const currentFile = location.pathname.split("/").pop() || "index.html";
  const context = () => document.getElementById("moduleTitle")?.textContent || pageContexts[currentFile] || document.title;

  document.body.insertAdjacentHTML("beforeend", `
    <button id="tcGlobalGuideButton" class="tc-guide-button" type="button" aria-expanded="false" aria-controls="tcGlobalGuidePanel"><span><img src="assets/zentom-ai-logo.svg" alt=""></span><strong>Ask Zentom</strong><em><i></i>Live</em></button>
    <aside id="tcGlobalGuidePanel" class="tc-guide-panel" aria-label="Zentom AI guide" hidden>
      <div class="tc-guide-header"><div class="tc-guide-brand"><img src="assets/zentom-ai-logo.svg" alt="Zentom AI"><div><small id="tcGlobalGuideStatus"><i></i>Checking AI status</small><h2>Ask Zentom AI</h2></div></div><button id="tcGlobalGuideClose" class="tc-guide-close" type="button" aria-label="Close AI guide">&times;</button></div>
      <p id="tcGlobalGuideContext" class="tc-guide-context"></p>
      <label for="tcGlobalGuideInput">Your doubt</label><textarea id="tcGlobalGuideInput" placeholder="Ask anything about this page or Salesforce..."></textarea>
      <p class="tc-guide-auto-note">Zentom automatically chooses the most efficient answer depth.</p>
      <button id="tcGlobalGuideAsk" class="tc-guide-ask" type="button">Ask Zentom</button>
      <div id="tcGlobalGuideAnswer" class="tc-guide-answer" hidden aria-live="polite"></div>
    </aside>`);

  const button = document.getElementById("tcGlobalGuideButton");
  const panel = document.getElementById("tcGlobalGuidePanel");
  const contextBox = document.getElementById("tcGlobalGuideContext");
  const input = document.getElementById("tcGlobalGuideInput");
  const answer = document.getElementById("tcGlobalGuideAnswer");
  const ask = document.getElementById("tcGlobalGuideAsk");
  const status = document.getElementById("tcGlobalGuideStatus");

  window.TomCodexAI.getStatus().then((result) => {
    status.classList.toggle("offline", !result.connected);
    status.lastChild.textContent = result.connected ? " Zentom online" : " Zentom offline";
  });

  function toggle(open) {
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    if (open) {
      contextBox.textContent = `Guiding you on: ${context()}`;
      input.focus();
    }
  }

  button.addEventListener("click", () => toggle(panel.hidden));
  document.getElementById("tcGlobalGuideClose").addEventListener("click", () => toggle(false));
  ask.addEventListener("click", async () => {
    const doubt = input.value.trim();
    answer.hidden = false;
    if (!doubt) {
      answer.className = "tc-guide-answer error";
      answer.textContent = "Type your doubt first.";
      return;
    }
    ask.disabled = true;
    ask.textContent = "Zentom is thinking...";
    answer.className = "tc-guide-answer";
    answer.textContent = "Preparing your guided answer...";
    const result = await window.TomCodexAI.askTrainer({ topic: context(), answerMode: "Global Academy Guide", speedMode: "auto", doubt });
    if (!result.connected) {
      answer.className = "tc-guide-answer error";
      answer.textContent = `${result.error}\n\nZentom AI is temporarily unavailable. Please try again after the service is connected.`;
      ask.disabled = false;
      ask.textContent = "Ask Zentom";
      return;
    }
    const selectedMode = { flash: "Quick answer", normal: "Guided answer", deep: "Deep guidance" }[result.speedMode] || "Zentom answer";
    answer.replaceChildren(Object.assign(document.createElement("strong"), { textContent: selectedMode }), Object.assign(document.createElement("p"), { textContent: result.answer }));
    ask.disabled = false;
    ask.textContent = "Ask Zentom";
    window.TomCodexLearning?.record("tutor", 2, `${context()}: ${doubt}`);
  });
})();
