// End-to-end tests for the Salesforce Master Dashboard
describe('Salesforce Master Dashboard', () => {
  beforeEach(() => {
    // Intercept login request
    cy.intercept('POST', '/api/student-login').as('loginReq');

    // Visit dashboard first to check if we are already logged in
    cy.visit('http://localhost:3000/learner-dashboard');
    
    // Check if we were redirected to access.html
    cy.url().then((url) => {
      if (url.includes('access.html')) {
        // We are on access.html, meaning we need to login or sign up
        cy.get('#studentSignInEmail').clear().type('cypress-test@tomcodex.com');
        cy.get('#studentSignInPassword').clear().type('Cypress123!');
        cy.get('#studentSignInForm').submit();
        
        cy.wait('@loginReq').then((interception) => {
          if (interception.response.statusCode !== 200) {
            // Sign up instead if login fails
            cy.get('[data-student-tab="signup"]').click();
            cy.get('#studentName').clear().type('Test Student');
            cy.get('#studentSignUpEmail').clear().type('cypress-test@tomcodex.com');
            cy.get('#studentSignUpPassword').clear().type('Cypress123!');
            cy.get('#studentSignUpForm').submit();
          }
        });
        
        // Ensure we end up on learner-dashboard
        cy.url().should('include', 'learner-dashboard');
      }
    });

    // Reset localStorage day progress to 1 so tests have a clean initial state
    cy.window().then((win) => {
      const key = "salesforceMasterDashboard.v1";
      const state = {
        selectedDay: 1,
        activeTab: "dashboard",
        completedTasks: {},
        completedHabits: [],
        generatedStages: []
      };
      win.localStorage.setItem(key, JSON.stringify(state));
      // Flush the sync to make sure it's saved on the server
      if (win.TomCodexLearnerSync) {
        return win.TomCodexLearnerSync.flush();
      }
    });

    // Re-visit learner-dashboard to load the reset state
    cy.visit('http://localhost:3000/learner-dashboard');

    // Make sure the dashboard tab is active at the start of every test
    cy.get('[data-tab-target="dashboard"]').click();
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

  it('should navigate to roadmap tab', () => {
    // Click roadmap tab
    cy.get('[data-tab-target="roadmap"]').click();

    // Verify roadmap tab is active
    cy.get('[data-tab-target="roadmap"]').should('have.class', 'active');
    cy.get('[data-tab-panel="roadmap"]').should('not.be.hidden');
  });

  it('should generate new stage when reaching last day', () => {
    // Ensure dashboard tab is active
    cy.get('[data-tab-target="dashboard"]').click();

    // Navigate to the last day (36)
    cy.get('#daySelect').select('36');

    // Click next day button to generate new stage
    cy.get('#nextDayBtn').click();

    // Verify new stage was created
    cy.get('#daySelect').should('have.value', '37');
    cy.get('#nextDayBtn').should('contain', 'topic');
  });

  it('should complete habits', () => {
    // Ensure practice tab is active
    cy.get('[data-tab-target="practice"]').click();

    // Check a habit checkbox
    cy.get('.habit-check').first().check();

    // Verify habit is marked as done
    cy.get('.task-item').should('have.class', 'done');
  });

  it('should handle errors gracefully', () => {
    // Ensure trainer tab is active
    cy.get('[data-tab-target="trainer"]').click();

    // Type a doubt first to satisfy validation
    cy.get('#doubtInput').clear().type('What is an Org?');

    // Simulate a network error
    cy.intercept('POST', '/api/*', { forceNetworkError: true });

    // Try to perform an action that requires API
    cy.get('#askTrainerBtn').click();

    // Verify error message is displayed
    cy.contains('Zentom AI is offline').should('exist');
  });

  it('should persist state across page reloads', () => {
    // Ensure dashboard tab is active
    cy.get('[data-tab-target="dashboard"]').click();

    // Complete a task
    cy.get('.today-check').first().check();

    // Reload the page
    cy.reload();

    // Re-verify on the correct tab
    cy.get('[data-tab-target="dashboard"]').click();

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
