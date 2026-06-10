// Common Test Data Scenarios
// Provides predefined test scenarios for frequently used data combinations

import { create, build } from '../registry.js';

export const commonScenarios = {
  // A student with some progress
  studentWithProgress: {
    user: build('user', { role: 'student' }),
    learning: build('learning', { 
      selectedDay: 5,
      completedTasks: { 1: [0, 1, 2], 2: [0] },
      completedHabits: [0, 1, 2]
    })
  },

  // A tutor with multiple students
  tutorWithStudents: {
    user: build('user', { role: 'tutor' }),
    students: create('user', 3, { role: 'student' }),
    learning: create('learning', 4)
  },

  // A student who has completed several days
  advancedStudent: {
    user: build('user', { role: 'student' }),
    learning: build('learning', { 
      selectedDay: 15,
      completedTasks: { 
        1: [0, 1, 2, 3, 4],
        2: [0, 1, 2, 3, 4],
        3: [0, 1, 2, 3, 4],
        4: [0, 1, 2, 3, 4],
        5: [0, 1, 2, 3, 4],
        6: [0, 1, 2, 3, 4],
        7: [0, 1, 2, 3, 4],
        8: [0, 1, 2, 3, 4],
        9: [0, 1, 2, 3, 4],
        10: [0, 1, 2, 3, 4],
        11: [0, 1, 2, 3, 4],
        12: [0, 1, 2, 3, 4],
        13: [0, 1, 2, 3, 4],
        14: [0, 1, 2, 3, 4]
      },
      completedHabits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    })
  },

  // A new student with no progress
  newStudent: {
    user: build('user', { role: 'student' }),
    learning: build('learning', { 
      selectedDay: 1,
      completedTasks: {},
      completedHabits: []
    })
  },

  // A student who has completed all tasks for a specific day
  dayComplete: {
    user: build('user', { role: 'student' }),
    learning: build('learning', { 
      selectedDay: 3,
      completedTasks: { 3: [0, 1, 2, 3, 4] },
      completedHabits: [0, 1, 2, 3, 4]
    })
  },

  // A student who has generated custom stages
  studentWithCustomStages: {
    user: build('user', { role: 'student' }),
    learning: build('learning', { 
      selectedDay: 10,
      generatedStages: [
        [37, "Workplace Scenario Lab", "Real stakeholder requests, constraints, and tradeoffs", "Solve a new workplace Salesforce scenario"],
        [38, "Advanced Project Upgrade", "Performance, security, maintainability, and scale", "Upgrade an existing portfolio project"]
      ]
    })
  }
};

// Helper to get a scenario by name
export const getScenario = (name) => {
  if (!commonScenarios[name]) {
    throw new Error(`Scenario "${name}" not found in common scenarios`);
  }
  return commonScenarios[name];
};

// Helper to get all scenario names
export const getScenarioNames = () => {
  return Object.keys(commonScenarios);
};
