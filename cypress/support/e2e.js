// Import commands.js from the support directory
import './commands.js'

// Import and register global Cypress utilities
import '@cypress/grep'

// Add custom commands for our application
Cypress.Commands.add('loginAsStudent', (email, password) => {
  cy.visit('/index.html');
  cy.get('#studentSignInEmail').type(email);
  cy.get('#studentSignInPassword').type(password);
  cy.get('#studentSignInForm').submit();
});

Cypress.Commands.add('loginAsTutor', (email, accessCode) => {
  cy.visit('/index.html?tutor=required');
  cy.get('#tutorEmail').type(email);
  cy.get('#tutorAccessCode').type(accessCode);
  cy.get('#tutorLoginPanel').submit();
});

Cypress.Commands.add('completeTask', (taskIndex) => {
  cy.get('.today-check').eq(taskIndex).check();
});

Cypress.Commands.add('completeHabit', (habitIndex) => {
  cy.get('.habit-check').eq(habitIndex).check();
});

Cypress.Commands.add('navigateToDay', (day) => {
  cy.get('#daySelect').select(day);
});

Cypress.Commands.add('generateNextStage', () => {
  cy.get('#nextDayBtn').click();
});

// Set up global test data
const testData = {
  student: {
    email: 'test@example.com',
    password: 'Test1234'
  },
  tutor: {
    email: 'tutor@example.com',
    accessCode: '123456'
  }
};

// Export test data for use in tests
export { testData };

// Set up global before/after hooks
before(() => {
  // Global setup before all tests
  cy.log('Starting test suite');
});

after(() => {
  // Global cleanup after all tests
  cy.log('Test suite completed');
});

beforeEach(() => {
  // Setup before each test
  cy.session('user-session', () => {
    // Common setup for each test
  });
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  return false;
});
