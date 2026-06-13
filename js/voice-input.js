(function () {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const targetIds = new Set(["tcGlobalGuideInput", "courseDoubtInput", "floatingGuideInput", "doubtInput"]);
  const vocabulary = ["Salesforce", "Zentom", "CRM", "Trailhead", "Apex", "SOQL", "SOSL", "LWC", "Flow Builder", "Lightning", "permission set", "profile", "sharing rule", "object", "field", "record", "dashboard", "report", "trigger", "sandbox", "DevOps"];
  const corrections = [
    [/\bsales force\b/gi, "Salesforce"],
    [/\bsalesforce\b/gi, "Salesforce"],
    [/\bzen tom\b/gi, "Zentom"],
    [/\btrail head\b/gi, "Trailhead"],
    [/\ba pecs\b/gi, "Apex"],
    [/\bapex\b/gi, "Apex"],
    [/\bso q l\b/gi, "SOQL"],
    [/\bs o q l\b/gi, "SOQL"],
    [/\bsequel\b/gi, "SOQL"],
    [/\bso s l\b/gi, "SOSL"],
    [/\bl w c\b/gi, "LWC"],
    [/\blightning web component(s)?\b/gi, "Lightning Web Component$1"],
    [/\bcrm\b/gi, "CRM"],
    [/\bdev ops\b/gi, "DevOps"]
  ];
  let activeRecognition = null;
  let activeButton = null;

  function stopActiveRecognition() {
    if (activeRecognition) activeRecognition.stop();
  }

  function setButtonState(button, state, message) {
    button.dataset.state = state;
    button.setAttribute("aria-pressed", String(state === "listening"));
    button.querySelector("span").textContent = state === "listening" ? "Stop listening" : "Voice input";
    const status = button.parentElement.querySelector(".voice-input-status");
    status.textContent = message || (state === "listening" ? "Listening in English (India)..." : "English (India)");
  }

  function normalizeTranscript(text) {
    let normalized = text.replace(/\b(new line|next line)\b/gi, "\n").replace(/\b(full stop|period)\b/gi, ".").replace(/\bcomma\b/gi, ",");
    corrections.forEach(([pattern, replacement]) => { normalized = normalized.replace(pattern, replacement); });
    normalized = normalized.replace(/\s+([.,?!])/g, "$1").replace(/[ \t]{2,}/g, " ").trim();
    return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : "";
  }

  function alternativeScore(alternative) {
    const text = alternative.transcript.toLowerCase();
    const vocabularyMatches = vocabulary.filter((term) => text.includes(term.toLowerCase())).length;
    return (Number(alternative.confidence) || 0) + vocabularyMatches * 0.18;
  }

  function bestAlternative(result) {
    let best = result[0];
    for (let index = 1; index < result.length; index += 1) {
      if (alternativeScore(result[index]) > alternativeScore(best)) best = result[index];
    }
    return best;
  }

  function joinText(...parts) {
    return parts.filter(Boolean).join(" ").replace(/ +\n/g, "\n").replace(/\n +/g, "\n").trim();
  }

  function startListening(textarea, button) {
    if (!SpeechRecognition) {
      setButtonState(button, "error", "Voice input needs Chrome or Edge.");
      return;
    }

    if (activeRecognition && activeButton === button) {
      stopActiveRecognition();
      return;
    }
    stopActiveRecognition();

    const recognition = new SpeechRecognition();
    const startingText = textarea.value.trim();
    let finalTranscript = "";
    let latestInterimTranscript = "";
    activeRecognition = recognition;
    activeButton = button;
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;

    recognition.onstart = () => setButtonState(button, "listening");
    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = bestAlternative(event.results[index]).transcript.trim();
        if (event.results[index].isFinal) finalTranscript = joinText(finalTranscript, transcript);
        else interimTranscript = joinText(interimTranscript, transcript);
      }
      latestInterimTranscript = interimTranscript;
      textarea.value = joinText(startingText, normalizeTranscript(joinText(finalTranscript, interimTranscript)));
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      setButtonState(button, "listening", interimTranscript ? "Listening and processing..." : "Speech processed. Keep speaking...");
    };
    recognition.onerror = (event) => {
      const messages = {
        "not-allowed": "Microphone permission was denied.",
        "audio-capture": "No microphone was detected.",
        "no-speech": "No speech detected. Speak closer to the microphone.",
        network: "Voice recognition network error."
      };
      setButtonState(button, "error", messages[event.error] || "Voice input could not start.");
    };
    recognition.onend = () => {
      if (button.dataset.state !== "error") {
        finalTranscript = joinText(finalTranscript, latestInterimTranscript);
        textarea.value = joinText(startingText, normalizeTranscript(finalTranscript));
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        setButtonState(button, "idle", finalTranscript ? "Speech processed · English (India)" : "English (India)");
      }
      if (activeRecognition === recognition) {
        activeRecognition = null;
        activeButton = null;
      }
    };
    try {
      recognition.start();
    } catch {
      setButtonState(button, "error", "Voice input could not start.");
    }
  }

  function addVoiceControl(textarea) {
    if (!targetIds.has(textarea.id) || textarea.dataset.voiceEnabled) return;
    textarea.dataset.voiceEnabled = "true";
    const control = document.createElement("div");
    control.className = "voice-input-control";
    control.innerHTML = `<button class="voice-input-button" type="button" aria-pressed="false" aria-label="Speak in English India"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15a4 4 0 0 0 4-4V5a4 4 0 1 0-8 0v6a4 4 0 0 0 4 4Zm-2-10a2 2 0 1 1 4 0v6a2 2 0 1 1-4 0V5Zm9 6a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V20H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3v-2.08A7 7 0 0 0 19 11Z"/></svg><span>Voice input</span></button><small class="voice-input-status">English (India)</small>`;
    
    const wrapper = textarea.closest(".tc-guide-input-wrapper") || textarea.closest(".input-wrapper") || textarea.closest(".chat-input-container");
    if (wrapper) {
      wrapper.insertAdjacentElement("afterend", control);
    } else {
      textarea.insertAdjacentElement("afterend", control);
    }
    
    control.querySelector("button").addEventListener("click", () => startListening(textarea, control.querySelector("button")));
  }

  function initializeVoiceInputs(root = document) {
    if (root.matches?.("textarea")) addVoiceControl(root);
    root.querySelectorAll("textarea").forEach(addVoiceControl);
  }

  initializeVoiceInputs();
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) initializeVoiceInputs(node);
    }));
  }).observe(document.body, { childList: true, subtree: true });
})();
