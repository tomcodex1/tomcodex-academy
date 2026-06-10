// TDD Templates - Main Entry Point
// Provides a unified interface for accessing all TDD templates

// Import TDD templates
import { createComponentTDDTemplate } from './component-tdd-template.js';
import { createServiceTDDTemplate } from './service-tdd-template.js';
import { createUtilityTDDTemplate } from './utility-tdd-template.js';

// Export all TDD templates
export {
  createComponentTDDTemplate,
  createServiceTDDTemplate,
  createUtilityTDDTemplate
};

// Export convenience functions
export const createTemplate = (type, name) => {
  switch (type) {
    case 'component':
      return createComponentTDDTemplate(name);
    case 'service':
      return createServiceTDDTemplate(name);
    case 'utility':
      return createUtilityTDDTemplate(name);
    default:
      throw new Error(`Unknown template type: ${type}`);
  }
};

// Default export
export default {
  createComponentTDDTemplate,
  createServiceTDDTemplate,
  createUtilityTDDTemplate,
  createTemplate
};

// Example usage:
// import { createTemplate } from './tests/templates';
//
// // Create a component test template
// const componentTest = createTemplate('component', 'MyComponent');
//
// // Create a service test template
// const serviceTest = createTemplate('service', 'MyService');
//
// // Create a utility test template
// const utilityTest = createTemplate('utility', 'myUtility');
