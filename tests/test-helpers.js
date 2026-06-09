import { LearningService } from "../js/learning-service.js";

export const sampleDays = [
  [1, "Org Navigation", "Setup and App Launcher", "Explore your org"],
  [2, "Objects & Fields", "Objects and field types", "Create Incident__c"],
  [3, "Relationships", "Lookup and Master-Detail", "Relate an Incident"]
];

export function createStorage(initial = {}) {
  const storage = { ...initial };
  return {
    storage,
    getItem: jest.fn((key) => storage[key] ?? null),
    setItem: jest.fn((key, value) => { storage[key] = String(value); }),
    removeItem: jest.fn((key) => { delete storage[key]; }),
    clear: jest.fn(() => Object.keys(storage).forEach((key) => delete storage[key]))
  };
}

export function createService(storage = createStorage(), days = sampleDays) {
  const serviceDays = days.map((day) => [...day]);
  return new LearningService(storage, { getDays: jest.fn(() => serviceDays) });
}

export function createRenderData(service) {
  return {
    selectedDay: service.state.selectedDay,
    days: service.getDays(),
    stats: service.getStats(),
    habits: service.getHabits(),
    completedTasks: service.state.completedTasks,
    completedHabits: service.state.completedHabits,
    getMission: () => service.getMission(),
    updateTaskCompletion: (...args) => service.updateCompletedTasks(...args),
    updateHabitCompletion: (...args) => service.updateCompletedHabits(...args),
    saveState: () => service.saveState(),
    updateProgress: jest.fn(),
    updateHabitProgress: jest.fn()
  };
}
