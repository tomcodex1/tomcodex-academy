import { renderStats, renderTodayMission, setupTabs } from "../js/ui-components.js";
import { createRenderData, createService, createStorage } from "./test-helpers.js";

describe("Dashboard integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="stats"></div>
      <div id="mission"></div>
      <div id="tabContent"></div>
      <button data-tab-target="dashboard">Dashboard</button>
      <button data-tab-target="analytics">Analytics</button>
      <section data-tab-panel="dashboard">Dashboard content</section>
      <section data-tab-panel="analytics">Analytics content</section>`;
    document.getElementById("tabContent").scrollIntoView = jest.fn();
  });

  test("a selected-day change is reflected across rendered components", () => {
    const service = createService();
    service.setSelectedDay(2);
    const data = createRenderData(service);
    renderStats(document.getElementById("stats"), data);
    renderTodayMission(document.getElementById("mission"), data);

    expect(document.getElementById("stats").textContent).toContain("Stage 2");
    expect(document.getElementById("mission").textContent).toContain("Objects & Fields");
  });

  test("task interaction persists and survives service recreation", () => {
    const storage = createStorage();
    const service = createService(storage);
    renderTodayMission(document.getElementById("mission"), createRenderData(service));

    const checkbox = document.querySelector(".today-check");
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change"));

    expect(createService(storage).state.completedTasks[1]).toContain(0);
  });

  test("tab clicks update state, panels, and persisted storage", () => {
    const storage = createStorage();
    const service = createService(storage);
    setupTabs(document, service);
    document.querySelector('[data-tab-target="analytics"]').click();

    expect(service.state.activeTab).toBe("analytics");
    expect(document.querySelector('[data-tab-panel="dashboard"]').hidden).toBe(true);
    expect(document.querySelector('[data-tab-panel="analytics"]').hidden).toBe(false);
    expect(JSON.parse(storage.storage[service.storageKey]).activeTab).toBe("analytics");
  });
});
