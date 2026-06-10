# Contract Testing Implementation

## Overview

This document outlines the implementation of contract testing for the Salesforce Master Dashboard project. Contract testing ensures that API consumers and producers work together correctly, preventing integration issues.

## What is Contract Testing?

Contract testing is a methodology for testing the interactions between services by creating formal "contracts" that describe these interactions. It ensures that services can communicate correctly without requiring full integration.

## Benefits

1. **Early Detection of Integration Issues**: Catch API compatibility issues before deployment
2. **Independent Development Teams**: Services can be developed and tested independently
3. **Comprehensive API Validation**: Ensures both the provider and consumer validate the contract
4. **Reduced Test Complexity**: Tests are focused on specific contracts rather than full systems

## Implementation Plan

### Phase 1: Setup (Week 1)
1. **Install and Configure PACT**
   ```bash
   npm install --save-dev @pact-foundation/pact
   ```

2. **Create Contract Testing Configuration**
   - Set up PACT for both consumer and provider tests
   - Configure test output directories
   - Set up publishing of contracts to a Pact Broker

3. **Identify API Contracts**
   - Document all public API endpoints
   - Define request/response schemas
   - Identify authentication requirements
   - List error scenarios

### Phase 2: Consumer Contract Testing (Week 2)
1. **Create Consumer Test Files**
   - Implement tests for each API consumer
   - Focus on frontend API calls in `js/ai-client.js` and other API-related modules

2. **Define Consumer Contracts**
   ```javascript
   // Example test for ai-client.js
   const { Pact, Matchers } = require('@pact-foundation/pact');
   const path = require('path');

   const pact = new Pact({
     consumer: 'SalesforceDashboard',
     provider: 'AIService',
     port: 1234,
     log: path.resolve(process.cwd(), 'logs', 'pact.log'),
     dir: path.resolve(process.cwd(), 'pacts'),
     logLevel: 'INFO'
   });

   describe('AI Service API Pact', () => {
     beforeEach(() => pact.setup());
     afterEach(() => pact.finalize());

     describe('when a request is made to get AI feedback', () => {
       beforeEach(() => {
         return pact.addInteraction({
           state: 'AI service is available',
           uponReceiving: 'a request for AI feedback',
           withRequest: {
             method: 'POST',
             path: '/api/ai/feedback',
             headers: {
               'Content-Type': 'application/json',
               'Authorization': Matchers.like('Bearer token')
             },
             body: {
               code: Matchers.like('public class Example {}'),
               language: 'Apex'
             }
           },
           willRespondWith: {
             status: 200,
             headers: {
               'Content-Type': 'application/json'
             },
             body: {
               feedback: Matchers.like('This code has good structure'),
               suggestions: Matchers.eachLike('Consider adding error handling')
             }
           }
         });
       });

       test('should return AI feedback', async () => {
         const response = await getAIFeedback('public class Example {}', 'Apex');
         expect(response.feedback).toBeTruthy();
         expect(response.suggestions).toBeTruthy();
       });
     });
   });
   ```

3. **Run Consumer Tests**
   - Execute consumer tests against the mock provider
   - Generate contract files
   - Verify contracts are correctly defined

### Phase 3: Provider Contract Testing (Week 3)
1. **Create Provider Test Files**
   - Implement tests for each API provider in the `server/` directory
   - Focus on the actual implementation of API endpoints

