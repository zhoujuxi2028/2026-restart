# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This is a **Docker-based test automation demonstration** for BASF QA Automation Engineer interview preparation (Day 6: DevOps & Containers). It showcases production-ready practices for containerizing Cypress E2E tests and Newman API tests with full-stack orchestration.

**Primary Language**: English (for interview preparation)
**Key Technologies**: Docker, Docker Compose, Kubernetes, Cypress, Newman, Node.js, PostgreSQL, Redis

## Quick Start Commands

### Complete Environment Setup and Verification
```bash
# Automated verification (recommended first run)
./verify-environment.sh

# This script will:
# 1. Check prerequisites (Docker, Docker Compose)
# 2. Verify all required files exist
# 3. Create test results directories
# 4. Start all services (database, redis, web-app)
# 5. Run Cypress tests
# 6. Run Newman API tests
# 7. Display results and status
```

### Manual Docker Compose Workflow
```bash
# Start all services in background
docker-compose up -d

# Check service health status
docker-compose ps

# View logs for specific service
docker-compose logs -f web-app
docker-compose logs database
docker-compose logs redis

# Run Cypress tests (requires services to be healthy)
docker-compose up cypress-tests

# Run Newman API tests
docker-compose up newman-tests

# Run both test suites together
docker-compose up cypress-tests newman-tests

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Individual Docker Image Commands
```bash
# Build Cypress test image
docker build -f Dockerfile.cypress -t my-cypress-tests .

# Build Newman test image
docker build -f Dockerfile.newman -t my-newman-tests .

# Run Cypress tests standalone
docker run --rm my-cypress-tests

# Run Newman tests standalone
docker run --rm my-newman-tests
```

### Local Testing (Without Docker)
```bash
# Install dependencies
npm install

# Run Cypress tests locally
npm run test:cypress

# Run Newman tests locally
npm run test:newman
```

### Kubernetes Deployment
```bash
# Deploy all resources to Kubernetes
kubectl apply -f k8s-cypress-job.yaml

# Check job status
kubectl get jobs -n test-automation

# View pod logs
kubectl logs -l app=cypress -n test-automation

# Watch job progress
kubectl get pods -n test-automation -w

# Cleanup
kubectl delete namespace test-automation
```

### Test Results
```bash
# View Cypress videos
ls -lh test-results/cypress/videos/

# View Cypress screenshots
ls -lh test-results/cypress/screenshots/

# Open Newman HTML report
firefox test-results/newman/newman-report.html
# or
open test-results/newman/newman-report.html
```

## Architecture Overview

### Service Architecture
This project demonstrates a **multi-service testing environment** using Docker Compose:

```
┌─────────────────────────────────────────┐
│      Docker Compose Network             │
│      (basf-test-network)                │
├─────────────────────────────────────────┤
│                                          │
│  ┌──────────┐        ┌──────────┐      │
│  │PostgreSQL│        │  Redis   │      │
│  │  :5432   │        │  :6379   │      │
│  └────▲─────┘        └────▲─────┘      │
│       │                   │             │
│       └─────────┬─────────┘             │
│                 │                       │
│          ┌──────▼────────┐              │
│          │   Web App     │              │
│          │ (Node.js)     │              │
│          │   :3000       │              │
│          └──────▲────────┘              │
│                 │                       │
│      ┏━━━━━━━━━━┻━━━━━━━━━━┓           │
│      ┃   Test Services     ┃           │
│      ┃  (Run as needed)    ┃           │
│      ┣━━━━━━━━━━┳━━━━━━━━━━┫           │
│      ┃ Cypress  ┃ Newman   ┃           │
│      ┃  Tests   ┃  Tests   ┃           │
│      ┗━━━━━━━━━━┻━━━━━━━━━━┛           │
│                                          │
└─────────────────────────────────────────┘
```

### Service Dependencies and Health Checks

**Critical Understanding**: Services use `depends_on` with `condition: service_healthy` to ensure:
1. PostgreSQL starts first and becomes healthy (can accept connections)
2. Redis starts and becomes healthy (responds to PING)
3. Web app waits for both database and Redis, then becomes healthy (health endpoint returns 200)
4. Test services (Cypress, Newman) only start after web app is healthy

This prevents **flaky tests** caused by tests running before services are ready.

### Key Files and Their Roles

- **docker-compose.yml**: Orchestrates 5 services (web-app, database, redis, cypress-tests, newman-tests)
- **Dockerfile.cypress**: Containerizes Cypress tests with layer caching optimization
- **Dockerfile.newman**: Containerizes Newman tests with Alpine-based Node.js
- **app/Dockerfile**: Web application container (Node.js + Express)
- **app/server.js**: REST API with endpoints for users and cache operations
- **db-init/init.sql**: PostgreSQL initialization script (creates users table with test data)
- **cypress/e2e/api-tests.cy.js**: Cypress API tests (health, users CRUD, cache operations)
- **collections/API-Collection.json**: Postman collection for Newman
- **environments/docker-compose-env.json**: Newman environment variables
- **verify-environment.sh**: Automated verification script
- **k8s-cypress-job.yaml**: Kubernetes resources (namespace, configmap, secret, PVC, job, cronjob) for parallel execution

## Common Development Workflows

### Debugging Test Failures

```bash
# 1. Check service logs first
docker-compose logs web-app | tail -50

# 2. Verify all services are healthy
docker-compose ps
# Should show (healthy) status for database, redis, web-app

