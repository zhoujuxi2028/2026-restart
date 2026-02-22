# Quick Start Guide - Docker Testing Environment

## Prerequisites

1. **Docker** installed and running
   ```bash
   docker --version
   # Should show: Docker version 20.x or higher
   ```

2. **Docker Compose** installed
   ```bash
   docker-compose --version
   # Should show: Docker Compose version 2.x or higher
   ```

## Quick Start (5 minutes)

### Step 1: Verify Files
```bash
cd /path/to/03-docker-examples
ls -la

# You should see:
# - app/
# - collections/
# - cypress/
# - db-init/
# - environments/
# - docker-compose.yml
# - Dockerfile.cypress
# - Dockerfile.newman
# - package.json
```

### Step 2: Create Test Results Directories
```bash
mkdir -p test-results/cypress/{videos,screenshots,results}
mkdir -p test-results/newman
chmod -R 777 test-results/
```

### Step 3: Start All Services
```bash
# Start all services in background
docker-compose up -d

# This will:
# 1. Pull/build Docker images (first time only, ~5-10 min)
# 2. Start PostgreSQL database
# 3. Start Redis cache
# 4. Start web application
# 5. Wait for health checks
```

### Step 4: Check Service Status
```bash
# View all running containers
docker-compose ps

# You should see:
# - basf-postgres (healthy)
# - basf-redis (healthy)
# - basf-web-app (healthy)

# View logs
docker-compose logs web-app
```

### Step 5: Verify Application is Running
```bash
# Test health endpoint
curl http://localhost:3000/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2026-02-22T...",
#   "service": "basf-test-app"
# }

# Test users API
curl http://localhost:3000/api/users

# Expected response:
# {
#   "success": true,
#   "count": 5,
#   "data": [...]
# }
```

### Step 6: Run Tests

#### Option A: Run Cypress Tests
```bash
docker-compose up cypress-tests

# Watch output for test results
# Results saved to: test-results/cypress/
```

#### Option B: Run Newman API Tests
```bash
docker-compose up newman-tests

# Watch output for test results
# Results saved to: test-results/newman/
```

#### Option C: Run Both Test Suites
```bash
docker-compose up cypress-tests newman-tests
```

### Step 7: View Test Results
```bash
# View Cypress videos
ls -lh test-results/cypress/videos/

# View Newman HTML report
open test-results/newman/newman-report.html
# or
firefox test-results/newman/newman-report.html
```

### Step 8: Cleanup
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Remove test results
rm -rf test-results/
```

## Troubleshooting

### Issue: Port 3000 already in use
**Solution**: Change port in docker-compose.yml
```yaml
web-app:
  ports:
    - "3001:3000"  # Changed from 3000:3000
```

### Issue: Services not healthy
**Solution**: Check logs
```bash
docker-compose logs database
docker-compose logs redis
docker-compose logs web-app
```

### Issue: Tests fail immediately
**Solution**: Ensure services are healthy first
```bash
# Wait for all services to be healthy
docker-compose ps

# Should show (healthy) for all services
# If not, wait a few more seconds
```

### Issue: Permission denied on test-results
**Solution**: Fix permissions
```bash
chmod -R 777 test-results/
```

### Issue: Docker daemon not running
**Solution**: Start Docker
```bash
# Linux
sudo systemctl start docker

# macOS/Windows
# Start Docker Desktop application
```

## Understanding the Environment

### Service Architecture
```
┌─────────────────────────────────────┐
│        Docker Compose Network       │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────┐  ┌──────────┐      │
│  │ PostgreSQL│  │  Redis   │      │
│  │  (5432)   │  │  (6379)  │      │
│  └─────▲─────┘  └─────▲────┘      │
│        │              │            │
│  ┌─────┴──────────────┴────┐      │
│  │     Web Application      │      │
│  │      (port 3000)         │      │
│  └─────▲────────────────────┘      │
│        │                            │
│  ┌─────┴────┐  ┌──────────┐       │
│  │  Cypress │  │  Newman  │       │
│  │  Tests   │  │  Tests   │       │
│  └──────────┘  └──────────┘       │
│                                     │
└─────────────────────────────────────┘
```

### Data Flow
1. Database initializes with test data (5 users)
2. Web app connects to database and Redis
3. Health checks ensure services are ready
4. Cypress tests run against web app
5. Newman tests run against API endpoints
6. Results saved to mounted volumes

## Next Steps

1. **Modify Tests**: Edit files in `cypress/e2e/`
2. **Add API Endpoints**: Edit `app/server.js`
3. **Add Database Tables**: Edit `db-init/init.sql`
4. **Run Tests Locally**: `npm install && npm run test:cypress`
5. **Integrate with CI**: Use in GitHub Actions/GitLab CI

## Interview Talking Points

When discussing this setup:

1. **"Complete environment in one command"**
   - `docker-compose up` starts database, cache, app, and tests
   - No manual setup, consistent across all machines

2. **"Health checks prevent flaky tests"**
   - Tests don't start until services are ready
   - `depends_on` with `condition: service_healthy`

3. **"Isolated testing environment"**
   - Custom network prevents interference
   - Each run can be completely independent

4. **"Easy CI/CD integration"**
   - Same docker-compose.yml works in CI
   - Artifacts mounted to volumes for CI to collect

5. **"Scalability"**
   - Easy to add new services (ElasticSearch, message queues)
   - Can scale services: `docker-compose up --scale web-app=3`

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Newman Documentation](https://www.npmjs.com/package/newman)
