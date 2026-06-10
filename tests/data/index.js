// Test Data Management System - Main Entry Point
// Provides a unified interface for accessing all test data management functionality

// Import core components
import { factories, create, build, buildValid, createValid, getFactoryTypes, hasFactory } from './registry.js';
import { commonScenarios, getScenario, getScenarioNames } from './fixtures/common-scenarios.js';
import { developmentSeed } from './seeds/development-seed.js';
import { 
  resetTestData, 
  getTestData, 
  getAllTestData, 
  createTestScenario,
  createApiResponse,
  createApiError,
  generateRandomTestData,
  validateTestData,
  cleanupTestData
} from './utils/data-utils.js';
import { config, getFactoryConfig, getValidationConfig, getFixtureConfig, getSeedConfig, getUtilityConfig, getLoggingConfig, updateConfig } from './config.js';
import { learningSchema, missionSchema, habitProgressSchema, todayProgressSchema, statsSchema } from './schemas/learning-schema.js';
import { userSchema, learningTrackSchema, learningProgressSchema } from './schemas/user-schema.js';

// Export factories
export {
  factories,
  create,
  build,
  buildValid,
  createValid,
  getFactoryTypes,
  hasFactory
};

// Export fixtures
export {
  commonScenarios,
  getScenario,
  getScenarioNames
};

// Export seeds
export {
  developmentSeed
};

// Export utilities
export {
  resetTestData,
  getTestData,
  getAllTestData,
  createTestScenario,
  createApiResponse,
  createApiError,
  generateRandomTestData,
  validateTestData,
  cleanupTestData
};

// Export configuration
export {
  config,
  getFactoryConfig,
  getValidationConfig,
  getFixtureConfig,
  getSeedConfig,
  getUtilityConfig,
  getLoggingConfig,
  updateConfig
};

// Export validation schemas
export {
  learningSchema,
  missionSchema,
  habitProgressSchema,
  todayProgressSchema,
  statsSchema,
  userSchema,
  learningTrackSchema,
  learningProgressSchema
};

// Convenience exports for commonly used items
export const UserFactory = factories.user;
export const LearningFactory = factories.learning;

// Default export
export default {
  // Factories
  factories,
  create,
  build,
  buildValid,
  createValid,
  getFactoryTypes,
  hasFactory,
  UserFactory,
  LearningFactory,

  // Fixtures
  commonScenarios,
  getScenario,
  getScenarioNames,

  // Seeds
  developmentSeed,

  // Utilities
  resetTestData,
  getTestData,
  getAllTestData,
  createTestScenario,
  createApiResponse,
  createApiError,
  generateRandomTestData,
  validateTestData,
  cleanupTestData,

  // Configuration
  config,
  getFactoryConfig,
  getValidationConfig,
  getFixtureConfig,
  getSeedConfig,
  getUtilityConfig,
  getLoggingConfig,
  updateConfig,

  // Validation schemas
  learningSchema,
  missionSchema,
  habitProgressSchema,
  todayProgressSchema,
  statsSchema,
  userSchema,
  learningTrackSchema,
  learningProgressSchema
};

// Example usage:
// import testData from './tests/data';
//
// // Create a user
// const user = testData.build('user', { role: 'tutor' });
//
// // Get a common scenario
// const scenario = testData.getScenario('studentWithProgress');
//
// // Generate random test data
// const randomData = testData.generateRandomTestData({
//   minDays: 1,
//   maxDays: 10,
//   minTasks: 0,
//   maxTasks: 3,
//   minHabits: 0,
//   maxHabits: 5
// });
