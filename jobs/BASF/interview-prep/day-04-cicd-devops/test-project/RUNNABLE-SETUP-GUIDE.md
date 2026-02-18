# Complete Setup Guide - Day 4 CI/CD Practice Suite

## 🎯 Purpose

This guide provides **step-by-step instructions** to set up and run the complete Day 4 CI/CD practice suite. Follow this guide to have a fully functional test project ready for interview demonstration.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js** installed (v18.0.0 or higher)
  ```bash
  node --version  # Should show v18.x.x or higher
  ```

- [ ] **npm** installed (comes with Node.js)
  ```bash
  npm --version   # Should show 9.x.x or higher
  ```

- [ ] **Git** installed
  ```bash
  git --version
  ```

- [ ] **Docker** installed (optional, for containerization practice)
  ```bash
  docker --version
  ```

- [ ] **Internet connection** (tests use public APIs)

### Installing Prerequisites (if needed)

#### Node.js Installation
```bash
# macOS (using Homebrew)
brew install node

# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Docker Installation (Optional)
```bash
# macOS
brew install --cask docker

# Linux
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verify installation
docker --version
```

---

## 🚀 Setup Steps

### Step 1: Navigate to Test Project Directory

```bash
cd /home/michael/repos/2026-restart/jobs/BASF/interview-prep/day-04-cicd-devops/test-project
```

### Step 2: Install Dependencies

```bash
# Install all npm packages (takes 2-3 minutes)
npm install

# You should see output like:
# added 215 packages, and audited 216 packages in 2m
```

**Expected Output:**
```
added 215 packages in 2m
```

**Common Issues:**
- If installation fails, try: `npm cache clean --force` then retry
- If permissions error on Linux: Don't use `sudo npm install`

### Step 3: Verify Cypress Installation

```bash
# Verify Cypress binary is installed correctly
npm run ci:verify
```

**Expected Output:**
```
Cypress Version: 13.6.0
Verified Cypress!
```

### Step 4: Run Your First Test

```bash
# Run all tests in headless mode (as they run in CI)
npm test
```

**Expected Output:**
You should see:
- Cypress tests executing (2 test files, ~10 tests)
- Newman tests executing (Postman collection)
- Test summary with pass/fail counts
- Reports generated in `newman/` and `cypress/videos/`

**First run typically takes 3-5 minutes.**

---

## ✅ Verification Steps

### Verify Cypress Tests

```bash
# Run Cypress tests only
npm run test:cypress
```

**Expected behavior:**
- Tests run in headless Chrome browser
- Videos saved to `cypress/videos/`
- Screenshots saved on failures to `cypress/screenshots/`
- Console output shows test results

**Check the output:**
```bash
# List generated videos
ls -lh cypress/videos/

# You should see:
# 01-api-tests.cy.js.mp4
# 02-ui-tests.cy.js.mp4
```

### Verify Newman Tests

```bash
# Run Newman (Postman) tests only
npm run test:newman
```

**Expected behavior:**
- Newman executes Postman collection
- HTML report generated at `newman/report.html`
- JUnit XML generated at `newman/junit.xml`
- Console shows test summary

**Check the reports:**
```bash
# List generated reports
ls -lh newman/

# Open HTML report in browser (macOS)
open newman/report.html

# Linux
xdg-open newman/report.html
```

### Verify Interactive Cypress Mode

```bash
# Open Cypress Test Runner (GUI mode)
npm run test:cypress:headed
```

**Expected behavior:**
- Cypress Test Runner window opens
- You see list of test files
- Click any test to run it interactively
- Watch tests execute in real browser
- Use time-travel debugging

---

## 🐳 Docker Verification (Optional)

### Build Docker Images

```bash
# Navigate back to day-04 directory
cd /home/michael/repos/2026-restart/jobs/BASF/interview-prep/day-04-cicd-devops

# Build Cypress Docker image
docker build -f 03-pipeline-examples/Dockerfile.cypress -t basf-cypress-tests ./test-project

# Build Newman Docker image
docker build -f 03-pipeline-examples/Dockerfile.newman -t basf-newman-tests ./test-project
```

**Expected output:** Multi-stage build completes successfully

### Run Tests in Docker

```bash
# Run Cypress tests in container
docker run -it --rm \
  -v $PWD/test-project:/app \
  -w /app \
  basf-cypress-tests

