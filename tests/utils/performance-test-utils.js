// Performance Testing Utilities
// Provides specialized utilities for testing application performance

export class PerformanceTestUtils {
  // Create a performance test runner
  static createPerformanceTest(name, testFn, options = {}) {
    const {
      iterations = 10,
      warmupIterations = 3,
      threshold = 100, // ms
      tolerance = 0.1 // 10%
    } = options;

    return {
      name,

      // Run the performance test
      async run() {
        // Warmup
        for (let i = 0; i < warmupIterations; i++) {
          await testFn();
        }

        // Actual test runs
        const results = [];
        for (let i = 0; i < iterations; i++) {
          const start = performance.now();
          await testFn();
          const end = performance.now();
          results.push(end - start);
        }

        // Calculate statistics
        const sum = results.reduce((a, b) => a + b, 0);
        const mean = sum / results.length;
        const min = Math.min(...results);
        const max = Math.max(...results);
        const variance = results.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / results.length;
        const stdDev = Math.sqrt(variance);

        // Check against threshold
        const passed = mean <= threshold;
        const withinTolerance = stdDev / mean <= tolerance;

        return {
          name,
          passed,
          withinTolerance,
          iterations,
          warmupIterations,
          threshold,
          results,
          stats: {
            mean,
            min,
            max,
            stdDev,
            variance
          }
        };
      },

      // Run multiple performance tests
      async runSuite(tests) {
        const results = [];

        for (const test of tests) {
          const result = await test.run();
          results.push(result);
        }

        return {
          name: this.name,
          results,
          summary: this.generateSummary(results)
        };
      },

      // Generate a summary of test results
      generateSummary(results) {
        const passed = results.filter(r => r.passed).length;
        const total = results.length;

        return {
          passed,
          total,
          percentage: (passed / total) * 100,
          slowest: results.reduce((max, r) => r.stats.mean > max.stats.mean ? r : max),
          fastest: results.reduce((min, r) => r.stats.mean < min.stats.mean ? r : min)
        };
      }
    };
  }

  // Measure component rendering performance
  static measureComponentRender(component, testData, options = {}) {
    const {
      iterations = 10,
      warmupIterations = 3
    } = options;

    return this.createPerformanceTest('Component Rendering', async () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const instance = new component(element, () => {});
      instance.render(testData);

      // Force reflow to ensure rendering is complete
      void element.offsetHeight;

      document.body.removeChild(element);
    }, options);
  }

  // Measure API response time
  static measureAPIResponse(apiCall, options = {}) {
    const {
      iterations = 10,
      warmupIterations = 3
    } = options;

    return this.createPerformanceTest('API Response Time', async () => {
      await apiCall();
    }, options);
  }

  // Measure data processing time
  static measureDataProcessing(processFn, testData, options = {}) {
    const {
      iterations = 10,
      warmupIterations = 3
    } = options;

    return this.createPerformanceTest('Data Processing', async () => {
      processFn(testData);
    }, options);
  }

  // Measure memory usage
  static measureMemoryUsage(testFn, options = {}) {
    const {
      iterations = 5,
      warmupIterations = 2
    } = options;

    return {
      name: 'Memory Usage',

      async run() {
        // Check if performance.memory is available
        if (!window.performance || !window.performance.memory) {
          throw new Error('Memory API not available');
        }

        // Warmup
        for (let i = 0; i < warmupIterations; i++) {
          await testFn();
        }

        // Actual test runs
        const results = [];
        const initialMemory = window.performance.memory.usedJSHeapSize;

        for (let i = 0; i < iterations; i++) {
          const before = window.performance.memory.usedJSHeapSize;
          await testFn();
          const after = window.performance.memory.usedJSHeapSize;

          results.push({
            before,
            after,
            delta: after - before
          });

          // Force garbage collection if available
          if (window.gc) {
            window.gc();
          }
        }

        const totalDelta = results.reduce((sum, r) => sum + r.delta, 0);
        const avgDelta = totalDelta / results.length;

        return {
          name: this.name,
          iterations,
          warmupIterations,
          initialMemory,
          results,
          stats: {
            totalDelta,
            avgDelta,
            finalMemory: results[results.length - 1].after
          }
        };
      }
    };
  }

  // Create a performance benchmark suite
  static createBenchmarkSuite(name, tests) {
    return {
      name,

      async run() {
        const results = [];

        for (const test of tests) {
          const result = await test.run();
          results.push(result);
        }

        return {
          name: this.name,
          results,
          summary: this.generateSummary(results)
        };
      },

      generateSummary(results) {
        const passed = results.filter(r => r.passed).length;
        const total = results.length;

        return {
          passed,
          total,
          percentage: (passed / total) * 100,
          slowest: results.reduce((max, r) => r.stats.mean > max.stats.mean ? r : max),
          fastest: results.reduce((min, r) => r.stats.mean < min.stats.mean ? r : min)
        };
      }
    };
  }

  // Generate performance report
  static generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      tests: results,
      summary: this.generateSummary(results)
    };

    // Add visual indicators
    report.summary.status = report.summary.percentage >= 90 ? 'EXCELLENT' :
                            report.summary.percentage >= 70 ? 'GOOD' :
                            report.summary.percentage >= 50 ? 'FAIR' : 'POOR';

    return report;
  }

  // Create a performance dashboard
  static createPerformanceDashboard(results) {
    const report = this.generateReport(results);

    // Create a simple HTML dashboard
    const dashboard = document.createElement('div');
    dashboard.innerHTML = `
      <h2>Performance Dashboard</h2>
      <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
      <div class="summary">
        <h3>Summary</h3>
        <p>Status: ${report.summary.status}</p>
        <p>Passed: ${report.summary.passed} / ${report.summary.total}</p>
        <p>Percentage: ${report.summary.percentage.toFixed(2)}%</p>
      </div>
      <div class="details">
        <h3>Test Details</h3>
        ${report.tests.map(test => `
          <div class="test">
            <h4>${test.name}</h4>
            <p>Status: ${test.passed ? 'PASSED' : 'FAILED'}</p>
            <p>Mean: ${test.stats.mean.toFixed(2)}ms</p>
            <p>Min: ${test.stats.min.toFixed(2)}ms</p>
            <p>Max: ${test.stats.max.toFixed(2)}ms</p>
            <p>Std Dev: ${test.stats.stdDev.toFixed(2)}ms</p>
          </div>
        `).join('')}
      </div>
    `;

    // Add some basic styling
    dashboard.style.cssText = `
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    `;

    dashboard.querySelector('.summary').style.cssText = `
      background-color: #f9f9f9;
      padding: 10px;
      margin-bottom: 20px;
      border-radius: 5px;
    `;

    dashboard.querySelector('.details').style.cssText = `
      margin-top: 20px;
    `;

    dashboard.querySelectorAll('.test').forEach(test => {
      test.style.cssText = `
        margin-bottom: 15px;
        padding: 10px;
        border-left: 3px solid ${test.querySelector('h4').textContent.includes('FAILED') ? '#ff5252' : '#4caf50'};
        background-color: #f9f9f9;
      `;
    });

    return dashboard;
  }
}
