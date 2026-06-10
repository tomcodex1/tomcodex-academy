// Base Factory Class for Test Data Management
// Provides common functionality for all data factories

export class BaseFactory {
  constructor(model, defaults = {}) {
    this.model = model;
    this.defaults = defaults;
    this.sequence = 0;
  }

  // Generate a unique identifier
  generateId(prefix = 'id') {
    return `${prefix}-${this.sequence++}`;
  }

  // Merge defaults with provided attributes
  build(attributes = {}) {
    return {
      ...this.defaults,
      ...attributes,
      id: attributes.id || this.generateId()
    };
  }

  // Generate multiple instances
  create(count = 1, attributes = {}) {
    if (count === 1) {
      return this.build(attributes);
    }

    return Array.from({ length: count }, () => this.build(attributes));
  }

  // Validate generated data against schema
  validate(data, schema) {
    if (!schema) return { valid: true, errors: [] };

    try {
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

  // Generate and validate data
  buildValid(attributes = {}, schema) {
    const data = this.build(attributes);
    const validation = this.validate(data, schema);

    if (!validation.valid) {
      throw new Error(`Invalid data generated for ${this.model}: ${validation.errors.map(e => `${e.path}: ${e.message}`).join(', ')}`);
    }

    return data;
  }
}
