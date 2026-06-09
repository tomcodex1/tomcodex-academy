import { createService, createStorage, sampleDays } from "./test-helpers.js";

describe("LearningService", () => {
  test("starts with the default dashboard state", () => {
    expect(createService().state).toEqual({
      selectedDay: 1,
      activeTab: "dashboard",
      completedTasks: {},
      completedHabits: [],
      generatedStages: []
    });
  });

  test("loads JSON state and restores generated stages", () => {
    const stored = {
      selectedDay: 4,
      activeTab: "analytics",
      completedTasks: { 1: [0] },
      completedHabits: [1],
      generatedStages: [[4, "Generated", "Topic", "Practice"]]
    };
    const service = createService(createStorage({
      "salesforceMasterDashboard.v1": JSON.stringify(stored)
    }));

    expect(service.state).toMatchObject(stored);
    expect(service.getDays()).toHaveLength(4);
  });

  test("falls back to defaults for corrupted JSON", () => {
    const service = createService(createStorage({
      "salesforceMasterDashboard.v1": "{bad json"
    }));
    expect(service.state.selectedDay).toBe(1);
  });

  test("saves state as JSON", () => {
    const storage = createStorage();
    const service = createService(storage);
    service.setActiveTab("analytics");

    expect(JSON.parse(storage.storage[service.storageKey]).activeTab).toBe("analytics");
  });

  test("updates task and habit completion", () => {
    const service = createService();
    service.updateCompletedTasks(1, 0, true);
    service.updateCompletedHabits(2, true);
    service.updateCompletedTasks(1, 0, false);

    expect(service.state.completedTasks[1]).toEqual([]);
    expect(service.state.completedHabits).toEqual([2]);
  });

  test("clamps selected days to the available range", () => {
    const service = createService();
    expect(service.setSelectedDay(999).newDay).toBe(sampleDays.length);
    expect(service.setSelectedDay(-5).newDay).toBe(1);
  });

  test("builds mission and progress data", () => {
    const service = createService();
    service.updateCompletedTasks(1, 0, true);
    const mission = service.getMission();

    expect(mission).toMatchObject({ day: 1, title: "Org Navigation" });
    expect(mission.mustFinish).toHaveLength(5);
    expect(service.getTodayProgress()).toEqual({ progress: 20, completed: 1, total: 5 });
  });

  test("generates a valid next stage for short custom day providers", () => {
    const service = createService();
    const stage = service.generateNextStage();

    expect(stage[0]).toBe(4);
    expect(stage).toHaveLength(4);
    expect(service.state.generatedStages).toContainEqual(stage);
  });

  test("continues when browser storage cannot be written", () => {
    const storage = createStorage();
    storage.setItem.mockImplementation(() => { throw new Error("quota"); });
    expect(() => createService(storage).saveState()).not.toThrow();
  });
});
