import {
  UIComponent,
  createUIComponent,
  renderHabits,
  renderStats,
  renderTodayMission,
  updateHabitProgress,
  updateTodayProgress,
  renderSkillMeters,
  renderSimpleList,
  setupDayNavigation,
  setupTabs
} from "../js/ui-components.js";
import { createRenderData, createService } from "./test-helpers.js";

describe("UI components", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    Element.prototype.scrollIntoView = jest.fn();
  });

  test("UIComponent renders only when its element exists", () => {
    const render = jest.fn();
    new UIComponent(null, render).render({});
    const element = document.createElement("div");
    new UIComponent(element, render).render({ value: 1 });
    expect(render).toHaveBeenCalledTimes(1);
  });

  test("createUIComponent resolves an element by ID", () => {
    document.body.innerHTML = '<div id="target"></div>';
    expect(createUIComponent("target", jest.fn())).toBeInstanceOf(UIComponent);
  });

  test("renders current-stage statistics", () => {
    const element = document.createElement("section");
    renderStats(element, createRenderData(createService()));
    expect(element.textContent).toContain("Stage 1");
    expect(element.textContent).toContain("Org Navigation");
  });

  test("renders mission tasks and persists checkbox changes", () => {
    document.body.innerHTML = '<section id="mission"></section>';
    const service = createService();
    renderTodayMission(document.getElementById("mission"), createRenderData(service));

    const checkbox = document.querySelector(".today-check");
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change"));
    expect(service.state.completedTasks[1]).toContain(0);
  });

  test("renders habits and persists checkbox changes", () => {
    const element = document.createElement("section");
    const service = createService();
    renderHabits(element, createRenderData(service));

    const checkbox = element.querySelector(".habit-check");
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change"));
    expect(service.state.completedHabits).toContain(0);
  });

  test("updates visible progress indicators", () => {
    document.body.innerHTML = `
      <span id="todayProgressText"></span><div id="todayProgressBar"></div>
      <span id="habitProgressText"></span><div id="habitProgressBar"></div>`;
    updateTodayProgress(40);
    updateHabitProgress(70);
    expect(document.getElementById("todayProgressBar").style.width).toBe("40%");
    expect(document.getElementById("habitProgressText").textContent).toBe("70%");
  });

  test("renders skill meters", () => {
    const element = document.createElement("div");
    const data = {
      skillMeters: [
        ["Apex Development", 80],
        ["Flow Builder", 90]
      ]
    };
    renderSkillMeters(element, data);
    expect(element.innerHTML).toContain("Apex Development");
    expect(element.innerHTML).toContain("80%");
    expect(element.innerHTML).toContain("Flow Builder");
    expect(element.innerHTML).toContain("90%");
  });

  test("renders simple lists", () => {
    const element = document.createElement("div");
    renderSimpleList(element, ["Item A", "Item B"]);
    expect(element.innerHTML).toContain("Item A");
    expect(element.innerHTML).toContain("Item B");
  });

  test("sets up day navigation and handles events", () => {
    document.body.innerHTML = `
      <div id="nav-container">
        <select id="daySelect"></select>
        <button id="previousDayBtn"></button>
        <button id="nextDayBtn"></button>
        <span id="todayTitle"></span>
        <p id="trainerNote"></p>
        <div id="todayTasks"></div>
        <div id="recallQuestions"></div>
      </div>
    `;
    const element = document.getElementById("nav-container");

    const mockData = {
      days: [
        [1, "Focus 1"],
        [2, "Focus 2"]
      ],
      state: { selectedDay: 1 },
      continuousStageTemplates: [["Template Stage", "Desc", "Task"]],
      generatedStages: [],
      saveState: jest.fn(),
      getSelectedDay: jest.fn(() => [1, "Focus 1"]),
      renderStats: jest.fn(),
      renderTodayMission: jest.fn(),
      renderDays: jest.fn(),
      record: jest.fn()
    };

    setupDayNavigation(element, mockData);

    const select = element.querySelector("#daySelect");
    expect(select.children).toHaveLength(2);
    expect(select.value).toBe("1");

    select.value = "2";
    select.dispatchEvent(new Event("change"));
    expect(mockData.state.selectedDay).toBe(2);
    expect(mockData.saveState).toHaveBeenCalled();

    document.getElementById("previousDayBtn").dispatchEvent(new Event("click"));
    expect(mockData.state.selectedDay).toBe(1);

    document.getElementById("nextDayBtn").dispatchEvent(new Event("click"));
    expect(mockData.state.selectedDay).toBe(2);

    document.getElementById("nextDayBtn").dispatchEvent(new Event("click"));
    expect(mockData.days).toHaveLength(3);
    expect(mockData.generatedStages).toHaveLength(1);
    expect(mockData.state.selectedDay).toBe(3);
  });

  test("sets up tabs keydown and go-tab event handlers", () => {
    document.body.innerHTML = `
      <div id="tabs">
        <button data-tab-target="dashboard" class="active"></button>
        <button data-tab-target="practice"></button>
        <div data-tab-panel="dashboard"></div>
        <div data-tab-panel="practice" hidden></div>
        <div id="tabContent"></div>
        <button data-go-tab="practice" id="go-btn"></button>
      </div>
    `;
    const element = document.getElementById("tabs");
    const mockData = {
      state: { activeTab: "dashboard" },
      saveState: jest.fn()
    };

    setupTabs(element, mockData);

    const dashboardBtn = element.querySelector('[data-tab-target="dashboard"]');
    const practiceBtn = element.querySelector('[data-tab-target="practice"]');

    const arrowRightEvent = new Event("keydown");
    arrowRightEvent.key = "ArrowRight";
    arrowRightEvent.preventDefault = jest.fn();
    dashboardBtn.dispatchEvent(arrowRightEvent);

    expect(mockData.state.activeTab).toBe("practice");
    expect(practiceBtn.classList.contains("active")).toBe(true);

    const arrowLeftEvent = new Event("keydown");
    arrowLeftEvent.key = "ArrowLeft";
    arrowLeftEvent.preventDefault = jest.fn();
    practiceBtn.dispatchEvent(arrowLeftEvent);

    expect(mockData.state.activeTab).toBe("dashboard");
    expect(dashboardBtn.classList.contains("active")).toBe(true);

    const tabContent = document.getElementById("tabContent");
    tabContent.scrollIntoView = jest.fn();

    document.getElementById("go-btn").dispatchEvent(new Event("click"));
    expect(mockData.state.activeTab).toBe("practice");
    expect(tabContent.scrollIntoView).toHaveBeenCalled();
  });
});
