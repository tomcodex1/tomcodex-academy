# Salesforce Master Dashboard Testing Guide

This document provides an overview of the testing strategy and setup for the Salesforce Master Dashboard project.

## Testing Strategy

Our testing strategy follows a multi-layered approach to ensure comprehensive test coverage:

1. **Unit Testing**: Tests individual functions and components in isolation
2. **Integration Testing**: Tests interactions between components
3. **Performance Testing**: Ensures the application performs well under various conditions
4. **Error Handling Testing**: Verifies graceful error handling
5. **End-to-End Testing**: Tests complete user workflows

## Test Structure

`tests/hosted-auth.test.js` covers hosted student signup, duplicate prevention, login, signed sessions, password reset, progress persistence, tutor login, and tutor student tracking.

```
tests/
├── learning-service.test.js      # Unit tests for business logic
├── ui-components.test.js         # Unit tests for UI components
├── integration.test.js          # Integration tests
├── performance.test.js          # Performance tests
└── error-handling.test.js      # Error handling tests

cypress/
├── integration/
│   └── dashboard.spec.js       # End-to-end tests
├── support/
│   ├── e2e.js                  # E2E test setup and utilities
│   └── commands.js              # Custom Cypress commands
└── config.js                   # Cypress configuration
```

## Running Tests

### Unit Tests

Run all unit tests:
```bash
npm test
```

Run unit tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

### End-to-End Tests

Install Cypress and run tests:
```bash
npx cypress open
```

Run tests from command line:
```bash
npx cypress run
```

Run specific test file:
```bash
npx cypress run --spec "cypress/integration/dashboard.spec.js"
```

## Writing Tests

### Unit Tests

When writing unit tests:

1. Test business logic in isolation
2. Mock external dependencies (localStorage, DOM, etc.)
3. Focus on expected behavior for given inputs
4. Test edge cases and error scenarios

Example:
```javascript
describe('LearningService', () => {
  let mockLocalStorage;
  let mockDaysProvider;
  let learningService;

  beforeEach(() => {
    // Setup mocks
    mockLocalStorage = { /* mock implementation */ };
    mockDaysProvider = { /* mock implementation */ };
    learningService = new LearningService(mockLocalStorage, mockDaysProvider);
  });

  test('should initialize with default state', () => {
    expect(learningService.state).toEqual({
      selectedDay: 1,
      activeTab: "dashboard",
      // ... other default properties
    });
  });
});
```

### Integration Tests

When writing integration tests:

1. Test interactions between components
2. Verify data flow between UI and business logic
3. Test complete workflows
4. Verify state persistence

Example:
```javascript
describe('Dashboard Integration Tests', () => {
  test('should update all components when day changes', () => {
    // Setup
    learningService.state.selectedDay = 1;
    renderComponents();

    // Action
    document.getElementById('nextDayBtn').click();

    // Verify
    expect(learningService.state.selectedDay).toBe(2);
    expect(document.getElementById('todayTitle').textContent).toContain('Stage 2');
  });
});
```

### End-to-End Tests

When writing E2E tests:

1. Test user workflows from start to finish
2. Use realistic data and scenarios
3. Test both happy paths and error scenarios
4. Use custom commands for common actions

Example:
```javascript
describe('User Workflow Tests', () => {
  it('should complete daily learning tasks', () => {
    // Login
    cy.loginAsStudent('test@example.com', 'password123');

    // Navigate to a specific day
    cy.navigateToDay(5);

    // Complete tasks
    cy.completeTask(0);
    cy.completeTask(1);

    // Verify progress
    cy.verifyTaskCompletion(0, true);
    cy.verifyTaskCompletion(1, true);
  });
});
```

## Code Coverage

We aim for high code coverage across all test types. Coverage reports are generated with:

```bash
npm run test:coverage
```

The coverage report is available in the `coverage/` directory. We should aim for:

- Unit tests: 90%+ coverage
- Integration tests: 80%+ coverage of critical workflows
- E2E tests: 100% coverage of critical user journeys

## Continuous Integration

Jest tests are automatically run on every push and pull request through GitHub Actions. The CI pipeline:

1. Installs dependencies
2. Runs unit, component, integration, performance, and error-handling Jest suites
3. Generates a coverage report
4. Uploads coverage to Codecov

Cypress E2E tests are currently run locally with `npm run test:e2e`. Add Cypress and its supporting plugins to `devDependencies` before enabling E2E execution in CI.

## Performance Testing

Performance tests ensure the application remains responsive:

1. Dashboard rendering should complete in <100ms
2. Large datasets should be handled efficiently
3. Frequent state updates should not cause performance degradation
4. Memory usage should remain stable over time

## Error Handling Testing

Error handling tests verify graceful degradation:

1. Invalid localStorage data should be handled
2. Missing DOM elements should not break the application
3. Network errors should be handled gracefully
4. Invalid user input should be handled properly

## Best Practices

1. **Test-Driven Development**: Write tests before implementing features
2. **AAA Pattern**: Arrange, Act, Assert for clear test structure
3. **Descriptive Names**: Use clear, descriptive test names
4. **One Assertion per Test**: Focus tests on a single behavior
5. **Isolation**: Keep tests independent of each other
6. **Mocking**: Mock external dependencies to ensure test isolation
7. **Data Management**: Use factories or fixtures for test data
8. **Regular Updates**: Update tests when code changes

## Debugging Tests

When tests fail:

1. Check the error message for clues
2. Use console.log statements to understand test flow
3. Verify mocks are configured correctly
4. Check for timing issues in async tests
5. Use Cypress's debugging tools for E2E tests

## Future Improvements

1. Add visual regression testing
2. Implement contract testing for APIs
3. Add accessibility testing
4. Implement property-based testing for edge cases
5. Add more comprehensive performance testing
