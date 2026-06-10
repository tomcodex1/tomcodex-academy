// Test Isolation Configuration
// Configuration for test isolation behavior

import { testConfig, getConfig, updateConfig } from './setup/config.js';

// Isolation configuration presets
export const isolationPresets = {
  // Minimal isolation - only essential isolation
  minimal: {
    environment: {
      autoSetup: true,
      autoTeardown: true,
      parallel: false,
      timeout: 5000
    },
    mocks: {
      localStorage: true,
      fetch: false,
      timers: false,
      console: false
    },
    cleanup: {
      elements: true,
      timers: false,
      mocks: true,
      state: false
    },
    isolation: {
      globalVariables: [],
      documentElements: [],
      sessionStorage: false,
      cookies: false
    },
    parallel: {
      enabled: false,
      maxConcurrency: 1,
      isolationLevel: 'minimal'
    }
  },

  // Standard isolation - balanced approach
  standard: {
    environment: {
      autoSetup: true,
      autoTeardown: true,
      parallel: true,
      timeout: 10000
    },
    mocks: {
      localStorage: true,
      fetch: true,
      timers: true,
      console: false
    },
    cleanup: {
      elements: true,
      timers: true,
      mocks: true,
      state: true
    },
    isolation: {
      globalVariables: ['TEST_MODE', 'TEST_ID'],
      documentElements: ['test-container'],
      sessionStorage: true,
      cookies: false
    },
    parallel: {
      enabled: true,
      maxConcurrency: 4,
      isolationLevel: 'standard'
    }
  },

  // Full isolation - maximum isolation
  full: {
    environment: {
      autoSetup: true,
      autoTeardown: true,
      parallel: true,
      timeout: 15000
    },
    mocks: {
      localStorage: true,
      fetch: true,
      timers: true,
      console: true
    },
    cleanup: {
      elements: true,
      timers: true,
      mocks: true,
      state: true
    },
    isolation: {
      globalVariables: ['TEST_MODE', 'TEST_ID', 'console'],
      documentElements: ['test-container', 'mock-element'],
      sessionStorage: true,
      cookies: true
    },
    parallel: {
      enabled: true,
      maxConcurrency: 8,
      isolationLevel: 'full'
    }
  }
};

// Apply isolation preset
export const applyPreset = (presetName) => {
  if (!isolationPresets[presetName]) {
    throw new Error(`Isolation preset "${presetName}" not found`);
  }

  updateConfig(isolationPresets[presetName]);
  return getConfig();
};

// Get current isolation level
export const getIsolationLevel = () => {
  const config = getConfig();
  return config.parallel.isolationLevel;
};

// Check if parallel testing is enabled
export const isParallelEnabled = () => {
  return getConfig().parallel.enabled;
};

// Get maximum concurrency
export const getMaxConcurrency = () => {
  return getConfig().parallel.maxConcurrency;
};

// Create custom isolation configuration
export const createIsolationConfig = (overrides) => {
  const config = getConfig();
  return {
    environment: { ...config.environment, ...overrides.environment },
    mocks: { ...config.mocks, ...overrides.mocks },
    cleanup: { ...config.cleanup, ...overrides.cleanup },
    isolation: { ...config.isolation, ...overrides.isolation },
    parallel: { ...config.parallel, ...overrides.parallel },
    data: { ...config.data, ...overrides.data },
    performance: { ...config.performance, ...overrides.performance }
  };
};

// Export isolation presets for easy access
export { isolationPresets };
