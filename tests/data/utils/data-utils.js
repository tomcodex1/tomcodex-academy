// Test Data Utilities
// Helper functions for managing test data

import { developmentSeed } from '../seeds/development-seed.js';
import { getScenario } from '../fixtures/common-scenarios.js';

// Utility to reset test data to initial state
export const resetTestData = () => {
  // In a real implementation, this would reset databases, localStorage, etc.
  // For now, we'll just return a confirmation
  return { status: 'reset', timestamp: new Date().toISOString() };
};

// Utility to get test data by type and ID
export const getTestData = (type, id) => {
  switch (type) {
    case 'user':
      return developmentSeed.users.find(user => user.id === id);
    case 'learning':
      return developmentSeed.learningProgress.find(learning => learning.userId === id);
    case 'track':
      return developmentSeed.learningTracks.find(track => track.track === id);
    default:
      throw new Error(`Unknown data type: ${type}`);
  }
};

// Utility to get all test data of a specific type
export const getAllTestData = (type) => {
  switch (type) {
    case 'user':
      return developmentSeed.users;
    case 'learning':
      return developmentSeed.learningProgress;
    case 'track':
      return developmentSeed.learningTracks;
    default:
      throw new Error(`Unknown data type: ${type}`);
  }
};

// Utility to create a test scenario with all related data
export const createTestScenario = (scenarioName) => {
  const scenario = getScenario(scenarioName);

  // Add IDs to scenario data if they don't exist
  if (!scenario.user.id) {
    scenario.user.id = `user-${scenarioName}`;
  }

  if (scenario.learning && !scenario.learning.userId) {
    scenario.learning.userId = scenario.user.id;
  }

  if (scenario.students) {
    scenario.students.forEach((student, index) => {
      if (!student.id) {
        student.id = `student-${scenarioName}-${index}`;
      }
    });
  }

  return scenario;
};

// Utility to simulate API responses with test data
export const createApiResponse = (data, status = 200, statusText = 'OK') => {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    headers: {
      get: (name) => {
        const headers = {
          'content-type': 'application/json'
        };
        return headers[name] || null;
      }
    },
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  };
};

// Utility to simulate API errors
export const createApiError = (status, message, statusText = 'Error') => {
  return {
    ok: false,
    status,
    statusText,
    headers: {
      get: () => null
    },
    json: () => Promise.reject(new Error(message)),
    text: () => Promise.resolve(JSON.stringify({ error: message }))
  };
};

// Utility to generate random test data within constraints
export const generateRandomTestData = (constraints) => {
  const { 
    minDays = 1, 
    maxDays = 36, 
    minTasks = 0, 
    maxTasks = 5, 
    minHabits = 0, 
    maxHabits = 10 
  } = constraints;

  const selectedDay = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
  const tasksCompleted = Array.from({ length: Math.floor(Math.random() * (maxTasks - minTasks + 1)) + minTasks }, (_, i) => i);
  const habitsCompleted = Array.from({ length: Math.floor(Math.random() * (maxHabits - minHabits + 1)) + minHabits }, (_, i) => i);

  return {
    selectedDay,
    completedTasks: { [selectedDay]: tasksCompleted },
    completedHabits: habitsCompleted
  };
};

// Utility to validate test data matches expected schema
export const validateTestData = (data, schema) => {
  try {
    schema.parse(data);
    return { valid: true, errors: [] };
  } catch (error) {
    return { 
      valid: false, 
      errors: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    };
  }
};

// Utility to clean up test data
export const cleanupTestData = () => {
  // In a real implementation, this would clean up databases, localStorage, etc.
  // For now, we'll just return a confirmation
  return { status: 'cleaned', timestamp: new Date().toISOString() };
};
