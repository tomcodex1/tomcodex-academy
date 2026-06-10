// Test Data Management System Usage Examples
// Demonstrates how to use the test data management system in various scenarios

import { create, build, buildValid, createValid } from '../registry.js';
import { getScenario } from '../fixtures/common-scenarios.js';
import { developmentSeed } from '../seeds/development-seed.js';
import { 
  resetTestData, 
  getTestData, 
  getAllTestData, 
  createTestScenario,
  createApiResponse,
  createApiError,
  generateRandomTestData,
  validateTestData 
} from '../utils/data-utils.js';
import { config, getFactoryConfig } from '../config.js';

// Example 1: Basic factory usage
export function basicFactoryUsage() {
  console.log('=== Basic Factory Usage ===');

  // Create a single user with default attributes
  const user = build('user');
  console.log('Default user:', user);

  // Create a single tutor user
  const tutor = build('user', { role: 'tutor' });
  console.log('Tutor user:', tutor);

  // Create multiple users
  const users = create('user', 3);
  console.log('Multiple users:', users);

  // Create a valid learning state
  const learningState = buildValid('learning', { selectedDay: 5 });
  console.log('Valid learning state:', learningState);

  // Create multiple valid learning states
  const learningStates = createValid('learning', 3, { selectedDay: 10 });
  console.log('Multiple valid learning states:', learningStates);
}

// Example 2: Using common scenarios
export function commonScenariosUsage() {
  console.log('=== Common Scenarios Usage ===');

  // Get a predefined scenario
  const studentWithProgress = getScenario('studentWithProgress');
  console.log('Student with progress scenario:', studentWithProgress);

  // Create a test scenario with all related data
  const scenario = createTestScenario('tutorWithStudents');
  console.log('Tutor with students scenario:', scenario);

  // Get all scenario names
  const scenarioNames = Object.keys(getScenario());
  console.log('Available scenarios:', scenarioNames);
}

// Example 3: Using seed data
export function seedDataUsage() {
  console.log('=== Seed Data Usage ===');

  // Get all users from seed data
  const allUsers = getAllTestData('user');
  console.log('All users:', allUsers);

  // Get a specific user by ID
  const specificUser = getTestData('user', 'user-tutor-with-students');
  console.log('Specific user:', specificUser);

  // Get complete user data with learning progress
  const completeUser = developmentSeed.getCompleteUser('id-1');
  console.log('Complete user data:', completeUser);
}

// Example 4: Using data utilities
export function dataUtilitiesUsage() {
  console.log('=== Data Utilities Usage ===');

  // Reset test data
  const resetResult = resetTestData();
  console.log('Reset test data:', resetResult);

  // Generate random test data
  const randomData = generateRandomTestData({
    minDays: 1,
    maxDays: 10,
    minTasks: 0,
    maxTasks: 3,
    minHabits: 0,
    maxHabits: 5
  });
  console.log('Random test data:', randomData);

  // Create API response
  const apiResponse = createApiResponse({ success: true, data: randomData });
  console.log('API response:', apiResponse);

  // Create API error
  const apiError = createApiError(404, 'User not found');
  console.log('API error:', apiError);

  // Validate test data
  const validation = validateTestData(randomData, learningSchema);
  console.log('Validation result:', validation);
}

// Example 5: Factory customization
export function factoryCustomizationUsage() {
  console.log('=== Factory Customization Usage ===');

  // Get factory configuration
  const userConfig = getFactoryConfig('user');
  console.log('User factory config:', userConfig);

  // Create a user with custom attributes
  const customUser = build('user', {
    name: 'Custom User',
    email: 'custom@example.com',
    role: 'tutor'
  });
  console.log('Custom user:', customUser);

  // Create a learning state with custom progress
  const customLearning = build('learning', {
    selectedDay: 15,
    completedTasks: { 15: [0, 1, 2, 3] },
    completedHabits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  });
  console.log('Custom learning:', customLearning);
}

// Example 6: Configuration management
export function configurationUsage() {
  console.log('=== Configuration Usage ===');

  // Get current configuration
  const currentConfig = config;
  console.log('Current config:', currentConfig);

  // Get specific configuration sections
  const validationConfig = getValidationConfig();
  console.log('Validation config:', validationConfig);

  const factoryConfig = getFactoryConfig('user');
  console.log('Factory config:', factoryConfig);

  // Update configuration
  const updatedConfig = updateConfig({
    validation: {
      autoValidate: false,
      throwOnValidationError: false
    }
  });
  console.log('Updated config:', updatedConfig);
}

// Example 7: Advanced usage patterns
export function advancedUsagePatterns() {
  console.log('=== Advanced Usage Patterns ===');

  // Create complex test data
  const complexData = {
    users: create('user', 5, { role: 'student' }),
    tutors: create('user', 2, { role: 'tutor' }),
    learningStates: create('learning', 7),
    scenarios: [
      createTestScenario('studentWithProgress'),
      createTestScenario('advancedStudent'),
      createTestScenario('newStudent')
    ]
  };
  console.log('Complex test data:', complexData);

  // Create API responses with test data
  const apiResponses = {
    success: createApiResponse(complexData),
    error: createApiError(500, 'Internal server error')
  };
  console.log('API responses:', apiResponses);

  // Validate all generated data
  const validations = {
    users: complexData.users.map(user => validateTestData(user, userSchema)),
    learningStates: complexData.learningStates.map(state => validateTestData(state, learningSchema))
  };
  console.log('Validation results:', validations);
}

// Example 8: Integration with testing frameworks
export function testingFrameworkIntegration() {
  console.log('=== Testing Framework Integration ===');

  // Example of how to use in Jest tests
  const mockUser = build('user', { role: 'student' });
  const mockLearning = build('learning', { selectedDay: 5 });

  // Mock localStorage
  const mockLocalStorage = {
    storage: {},
    getItem: jest.fn(key => mockLocalStorage.storage[key] || null),
    setItem: jest.fn((key, value) => { mockLocalStorage.storage[key] = String(value); }),
    removeItem: jest.fn(key => { delete mockLocalStorage.storage[key]; }),
    clear: jest.fn(() => Object.keys(mockLocalStorage.storage).forEach((key) => delete mockLocalStorage.storage[key]))
  };

  // Mock API response
  const mockApi = {
    getUser: jest.fn(() => Promise.resolve(createApiResponse(mockUser))),
    getLearning: jest.fn(() => Promise.resolve(createApiResponse(mockLearning)))
  };

  console.log('Mock user:', mockUser);
  console.log('Mock learning:', mockLearning);
  console.log('Mock localStorage:', mockLocalStorage);
  console.log('Mock API:', mockApi);
}

// Run all examples
export function runAllExamples() {
  basicFactoryUsage();
  commonScenariosUsage();
  seedDataUsage();
  dataUtilitiesUsage();
  factoryCustomizationUsage();
  configurationUsage();
  advancedUsagePatterns();
  testingFrameworkIntegration();
}

// Export individual examples for selective use
export default {
  basicFactoryUsage,
  commonScenariosUsage,
  seedDataUsage,
  dataUtilitiesUsage,
  factoryCustomizationUsage,
  configurationUsage,
  advancedUsagePatterns,
  testingFrameworkIntegration,
  runAllExamples
};
