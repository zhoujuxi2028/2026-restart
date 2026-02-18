# CI/CD Test Project - Hands-On Practice

## Overview

This is a **fully functional test project** for practicing CI/CD pipeline integration with Cypress E2E tests and Newman API tests. Use this project to:
- Run tests locally before pushing to CI/CD
- Practice Docker containerization
- Test pipeline configurations
- Demonstrate your skills during interviews

## Project Structure

```
test-project/
├── package.json                 # Node.js dependencies and scripts
├── cypress.config.js            # Cypress configuration
├── cypress/
│   └── e2e/
│       ├── 01-api-tests.cy.js   # API testing examples
│       └── 02-ui-tests.cy.js    # UI testing examples
├── postman/
│   ├── api-collection.json      # Postman collection for API tests
│   └── environment.json         # Environment variables
└── README.md                    # This file
```

## Quick Start

### Prerequisites
```bash
# Ensure you have Node.js installed (v18+ recommended)
node --version

# Ensure you have npm installed
npm --version
```

### Installation

```bash
# Navigate to the test project directory
cd test-project

# Install all dependencies
npm install

# Verify Cypress installation
npm run ci:verify
```

### Running Tests

#### Run All Tests
```bash
npm test
```

#### Run Cypress Tests Only
```bash
# Headless mode (for CI/CD)
npm run test:cypress

# Interactive mode (for development)
npm run test:cypress:headed
```

#### Run Newman Tests Only
```bash
npm run test:newman
```

#### Run with Different Base URL
```bash
# Set custom base URL for Cypress
CYPRESS_baseUrl=https://example.com npm run test:cypress

# Set custom base URL for Newman
BASE_URL=https://api.example.com npm run test:newman
```

## Test Details

### Cypress E2E Tests

**01-api-tests.cy.js** - RESTful API Testing
- GET requests with validation
- POST requests (create resources)
- PUT requests (update resources)
- DELETE requests
- Error handling (404 scenarios)
- Response structure validation

**02-ui-tests.cy.js** - UI End-to-End Testing
- Page load tests
- Link validation
- Responsive design testing (mobile/tablet/desktop)
- Performance testing (load time budgets)
- Network condition simulation

**Key Features Demonstrated**:
- Test isolation with `beforeEach`
- Retry logic for flaky test handling
- Screenshot and video capture
- Custom command patterns
- Environment variable usage
- Data-driven testing

### Newman API Tests

**api-collection.json** - Postman Collection
- User management endpoints
- Post CRUD operations
- Error handling tests
- Request/response validation
- Collection variables
- Test scripts with assertions

**Key Features Demonstrated**:
- Comprehensive test assertions
- Collection and environment variables
- Pre-request scripts
- Test chaining (storing IDs for subsequent requests)
- Multiple reporter formats (CLI, HTML, JUnit)

## CI/CD Integration

### GitHub Actions

Copy the configuration to your repository:
```bash
mkdir -p .github/workflows
cp ../03-pipeline-examples/github-actions.yml .github/workflows/test.yml
```

### GitLab CI

```bash
cp ../03-pipeline-examples/gitlab-ci.yml .gitlab-ci.yml
```

### Jenkins

```bash
cp ../03-pipeline-examples/Jenkinsfile ./Jenkinsfile
```

## Docker Integration

### Build Docker Images

```bash
# Build Cypress image
docker build -f ../03-pipeline-examples/Dockerfile.cypress -t my-cypress-tests .

# Build Newman image
docker build -f ../03-pipeline-examples/Dockerfile.newman -t my-newman-tests .
```

### Run Tests in Docker

```bash
# Run Cypress tests in container
docker run -it --rm \
  -v $PWD:/app \
  -w /app \
  my-cypress-tests

# Run Newman tests in container
docker run -it --rm \
  -v $PWD/postman:/etc/newman \
  my-newman-tests \
  run api-collection.json \
  -e environment.json \
  -r cli,htmlextra
```

### Use Docker Compose

```bash
# Run all tests with docker-compose
docker-compose -f ../03-pipeline-examples/docker-compose.yml up --build

# View results
ls -la cypress/videos cypress/screenshots newman/
```

## Test Reports

### Cypress Reports
- **Videos**: `cypress/videos/` - Full test execution recordings
- **Screenshots**: `cypress/screenshots/` - Failure screenshots
- **Console**: Terminal output with pass/fail status

### Newman Reports
- **HTML Report**: `newman/report.html` - Detailed visual report
- **JUnit XML**: `newman/junit.xml` - For CI/CD integration
- **CLI Output**: Terminal summary

To view the HTML report:
```bash
# After running Newman tests
open newman/report.html  # macOS
xdg-open newman/report.html  # Linux
start newman/report.html  # Windows
```

