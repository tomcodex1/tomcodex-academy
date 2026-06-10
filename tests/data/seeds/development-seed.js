// Development Seed Data
// Provides a comprehensive set of test data for development and testing

import { create, build } from '../registry.js';
import { getScenario } from '../fixtures/common-scenarios.js';

export const developmentSeed = {
  // Create a set of test users
  users: [
    build('user', { 
      role: 'tutor', 
      email: 'tutor@example.com',
      name: 'Jane Tutor'
    }),
    build('user', { 
      role: 'student', 
      email: 'student1@example.com',
      name: 'John Student'
    }),
    build('user', { 
      role: 'student', 
      email: 'student2@example.com',
      name: 'Jane Student'
    }),
    build('user', { 
      role: 'student', 
      email: 'student3@example.com',
      name: 'Bob Student'
    }),
    build('user', { 
      role: 'student', 
      email: 'student4@example.com',
      name: 'Alice Student'
    }),
    build('user', { 
      role: 'student', 
      email: 'student5@example.com',
      name: 'Mike Student'
    })
  ],

  // Create learning progress for each student
  learningProgress: [
    // Student 1 - Early learner
    build('learning', { 
      userId: 'id-1',
      selectedDay: 3,
      completedTasks: { 1: [0, 1, 2], 2: [0] },
      completedHabits: [0, 1]
    }),

    // Student 2 - Mid-progress learner
    build('learning', { 
      userId: 'id-2',
      selectedDay: 7,
      completedTasks: { 
        1: [0, 1, 2, 3, 4],
        2: [0, 1, 2, 3, 4],
        3: [0, 1, 2, 3],
        4: [0, 1, 2],
        5: [0, 1],
        6: [0]
      },
      completedHabits: [0, 1, 2, 3, 4, 5]
    }),

    // Student 3 - Advanced learner
    build('learning', { 
      userId: 'id-3',
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
    }),

    // Student 4 - Custom stages learner
    build('learning', { 
      userId: 'id-4',
      selectedDay: 10,
      completedTasks: { 
        1: [0, 1, 2, 3, 4],
        2: [0, 1, 2, 3, 4],
        3: [0, 1, 2, 3, 4],
        4: [0, 1, 2, 3, 4],
        5: [0, 1, 2, 3, 4],
        6: [0, 1, 2, 3, 4],
        7: [0, 1, 2, 3, 4],
        8: [0, 1, 2, 3, 4],
        9: [0, 1, 2, 3, 4]
      },
      completedHabits: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      generatedStages: [
        [37, "Workplace Scenario Lab", "Real stakeholder requests, constraints, and tradeoffs", "Solve a new workplace Salesforce scenario"],
        [38, "Advanced Project Upgrade", "Performance, security, maintainability, and scale", "Upgrade an existing portfolio project"]
      ]
    }),

    // Student 5 - Near completion
    build('learning', { 
      userId: 'id-5',
      selectedDay: 30,
      completedTasks: { 
        1: [0, 1, 2, 3, 4],
        2: [0, 1, 2, 3, 4],
        // ... (completed for all previous days)
        29: [0, 1, 2, 3, 4],
        30: [0, 1, 2, 3]
      },
      completedHabits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    })
  ],

  // Pre-defined learning tracks
  learningTracks: [
    {
      track: "admin",
      href: "course-admin.html",
      total: 14,
      completed: 5,
      percent: 36,
      enrolled: true,
      status: "In progress",
      action: "Continue track →",
      remaining: 9
    },
    {
      track: "apex",
      href: "course-apex.html",
      total: 12,
      completed: 2,
      percent: 17,
      enrolled: true,
      status: "In progress",
      action: "Continue track →",
      remaining: 10
    },
    {
      track: "flow",
      href: "course-flow.html",
      total: 12,
      completed: 0,
      percent: 0,
      enrolled: false,
      status: "Enrollment required",
      action: "Enroll now →",
      remaining: 12
    },
    {
      track: "lwc",
      href: "course-lwc.html",
      total: 12,
      completed: 0,
      percent: 0,
      enrolled: false,
      status: "Enrollment required",
      action: "Enroll now →",
      remaining: 12
    }
  ],

  // Get complete user data with learning progress
  getCompleteUser: (userId) => {
    const user = developmentSeed.users.find(u => u.id === userId);
    const learning = developmentSeed.learningProgress.find(l => l.userId === userId);
    return { user, learning };
  }
};
