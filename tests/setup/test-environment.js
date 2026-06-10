// Test Environment Setup
// Provides isolated test environments to prevent test interference

export class TestEnvironment {
  constructor() {
    this.originalState = {};
    this.mockedServices = {};
    this.createdElements = [];
    this.timers = [];
  }

  // Setup test environment
  async setup() {
    // Store original environment state
    this.storeOriginalState();

    // Create isolated environment
    await this.createIsolatedEnvironment();

    // Setup mocks and stubs
    await this.setupMocks();

    // Setup timers
    this.setupTimers();
  }

  // Teardown test environment
  async teardown() {
    // Restore original state
    await this.restoreOriginalState();

    // Cleanup created elements
    await this.cleanupElements();

    // Restore timers
    this.restoreTimers();

    // Clear mocked services
    await this.clearMocks();
  }

  // Store original environment state
  storeOriginalState() {
    // Store original localStorage
    this.originalState.localStorage = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      this.originalState.localStorage[key] = localStorage.getItem(key);
    }

    // Store original document state
    this.originalState.document = {
      title: document.title,
      body: document.body.innerHTML
    };

    // Store original window state
    this.originalState.window = {
      location: window.location.href,
      sessionStorage: {}
    };

    // Copy sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      this.originalState.window.sessionStorage[key] = sessionStorage.getItem(key);
    }

    // Store original fetch
    this.originalState.fetch = global.fetch;

    // Store original timers
    this.originalState.setTimeout = global.setTimeout;
    this.originalState.setInterval = global.setInterval;
    this.originalState.clearTimeout = global.clearTimeout;
    this.originalState.clearInterval = global.clearInterval;

    // Store original console
    this.originalState.console = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };
  }

  // Create isolated environment
  async createIsolatedEnvironment() {
    // Clear localStorage
    localStorage.clear();

    // Create test container
    this.testContainer = document.createElement('div');
    this.testContainer.id = 'test-container';
    document.body.appendChild(this.testContainer);

    // Create shadow DOM if needed
    this.shadowRoot = this.testContainer.attachShadow({ mode: 'open' });

    // Set test environment variables
    window.TEST_MODE = true;
    window.TEST_ID = this.generateTestId();
  }

  // Setup mocks and stubs
  async setupMocks() {
    // Mock localStorage
    this.mockedServices.localStorage = {
      getItem: jest.fn(key => this.originalState.localStorage[key] || null),
      setItem: jest.fn((key, value) => {
        localStorage.setItem(key, String(value));
      }),
      removeItem: jest.fn(key => {
        localStorage.removeItem(key);
      }),
      clear: jest.fn(() => {
        localStorage.clear();
      })
    };

    // Mock fetch
    this.mockedServices.fetch = jest.fn();
    global.fetch = this.mockedServices.fetch;

    // Mock timers
    this.mockedServices.timers = {
      setTimeout: jest.fn((fn, delay) => {
        const timerId = this.originalState.setTimeout.call(window, fn, delay);
        this.timers.push(timerId);
        return timerId;
      }),
      setInterval: jest.fn((fn, delay) => {
        const timerId = this.originalState.setInterval.call(window, fn, delay);
        this.timers.push(timerId);
        return timerId;
      }),
      clearTimeout: jest.fn(timerId => {
        this.originalState.clearTimeout.call(window, timerId);
        this.timers = this.timers.filter(id => id !== timerId);
      }),
      clearInterval: jest.fn(timerId => {
        this.originalState.clearInterval.call(window, timerId);
        this.timers = this.timers.filter(id => id !== timerId);
      })
    };

    global.setTimeout = this.mockedServices.timers.setTimeout;
    global.setInterval = this.mockedServices.timers.setInterval;
    global.clearTimeout = this.mockedServices.timers.clearTimeout;
    global.clearInterval = this.mockedServices.timers.clearInterval;

    // Mock console (optional)
    this.mockedServices.console = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn()
    };

    console.log = this.mockedServices.console.log;
    console.error = this.mockedServices.console.error;
    console.warn = this.mockedServices.console.warn;
    console.info = this.mockedServices.console.info;
  }

  // Setup timers
  setupTimers() {
    // Use fake timers for all tests
    jest.useFakeTimers();
  }

  // Restore original state
  async restoreOriginalState() {
    // Restore localStorage
    localStorage.clear();
    Object.keys(this.originalState.localStorage).forEach(key => {
      localStorage.setItem(key, this.originalState.localStorage[key]);
    });

    // Restore document state
    document.title = this.originalState.document.title;
    document.body.innerHTML = this.originalState.document.body;

    // Restore window state
    window.location.href = this.originalState.window.location;

    // Restore sessionStorage
    sessionStorage.clear();
    Object.keys(this.originalState.window.sessionStorage).forEach(key => {
      sessionStorage.setItem(key, this.originalState.window.sessionStorage[key]);
    });

    // Restore test environment variables
    window.TEST_MODE = false;
    delete window.TEST_ID;
  }

  // Cleanup created elements
  async cleanupElements() {
    // Remove test container
    if (this.testContainer && this.testContainer.parentNode) {
      this.testContainer.parentNode.removeChild(this.testContainer);
    }

    // Remove any other created elements
    this.createdElements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    this.createdElements = [];
  }

  // Restore timers
  restoreTimers() {
    // Restore original timer functions
    global.setTimeout = this.originalState.setTimeout;
    global.setInterval = this.originalState.setInterval;
    global.clearTimeout = this.originalState.clearTimeout;
    global.clearInterval = this.originalState.clearInterval;

    // Clear all remaining timers
    this.timers.forEach(timerId => {
      this.originalState.clearTimeout.call(window, timerId);
      this.originalState.clearInterval.call(window, timerId);
    });

    this.timers = [];

    // Restore real timers
    jest.useRealTimers();
  }

  // Clear mocks
  async clearMocks() {
    // Clear all mocked services
    Object.keys(this.mockedServices).forEach(service => {
      if (this.mockedServices[service] && typeof this.mockedServices[service].mockClear === 'function') {
        this.mockedServices[service].mockClear();
      }
    });

    this.mockedServices = {};
  }

  // Generate unique test ID
  generateTestId() {
    return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add created element to cleanup list
  trackElement(element) {
    this.createdElements.push(element);
  }

  // Create test container
  createTestContainer() {
    const container = document.createElement('div');
    container.id = 'test-container';
    this.trackElement(container);
    return container;
  }

  // Create isolated component container
  createComponentContainer() {
    const container = document.createElement('div');
    container.className = 'component-test-container';
    this.trackElement(container);
    return container;
  }

  // Get test container
  getTestContainer() {
    return this.testContainer;
  }

  // Get shadow root
  getShadowRoot() {
    return this.shadowRoot;
  }
}
