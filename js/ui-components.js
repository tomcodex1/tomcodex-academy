// UI Components - Rendering Layer
// This module handles UI rendering and component management

export class UIComponent {
  constructor(element, renderFunction) {
    this.element = element;
    this.renderFunction = renderFunction;
  }

  render(data) {
    if (!this.element) return;
    this.renderFunction(this.element, data);
  }
}

export function createUIComponent(elementId, renderFunction) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return null;
  }
  return new UIComponent(element, renderFunction);
}

// Utility function to create DOM elements
export function createElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

// Render functions for different UI components
export function renderStats(element, data) {
  if (!element || !Array.isArray(data?.days) || !data.days.length || !Array.isArray(data?.stats)) return;
  const mission = data.selectedDay ? data.days.find(([day]) => day === data.selectedDay) : data.days[0];
  if (!mission) return;
  const stats = [...data.stats];
  stats[2] = { label: "Current", value: `Stage ${mission[0]}`, detail: mission[1] };

  element.replaceChildren();
  stats.forEach((item) => {
    const card = createElement("div", "stat-card");
    card.append(
      createElement("strong", "", item.value),
      createElement("span", "", item.label),
      createElement("p", "tiny-text", item.detail)
    );
    element.append(card);
  });
}

export function renderTodayMission(element, data) {
  if (!element || typeof data?.getMission !== "function") return;
  const mission = data.selectedDay ? data.getMission(data.selectedDay) : null;
  if (!mission) return;

  const completedTasks = data.completedTasks?.[mission.day] || [];
  element.innerHTML = `
    <h2 id="todayTitle">Current Mission: Stage ${mission.day} - ${mission.title}</h2>
    <p id="trainerNote">${mission.trainerNote}</p>
    <div class="tasks-container">
      <h3>Tasks to Complete</h3>
      <div id="todayTasks"></div>
    </div>
    <div class="questions-container">
      <h3>Recall Questions</h3>
      <div id="recallQuestions"></div>
    </div>
  `;

  const tasks = document.getElementById("todayTasks");
  mission.mustFinish.forEach((task, index) => {
    const label = createElement("label", "task-item");
    const checkbox = createElement("input", "today-check");
    checkbox.type = "checkbox";
    checkbox.checked = completedTasks.includes(index);
    label.classList.toggle("done", checkbox.checked);
    label.append(checkbox, createElement("span", "", task));

    checkbox.addEventListener("change", () => {
      label.classList.toggle("done", checkbox.checked);
      data.updateTaskCompletion?.(mission.day, index, checkbox.checked);
      data.saveState?.();
      data.updateProgress?.();
    });

    tasks?.append(label);
  });

  const questions = document.getElementById("recallQuestions");
  mission.recall.forEach((question, index) => {
    const item = createElement("div");
    item.append(
      createElement("span", "small-label", `Question ${index + 1}`),
      document.createElement("br"),
      document.createTextNode(question)
    );
    questions?.append(item);
  });

  data.updateProgress?.();
}

export function renderHabits(element, data) {
  if (!element || !Array.isArray(data?.habits)) return;
  element.innerHTML = "";
  data.habits.forEach((habit, index) => {
    const label = createElement("label", "task-item");
    const checkbox = createElement("input", "habit-check");
    checkbox.type = "checkbox";
    checkbox.checked = data.completedHabits?.includes(index) || false;
    label.classList.toggle("done", checkbox.checked);
    label.append(checkbox, createElement("span", "", habit));

    checkbox.addEventListener("change", () => {
      label.classList.toggle("done", checkbox.checked);
      data.updateHabitCompletion?.(index, checkbox.checked);
      data.saveState?.();
      data.updateHabitProgress?.();
    });

    element.append(label);
  });

  data.updateHabitProgress?.();
}

export function renderSkillMeters(element, data) {
  element.innerHTML = "";
  data.skillMeters.forEach(([skill, value]) => {
    element.innerHTML += `
      <div>
        <div class="meter-label"><span>${skill}</span><strong>${value}%</strong></div>
        <div class="meter-track"><div class="meter-fill" style="width:${value}%"></div></div>
      </div>`;
  });
}

