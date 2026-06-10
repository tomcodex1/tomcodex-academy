// Test Environment Configuration
// Configuration settings for test environment isolation

export const testConfig = {
  // Test environment settings
  environment: {
    autoSetup: true,
    autoTeardown: true,
    parallel: true,
    timeout: 10000
  },

  // Mock settings
  mocks: {
    localStorage: true,
    fetch: true,
    timers: true,
    console: false
  },

  // Cleanup settings
  cleanup: {
    elements: true,
    timers: true,
    mocks: true,
    state: true
  },

  // Test isolation settings
  isolation: {
    globalVariables: ['TEST_MODE', 'TEST_ID'],
    documentElements: ['test-container'],
    sessionStorage: true,
    cookies: false
  },

  // Parallel test settings
  parallel: {
    enabled: true,
    maxConcurrency: 4,
    isolationLevel: 'full'
  },

  // Test data settings
  data: {
    autoReset: true,
    validation: true,
    factories: true
  },

  // Performance settings
  performance: {
    measureMemory: false,
    measureTime: false,
    thresholds: {
      componentRender: 100,
      apiResponse: 500,
      dataProcessing: 50
    }
  }
};

// Helper to get configuration
export const getConfig = () => testConfig;

// Helper to update configuration
export const updateConfig = (newConfig) => {
  Object.assign(testConfig, newConfig);
  return testConfig;
};

// Helper to get a specific configuration section
export const getSection = (section) => {
  if (!testConfig[section]) {
    throw new Error(`Configuration section "${section}" not found`);
  }
  return testConfig[section];
};

// Helper to check if a feature is enabled
export const isFeatureEnabled = (feature) => {
  const sections = feature.split('.');
  let current = testConfig;

  for (const section of sections) {
    if (!current[section]) {
      return false;
    }
    current = current[section];
  }

  return !!current;
};
