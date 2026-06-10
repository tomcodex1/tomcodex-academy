// Test Data Registry
// Central management for all test data factories and fixtures

import { UserFactory } from './factories/user-factory.js';
import { LearningFactory } from './factories/learning-factory.js';

// Factory instances
export const factories = {
  user: new UserFactory(),
  learning: new LearningFactory()
  // Add more factories as needed
};

// Convenience methods for creating test data
export const create = (type, count = 1, attributes = {}) => {
  return factories[type].create(count, attributes);
};

export const build = (type, attributes = {}) => {
  return factories[type].build(attributes);
};

export const buildValid = (type, attributes = {}) => {
  return factories[type].buildValid(attributes);
};

export const createValid = (type, count = 1, attributes = {}) => {
  return factories[type].createValid(count, attributes);
};

// Helper to get all registered factory types
export const getFactoryTypes = () => {
  return Object.keys(factories);
};

// Helper to check if a factory type exists
export const hasFactory = (type) => {
  return factories.hasOwnProperty(type);
};

// Example usage:
// import { create, build, buildValid, createValid } from './registry.js';
//
// // Create a single user with default attributes
// const user = build('user');
//
// // Create a single tutor user
// const tutor = build('user', { role: 'tutor' });
//
// // Create multiple users
// const users = create('user', 3);
//
// // Create a valid learning state
// const learningState = buildValid('learning', { selectedDay: 5 });
