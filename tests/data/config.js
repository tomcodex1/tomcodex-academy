// Test Data Management Configuration
// Configuration settings for the test data management system

export const config = {
  // Factory settings
  factories: {
    // Default settings for all factories
    defaults: {
      sequenceStart: 0,
      idPrefix: 'test'
    },

    // Factory-specific settings
    user: {
      idPrefix: 'user',
      defaultRole: 'student',
      defaultEmailDomain: 'example.com'
    },

    learning: {
      idPrefix: 'learning',
      defaultSelectedDay: 1,
      defaultActiveTab: 'dashboard'
    }
  },

  // Validation settings
  validation: {
    // Whether to validate generated data automatically
    autoValidate: true,

    // Whether to throw errors on validation failure
    throwOnValidationError: true,

    // Custom validation messages
    messages: {
      validationError: 'Generated test data failed validation',
      missingFactory: 'Factory not found',
      invalidCount: 'Invalid count parameter'
    }
  },

  // Fixture settings
  fixtures: {
    // Whether to validate fixture data
    validateFixtures: true,

    // Whether to throw errors on fixture validation failure
    throwOnFixtureValidationError: true
  },

  // Seed settings
  seeds: {
    // Whether to automatically load seed data
    autoLoad: true,

    // Whether to validate seed data
    validateSeeds: true,

    // Whether to throw errors on seed validation failure
    throwOnSeedValidationError: true
  },

  // Utility settings
  utils: {
    // Whether to automatically reset test data before each test
    autoReset: true,

    // Whether to automatically clean up test data after each test
    autoCleanup: true,

    // Default API response status
    defaultApiStatus: 200,

    // Default API error status
    defaultApiErrorStatus: 500
  },

  // Logging settings
  logging: {
    // Whether to log factory usage
    logFactoryUsage: true,

    // Whether to log validation results
    logValidationResults: true,

    // Whether to log API simulations
    logApiSimulations: true,

    // Log level (error, warn, info, debug)
    level: 'info'
  }
};

// Helper to get a factory-specific configuration
export const getFactoryConfig = (factoryName) => {
  return config.factories[factoryName] || config.factories.defaults;
};

// Helper to get a validation configuration
export const getValidationConfig = () => {
  return config.validation;
};

// Helper to get a fixture configuration
export const getFixtureConfig = () => {
  return config.fixtures;
};

// Helper to get a seed configuration
export const getSeedConfig = () => {
  return config.seeds;
};

// Helper to get a utility configuration
export const getUtilityConfig = () => {
  return config.utils;
};

// Helper to get a logging configuration
export const getLoggingConfig = () => {
  return config.logging;
};

// Helper to update configuration
export const updateConfig = (newConfig) => {
  Object.assign(config, newConfig);
  return config;
};

// Helper to reset configuration to defaults
export const resetConfig = () => {
  // Re-export the original config to reset
  return {
    ...config
  };
};
