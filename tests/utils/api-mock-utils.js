// API Mocking Utilities
// Provides specialized utilities for mocking API responses and interactions

import { MockUtils } from './mock-utils.js';

export class APIMockUtils {
  // Create mock API responses
  static createMockAPIResponses() {
    return {
      // User API responses
      users: {
        'GET /api/users': {
          status: 200,
          body: [
            { id: '1', name: 'John Doe', email: 'john@example.com', role: 'student' },
            { id: '2', name: 'Jane Tutor', email: 'jane@example.com', role: 'tutor' }
          ]
        },
        'GET /api/users/1': {
          status: 200,
          body: { id: '1', name: 'John Doe', email: 'john@example.com', role: 'student' }
        },
        'POST /api/users': {
          status: 201,
          body: { id: '3', name: 'New User', email: 'new@example.com', role: 'student' }
        }
      },

      // Learning API responses
      learning: {
        'GET /api/learning/progress': {
          status: 200,
          body: {
            selectedDay: 5,
            completedTasks: { 1: [0, 1, 2], 2: [0] },
            completedHabits: [0, 1, 2]
          }
        },
        'POST /api/learning/progress': {
          status: 200,
          body: { success: true }
        },
        'GET /api/learning/stages': {
          status: 200,
          body: [
            [37, "Workplace Scenario Lab", "Real stakeholder requests, constraints, and tradeoffs", "Solve a new workplace Salesforce scenario"],
            [38, "Advanced Project Upgrade", "Performance, security, maintainability, and scale", "Upgrade an existing portfolio project"]
          ]
        }
      },

      // AI API responses
      ai: {
        'POST /api/ai/feedback': {
          status: 200,
          body: {
            feedback: "Your code has good structure",
            suggestions: ["Consider adding error handling", "Add comments for complex logic"]
          }
        }
      },

      // Default error response
      error: {
        'GET /api/404': {
          status: 404,
          body: { error: "Resource not found" }
        },
        'GET /api/500': {
          status: 500,
          body: { error: "Internal server error" }
        }
      }
    };
  }

  // Set up API mocking
  static setupAPI(apiResponses = {}) {
    // Create a combined mock fetch function
    const mockResponses = { ...this.createMockAPIResponses(), ...apiResponses };
    const mockFetch = MockUtils.createMockFetch(mockResponses);

    // Replace global fetch
    global.fetch = mockFetch;

    // Return mock for verification
    return {
      fetch: mockFetch,
      reset: () => {
        global.fetch = mockFetch;
      }
    };
  }

  // Create API error scenarios
  static createAPIErrorScenarios() {
    return {
      networkError: () => {
        return Promise.reject(new Error('Network error'));
      },
      serverError: () => {
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          headers: { 'Content-Type': 'application/json' },
          json: () => Promise.resolve({ error: 'Server error' })
        });
      },
      unauthorizedError: () => {
        return Promise.resolve({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          headers: { 'Content-Type': 'application/json' },
          json: () => Promise.resolve({ error: 'Unauthorized access' })
        });
      },
      validationError: () => {
        return Promise.resolve({
          ok: false,
          status: 422,
          statusText: 'Unprocessable Entity',
          headers: { 'Content-Type': 'application/json' },
          json: () => Promise.resolve({ 
            errors: {
              email: ['is invalid'],
              password: ['is too short']
            }
          })
        });
      }
    };
  }

  // Create API delay scenarios
  static createAPIDelayScenarios() {
    return {
      slowResponse: (delay = 2000) => {
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          json: () => {
            return new Promise(resolve => {
              setTimeout(() => resolve({ success: true }), delay);
            });
          }
        });
      },
      delayedError: (delay = 2000) => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Delayed network error'));
          }, delay);
        });
      }
    };
  }

  // Create API state scenarios
  static createAPIStateScenarios() {
    return {
      loading: {
        status: 'loading',
        data: null,
        error: null
      },
      success: {
        status: 'success',
        data: { message: 'Success' },
        error: null
      },
      error: {
        status: 'error',
        data: null,
        error: { message: 'Error occurred' }
      }
    };
  }

  // Mock localStorage for authentication
  static mockAuthStorage() {
    const mockStorage = MockUtils.createMockLocalStorage();
    const mockAuth = {
      getToken: () => mockStorage.getItem('authToken'),
      setToken: (token) => mockStorage.setItem('authToken', token),
      clearToken: () => mockStorage.removeItem('authToken'),
      isAuthenticated: () => !!mockStorage.getItem('authToken')
    };

    return { mockStorage, mockAuth };
  }

  // Create API response interceptors
  static createResponseInterceptors() {
    const interceptors = {
      request: [],
      response: [],
      error: []
    };

    return {
      // Add request interceptor
      addRequestInterceptor: (interceptor) => {
        interceptors.request.push(interceptor);
      },

      // Add response interceptor
      addResponseInterceptor: (interceptor) => {
        interceptors.response.push(interceptor);
      },

      // Add error interceptor
      addErrorInterceptor: (interceptor) => {
        interceptors.error.push(interceptor);
      },

      // Process request with interceptors
      processRequest: (url, options) => {
        let processedOptions = { ...options };

        interceptors.request.forEach(interceptor => {
          processedOptions = interceptor(url, processedOptions) || processedOptions;
        });

        return processedOptions;
      },

      // Process response with interceptors
      processResponse: (response) => {
        let processedResponse = response;

        interceptors.response.forEach(interceptor => {
          processedResponse = interceptor(processedResponse) || processedResponse;
        });

        return processedResponse;
      },

      // Process error with interceptors
      processError: (error) => {
        let processedError = error;

        interceptors.error.forEach(interceptor => {
          processedError = interceptor(processedError) || processedError;
        });

        return processedError;
      }
    };
  }
}