## Interview Demonstration Tips

### Scenario 1: "Show me your test automation framework"

**Steps**:
1. Open this project in your IDE
2. Run `npm install && npm test`
3. Show the test execution and results
4. Open test files and explain key patterns
5. Show reports (videos, screenshots, HTML)

**Talking Points**:
- "I've structured tests with clear organization and naming conventions"
- "Tests use retry logic and proper assertions for reliability"
- "We generate multiple report formats for different audiences"
- "Configuration is externalized for environment flexibility"

### Scenario 2: "Explain your CI/CD setup"

**Steps**:
1. Show the pipeline configuration files
2. Explain each stage (install, lint, test, report)
3. Demonstrate Docker containerization
4. Show how artifacts are stored

**Talking Points**:
- "Our pipeline has 4 stages: build, test, report, deploy"
- "We use Docker for consistent test environments"
- "Tests run in parallel across browsers/workers"
- "Reports and videos are stored as artifacts for 7 days"

### Scenario 3: "How do you handle test failures?"

**Steps**:
1. Force a test failure (change an assertion)
2. Run the test suite
3. Show the failure output, screenshot, and video
4. Demonstrate debugging with Cypress Test Runner

**Talking Points**:
- "Cypress captures videos and screenshots automatically on failure"
- "We have retry logic configured for transient failures"
- "Test logs include detailed error messages and stack traces"
- "The interactive Test Runner helps debug issues locally"

## Common Interview Questions - With This Project

### Q1: "Walk me through your test automation setup"

**Answer using this project**:
"This project demonstrates my approach to test automation:
- **Framework**: Cypress for E2E and API tests, Newman for Postman collections
- **Organization**: Tests organized by type (API vs UI) with clear naming
- **Configuration**: Externalized config for different environments
- **CI/CD**: Ready-to-integrate pipeline configs for GitHub Actions, GitLab CI, Jenkins
- **Reporting**: Multiple formats - videos, screenshots, HTML, JUnit XML
- **Containerization**: Dockerfiles for reproducible test environments"

### Q2: "How do you ensure test reliability?"

**Answer**:
"Several strategies demonstrated in this project:
- **Retry Logic**: Configured 2 retries in CI mode (`cypress.config.js:32`)
- **Test Isolation**: Each test runs independently with fresh state
- **Explicit Waits**: No arbitrary sleeps, only explicit waits for conditions
- **Error Handling**: Proper use of `failOnStatusCode: false` for error scenarios
- **Assertions**: Comprehensive assertions on status, headers, body structure"

### Q3: "How do you integrate tests into CI/CD?"

**Answer**:
"This project includes three pipeline configurations:
- **GitHub Actions**: Matrix strategy for parallel browser testing
- **GitLab CI**: Docker-in-Docker for containerized execution
- **Jenkins**: Declarative pipeline with parallel stages

Key integration points:
- Tests run on every PR and merge
- Reports generated as artifacts
- Notifications on failure
- Environment-specific configurations"

## Troubleshooting

### Issue: Cypress installation fails

**Solution**:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tests fail with "baseUrl" error

**Solution**:
The tests use public APIs that should always be available. If issues persist:
```bash
# Verify internet connection
curl https://jsonplaceholder.typicode.com/users

# Check Cypress configuration
cat cypress.config.js
```

### Issue: Docker build fails

**Solution**:
```bash
# Ensure Docker is running
docker ps

# Build with no cache
docker build --no-cache -f ../03-pipeline-examples/Dockerfile.cypress -t my-cypress-tests .
```

### Issue: Newman command not found

**Solution**:
```bash
# Install Newman globally
npm install -g newman newman-reporter-htmlextra

# Or use local installation
npx newman run postman/api-collection.json -e postman/environment.json
```

## Next Steps

1. **Customize Tests**: Modify tests to match your actual application under test
2. **Add Tests**: Create additional test files for more coverage
3. **Configure CI**: Push to GitHub/GitLab and see tests run in CI/CD
4. **Practice Explanations**: Record yourself explaining the project
5. **Extend Examples**: Add authentication, database tests, visual regression

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Postman Learning Center](https://learning.postman.com/)
- [Newman CLI Docs](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- [Docker Documentation](https://docs.docker.com/)

## Interview Checklist

Before your interview, ensure you can:
- [ ] Run all tests successfully
- [ ] Explain each test file's purpose
- [ ] Describe the CI/CD integration approach
- [ ] Show Docker containerization benefits
- [ ] Demonstrate test failure debugging
- [ ] Explain report generation and artifact storage
- [ ] Discuss test reliability strategies
- [ ] Walk through the project structure confidently

---

**Good luck with your BASF interview! This project demonstrates real-world skills that QA automation engineers use daily.**