# Run Newman tests in container
docker run -it --rm \
  -v $PWD/test-project/postman:/etc/newman \
  basf-newman-tests \
  run api-collection.json \
  -e environment.json \
  -r cli,htmlextra
```

---

## 📂 Project Structure Verification

After setup, your directory should look like:

```
test-project/
├── package.json                    ✅ Created
├── package-lock.json               ✅ Generated after npm install
├── node_modules/                   ✅ Generated (215+ packages)
├── cypress.config.js               ✅ Created
├── cypress/
│   ├── e2e/
│   │   ├── 01-api-tests.cy.js     ✅ Created
│   │   └── 02-ui-tests.cy.js      ✅ Created
│   ├── support/
│   │   ├── commands.js             ✅ Created
│   │   └── e2e.js                  ✅ Created
│   ├── videos/                     ✅ Generated after test run
│   └── screenshots/                ✅ Generated on failures
├── postman/
│   ├── api-collection.json         ✅ Created
│   └── environment.json            ✅ Created
├── newman/                         ✅ Generated after Newman run
│   ├── report.html
│   └── junit.xml
└── README.md                       ✅ Created
```

**Verify structure:**
```bash
# From test-project directory
tree -L 3 -I 'node_modules'
```

---

## 🧪 Test Execution Modes

### Mode 1: Quick Smoke Test (2 minutes)

```bash
# Run only API tests
npx cypress run --spec "cypress/e2e/01-api-tests.cy.js"
```

### Mode 2: Full Test Suite (5 minutes)

```bash
# Run all Cypress + Newman tests
npm test
```

### Mode 3: Interactive Development

```bash
# Open Cypress Test Runner for debugging
npm run test:cypress:headed
```

### Mode 4: CI/CD Simulation

```bash
# Simulate CI environment
CI=true npm run test:cypress

# With custom environment
CYPRESS_baseUrl=https://example.com npm run test:cypress
```

---

## 🔍 Troubleshooting Common Issues

### Issue 1: npm install fails with EACCES

**Problem:** Permission denied during installation

**Solution:**
```bash
# DON'T use sudo npm install

# Fix npm permissions (Linux/macOS)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Try installation again
npm install
```

### Issue 2: Cypress binary not found

**Problem:** "The cypress npm package is installed, but the Cypress binary is missing"

**Solution:**
```bash
# Clear Cypress cache and reinstall
npx cypress cache clear
npm install cypress --force
npx cypress install
npx cypress verify
```

### Issue 3: Tests timeout or fail

**Problem:** Tests fail with timeout errors

**Solution:**
```bash
# Check internet connection
curl https://jsonplaceholder.typicode.com/users

# Increase timeout in cypress.config.js
# Already set to 10000ms, but you can increase:
# defaultCommandTimeout: 20000

# Run with debug output
DEBUG=cypress:* npm run test:cypress
```

### Issue 4: Port already in use (Docker)

**Problem:** "Port 8080 is already allocated"

**Solution:**
```bash
# Find process using port
lsof -i :8080

# Kill the process or use different port
docker run -p 8081:8080 ...
```

### Issue 5: Newman command not found

**Problem:** "newman: command not found"

**Solution:**
```bash
# Install Newman globally
npm install -g newman newman-reporter-htmlextra

# Or use npx (no global install needed)
npx newman run postman/api-collection.json -e postman/environment.json
```

---

## 📊 Expected Test Results

### Cypress Tests - Expected Output

```
  API Tests - JSONPlaceholder
    GET Requests
      ✓ should retrieve all users (1234ms)
      ✓ should retrieve a specific user by ID (567ms)
      ✓ should retrieve posts for a specific user (890ms)
    POST Requests
      ✓ should create a new post (456ms)
    PUT Requests
      ✓ should update an existing post (678ms)
    DELETE Requests
      ✓ should delete a post (345ms)
    Error Handling
      ✓ should handle 404 for non-existent resource (234ms)

  UI Tests - Example.com
    Page Load Tests
      ✓ should load the homepage successfully (1456ms)
      ✓ should have proper meta tags (789ms)
    Link Tests
      ✓ should have a working "More information" link (567ms)
    Responsive Design Tests
      ✓ should render correctly on mobile (375x667) (1234ms)
      ✓ should render correctly on tablet (768x1024) (1345ms)
      ✓ should render correctly on desktop (1920x1080) (1456ms)

  13 passing (15s)
