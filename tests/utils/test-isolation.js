// Test Isolation Utilities
// Provides utilities for ensuring test isolation and preventing test interference

import { TestEnvironment } from '../setup/test-environment.js';
import { testConfig, getConfig, updateConfig } from '../setup/config.js';

export class TestIsolation {
  constructor() {
    this.environments = new Map();
    this.currentTestId = null;
  }

  // Get or create test environment
  async getEnvironment(testId) {
    if (!this.environments.has(testId)) {
      const env = new TestEnvironment();
      await env.setup();
      this.environments.set(testId, env);
      this.currentTestId = testId;
    }

    return this.environments.get(testId);
  }

  // Cleanup test environment
  async cleanupEnvironment(testId) {
    if (this.environments.has(testId)) {
      const env = this.environments.get(testId);
      await env.teardown();
      this.environments.delete(testId);

      if (this.currentTestId === testId) {
        this.currentTestId = null;
      }
    }
  }

  // Cleanup all environments
  async cleanupAll() {
    const cleanupPromises = Array.from(this.environments.keys()).map(id => 
      this.cleanupEnvironment(id)
    );

    await Promise.all(cleanupPromises);
  }

  // Get current environment
  getCurrentEnvironment() {
    if (!this.currentTestId) {
      throw new Error('No current test environment');
    }

    return this.environments.get(this.currentTestId);
  }

  // Create isolated test context
  createTestContext(testId) {
    return {
      id: testId,
      env: this.getCurrentEnvironment(),
      mock: this.createMockContext(),
      data: this.createDataContext(),
      cleanup: async () => {
        await this.cleanupEnvironment(testId);
      }
    };
  }

  // Create mock context
  createMockContext() {
    const env = this.getCurrentEnvironment();
    return {
      localStorage: env.mockedServices.localStorage,
      fetch: env.mockedServices.fetch,
      timers: env.mockedServices.timers,
      console: env.mockedServices.console,

      // Mock helper methods
      mockLocalStorage: (data) => {
        Object.keys(data).forEach(key => {
          env.mockedServices.localStorage.setItem(key, data[key]);
        });
      },

      mockApiResponse: (url, response) => {
        env.mockedServices.fetch.mockResolvedValue({
          ok: true,
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          json: () => Promise.resolve(response)
        });
      },

      mockApiError: (url, status, error) => {
        env.mockedServices.fetch.mockResolvedValue({
          ok: false,
          status,
          headers: { 'Content-Type': 'application/json' },
          json: () => Promise.resolve({ error })
        });
      }
    };
  }

  // Create data context
  createDataContext() {
    return {
      // Reset data helpers
      resetData: () => {
        localStorage.clear();
      },

      // Seed data helpers
      seedData: (data) => {
        Object.keys(data).forEach(key => {
          localStorage.setItem(key, JSON.stringify(data[key]));
        });
      },

      // Get data helpers
      getData: (key) => {
        return JSON.parse(localStorage.getItem(key));
      },

      // Validate data helpers
      validateData: (key, schema) => {
        try {
          const data = this.getData(key);
          schema.parse(data);
          return { valid: true, errors: [] };
        } catch (error) {
          return { 
            valid: false, 
            errors: error.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message
            }))
          };
        }
      }
    };
  }

  // Create test isolation decorator
  static isolate(testFn) {
    return async function(...args) {
      const testId = this.test?.id || 'anonymous-test';
      const isolation = new TestIsolation();

      try {
        // Setup environment
        await isolation.getEnvironment(testId);

        // Create test context
        const context = isolation.createTestContext(testId);

        // Bind context to test function
        const boundTestFn = testFn.bind({ ...this, context });

        // Run test
        const result = await boundTestFn(...args);

        return result;
      } catch (error) {
        console.error(`Test ${testId} failed:`, error);
        throw error;
      } finally {
        // Cleanup environment
        await isolation.cleanupEnvironment(testId);
      }
    };
  }

  // Create test suite with isolation
  static createIsolatedSuite(suiteName, tests) {
    return {
      name: suiteName,

      async run() {
        const results = [];
        const isolation = new TestIsolation();

        for (const test of tests) {
          const testId = `${suiteName}-${test.name}`;

          try {
            // Setup environment
            await isolation.getEnvironment(testId);

            // Create test context
            const context = isolation.createTestContext(testId);

            // Bind context to test function
            const boundTestFn = test.fn.bind({ ...test, context });

            // Run test with timeout
            const testPromise = boundTestFn();
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Test timeout')), getConfig().environment.timeout);
            });

            // Run test with timeout
            const result = await Promise.race([testPromise, timeoutPromise]);

            results.push({
              name: test.name,
              passed: true,
              result
            });
          } catch (error) {
            results.push({
              name: test.name,
              passed: false,
              error: error.message
            });
          } finally {
            // Cleanup environment
            await isolation.cleanupEnvironment(testId);
          }
        }

        return {
          name: suiteName,
          results
        };
      }
    };
  }
}

// Create global test isolation instance
const globalIsolation = new TestIsolation();

// Export global instance
export { globalIsolation };

// Export helper functions
export const withIsolation = TestIsolation.isolate;
export const createIsolatedSuite = TestIsolation.createIsolatedSuite;
