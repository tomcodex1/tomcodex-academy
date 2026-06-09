
// Setup file for Jest tests
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
globalThis.jest = jest;

// Mock localStorage
const localStorageMock = {
  storage: {},
  getItem: jest.fn(key => localStorageMock.storage[key] || null),
  setItem: jest.fn((key, value) => {
    localStorageMock.storage[key] = String(value);
  }),
  removeItem: jest.fn(key => {
    delete localStorageMock.storage[key];
  }),
  clear: jest.fn(() => {
    localStorageMock.storage = {};
  })
};

global.localStorage = localStorageMock;

// Mock window.matchMedia for browser-focused suites.
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Mock fetch API
global.fetch = jest.fn();

// Mock window.TomCodexLearning and other global objects
beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks();

  // Reset localStorage
  localStorageMock.storage = {};
  localStorageMock.getItem.mockImplementation(key => localStorageMock.storage[key] || null);
  localStorageMock.setItem.mockImplementation((key, value) => {
    localStorageMock.storage[key] = String(value);
  });
  localStorageMock.removeItem.mockImplementation(key => {
    delete localStorageMock.storage[key];
  });
  localStorageMock.clear.mockImplementation(() => {
    localStorageMock.storage = {};
  });

  // Reset fetch mock
  fetch.mockClear();

  // Setup default fetch response
  fetch.mockImplementation(() =>
    Promise.resolve({
      ok: true,
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
      text: () => Promise.resolve(JSON.stringify({})),
      json: () => Promise.resolve({}),
    })
  );
});
