// Custom Cypress commands for the Salesforce Master Dashboard

// Add custom commands for authentication
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

// Add custom commands for task management
Cypress.Commands.add('completeTask', (taskIndex) => {
  cy.get('.today-check').eq(taskIndex).check();
});

Cypress.Commands.add('completeHabit', (habitIndex) => {
  cy.get('.habit-check').eq(habitIndex).check();
});

// Add custom commands for navigation
Cypress.Commands.add('navigateToDay', (day) => {
  cy.get('#daySelect').select(day);
});

Cypress.Commands.add('generateNextStage', () => {
  cy.get('#nextDayBtn').click();
});

// Add custom commands for data verification
Cypress.Commands.add('verifyTaskCompletion', (taskIndex, shouldBeCompleted) => {
  cy.get('.today-check').eq(taskIndex).should(shouldBeCompleted ? 'be.checked' : 'not.be.checked');
});

Cypress.Commands.add('verifyHabitCompletion', (habitIndex, shouldBeCompleted) => {
  cy.get('.habit-check').eq(habitIndex).should(shouldBeCompleted ? 'be.checked' : 'not.be.checked');
});

Cypress.Commands.add('verifyDayContent', (dayNumber, expectedTitle) => {
  cy.get('#todayTitle').should('contain', `Stage ${dayNumber}`);
  cy.get('#todayTitle').should('contain', expectedTitle);
});

// Add custom commands for API mocking
Cypress.Commands.add('mockApiCall', (endpoint, response) => {
  cy.intercept('GET', endpoint, response).as('apiCall');
});

Cypress.Commands.add('mockFailedApiCall', (endpoint) => {
  cy.intercept('GET', endpoint, { forceNetworkError: true }).as('failedApiCall');
});

// Add custom commands for waiting
Cypress.Commands.add('waitForDataLoad', () => {
  cy.get('.stat-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
});

// Add custom commands for screenshots
Cypress.Commands.add('takeScreenshot', (name) => {
  cy.screenshot(`${name}-${new Date().getTime()}`);
});

// Add custom commands for testing error states
Cypress.Commands.add('simulateError', (selector, errorMessage) => {
  cy.get(selector).invoke('text', errorMessage).trigger('error');
});
