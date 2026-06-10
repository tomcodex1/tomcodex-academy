// Service TDD Template
// Provides a template for writing TDD tests for business logic services

export function createServiceTDDTemplate(serviceName) {
  return `
describe('${serviceName}', () => {
  // Setup
  let service;
  let mockDependencies;

  beforeEach(() => {
    // Setup mock dependencies
    mockDependencies = {
      // Add mock dependencies here
      apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn()
      },
      localStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      eventBus: {
        emit: jest.fn(),
        on: jest.fn(),
        off: jest.fn()
      }
    };

    // Create service instance
    service = new ${serviceName}(mockDependencies);
  });

  // Test cases
  describe('when method is called', () => {
    it('should return expected result', () => {
      // Arrange
      const input = { /* test input */ };
      const expected = { /* expected output */ };

      // Mock API response
      mockDependencies.apiClient.get.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(expected)
      });

      // Act
      return service.method(input).then(result => {
        // Assert
        expect(result).toEqual(expected);
      });
    });

    it('should handle edge case', () => {
      // Arrange
      const input = { /* edge case input */ };
      const expected = { /* expected output for edge case */ };

      // Mock API response
      mockDependencies.apiClient.get.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(expected)
      });

      // Act
      return service.method(input).then(result => {
        // Assert
        expect(result).toEqual(expected);
      });
    });

    it('should validate input', () => {
      // Arrange
      const invalidInput = { /* invalid input */ };

      // Act & Assert
      expect(() => service.method(invalidInput)).toThrow('Invalid input');
    });

    it('should handle API error', () => {
      // Arrange
      const input = { /* test input */ };

      // Mock API error
      mockDependencies.apiClient.get.mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' })
      });

      // Act & Assert
      return service.method(input).catch(error => {
        expect(error).toBe('Not found');
      });
    });
  });

  describe('when data is processed', () => {
    it('should transform data correctly', () => {
      // Arrange
      const inputData = { /* raw data */ };
      const expectedOutput = { /* transformed data */ };

      // Mock API response
      mockDependencies.apiClient.get.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(inputData)
      });

      // Act
      return service.processData(inputData).then(result => {
        // Assert
        expect(result).toEqual(expectedOutput);
      });
    });

    it('should handle empty data', () => {
      // Arrange
      const emptyData = null;

      // Act
      const result = service.processData(emptyData);

      // Assert
      expect(result).toEqual([]);
    });

    it('should filter data based on criteria', () => {
      // Arrange
      const inputData = [
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true }
      ];

      // Mock API response
      mockDependencies.apiClient.get.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(inputData)
      });

      // Act
      return service.filterActive().then(result => {
        // Assert
        expect(result.length).toBe(2);
        expect(result.every(item => item.active)).toBe(true);
      });
    });
  });

  describe('when state changes', () => {
    it('should update internal state', () => {
      // Arrange
      const newState = { /* new state */ };

      // Act
      service.updateState(newState);

      // Assert
      expect(service.state).toEqual(newState);
    });

    it('should persist state to localStorage', () => {
      // Arrange
      const state = { /* test state */ };

      // Act
      service.saveState(state);

      // Assert
      expect(mockDependencies.localStorage.setItem).toHaveBeenCalledWith(
        'serviceNameState', 
        JSON.stringify(state)
      );
    });

    it('should load state from localStorage', () => {
      // Arrange
      const state = { /* test state */ };
      mockDependencies.localStorage.getItem.mockReturnValue(JSON.stringify(state));

      // Act
      const loadedState = service.loadState();

      // Assert
      expect(loadedState).toEqual(state);
    });
  });

  describe('when events are emitted', () => {
    it('should emit event on success', () => {
      // Arrange
      const eventData = { /* test data */ };

      // Mock API response
      mockDependencies.apiClient.post.mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve(eventData)
      });

      // Act
      return service.create(eventData).then(() => {
        // Assert
        expect(mockDependencies.eventBus.emit).toHaveBeenCalledWith(
          'serviceCreated', 
          eventData
        );
      });
    });

    it('should emit event on error', () => {
      // Arrange
      const errorData = { error: 'Test error' };

      // Mock API error
      mockDependencies.apiClient.post.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorData)
      });

      // Act
      return service.create({}).catch(() => {
        // Assert
        expect(mockDependencies.eventBus.emit).toHaveBeenCalledWith(
          'serviceError', 
          errorData
        );
      });
    });
  });

  describe('when cleanup is required', () => {
    it('should clean up resources', () => {
      // Arrange
      // Add any resources that need cleanup

      // Act
      service.cleanup();

      // Assert
      // Verify that resources were cleaned up
      expect(mockDependencies.eventBus.off).toHaveBeenCalled();
    });
  });
});
  `;
}
