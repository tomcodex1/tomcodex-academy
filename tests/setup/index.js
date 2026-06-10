// Test Environment Setup - Main Entry Point
// Provides a unified interface for accessing all test environment setup functionality

// Import core test environment components
import { TestEnvironment } from './test-environment.js';
import { testConfig, getConfig, updateConfig, getSection, isFeatureEnabled } from './config.js';

// Export test environment class
export { TestEnvironment };

// Export configuration
export {
  testConfig,
  getConfig,
  updateConfig,
  getSection,
  isFeatureEnabled
};

// Export default configuration
export default {
  TestEnvironment,
  testConfig,
  getConfig,
  updateConfig,
  getSection,
  isFeatureEnabled
};

// Example usage:
// import { TestEnvironment, getConfig } from './tests/setup';
//
// // Create test environment
// const env = new TestEnvironment();
// await env.setup();
//
// // Get configuration
// const config = getConfig();
//
// // Run tests with environment
// try {
//   // Test code here
// } finally {
//   await env.teardown();
// }