# 3. Test endpoints manually
curl http://localhost:3000/health
curl http://localhost:3000/api/users

# 4. Run tests with interactive shell for debugging
docker-compose run --rm cypress-tests sh
# Inside container:
npx cypress run --spec "cypress/e2e/api-tests.cy.js"

# 5. Check test results
ls -la test-results/cypress/videos/
```

### Modifying Tests

```bash
# 1. Edit test file locally
vim cypress/e2e/api-tests.cy.js

# 2. Rebuild Cypress image (if dependencies changed)
docker-compose build cypress-tests

# 3. Run updated tests
docker-compose up cypress-tests

# Alternative: Run locally without Docker for faster iteration
npm install
npx cypress open
```

### Adding New Services

```bash
# 1. Add service definition to docker-compose.yml
# 2. Add to test-network
# 3. Configure health check
# 4. Set depends_on for proper startup order
# 5. Test with:
docker-compose up -d new-service
docker-compose ps
docker-compose logs new-service
```

### CI/CD Integration Pattern

The docker-compose setup is CI-ready:

```yaml
# Example GitLab CI (see docker-compose.yml for more examples)
test:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker-compose up -d web-app database redis
    - sleep 10  # Wait for health checks
    - docker-compose run --rm cypress-tests
    - docker-compose run --rm newman-tests
  after_script:
    - docker-compose down -v
  artifacts:
    when: always
    paths:
      - test-results/
```

## Interview-Relevant Talking Points

When discussing this project during interviews:

### Docker Benefits
- **"Eliminates 'works on my machine' problem"**: Same Docker image runs everywhere (dev, CI, staging)
- **"Layer caching reduces build time"**: Dependencies cached, only test code changes rebuild
- **"Isolated test environment"**: Each run can be completely independent with clean data

### Docker Compose Benefits
- **"Complete environment in one command"**: `docker-compose up` starts 5 services with proper ordering
- **"Health checks prevent flaky tests"**: Tests don't start until services are ready
- **"New developer onboarding"**: 5 minutes to running tests vs 2 hours of manual setup

### Kubernetes Benefits
- **"Parallel execution at scale"**: 800 tests in 9 minutes (parallelism=10) vs 90 minutes sequential
- **"Resource management"**: Memory/CPU limits prevent infrastructure exhaustion
- **"Scheduled testing"**: CronJob enables automated nightly regression runs

### Best Practices Demonstrated
1. **Specific version tags** (not :latest) for reproducibility
2. **Layer caching optimization** in Dockerfiles
3. **Health checks** for all services
4. **Environment variable configuration** for flexibility
5. **.dockerignore** to reduce build context
6. **Volume mounts** for test results collection
7. **Graceful shutdown** handling in app
8. **Kubernetes resource limits** and namespaces

## Troubleshooting Common Issues

### Port Already in Use
```bash
# Change port mapping in docker-compose.yml
ports:
  - "3001:3000"  # Changed from 3000:3000
```

### Services Not Healthy
```bash
# Wait longer or check logs
docker-compose ps  # Check health status
docker-compose logs database  # Check specific service
```

### Permission Denied on test-results/
```bash
# Fix permissions
chmod -R 777 test-results/
```

### Tests Fail with Connection Refused
```bash
# Ensure services are on same network and healthy
docker-compose ps
# Wait for (healthy) status before running tests
```

### Docker Daemon Not Running
```bash
# Linux
sudo systemctl start docker

# macOS/Windows: Start Docker Desktop
```

## Environment Variables

Key environment variables used across services:

- `NODE_ENV=test`: Sets Node.js environment
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `CYPRESS_BASE_URL`: Target URL for Cypress tests
- `BASE_URL`: Target URL for Newman tests
- `CYPRESS_VIDEO=true`: Enable video recording
- `API_KEY`: API authentication key

## Understanding Test Results

### Cypress Results
- **Videos**: `test-results/cypress/videos/` - Full test execution recordings
- **Screenshots**: `test-results/cypress/screenshots/` - Failure screenshots
- **Exit code**: 0 = all passed, non-zero = failures

### Newman Results
- **HTML Report**: `test-results/newman/newman-report.html` - Detailed visual report
- **Console output**: Shows request/response details and assertion results
- **Exit code**: 0 = all passed, non-zero = failures

## Kubernetes Parallel Execution

The `k8s-cypress-job.yaml` demonstrates enterprise-scale testing:

- **Namespace**: `test-automation` for resource isolation
- **ConfigMap**: Centralized configuration management
- **Secret**: Secure credential storage
- **PersistentVolumeClaim**: Shared storage for test results
- **Job with parallelism=10**: Runs 10 pods simultaneously
- **CronJob**: Scheduled execution (daily at 2 AM)

This enables running 800 Cypress tests in ~9 minutes instead of 90 minutes sequential execution.

## Documentation References

- **README.md**: Overview of all files and interview preparation points
- **QUICKSTART.md**: Step-by-step setup guide with troubleshooting
- **SETUP-COMPLETE.md**: Detailed setup completion documentation
- **VERIFICATION-RESULTS.md**: Verification script output and results

## Notes for Future Modifications

- **Keep Docker images updated**: Current base images are Cypress 12.17.0, Postgres 15, Redis 7
- **Volume mounts**: Persistent data is disabled by default (clean slate each run)
- **Parallelism**: Can scale web-app with `docker-compose up --scale web-app=3`
- **Test isolation**: Each service restart gives clean state (useful for test independence)
