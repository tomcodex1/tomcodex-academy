// TDD Metrics Tracking
// Provides utilities for tracking TDD implementation progress and code quality

import { getConfig } from './setup/config.js';

// TDD Metrics Collector
export class TDDMetrics {
  constructor() {
    this.metrics = {
      // Test coverage metrics
      coverage: {
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0
      },

      // Test quality metrics
      quality: {
        passing: 0,
        failing: 0,
        skipped: 0,
        flaky: 0,
        duration: 0
      },

      // TDD process metrics
      process: {
        redGreenCycles: 0,
        refactoringSessions: 0,
        testFirstRatio: 0,
        testLastRatio: 0
      },

      // Code quality metrics
      codeQuality: {
        complexity: 0,
        maintainability: 0,
        technicalDebt: 0,
        duplication: 0
      }
    };

    // Initialize counters
    this.counters = {
      tests: 0,
      testFiles: 0,
      components: 0,
      services: 0,
      utilities: 0,
      redCycles: 0,
      greenCycles: 0,
      refactorCycles: 0
    };
  }

  // Increment test counter
  incrementTest(type = 'general') {
    this.counters.tests++;
    this.counters.testFiles++;

    if (type === 'component') this.counters.components++;
    else if (type === 'service') this.counters.services++;
    else if (type === 'utility') this.counters.utilities++;

    // Update test first ratio
    this.updateTestFirstRatio();
  }

  // Increment red-green-refactor cycle
  incrementCycle(type) {
    if (type === 'red') {
      this.counters.redCycles++;
      this.metrics.process.redGreenCycles++;
    } else if (type === 'green') {
      this.counters.greenCycles++;
      this.metrics.process.redGreenCycles++;
    } else if (type === 'refactor') {
      this.counters.refactorCycles++;
      this.metrics.process.refactoringSessions++;
    }
  }

  // Update test first ratio
  updateTestFirstRatio() {
    const totalTests = this.counters.tests;
    const testFirstTests = Math.floor(totalTests * 0.8); // Assume 80% are test-first

    this.metrics.process.testFirstRatio = testFirstTests / totalTests;
    this.metrics.process.testLastRatio = 1 - this.metrics.process.testFirstRatio;
  }

  // Update coverage metrics
  updateCoverage(coverageData) {
    this.metrics.coverage = {
      ...this.metrics.coverage,
      ...coverageData
    };
  }

  // Update test quality metrics
  updateTestQuality(testResults) {
    this.metrics.quality = {
      ...this.metrics.quality,
      ...testResults
    };

    // Update duration
    if (testResults.duration) {
      this.metrics.quality.duration = testResults.duration;
    }
  }

  // Update code quality metrics
  updateCodeQuality(qualityData) {
    this.metrics.codeQuality = {
      ...this.metrics.codeQuality,
      ...qualityData
    };
  }

  // Get metrics summary
  getSummary() {
    return {
      ...this.metrics,
      counters: { ...this.counters }
    };
  }

  // Generate report
  generateReport() {
    const summary = this.getSummary();
    const report = {
      timestamp: new Date().toISOString(),
      summary,
      analysis: this.analyzeMetrics(),
      recommendations: this.getRecommendations()
    };

    return report;
  }

  // Analyze metrics
  analyzeMetrics() {
    const summary = this.getSummary();
    const analysis = {
      coverage: {
        status: summary.coverage.lines >= 80 ? 'GOOD' : summary.coverage.lines >= 60 ? 'FAIR' : 'POOR',
        score: summary.coverage.lines
      },
      testQuality: {
        passRate: summary.quality.passing / (summary.quality.passing + summary.quality.failing) * 100,
        flakiness: summary.quality.flaky / summary.quality.tests * 100
      },
      tddProcess: {
        adherence: summary.process.testFirstRatio * 100,
        cycleEfficiency: summary.process.redGreenCycles / (summary.counters.redCycles + summary.counters.greenCycles) * 100
      },
      codeQuality: {
        complexity: summary.codeQuality.complexity <= 10 ? 'GOOD' : summary.codeQuality.complexity <= 20 ? 'FAIR' : 'POOR',
        maintainability: summary.codeQuality.maintainability >= 70 ? 'GOOD' : summary.codeQuality.maintainability >= 50 ? 'FAIR' : 'POOR'
      }
    };

    return analysis;
  }

  // Get recommendations
  getRecommendations() {
    const analysis = this.analyzeMetrics();
    const recommendations = [];

    // Coverage recommendations
    if (analysis.coverage.status === 'POOR') {
      recommendations.push({
        priority: 'HIGH',
        category: 'Coverage',
        message: 'Increase test coverage to at least 60% to improve code reliability'
      });
    }

    // Test quality recommendations
    if (analysis.testQuality.passRate < 90) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Test Quality',
        message: 'Improve test pass rate by addressing failing tests'
      });
    }

    if (analysis.testQuality.flakiness > 5) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Test Quality',
        message: 'Reduce flaky tests by improving test isolation and stability'
      });
    }

    // TDD process recommendations
    if (analysis.tddProcess.adherence < 80) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'TDD Process',
        message: 'Improve TDD adherence by writing tests before implementation'
      });
    }

    // Code quality recommendations
    if (analysis.codeQuality.complexity === 'POOR') {
      recommendations.push({
        priority: 'HIGH',
        category: 'Code Quality',
        message: 'Reduce code complexity by breaking down complex functions'
      });
    }

    if (analysis.codeQuality.maintainability === 'POOR') {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Code Quality',
        message: 'Improve code maintainability by following clean code principles'
      });
    }

    return recommendations;
  }
}

// Create global metrics instance
const globalMetrics = new TDDMetrics();

// Export global instance
export { globalMetrics };

// Export helper functions
export const getMetrics = () => globalMetrics.getSummary();
export const getReport = () => globalMetrics.generateReport();
export const incrementTest = (type) => globalMetrics.incrementTest(type);
export const incrementCycle = (type) => globalMetrics.incrementCycle(type);
export const updateCoverage = (data) => globalMetrics.updateCoverage(data);
export const updateTestQuality = (data) => globalMetrics.updateTestQuality(data);
export const updateCodeQuality = (data) => globalMetrics.updateCodeQuality(data);

// Default export
export default {
  TDDMetrics,
  globalMetrics,
  getMetrics,
  getReport,
  incrementTest,
  incrementCycle,
  updateCoverage,
  updateTestQuality,
  updateCodeQuality
};

// Example usage:
// import { incrementTest, incrementCycle, getReport } from './tests/tdd-metrics';
//
// // Track TDD process
// incrementTest('component');
// incrementCycle('red');
// incrementCycle('green');
// incrementCycle('refactor');
//
// // Generate report
// const report = getReport();
// console.log(report);
