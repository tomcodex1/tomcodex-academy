import { renderHabits, renderStats, renderTodayMission } from "../js/ui-components.js";
import { createService, createStorage } from "./test-helpers.js";

describe("Error handling", () => {
  test("falls back when storage reads fail", () => {
    const storage = createStorage();
    storage.getItem.mockImplementation(() => { throw new Error("denied"); });
    expect(createService(storage).state.selectedDay).toBe(1);
  });

  test("continues when storage writes fail", () => {
    const storage = createStorage();
    storage.setItem.mockImplementation(() => { throw new Error("quota"); });
    const service = createService(storage);
    expect(() => service.setSelectedDay(2)).not.toThrow();
    expect(service.state.selectedDay).toBe(2);
  });

  test("recovers from malformed persisted JSON", () => {
    const service = createService(createStorage({
      "salesforceMasterDashboard.v1": "{invalid"
    }));
    expect(service.state).toMatchObject({ selectedDay: 1, activeTab: "dashboard" });
  });

  test("render functions ignore missing elements and incomplete data", () => {
    expect(() => {
      renderStats(null, {});
      renderTodayMission(null, {});
      renderHabits(null, {});
      renderStats(document.createElement("div"), {});
      renderTodayMission(document.createElement("div"), {});
      renderHabits(document.createElement("div"), {});
    }).not.toThrow();
  });

  test("invalid selected days are clamped by the service API", () => {
    const service = createService();
    service.setSelectedDay(Number.NaN);
    expect(service.state.selectedDay).toBe(1);
    service.setSelectedDay(999);
    expect(service.state.selectedDay).toBe(3);
  });
});
