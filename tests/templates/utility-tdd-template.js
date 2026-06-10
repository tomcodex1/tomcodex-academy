// Utility TDD Template
// Provides a template for writing TDD tests for utility functions

export function createUtilityTDDTemplate(functionName) {
  return `
describe('${functionName}', () => {
  // Test cases
  describe('when called with valid input', () => {
    it('should return expected result', () => {
      // Arrange
      const input = { /* test input */ };
      const expected = { /* expected output */ };

      // Act
      const result = ${functionName}(input);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should handle default values', () => {
      // Arrange
      const input = { /* partial input */ };
      const expected = { /* expected output with defaults */ };

      // Act
      const result = ${functionName}(input);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should handle edge case', () => {
      // Arrange
      const input = { /* edge case input */ };
      const expected = { /* expected output for edge case */ };

      // Act
      const result = ${functionName}(input);

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('when called with invalid input', () => {
    it('should throw error for invalid type', () => {
      // Arrange
      const invalidInput = { /* invalid type input */ };

      // Act & Assert
      expect(() => ${functionName}(invalidInput)).toThrow('Invalid input type');
    });

    it('should throw error for missing required field', () => {
      // Arrange
      const inputMissingField = { /* input missing required field */ };

      // Act & Assert
      expect(() => ${functionName}(inputMissingField)).toThrow('Missing required field');
    });

    it('should throw error for out of range value', () => {
      // Arrange
      const inputOutOfRange = { /* input with out of range value */ };

      // Act & Assert
      expect(() => ${functionName}(inputOutOfRange)).toThrow('Value out of range');
    });
  });

  describe('when performance is critical', () => {
    it('should handle large input efficiently', () => {
      // Arrange
      const largeInput = createLargeInput(); // Helper function to create large input
      const startTime = performance.now();

      // Act
      const result = ${functionName}(largeInput);

      // Assert
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Adjust threshold as needed
      expect(result).toBeDefined();
    });

    it('should handle repeated calls efficiently', () => {
      // Arrange
      const input = { /* test input */ };
      const iterations = 1000;
      const startTime = performance.now();

      // Act
      for (let i = 0; i < iterations; i++) {
        ${functionName}(input);
      }

      // Assert
      const endTime = performance.now();
      const duration = endTime - startTime;
      const avgDuration = duration / iterations;

      expect(avgDuration).toBeLessThan(1); // Adjust threshold as needed
    });
  });

  describe('when data is modified', () => {
    it('should not modify input object', () => {
      // Arrange
      const input = { /* test input */ };
      const originalInput = { ...input };

      // Act
      ${functionName}(input);

      // Assert
      expect(input).toEqual(originalInput);
    });

    it('should return new object', () => {
      // Arrange
      const input = { /* test input */ };

      // Act
      const result = ${functionName}(input);

      // Assert
      expect(result).not.toBe(input);
    });
  });

  describe('when compared to global state', () => {
    it('should not depend on global state', () => {
      // Arrange
      const input = { /* test input */ };
      const globalState = { /* some global state */ };

      // Act
      const result1 = ${functionName}(input);

      // Modify global state
      globalState.someValue = 'modified';

      // Act again
      const result2 = ${functionName}(input);

      // Assert
      expect(result1).toEqual(result2);
    });
  });

  describe('when chained with other functions', () => {
    it('should work with chained functions', () => {
      // Arrange
      const input = { /* test input */ };

      // Act
      const result = ${functionName}(input)
        .then(otherFunction1)
        .then(otherFunction2);

      // Assert
      expect(result).toEqual(/* expected result */);
    });

    it('should handle deep nested chaining', () => {
      // Arrange
      const input = { /* test input */ };

      // Act
      const result = ${functionName}(input)
        .then(deepNestedFunction1)
        .then(deepNestedFunction2)
        .then(deepNestedFunction3);

      // Assert
      expect(result).toEqual(/* expected result */);
    });
  });

  describe('when used in search functionality', () => {
    it('should return correct results for exact match', () => {
      // Arrange
      const searchTerm = 'exact term';
      const data = [ /* test data with exact match */ ];

      // Act
      const result = ${functionName}(data, searchTerm);

      // Assert
      expect(result).toEqual([ /* expected results */ ]);
    });

    it('should return correct results for partial match', () => {
      // Arrange
      const searchTerm = 'partial';
      const data = [ /* test data with partial match */ ];

      // Act
      const result = ${functionName}(data, searchTerm);

      // Assert
      expect(result).toEqual([ /* expected results */ ]);
    });

    it('should return empty array for no matches', () => {
      // Arrange
      const searchTerm = 'no match';
      const data = [ /* test data with no matches */ ];

      // Act
      const result = ${functionName}(data, searchTerm);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
  `;
}
