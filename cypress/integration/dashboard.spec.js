// End-to-end tests for the Salesforce Master Dashboard
describe('Salesforce Master Dashboard', () => {
  beforeEach(() => {
    // Visit the dashboard before each test
    cy.visit('http://localhost:3000');
  });

  it('should display dashboard with correct initial state', () => {
    // Verify main components are present
    cy.get('#statsGrid').should('exist');
    cy.get('#todayTasks').should('exist');
    cy.get('#habitTracker').should('exist');

    // Verify initial day is selected
    cy.get('#daySelect').should('have.value', '1');

    // Verify stats are displayed
    cy.get('.stat-card').should('have.length', 4);
    cy.contains('Pathways').should('exist');
    cy.contains('24+').should('exist');
  });

  it('should navigate to next day', () => {
    // Click next day button
    cy.get('#nextDayBtn').click();

    // Verify day changed
    cy.get('#daySelect').should('have.value', '2');
    cy.get('#todayTitle').should('contain', 'Stage 2');
    cy.get('#todayTitle').should('contain', 'Objects & Fields');

    // Verify stats updated
    cy.get('.stat-card').eq(2).should('contain', 'Stage 2');
  });

  it('should complete a task', () => {
    // Find and check a task checkbox
    cy.get('.today-check').first().check();

    // Verify task is marked as done
    cy.get('.task-item').first().should('have.class', 'done');
  });

  it('should navigate to analytics tab', () => {
    // Click analytics tab
    cy.get('[data-tab-target="analytics"]').click();

    // Verify analytics tab is active
    cy.get('[data-tab-target="analytics"]').should('have.class', 'active');
    cy.get('[data-tab-panel="analytics"]').should('not.be.hidden');
  });

  it('should generate new stage when reaching last day', () => {
    // Navigate to the last day (36)
    cy.get('#daySelect').select('36');

    // Click next day button to generate new stage
    cy.get('#nextDayBtn').click();

    // Verify new stage was created
    cy.get('#daySelect').should('have.value', '37');
    cy.get('#nextDayBtn').should('contain', 'Next topic');
  });

  it('should complete habits', () => {
    // Check a habit checkbox
    cy.get('.habit-check').first().check();

    // Verify habit is marked as done
    cy.get('.task-item').should('have.class', 'done');
  });

  it('should handle errors gracefully', () => {
    // Simulate a network error
    cy.intercept('POST', '/api/*', { forceNetworkError: true });

    // Try to perform an action that requires API
    cy.get('#askTrainerBtn').click();

    // Verify error message is displayed
    cy.contains('Zentom AI is offline').should('exist');
  });

  it('should persist state across page reloads', () => {
    // Complete a task
    cy.get('.today-check').first().check();

    // Reload the page
    cy.reload();

    // Verify task is still completed
    cy.get('.task-item').first().should('have.class', 'done');
  });

  it('should display skill meters correctly', () => {
    // Verify skill meters are displayed
    cy.get('#skillMeters').should('exist');

    // Verify each skill meter has a label and percentage
    cy.get('#skillMeters .meter-label').should('have.length', 7);
    cy.get('#skillMeters .meter-fill').should('have.length', 7);
  });

  it('should display daily checklist', () => {
    // Verify daily checklist is displayed
    cy.get('#dailyChecklist').should('exist');

    // Verify each checklist item is displayed
    cy.get('#dailyChecklist div').should('have.length', 6);
  });

  it('should display study blocks', () => {
    // Verify study blocks are displayed
    cy.get('#studyBlocks').should('exist');

    // Verify each study block is displayed
    cy.get('#studyBlocks div').should('have.length', 6);
  });
});
