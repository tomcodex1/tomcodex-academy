(function () {
  if (document.getElementById("tcGlobalGuideButton")) return;

  const pageContexts = {
    "index.html": "TomCodex AI Academy programs and learning guidance",
    "access.html": "Password-free academy preview access",
    "dashboard.html": "Student dashboard and continuous Salesforce learning",
    "interview.html": "Salesforce AI Interviewer practice",
    "analytics.html": "Learning analytics, records, and progress curves",
    "course-admin.html": "Salesforce Administrator learning program",
    "course-apex.html": "Apex Development learning program",
    "course-flow.html": "Salesforce Flow automation learning program",
    "course-lwc.html": "Lightning Web Components frontend learning program",
    "course-integration.html": "Salesforce Integration learning program",
    "course-agentforce.html": "Salesforce Agentforce learning program",
    "course-poc.html": "Final Capstone POC Project learning program"
  };

  const currentFile = location.pathname.split("/").pop() || "index.html";
  const context = () => document.getElementById("moduleTitle")?.textContent || pageContexts[currentFile] || document.title;

  document.body.insertAdjacentHTML("beforeend", `
    <button id="tcGlobalGuideButton" class="tc-guide-button" type="button" aria-expanded="false" aria-controls="tcGlobalGuidePanel" title="Ask Zentom AI">
      <span><img src="assets/zentom-mascot.jpg" alt=""></span>
      <strong>Ask Zentom</strong>
      <em><i></i>Live</em>
    </button>
    
    <aside id="tcGlobalGuidePanel" class="tc-guide-panel" aria-label="Zentom AI guide" hidden>
      <div class="tc-guide-header">
        <div class="tc-guide-brand">
          <img src="assets/zentom-mascot.jpg" alt="Zentom AI">
          <div>
            <h2>Zentom AI Tutor</h2>
            <small id="tcGlobalGuideStatus"><i></i>Checking AI status</small>
          </div>
        </div>
        <div class="tc-guide-actions">
          <button id="tcGlobalGuideClear" class="tc-guide-action-btn" type="button" title="Clear conversation">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
          <button id="tcGlobalGuideClose" class="tc-guide-close" type="button" aria-label="Close AI guide">&times;</button>
        </div>
      </div>
      
      <div id="tcGlobalGuideContext" class="tc-guide-context"></div>
      
      <div id="tcGlobalGuideHistory" class="tc-guide-history"></div>
      
      <div class="tc-guide-footer">
        <div class="tc-guide-speed-selector">
          <button type="button" class="speed-pill active" data-speed="auto" title="Let AI choose optimal depth">⚡ Auto</button>
          <button type="button" class="speed-pill" data-speed="flash" title="Short bullet point answer">⚡ Flash</button>
          <button type="button" class="speed-pill" data-speed="normal" title="Standard guidance & examples">💬 Normal</button>
          <button type="button" class="speed-pill" data-speed="deep" title="Deep concept, pitfalls & steps">🧠 Deep</button>
        </div>
        
        <div class="tc-guide-input-wrapper">
          <textarea id="tcGlobalGuideInput" placeholder="Ask a question..." rows="1"></textarea>
          <button id="tcGlobalGuideAsk" class="tc-guide-send" type="button" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </aside>
  `);

  const button = document.getElementById("tcGlobalGuideButton");
  const panel = document.getElementById("tcGlobalGuidePanel");
  const contextBox = document.getElementById("tcGlobalGuideContext");
  const input = document.getElementById("tcGlobalGuideInput");
  const historyContainer = document.getElementById("tcGlobalGuideHistory");
  const sendBtn = document.getElementById("tcGlobalGuideAsk");
  const clearBtn = document.getElementById("tcGlobalGuideClear");
  const status = document.getElementById("tcGlobalGuideStatus");
  const pills = document.querySelectorAll(".speed-pill");

  let conversationHistory = [];
  let selectedSpeed = "auto";

  // Load history from localStorage
  try {
    const saved = localStorage.getItem("tc_global_chat_history");
    if (saved) {
      conversationHistory = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load chat history", e);
  }

  // Load speed mode from localStorage
  try {
    const savedSpeed = localStorage.getItem("tc_global_chat_speed");
    if (savedSpeed) {
      selectedSpeed = savedSpeed;
      pills.forEach(p => {
        p.classList.toggle("active", p.dataset.speed === selectedSpeed);
      });
    }
  } catch (e) {
    console.error("Failed to load chat speed mode", e);
  }

  // Auto-expand textarea input height
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  });

  // Watch for history changes to auto-scroll
  const scrollObserver = new MutationObserver(() => {
    historyContainer.scrollTop = historyContainer.scrollHeight;
  });
  scrollObserver.observe(historyContainer, { childList: true, subtree: true });

  window.TomCodexAI.getStatus().then((result) => {
    status.classList.toggle("offline", !result.connected);
    status.lastChild.textContent = result.connected ? " Zentom online" : " Zentom offline";
  });

  function saveHistory() {
    try {
      localStorage.setItem("tc_global_chat_history", JSON.stringify(conversationHistory));
    } catch (e) {
      console.error("Failed to save chat history", e);
    }
  }

  function renderHistory() {
    historyContainer.innerHTML = "";
    if (conversationHistory.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "tc-empty-state";
      emptyState.innerHTML = `
        <div class="tc-empty-avatar"><img src="assets/zentom-mascot.jpg" alt="Zentom"></div>
        <h3>Hi, I'm Zentom</h3>
        <p>I am your dedicated Salesforce AI tutor. Ask me any conceptual questions, debugging doubts, or request guidance on the current topic.</p>
        <div class="tc-empty-suggestions">
          <button type="button" class="suggestion-chip">What is Object Manager?</button>
          <button type="button" class="suggestion-chip">Explain Profiles vs Permission Sets</button>
          <button type="button" class="suggestion-chip">How do I write a SOQL query?</button>
        </div>
      `;
      historyContainer.appendChild(emptyState);

      emptyState.querySelectorAll(".suggestion-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          input.value = chip.textContent;
          input.focus();
          input.dispatchEvent(new Event("input"));
        });
      });
      return;
    }

    conversationHistory.forEach((msg) => {
      const messageDiv = document.createElement("div");
      messageDiv.className = `tc-message ${msg.role === "model" ? "model" : "user"}`;
      
      const bubbleDiv = document.createElement("div");
      bubbleDiv.className = "tc-bubble";
      if (msg.role === "model") {
        bubbleDiv.innerHTML = window.TomCodexAI.parseMarkdownToHTML(msg.text);
      } else {
        bubbleDiv.textContent = msg.text;
      }
      messageDiv.appendChild(bubbleDiv);
      historyContainer.appendChild(messageDiv);
    });

    historyContainer.scrollTop = historyContainer.scrollHeight;
  }

  function toggle(open) {
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    if (open) {
      contextBox.textContent = `Guiding you on: ${context()}`;
      renderHistory();
      input.focus();
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 120) + "px";
    }
  }

  button.addEventListener("click", () => toggle(panel.hidden));
  document.getElementById("tcGlobalGuideClose").addEventListener("click", () => toggle(false));

  // Clear chat handler
  clearBtn.addEventListener("click", () => {
    if (confirm("Clear your conversation with Zentom?")) {
      conversationHistory = [];
      saveHistory();
      renderHistory();
    }
  });

  // Speed selection handler
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      selectedSpeed = pill.dataset.speed;
      try {
        localStorage.setItem("tc_global_chat_speed", selectedSpeed);
      } catch (e) {}
    });
  });

  // Handle send message
  async function sendMessage() {
    const doubt = input.value.trim();
    if (!doubt) return;

    // Reset input height & value
    input.value = "";
    input.style.height = "auto";

    // Add user message to history
    conversationHistory.push({ role: "user", text: doubt });
    saveHistory();
    renderHistory();

    // Show typing indicator
    const typingDiv = document.createElement("div");
    typingDiv.className = "tc-message model typing";
    typingDiv.id = "tcGlobalGuideTyping";
    typingDiv.innerHTML = `<div class="tc-bubble"><div class="tc-dots"><span></span><span></span><span></span></div></div>`;
    historyContainer.appendChild(typingDiv);
    historyContainer.scrollTop = historyContainer.scrollHeight;

    // Disable send
    sendBtn.disabled = true;
    input.disabled = true;

    // Call AI API
    const result = await window.TomCodexAI.askTrainer({
      topic: context(),
      answerMode: "Global Academy Guide",
      speedMode: selectedSpeed,
      doubt: doubt,
      history: conversationHistory.slice(0, -1) // Send all previous turns
    });

    // Remove typing indicator
    const typingIndicator = document.getElementById("tcGlobalGuideTyping");
    if (typingIndicator) typingIndicator.remove();

    sendBtn.disabled = false;
    input.disabled = false;
    input.focus();

    // Create a new model message placeholder
    const answerDiv = document.createElement("div");
    answerDiv.className = "tc-message model";
    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "tc-bubble rich-text-content";
    answerDiv.appendChild(bubbleDiv);
    historyContainer.appendChild(answerDiv);

    if (!result.connected) {
      bubbleDiv.className = "tc-bubble error";
      bubbleDiv.textContent = `${result.error || "Zentom AI could not connect."}\n\nPlease check your internet connection or try again.`;
      // Don't save failed messages to history
      return;
    }

    // Type out response
    window.TomCodexAI.typeWriterEffect(bubbleDiv, result.answer, () => {
      // Save completed AI response to history
      conversationHistory.push({ role: "model", text: result.answer });
      saveHistory();
    });

    window.TomCodexLearning?.record("tutor", 2, `${context()}: ${doubt}`);
  }

  // Click send button
  sendBtn.addEventListener("click", sendMessage);

  // Enter to send (Shift+Enter for new line)
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();