2. **Define Provider Contracts**
   ```javascript
   // Example test for server/ai-evaluator-route.js
   const path = require('path');
   const { Pact } = require('@pact-foundation/pact');
   const chai = require('chai');
   const chaiAsPromised = require('chai-as-promised');
   const evaluatorService = require('./ai-evaluator-route');

   const expect = chai.expect;
   chai.use(chaiAsPromised);

   describe('AI Evaluator Provider Pact', () => {
     let provider;

     before(() => {
       provider = new Pact({
         provider: 'AIService',
         consumer: 'SalesforceDashboard',
         port: 1234,
         log: path.resolve(process.cwd(), 'logs', 'provider-pact.log'),
         dir: path.resolve(process.cwd(), 'pacts'),
         logLevel: 'INFO'
       });

       provider.setup();
     });

     after(() => {
       provider.finalize();
     });

     describe /api/ai/feedback', () => {
       before(() => {
         return provider.addInteraction({
           state: 'AI service is available',
           uponReceiving: 'a request for AI feedback',
           withRequest: {
             method: 'POST',
             path: '/api/ai/feedback',
             headers: {
               'Content-Type': 'application/json',
               'Authorization': Matchers.like('Bearer token')
             },
             body: {
               code: 'public class Example {}',
               language: 'Apex'
             }
           },
           willRespondWith: {
             status: 200,
             headers: {
               'Content-Type': 'application/json'
             },
             body: {
               feedback: 'This code has good structure',
               suggestions: ['Consider adding error handling']
             }
           }
         });
       });

       test('should return AI feedback', async () => {
         const response = await evaluatorService.getFeedback({
           code: 'public class Example {}',
           language: 'Apex'
         });

         expect(response).to.deep.equal({
           feedback: 'This code has good structure',
           suggestions: ['Consider adding error handling']
         });
       });
     });
   });
   ```

3. **Run Provider Tests**
   - Execute provider tests against the mock consumer
   - Validate that provider responses match the contract
   - Fix any contract mismatches

### Phase 4: Integration with CI/CD (Week 4)
1. **Configure Pact Broker**
   - Set up a Pact Broker (can be Docker-based)
   - Configure publishing of contracts to the broker
   - Set up contract verification in CI/CD

2. **Update CI/CD Pipeline**
   ```yaml
   # Example GitHub Actions workflow
   name: Contract Testing

   on: [push, pull_request]

   jobs:
     consumer-tests:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Set up Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
         - name: Install dependencies
           run: npm install
         - name: Run consumer tests
           run: npm run test:consumer
         - name: Publish contracts
           run: npm run publish:pacts
           env:
             PACT_BROKER_BASE_URL: ${{ secrets.PACT_BROKER_BASE_URL }}
             PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}

     provider-tests:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Set up Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
         - name: Install dependencies
           run: npm install
         - name: Run provider tests
           run: npm run test:provider
         - name: Verify contracts
           run: npm run verify:contracts
           env:
             PACT_BROKER_BASE_URL: ${{ secrets.PACT_BROKER_BASE_URL }}
             PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
   ```

3. **Add Pact Verification Step**
   - Verify contracts against the latest version in CI/CD
   - Fail builds if contracts are not verified
   - Generate and publish verification results

### Phase 5: Continuous Improvement (Ongoing)
1. **Regular Contract Reviews**
   - Schedule regular contract review meetings
   - Update contracts as APIs evolve
   - Maintain documentation of contract changes

2. **Contract Versioning**
   - Implement semantic versioning for contracts
   - Maintain backward compatibility where possible
   - Plan for breaking changes with proper communication

3. **Performance Monitoring**
   - Monitor contract test execution time
   - Track contract verification success rate
   - Identify and address performance bottlenecks

## Best Practices

1. **Start Simple**: Begin with critical APIs and expand gradually
2. **Clear Contracts**: Ensure contracts are unambiguous and comprehensive
3. **Regular Updates**: Update contracts as APIs change
4. **Documentation**: Maintain clear documentation of all contracts
5. **Collaboration**: Foster collaboration between consumer and provider teams

## Success Metrics

1. **Contract Coverage**: 100% of public APIs covered by contracts
2. **Integration Issues**: 90% reduction in API-related integration issues
3. **Test Speed**: Contract tests complete in < 2 minutes
4. **Contract Verification**: 100% success rate in CI/CD

## Conclusion

Contract testing will significantly improve the reliability of API integrations in the Salesforce Master Dashboard project. By implementing a comprehensive contract testing strategy, we can catch integration issues early, reduce testing complexity, and enable independent development of services.