```

### Newman Tests - Expected Output

```
BASF CI/CD API Tests

→ User Management
  GET Get All Users
  ✓ Status code is 200
  ✓ Response time is less than 2000ms
  ✓ Content-Type is application/json
  ✓ Response is an array with at least 1 user
  ✓ First user has required properties

  GET Get User By ID
  ✓ Status code is 200
  ✓ User has valid email format
  ✓ User ID matches requested ID

→ Post Management
  ...

┌─────────────────────────┬────────────┬────────────┐
│                         │   executed │     failed │
├─────────────────────────┼────────────┼────────────┤
│              iterations │          1 │          0 │
├─────────────────────────┼────────────┼────────────┤
│                requests │          7 │          0 │
├─────────────────────────┼────────────┼────────────┤
│            test-scripts │         14 │          0 │
├─────────────────────────┼────────────┼────────────┤
│      assertions │         20 │          0 │
└─────────────────────────┴────────────┴────────────┘
```

---

## 🎓 Interview Demonstration Checklist

Before your interview, practice this demonstration flow:

- [ ] **Setup (1 minute)**
  - Open terminal in `test-project` directory
  - Show `package.json` and explain dependencies

- [ ] **Run Tests (2 minutes)**
  - Execute `npm test`
  - Explain what's happening in real-time

- [ ] **Show Results (2 minutes)**
  - Open video: `cypress/videos/01-api-tests.cy.js.mp4`
  - Open report: `newman/report.html`
  - Explain pass/fail metrics

- [ ] **Code Walkthrough (3 minutes)**
  - Open `cypress/e2e/01-api-tests.cy.js`
  - Explain test structure and assertions
  - Highlight custom commands in `cypress/support/commands.js`

- [ ] **CI/CD Integration (2 minutes)**
  - Show `03-pipeline-examples/github-actions.yml`
  - Explain how tests integrate into pipeline
  - Discuss artifact storage and reporting

- [ ] **Docker Demo (Optional, 2 minutes)**
  - Build Docker image
  - Run tests in container
  - Explain benefits of containerization

**Total demonstration: 10-12 minutes**

---

## 📝 Next Steps After Setup

1. **Run Tests Multiple Times**
   - Ensure consistent results
   - Verify retry logic works
   - Check artifact generation

2. **Modify Tests**
   - Change an assertion to see failure behavior
   - Add a new test case
   - Practice explaining your changes

3. **Explore Reports**
   - Open all generated reports
   - Understand what information they provide
   - Practice explaining them in English

4. **Practice Docker**
   - Build images successfully
   - Run tests in containers
   - Understand the Dockerfile structure

5. **Study Pipeline Configurations**
   - Read `github-actions.yml` line by line
   - Compare with `gitlab-ci.yml`
   - Understand `Jenkinsfile` syntax

6. **Prepare Interview Answers**
   - Review `02-interview-questions.md`
   - Write your own STAR format answers
   - Practice delivering them out loud

---

## 🆘 Getting Help

If you encounter issues:

1. **Check logs carefully**
   ```bash
   # Cypress debug mode
   DEBUG=cypress:* npm run test:cypress

   # Newman verbose mode
   npx newman run postman/api-collection.json -e postman/environment.json --verbose
   ```

2. **Verify environment**
   ```bash
   node --version      # Should be 18+
   npm --version       # Should be 9+
   npx cypress verify  # Should show version
   ```

3. **Clean install**
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

4. **Check test API availability**
   ```bash
   curl https://jsonplaceholder.typicode.com/users
   # Should return JSON array of users
   ```

---

## ✨ Success Criteria

Your setup is complete when you can:

✅ Run `npm test` without errors
✅ See passing tests in console output
✅ Find generated videos in `cypress/videos/`
✅ Open HTML report at `newman/report.html`
✅ Run tests in Docker containers
✅ Explain each test file's purpose
✅ Modify a test and re-run successfully

---

## 🎯 Ready for Interview!

You now have a **fully functional CI/CD test project** that demonstrates:

- ✅ Cypress E2E automation skills
- ✅ Newman/Postman API testing skills
- ✅ CI/CD pipeline integration knowledge
- ✅ Docker containerization understanding
- ✅ Test reporting and artifact management
- ✅ Professional code organization

**Practice your demonstration and you'll be interview-ready!**

---

**Estimated total setup time: 15-20 minutes (including installs)**

Good luck with your BASF interview! 🚀
