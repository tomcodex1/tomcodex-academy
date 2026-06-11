(function () {
  const input = document.getElementById("courseDoubtInput");
  const speed = document.getElementById("courseDoubtSpeed");
  const answerBox = document.getElementById("courseDoubtAnswer");
  const askButton = document.getElementById("askCourseGuideBtn");

  askButton.addEventListener("click", async () => {
    const doubt = input.value.trim();
    if (!doubt) {
      answerBox.className = "course-doubt-answer error";
      answerBox.textContent = "Type your doubt first so Zentom can guide you.";
      return;
    }

    askButton.disabled = true;
    askButton.textContent = "Zentom is thinking...";
    answerBox.className = "course-doubt-answer";
    answerBox.textContent = "Preparing your guided answer...";

    const moduleTitle = document.getElementById("moduleTitle").textContent;
    const result = await window.TomCodexAI.askTrainer({
      topic: moduleTitle,
      answerMode: "Course Guide Mode",
      speedMode: speed.value,
      doubt
    });

    if (!result.connected) {
      answerBox.className = "course-doubt-answer error";
      answerBox.textContent = `${result.error}\n\nZentom AI is temporarily unavailable. Please try again after the service is connected.`;
      askButton.disabled = false;
      askButton.textContent = "Ask Zentom";
      return;
    }

    answerBox.className = "course-doubt-answer";
    const heading = Object.assign(document.createElement("strong"), { textContent: `${speed.options[speed.selectedIndex].text} guide answer` });
    const bodyContainer = document.createElement("div");
    bodyContainer.className = "rich-text-content";
    answerBox.replaceChildren(heading, bodyContainer);
    window.TomCodexAI.typeWriterEffect(bodyContainer, result.answer, () => {
      askButton.disabled = false;
      askButton.textContent = "Ask Zentom";
    });
    window.TomCodexLearning?.record("tutor", 2, `${moduleTitle}: ${doubt}`);
  });

  const floatingButton = document.getElementById("floatingGuideBtn");
  if (!floatingButton) return;
  const floatingPanel = document.getElementById("floatingGuidePanel");
  const floatingContext = document.getElementById("floatingGuideContext");
  const floatingInput = document.getElementById("floatingGuideInput");
  const floatingSpeed = document.getElementById("floatingGuideSpeed");
  const floatingAnswer = document.getElementById("floatingGuideAnswer");
  const floatingAskButton = document.getElementById("askFloatingGuideBtn");

  function toggleFloatingGuide(open) {
    floatingPanel.classList.toggle("hidden", !open);
    floatingButton.setAttribute("aria-expanded", String(open));
    if (open) {
      floatingContext.textContent = `Guiding you on: ${document.getElementById("moduleTitle").textContent}`;
      floatingInput.focus();
    }
  }

  floatingButton.addEventListener("click", () => toggleFloatingGuide(floatingPanel.classList.contains("hidden")));
  document.getElementById("closeFloatingGuideBtn").addEventListener("click", () => toggleFloatingGuide(false));
  floatingAskButton.addEventListener("click", async () => {
    const doubt = floatingInput.value.trim();
    if (!doubt) {
      floatingAnswer.className = "course-doubt-answer error";
      floatingAnswer.textContent = "Type your doubt first.";
      return;
    }
    const moduleTitle = document.getElementById("moduleTitle").textContent;
    floatingAskButton.disabled = true;
    floatingAskButton.textContent = "AI guide is thinking...";
    floatingAnswer.className = "course-doubt-answer";
    floatingAnswer.textContent = "Preparing your guided answer...";
    const result = await window.TomCodexAI.askTrainer({ topic: moduleTitle, answerMode: "Floating Course Guide", speedMode: floatingSpeed.value, doubt });
    const heading = Object.assign(document.createElement("strong"), { textContent: `${floatingSpeed.options[floatingSpeed.selectedIndex].text} guide answer` });
    const bodyContainer = document.createElement("div");
    bodyContainer.className = "rich-text-content";
    floatingAnswer.replaceChildren(heading, bodyContainer);
    window.TomCodexAI.typeWriterEffect(bodyContainer, result.answer, () => {
      floatingAskButton.disabled = false;
      floatingAskButton.textContent = "Ask AI guide";
    });
    window.TomCodexLearning?.record("tutor", 2, `${moduleTitle}: ${doubt}`);
  });
})();
