import {
  UIComponent,
  createUIComponent,
  renderHabits,
  renderStats,
  renderTodayMission,
  updateHabitProgress,
  updateTodayProgress
} from "../js/ui-components.js";
import { createRenderData, createService } from "./test-helpers.js";

describe("UI components", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
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
});
