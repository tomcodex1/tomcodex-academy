import { renderHabits, renderStats, renderTodayMission } from "../js/ui-components.js";
import { createRenderData, createService, createStorage } from "./test-helpers.js";

describe("Performance", () => {
  test("renders the core dashboard components within 250ms", () => {
    document.body.innerHTML = '<div id="stats"></div><div id="mission"></div><div id="habits"></div>';
    const data = createRenderData(createService());
    const start = performance.now();

    renderStats(document.getElementById("stats"), data);
    renderTodayMission(document.getElementById("mission"), data);
    renderHabits(document.getElementById("habits"), data);

    expect(performance.now() - start).toBeLessThan(250);
  });

  test("finds a selected stage among 1,000 stages within 50ms", () => {
    const days = Array.from({ length: 1000 }, (_, index) => [
      index + 1, `Stage ${index + 1}`, "Topic", "Practice"
    ]);
    const service = createService(createStorage(), days);
    service.state.selectedDay = 1000;
    const start = performance.now();
    expect(service.getSelectedDay()[0]).toBe(1000);
    expect(performance.now() - start).toBeLessThan(50);
  });

  test("persists 1,000 state updates within 500ms", () => {
    const service = createService();
    const start = performance.now();
    for (let index = 0; index < 1000; index += 1) {
      service.setActiveTab(index % 2 ? "dashboard" : "analytics");
    }
    expect(performance.now() - start).toBeLessThan(500);
  });

  test("renders 100 habits within 250ms", () => {
    const element = document.createElement("div");
    const data = createRenderData(createService());
    data.habits = Array.from({ length: 100 }, (_, index) => `Habit ${index + 1}`);
    const start = performance.now();
    renderHabits(element, data);
    expect(element.querySelectorAll(".habit-check")).toHaveLength(100);
    expect(performance.now() - start).toBeLessThan(250);
  });
});
