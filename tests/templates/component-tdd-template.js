// Component TDD Template
// Provides a template for writing TDD tests for UI components

export function createComponentTDDTemplate(componentName) {
  return `
describe('${componentName}', () => {
  // Setup
  let component;
  let container;
  let mockProps;

  beforeEach(() => {
    // Setup test environment
    container = document.createElement('div');
    document.body.appendChild(container);

    // Mock props
    mockProps = {
      // Add mock props here
      title: 'Test Component',
      data: []
    };

    // Create component instance
    component = new ${componentName}(container, mockProps);
  });

  // Teardown
  afterEach(() => {
    // Cleanup
    if (component && typeof component.destroy === 'function') {
      component.destroy();
    }

    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  // Test cases
  describe('when rendering', () => {
    it('should render correctly', () => {
      // Arrange
      component.render();

      // Act
      const element = container.querySelector('.${componentName.toLowerCase()}');

      // Assert
      expect(element).toBeTruthy();
      expect(element.classList.contains('${componentName.toLowerCase()}')).toBe(true);
    });

    it('should display correct content', () => {
      // Arrange
      component.render();

      // Act
      const titleElement = container.querySelector('.title');

      // Assert
      expect(titleElement.textContent).toBe('Test Component');
    });

    it('should render data items', () => {
      // Arrange
      mockProps.data = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];
      component.render();

      // Act
      const items = container.querySelectorAll('.data-item');

      // Assert
      expect(items.length).toBe(2);
      expect(items[0].textContent).toContain('Item 1');
      expect(items[1].textContent).toContain('Item 2');
    });
  });

  describe('when user interacts', () => {
    it('should handle click event', () => {
      // Arrange
      const clickHandler = jest.fn();
      mockProps.onClick = clickHandler;
      component.render();

      const button = container.querySelector('button');

      // Act
      button.click();

      // Assert
      expect(clickHandler).toHaveBeenCalledTimes(1);
    });

    it('should update state on input change', () => {
      // Arrange
      component.render();

      const input = container.querySelector('input');
      const newValue = 'new value';

      // Act
      input.value = newValue;
      input.dispatchEvent(new Event('input'));

      // Assert
      expect(component.state.inputValue).toBe(newValue);
    });

    it('should handle form submission', () => {
      // Arrange
      const submitHandler = jest.fn();
      mockProps.onSubmit = submitHandler;
      component.render();

      const form = container.querySelector('form');

      // Act
      form.dispatchEvent(new Event('submit'));

      // Assert
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('when error occurs', () => {
    it('should display error message', () => {
      // Arrange
      mockProps.showError = true;
      mockProps.errorMessage = 'Test error';
      component.render();

      // Act
      const errorElement = container.querySelector('.error');

      // Assert
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toBe('Test error');
    });

    it('should handle loading state', () => {
      // Arrange
      mockProps.isLoading = true;
      component.render();

      // Act
      const loadingElement = container.querySelector('.loading');

      // Assert
      expect(loadingElement).toBeTruthy();
      expect(loadingElement.classList.contains('loading')).toBe(true);
    });
  });

  describe('when props change', () => {
    it('should update component when props change', () => {
      // Arrange
      component.render();

      // Update props
      mockProps.title = 'Updated Title';

      // Act
      component.update(mockProps);

      // Assert
      const titleElement = container.querySelector('.title');
      expect(titleElement.textContent).toBe('Updated Title');
    });
  });

  describe('when data changes', () => {
    it('should update when data changes', () => {
      // Arrange
      component.render();

      // Update data
      mockProps.data = [
        { id: 3, name: 'New Item' }
      ];

      // Act
      component.update(mockProps);

      // Assert
      const items = container.querySelectorAll('.data-item');
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain('New Item');
    });
  });
});
  `;
}