export function renderSimpleList(element, items) {
  element.innerHTML = "";
  items.forEach((item) => {
    element.innerHTML += `<div>${item}</div>`;
  });
}

export function updateTodayProgress(progress) {
  const progressText = document.getElementById("todayProgressText");
  const progressBar = document.getElementById("todayProgressBar");

  if (progressText) progressText.textContent = `${progress}%`;
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute("aria-valuenow", progress);
  }
}

export function updateHabitProgress(progress) {
  const progressText = document.getElementById("habitProgressText");
  const progressBar = document.getElementById("habitProgressBar");

  if (progressText) progressText.textContent = `${progress}%`;
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute("aria-valuenow", progress);
  }
}

export function setupDayNavigation(element, data) {
  const select = element.querySelector("#daySelect");
  const appendStageOption = ([day, focus]) => {
    const option = createElement("option", "", `Stage ${day}: ${focus}`);
    option.value = day;
    select.append(option);
  };

  data.days.forEach(appendStageOption);
  select.value = data.state.selectedDay;

  const generateNextStage = () => {
    const stageNumber = data.days.length + 1;
    const template = data.continuousStageTemplates[(stageNumber - 37) % data.continuousStageTemplates.length];
    const stage = [stageNumber, ...template];
    data.days.push(stage);
    data.generatedStages.push(stage);
    appendStageOption(stage);
    data.renderDays();
    return stageNumber;
  };

  const setDay = (day) => {
    const previousStage = data.state.selectedDay;
    data.state.selectedDay = Math.min(data.days.length, Math.max(1, Number(day)));
    data.saveState();
    select.value = data.state.selectedDay;
    document.getElementById("previousDayBtn").disabled = data.state.selectedDay === 1;
    const nextButton = document.getElementById("nextDayBtn");
    nextButton.disabled = false;
    nextButton.textContent = data.state.selectedDay === data.days.length ? "Generate next topic" : "Next topic";

    // Re-render components that depend on the selected day
    data.renderStats();
    data.renderTodayMission();

    if (data.state.selectedDay !== previousStage) {
      data.record("stage", 1, data.getSelectedDay()[1]);
    }
  };

  select.addEventListener("change", () => setDay(select.value));
  document.getElementById("previousDayBtn").addEventListener("click", () => setDay(data.state.selectedDay - 1));
  document.getElementById("nextDayBtn").addEventListener("click", () => {
    const nextStage = data.state.selectedDay === data.days.length ? generateNextStage() : data.state.selectedDay + 1;
    setDay(nextStage);
  });
  setDay(data.state.selectedDay);
}

export function setupTabs(element, data) {
  const buttons = [...element.querySelectorAll("[data-tab-target]")];
  const panels = [...element.querySelectorAll("[data-tab-panel]")];
  const availableTabs = buttons.map((button) => button.dataset.tabTarget);

  const showTab = (tabName, moveFocus = false, scrollToContent = false) => {
    const activeTab = availableTabs.includes(tabName) ? tabName : "dashboard";
    data.state.activeTab = activeTab;
    data.saveState();

    buttons.forEach((button) => {
      const isActive = button.dataset.tabTarget === activeTab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive);
      button.tabIndex = isActive ? 0 : -1;
      if (isActive && moveFocus) button.focus();
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.tabPanel !== activeTab;
    });

    if (scrollToContent) {
      document.getElementById("tabContent").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => showTab(button.dataset.tabTarget, false, true));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + direction + buttons.length) % buttons.length;
      showTab(buttons[nextIndex].dataset.tabTarget, true, true);
    });
  });

  element.querySelectorAll("[data-go-tab]").forEach((button) => {
    button.addEventListener("click", () => showTab(button.dataset.goTab, false, true));
  });

  showTab(data.state.activeTab);
}
