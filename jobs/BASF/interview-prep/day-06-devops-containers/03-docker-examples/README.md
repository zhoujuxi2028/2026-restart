# Docker Examples for Test Automation

This directory contains practical Docker and Kubernetes examples for containerizing test automation.

## Files Overview

### 1. Dockerfile.cypress
**Purpose:** Containerize Cypress E2E tests

**Key Features:**
- Based on official `cypress/included` image
- Optimized layer caching for fast builds
- Configurable via environment variables
- Includes health checks

**Build and run:**
```bash
docker build -f Dockerfile.cypress -t my-cypress-tests .
docker run --rm my-cypress-tests
```

### 2. Dockerfile.newman
**Purpose:** Containerize Newman (Postman) API tests

**Key Features:**
- Lightweight Alpine-based Node.js image
- Newman with HTML reporters included
- Easy collection and environment management

**Build and run:**
```bash
docker build -f Dockerfile.newman -t my-newman-tests .
docker run --rm my-newman-tests
```

### 3. docker-compose.yml
**Purpose:** Full-stack testing environment

**Services:**
- `web-app`: Application under test
- `database`: PostgreSQL database
- `redis`: Redis cache
- `cypress-tests`: Cypress E2E tests
- `newman-tests`: Postman/Newman API tests

**Usage:**
```bash
# Start all services
docker-compose up

# Run tests only
docker-compose up cypress-tests newman-tests

# Stop and cleanup
docker-compose down -v
```

### 4. k8s-cypress-job.yaml
**Purpose:** Kubernetes Job for parallel Cypress execution

**Resources:**
- Namespace for test isolation
- ConfigMap for configuration
- Secret for credentials
- PersistentVolumeClaim for results
- Job with parallelism=10
- CronJob for scheduled tests

**Usage:**
```bash
# Apply all resources
kubectl apply -f k8s-cypress-job.yaml

# Check status
kubectl get jobs -n test-automation

# View logs
kubectl logs -l app=cypress -n test-automation

# Cleanup
kubectl delete namespace test-automation
```

## Quick Start

### Local Development with Docker Compose
```bash
# 1. Ensure Docker and Docker Compose are installed
docker --version
docker-compose --version

# 2. Start the environment
docker-compose up -d

# 3. View logs
docker-compose logs -f

# 4. Cleanup
docker-compose down -v
```

### Kubernetes Deployment
```bash
# 1. Ensure kubectl is configured
kubectl cluster-info

# 2. Deploy test job
kubectl apply -f k8s-cypress-job.yaml

# 3. Watch progress
kubectl get pods -n test-automation -w

# 4. Collect results
kubectl logs -l app=cypress -n test-automation

# 5. Cleanup
kubectl delete namespace test-automation
```

## Interview Preparation

### Key Talking Points

**Docker Benefits:**
- "Docker solves the 'works on my machine' problem by providing consistent environments"
- "We use layer caching to reduce build times from 8 minutes to 2 minutes"
- "Same Docker image runs in development, CI, and staging"

**Docker Compose Benefits:**
- "Docker Compose allows us to start our entire test environment with one command"
- "Health checks ensure services are ready before tests run, eliminating flaky tests"
- "New developers can run tests in 5 minutes vs 2 hours of manual setup"

**Kubernetes Benefits:**
- "Kubernetes enables us to run 800 tests in 9 minutes instead of 90 minutes through parallelization"
- "Resource limits ensure tests don't consume too much infrastructure"
- "CronJobs allow scheduled regression testing without manual intervention"

### Common Interview Questions

**Q: Why containerize tests?**
A: Consistency across environments, faster setup, isolation, easy CI/CD integration, and reproducibility.

**Q: When to use Kubernetes vs Docker Compose?**
A: Docker Compose for small teams and simple setups (<100 tests). Kubernetes for large-scale parallel execution (>500 tests) or complex orchestration needs.

**Q: How do you collect test results from containers?**
A: Volume mounts for Docker, PersistentVolumeClaims for Kubernetes, or upload to cloud storage (S3, etc.).

## Best Practices Demonstrated

1. ✅ Use official base images
2. ✅ Tag specific versions (not :latest)
3. ✅ Optimize layer caching
4. ✅ Use .dockerignore
5. ✅ Implement health checks
6. ✅ Configure via environment variables
7. ✅ Use docker-compose for multi-service testing
8. ✅ Implement Kubernetes resource limits
9. ✅ Use ConfigMaps/Secrets for configuration
10. ✅ Document thoroughly

## Troubleshooting

**Issue: "Cannot connect to Docker daemon"**
```bash
# Solution: Start Docker daemon
sudo systemctl start docker
```

**Issue: "Port already in use"**
```bash
# Solution: Change port mapping in docker-compose.yml
ports:
  - "3001:3000"  # Changed from 3000:3000
```

**Issue: "Service not ready when tests start"**
```bash
# Solution: Add sleep or wait-on in test command
command: >
  sh -c "
    wait-on http://app:3000/health --timeout 60000 &&
    npx cypress run
  "
```

**Issue: "Permission denied writing to volume"**
```bash
# Solution: Fix permissions
mkdir -p test-results
chmod -R 777 test-results/
```

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Cypress Docker Images](https://github.com/cypress-io/cypress-docker-images)
- [Newman Docker](https://hub.docker.com/r/postman/newman)

## Next Steps

1. Try running the Docker Compose example locally
2. Modify Dockerfile to add your own customizations
3. Practice explaining each file during mock interviews
4. Prepare STAR format stories about containerized testing

---

**Remember:** The goal isn't to memorize every line, but to understand the "why" behind each decision and be able to articulate benefits clearly in English during interviews.
