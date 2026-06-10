// Business Logic Testing Utilities
// Provides specialized utilities for testing business logic and application state

import { create, build } from '../data/index.js';

export class BusinessLogicTestUtils {
  // Test learning service progress tracking
  static testLearningProgress(service, testData) {
    // Initialize service with test data
    const learningData = build('learning', testData);

    // Test progress calculation
    const progress = service.calculateProgress(learningData);
    expect(progress).toBeDefined();
    expect(typeof progress).toBe('number');
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(100);

    // Test task completion
    const taskCompletion = service.calculateTaskCompletion(learningData);
    expect(taskCompletion).toBeDefined();
    expect(typeof taskCompletion).toBe('number');
    expect(taskCompletion).toBeGreaterThanOrEqual(0);
    expect(taskCompletion).toBeLessThanOrEqual(100);

    // Test habit completion
    const habitCompletion = service.calculateHabitCompletion(learningData);
    expect(habitCompletion).toBeDefined();
    expect(typeof habitCompletion).toBe('number');
    expect(habitCompletion).toBeGreaterThanOrEqual(0);
    expect(habitCompletion).toBeLessThanOrEqual(100);

    return { progress, taskCompletion, habitCompletion };
  }

  // Test authentication logic
  static testAuthentication(authService, testData) {
    // Test login with valid credentials
    const loginResult = authService.login(testUser.validCredentials);
    expect(loginResult).toBeDefined();
    expect(loginResult.success).toBe(true);
    expect(loginResult.token).toBeDefined();

    // Test login with invalid credentials
    const invalidLogin = authService.login(testUser.invalidCredentials);
    expect(invalidLogin).toBeDefined();
    expect(invalidLogin.success).toBe(false);
    expect(invalidLogin.error).toBeDefined();

    // Test token validation
    const tokenValidation = authService.validateToken(loginResult.token);
    expect(tokenValidation).toBeDefined();
    expect(tokenValidation.valid).toBe(true);
    expect(tokenValidation.user).toBeDefined();

    // Test token expiration
    const expiredToken = authService.validateToken(testUser.expiredToken);
    expect(expiredToken).toBeDefined();
    expect(expiredToken.valid).toBe(false);
    expect(expiredToken.error).toBeDefined();

    return {
      loginSuccess: loginResult,
      loginFailure: invalidLogin,
      tokenValid: tokenValidation,
      tokenExpired: expiredToken
    };
  }

  // Test habit tracking logic
  static testHabitTracking(habitService, testData) {
    // Test habit creation
    const createdHabit = habitService.createHabit(testData.habitData);
    expect(createdHabit).toBeDefined();
    expect(createdHabit.id).toBeDefined();
    expect(createdHabit.name).toBe(testData.habitData.name);

    // Test habit completion
    const completedHabit = habitService.completeHabit(createdHabit.id);
    expect(completedHabit).toBeDefined();
    expect(completedHabit.completed).toBe(true);
    expect(completedHabit.completedAt).toBeDefined();

    // Test habit streak calculation
    const streak = habitService.calculateStreak(createdHabit.id);
    expect(streak).toBeDefined();
    expect(typeof streak).toBe('number');
    expect(streak).toBeGreaterThanOrEqual(0);

    // Test habit reset
    const resetHabit = habitService.resetHabit(createdHabit.id);
    expect(resetHabit).toBeDefined();
    expect(resetHabit.completed).toBe(false);
    expect(resetHabit.completedAt).toBeNull();
    expect(resetHabit.streak).toBe(0);

    return {
      createdHabit,
      completedHabit,
      streak,
      resetHabit
    };
  }

  // Test task management logic
  static testTaskManagement(taskService, testData) {
    // Test task creation
    const createdTask = taskService.createTask(testData.taskData);
    expect(createdTask).toBeDefined();
    expect(createdTask.id).toBeDefined();
    expect(createdTask.title).toBe(testData.taskData.title);

    // Test task completion
    const completedTask = taskService.completeTask(createdTask.id);
    expect(completedTask).toBeDefined();
    expect(completedTask.completed).toBe(true);
    expect(completedTask.completedAt).toBeDefined();

    // Test task progress calculation
    const progress = taskService.calculateProgress([createdTask]);
    expect(progress).toBeDefined();
    expect(typeof progress).toBe('number');
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(100);

    // Test task reset
    const resetTask = taskService.resetTask(createdTask.id);
    expect(resetTask).toBeDefined();
    expect(resetTask.completed).toBe(false);
    expect(resetTask.completedAt).toBeNull();

    return {
      createdTask,
      completedTask,
      progress,
      resetTask
    };
  }

