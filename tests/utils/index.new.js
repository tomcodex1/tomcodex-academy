// Custom Test Utilities - Main Entry Point
// Provides a unified interface for accessing all custom test utilities

// Import core testing utilities
import { DOMTestUtils } from './dom-test-utils.js';
import { ComponentTestUtils } from './component-test-utils.js';
import { MockUtils } from './mock-utils.js';
import { APIMockUtils } from './api-mock-utils.js';
import { BusinessLogicTestUtils } from './business-logic-test-utils.js';
import { PerformanceTestUtils } from './performance-test-utils.js';
import { TestIsolation, withIsolation, createIsolatedSuite, globalIsolation } from './test-isolation.js';

// Export all testing utilities
export {
  // DOM testing utilities
  DOMTestUtils,
  ComponentTestUtils,

  // Mocking utilities
  MockUtils,
  APIMockUtils,

  // Business logic testing utilities
  BusinessLogicTestUtils,

  // Performance testing utilities
  PerformanceTestUtils,

  // Test isolation utilities
  TestIsolation,
  withIsolation,
  createIsolatedSuite,
  globalIsolation
};

// Export convenience classes
export const DOM = DOMTestUtils;
export const Component = ComponentTestUtils;
export const Mock = MockUtils;
export const APIMock = APIMockUtils;
export const BusinessLogic = BusinessLogicTestUtils;
export const Performance = PerformanceTestUtils;
export const Isolation = TestIsolation;

// Default export
export default {
  // DOM testing utilities
  DOMTestUtils,
  ComponentTestUtils,

  // Mocking utilities
  MockUtils,
  APIMockUtils,

  // Business logic testing utilities
  BusinessLogicTestUtils,

  // Performance testing utilities
  PerformanceTestUtils,

  // Test isolation utilities
  TestIsolation,
  withIsolation,
  createIsolatedSuite,
  globalIsolation,

  // Convenience classes
  DOM,
  Component,
  Mock,
  APIMock,
  BusinessLogic,
  Performance,
  Isolation
};

// Example usage:
// import { DOM, Mock, BusinessLogic, Isolation } from './tests/utils';
//
// // Test DOM interactions
// await DOM.click(element);
// await DOM.fillInput(input, 'test value');
//
// // Mock API responses
// Mock.setupAPI(mockResponses);
//
// // Test business logic
// BusinessLogic.testLearningProgress(service, testData);
//
// // Create isolated test
// const test = withIsolation(function() {
//   // Test code here
// });