  // Test dashboard data aggregation
  static testDashboardAggregation(dashboardService, testData) {
    // Test user stats aggregation
    const userStats = dashboardService.getUserStats(testData.userId);
    expect(userStats).toBeDefined();
    expect(userStats.totalDays).toBeDefined();
    expect(userStats.completedDays).toBeDefined();
    expect(userStats.currentStreak).toBeDefined();
    expect(userStats.longestStreak).toBeDefined();

    // Test progress visualization data
    const progressData = dashboardService.getProgressData(testData.userId);
    expect(progressData).toBeDefined();
    expect(progressData.labels).toBeDefined();
    expect(progressData.datasets).toBeDefined();
    expect(Array.isArray(progressData.labels)).toBe(true);
    expect(Array.isArray(progressData.datasets)).toBe(true);

    // Test achievement calculation
    const achievements = dashboardService.calculateAchievements(testData.userId);
    expect(achievements).toBeDefined();
    expect(Array.isArray(achievements)).toBe(true);

    return {
      userStats,
      progressData,
      achievements
    };
  }

  // Test stage generation logic
  static testStageGeneration(stageService, testData) {
    // Test custom stage generation
    const customStage = stageService.generateCustomStage(testData.stageData);
    expect(customStage).toBeDefined();
    expect(customStage.day).toBeDefined();
    expect(customStage.title).toBeDefined();
    expect(customStage.description).toBeDefined();
    expect(customStage.practice).toBeDefined();

    // Test stage validation
    const isValid = stageService.validateStage(customStage);
    expect(isValid).toBeDefined();
    expect(typeof isValid).toBe('boolean');

    // Test stage progression
    const progression = stageService.calculateProgression(testData.userId);
    expect(progression).toBeDefined();
    expect(progression.currentStage).toBeDefined();
    expect(progression.nextStage).toBeDefined();
    expect(progression.progress).toBeDefined();

    return {
      customStage,
      isValid,
      progression
    };
  }

  // Test AI evaluation logic
  static testAIEvaluation(aiService, testData) {
    // Test code evaluation
    const evaluation = aiService.evaluateCode(testData.codeData);
    expect(evaluation).toBeDefined();
    expect(evaluation.feedback).toBeDefined();
    expect(evaluation.suggestions).toBeDefined();
    expect(Array.isArray(evaluation.suggestions)).toBe(true);

    // Test feedback quality
    const quality = aiService.evaluateFeedbackQuality(evaluation);
    expect(quality).toBeDefined();
    expect(typeof quality).toBe('number');
    expect(quality).toBeGreaterThanOrEqual(0);
    expect(quality).toBeLessThanOrEqual(100);

    // Test suggestion relevance
    const relevance = aiService.evaluateSuggestionRelevance(evaluation.suggestions, testData.codeData);
    expect(relevance).toBeDefined();
    expect(typeof relevance).toBe('number');
    expect(relevance).toBeGreaterThanOrEqual(0);
    expect(relevance).toBeLessThanOrEqual(100);

    return {
      evaluation,
      quality,
      relevance
    };
  }

  // Test data persistence
  static testDataPersistence(persistenceService, testData) {
    // Test data saving
    const saveResult = persistenceService.saveData(testData.userId, testData.data);
    expect(saveResult).toBeDefined();
    expect(saveResult.success).toBe(true);

    // Test data retrieval
    const retrievedData = persistenceService.getData(testData.userId);
    expect(retrievedData).toBeDefined();
    expect(retrievedData).toEqual(testData.data);

    // Test data deletion
    const deleteResult = persistenceService.deleteData(testData.userId);
    expect(deleteResult).toBeDefined();
    expect(deleteResult.success).toBe(true);

    // Test data validation
    const validation = persistenceService.validateData(testData.data);
    expect(validation).toBeDefined();
    expect(validation.valid).toBe(true);

    return {
      saveResult,
      retrievedData,
      deleteResult,
      validation
    };
  }
}
