# DevOps + Docker + Kubernetes - Core Concepts

## Table of Contents
1. [DevOps Fundamentals](#1-devops-fundamentals)
2. [Docker for Test Automation](#2-docker-for-test-automation)
3. [Docker Compose for Multi-Service Testing](#3-docker-compose)
4. [Kubernetes Basics](#4-kubernetes-basics)
5. [DevOps Workflows](#5-devops-workflows)

---

## 1. DevOps Fundamentals

### 1.1 What is DevOps?

**Definition**: A cultural and technical movement emphasizing collaboration between Development and Operations to deliver software faster, reliably, with high quality.

**Core Principles**:
- **Collaboration**: Breaking down silos between teams
- **Automation**: Automate builds, tests, deployments
- **CI/CD**: Frequent code integration and automated deployments
- **Monitoring**: Continuous feedback loops
- **Infrastructure as Code**: Manage infrastructure through code

### 1.2 Traditional vs DevOps Approach

| Aspect | Traditional | DevOps |
|--------|-------------|--------|
| Team Structure | Separate Dev/QA/Ops silos | Integrated cross-functional teams |
| Release Cycle | Monthly/Quarterly | Daily/Weekly |
| Testing Phase | After development complete | Throughout (shift-left) |
| Environment Setup | Manual configuration | Automated, containerized |
| Feedback Loop | Days/Weeks | Minutes/Hours |
| Deployment | Manual process | Automated CI/CD pipelines |

### 1.3 QA's Role in DevOps

**Traditional QA**:
- Gatekeeper at end of development
- Manual testing focus
- Separate phase after dev

**DevOps QA**:
- Integrated from beginning (shift-left)
- Automation focus
- Close collaboration with developers
- Enable faster releases through automated testing
- Continuous testing in CI/CD

**Key QA Activities**:
1. Test automation creation and maintenance
2. CI/CD integration
3. Test environment management (containers)
4. Test monitoring and reporting
5. Developer collaboration on testability

### 1.4 Shift-Left Testing

**Concept**: Move testing earlier in the software development lifecycle.

**Benefits**:
- Find bugs early (cheaper to fix)
- Involve QA in requirements/design phases
- Test at multiple levels (unit, integration, E2E)

**Implementation**:
```
Traditional: [Requirements] → [Design] → [Dev] → [Testing] → [Deploy]
                                              ↑ QA starts here

Shift-Left:  [Requirements] → [Design] → [Dev] → [Testing] → [Deploy]
             ↑ QA starts here (reviews requirements, plans tests)
```

**Interview Talking Points**:
- "I advocate for shift-left testing where QA is involved from requirements phase"
- "By reviewing requirements early, we identify testability issues before development starts"
- "We practice continuous testing throughout development, not just at the end"

### 1.5 DevOps "Three Ways"

**First Way: Flow**
- Optimize work flow from Dev to Ops to customer
- **QA Impact**: Automate tests to prevent bottlenecks

**Second Way: Feedback**
- Create fast feedback loops at all stages
- **QA Impact**: Fast test execution, clear reports, quick bug detection

**Third Way: Continuous Learning**
- Culture of experimentation and learning from failures
- **QA Impact**: Experiment with new testing tools, share knowledge

---

## 2. Docker for Test Automation

### 2.1 What is Docker?

**Definition**: Platform using containerization to package applications and dependencies into isolated, portable units.

**Key Concepts**:
- **Image**: Template with application + dependencies
- **Container**: Running instance of an image
- **Dockerfile**: Script defining how to build an image
- **Registry**: Repository for storing images (Docker Hub, private)

### 2.2 Why Docker for Test Automation?

**Problem**: "It works on my machine!" - Different environments → inconsistent test results.

**6 Key Benefits**:

1. **Consistency**: Same environment for local, CI, production testing
2. **Isolation**: Tests run in isolated containers, no dependency conflicts
3. **Portability**: Run on any machine with Docker, any OS
4. **Speed**: Fast startup (seconds vs minutes for VMs)
5. **Version Control**: Docker images versioned, Dockerfile in Git
6. **CI/CD Integration**: Seamless pipeline integration

### 2.3 Dockerfile Basics

**Structure**:
```dockerfile
# 1. Base image
FROM cypress/included:12.17.0

# 2. Working directory
WORKDIR /e2e

# 3. Copy dependency files
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm ci

# 5. Copy test files
COPY cypress cypress
COPY cypress.config.js ./

# 6. Default command
CMD ["npx", "cypress", "run"]
```

**Key Instructions**:

| Instruction | Purpose | Example |
|-------------|---------|---------|
| `FROM` | Base image | `FROM node:18-alpine` |
| `WORKDIR` | Working directory | `WORKDIR /app` |
| `COPY` | Copy files | `COPY . .` |
| `RUN` | Execute during build | `RUN npm install` |
| `CMD` | Default container command | `CMD ["npm", "test"]` |
| `ENV` | Environment variables | `ENV NODE_ENV=production` |
| `EXPOSE` | Document ports | `EXPOSE 3000` |

### 2.4 Docker Commands

**Building**:
```bash
docker build -t my-cypress-tests .
docker build -f Dockerfile.cypress -t tests .
```

**Running**:
```bash
docker run my-cypress-tests
docker run -e CYPRESS_BASE_URL=https://staging.com my-tests
docker run -v $(pwd)/cypress:/app/cypress my-tests
```

**Managing**:
```bash
docker ps                    # List running containers
docker logs <container-id>   # View logs
docker stop <container-id>   # Stop container
docker images                # List images
```

### 2.5 Example: Dockerized Cypress Tests

```dockerfile
FROM cypress/included:12.17.0
WORKDIR /e2e

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy test files
COPY cypress.config.js ./
COPY cypress ./cypress

# Environment variables
ENV CYPRESS_VIDEO=true
ENV CYPRESS_SCREENSHOTS=true

# Run tests
CMD ["npx", "cypress", "run", "--browser", "chrome"]
```

**Build and run**:
```bash
docker build -t my-cypress-tests .
docker run my-cypress-tests
docker run my-cypress-tests --spec "cypress/e2e/login.cy.js"
```

### 2.6 Best Practices

1. **Use official base images**: `FROM cypress/included:12.17.0`
2. **Leverage build cache**: Copy package.json first, then source code
3. **Use .dockerignore**: Exclude node_modules, videos, .git
4. **Keep images small**: Use Alpine-based images, clean npm cache
5. **Multi-stage builds** (if needed): Build stage + Test stage

---

## 3. Docker Compose

### 3.1 What is Docker Compose?

**Definition**: Tool for defining and running multi-container applications using YAML.

**Use Cases**:
- Testing apps requiring multiple services (app, DB, cache)
- Full-stack integration tests
- Test environments with all dependencies
- Parallel test execution

### 3.2 Example: Full-Stack Testing

```yaml
version: '3.8'

services:
  # Application under test
  web-app:
    image: my-app:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgres://db:5432/testdb
    depends_on:
      - database
    networks:
      - test-network

  # Database
  database:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=testdb
      - POSTGRES_USER=testuser
      - POSTGRES_PASSWORD=testpass
    networks:
      - test-network

  # Cypress tests
  cypress-tests:
    image: cypress/included:12.17.0
    volumes:
      - ./cypress:/e2e/cypress
    environment:
      - CYPRESS_BASE_URL=http://web-app:3000
    depends_on:
      - web-app
    networks:
      - test-network
    command: npx cypress run

networks:
  test-network:
```

### 3.3 Docker Compose Commands

```bash
docker-compose up                    # Start all services
docker-compose up -d                 # Start in background
docker-compose down                  # Stop all services
docker-compose logs cypress-tests    # View service logs
docker-compose ps                    # List services
docker-compose run cypress-tests npx cypress run --spec "..."
```

### 3.4 CI/CD Integration

**GitHub Actions Example**:
```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Start services
        run: docker-compose up -d web-app database

      - name: Wait for services
        run: sleep 10

      - name: Run tests
        run: docker-compose run --rm cypress-tests

      - name: Cleanup
        if: always()
        run: docker-compose down -v
```

---

## 4. Kubernetes Basics

### 4.1 What is Kubernetes (K8s)?

**Definition**: Open-source container orchestration platform automating deployment, scaling, and management of containerized applications.

**Key Concepts**:
- **Cluster**: Set of machines running containers
- **Node**: Machine (physical/virtual) in cluster
- **Pod**: Smallest unit, contains 1+ containers
- **Job**: One-time task execution
- **Deployment**: Manages pod lifecycle
- **Service**: Exposes pods to network

### 4.2 Why Kubernetes for Testing?

**Use Cases**:
1. **Parallel execution**: Run hundreds of test pods simultaneously
2. **Resource management**: Efficient CPU/memory allocation
3. **Auto-scaling**: Scale based on demand
4. **Self-healing**: Auto-restart failed pods
5. **Multi-environment**: Manage dev/staging/prod tests

**When to Use K8s**:
- Large-scale test suites requiring parallelization
- Complex environments with many services
- Team already uses K8s for apps
- Need sophisticated orchestration

**When NOT to Use K8s**:
- Small test suites (Docker Compose simpler)
- No K8s expertise in team
- Infrastructure complexity > benefits
- Simple CI/CD pipelines

### 4.3 Kubernetes Job for Tests

**One-time test execution**:
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: cypress-test-job
spec:
  template:
    spec:
      containers:
      - name: cypress
        image: my-cypress-tests:latest
        command: ["npx", "cypress", "run"]
        env:
        - name: CYPRESS_BASE_URL
          value: "https://staging.example.com"
      restartPolicy: Never
  backoffLimit: 2  # Retry up to 2 times
```

**Scheduled tests (CronJob)**:
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-tests
spec:
  schedule: "0 2 * * *"  # 2 AM daily
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: cypress
            image: my-cypress-tests:latest
            command: ["npx", "cypress", "run"]
          restartPolicy: OnFailure
```

### 4.4 Kubernetes Commands

```bash
kubectl apply -f test-job.yaml       # Create job
kubectl get pods                     # List pods
kubectl logs <pod-name>              # View logs
kubectl describe pod <pod-name>      # Detailed info
kubectl delete job <job-name>        # Delete job
kubectl get jobs -w                  # Watch jobs
```

### 4.5 Parallel Test Execution

**Strategy**: Split specs across multiple pods.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: cypress-parallel
spec:
  parallelism: 5      # 5 pods in parallel
  completions: 5      # 5 total completions
  template:
    spec:
      containers:
      - name: cypress
        image: my-cypress-tests:latest
        command:
          - sh
          - -c
          - |
            POD_INDEX=${JOB_COMPLETION_INDEX:-0}
            npx cypress run --spec "cypress/e2e/batch-${POD_INDEX}/**/*.cy.js"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
      restartPolicy: Never
```

### 4.6 Interview-Level K8s Knowledge

**What you NEED to know**:
- High-level concepts (pods, jobs, services)
- Why K8s useful for test orchestration
- Basic kubectl commands
- When to use K8s vs simpler solutions

**What you DON'T need**:
- Deep K8s internals
- Complex networking
- Advanced security/RBAC
- Production cluster management

**Good Interview Answer**:
> "Kubernetes is valuable for large-scale test automation because it orchestrates hundreds of containers in parallel. For example, we split 500 Cypress tests across 20 pods, reducing execution from 2 hours to 10 minutes. It handles resource allocation, auto-restarts failures, and integrates with CI/CD. However, for smaller suites, Docker Compose is simpler and sufficient."

---

## 5. DevOps Workflows

### 5.1 Git Branching Strategies

**GitFlow**:
```
main (production)
  ↑
develop (integration)
  ↑
feature/new-feature
```

**Trunk-Based Development**:
```
main (all commits)
  ↑
short-lived-feature (< 1 day)
```

**For QA**:
- Tests run on every branch
- Main branch always deployable
- Feature branches include test updates
- Test automation part of Definition of Done

### 5.2 Pull Request Workflow

```
1. Developer creates feature branch
2. Writes code + tests
3. Creates PR
4. Automated tests run (unit, integration, E2E)
5. Code review (including test review)
6. PR approved
7. Merge to main
8. Deploy to staging
9. Smoke tests
10. Deploy to production
```

**QA Role in PRs**:
- Review test coverage for new features
- Ensure tests are maintainable
- Verify test reports in CI
- Provide feedback on test design
- Block PRs with insufficient coverage

### 5.3 Code Review for Tests

**What to review**:
- Test coverage (all scenarios?)
- Test clarity (intent clear?)
- Maintainability (easy to update?)
- Performance (runs efficiently?)
- Independence (any order?)
- Assertions (specific and meaningful?)
- Test data (well-managed?)

### 5.4 Testing Pyramid

```
       /\
      /E2E\         ← Fewer, slower
     /──────\
    /  API  \       ← Moderate, faster
   /──────────\
  /    Unit    \    ← Many, fast
 /──────────────\
```

**DevOps Testing Strategy**:
- **Unit tests**: Every commit (fast feedback)
- **Integration tests**: Every PR
- **E2E tests**: Merge to main, pre-deployment
- **Smoke tests**: Post-deployment
- **Performance tests**: Nightly or pre-release

### 5.5 DORA Metrics

**Four Key Metrics**:

1. **Deployment Frequency**: How often deploy to production
   - Elite: Multiple times/day
   - QA Impact: Fast automated tests enable frequent deployments

2. **Lead Time for Changes**: Commit to production time
   - Elite: < 1 hour
   - QA Impact: Automated tests reduce lead time

3. **Time to Restore Service**: Recovery from failures
   - Elite: < 1 hour
   - QA Impact: Tests catch issues before production

4. **Change Failure Rate**: % deployments causing failures
   - Elite: 0-15%
   - QA Impact: High coverage reduces failure rate

### 5.6 Test Monitoring

**Key Metrics**:
- Total test count
- Pass/fail rate
- Test execution time
- Flaky test rate
- Pipeline success rate
- Bug detection rate

**Tools**:
- Cypress Dashboard
- Allure Reports
- Grafana
- Slack/Teams notifications

### 5.7 Communication for Global Teams

**Key Practices**:
- Daily standups (15 min)
- Sprint planning
- Retrospectives
- Blameless postmortems

**For BASF (US/India/Europe)**:
- Schedule across time zones
- Async communication (Slack/Confluence)
- Document everything
- Overcommunicate

---

## Summary: Key Takeaways

### DevOps Culture
- Collaboration between Dev/QA/Ops
- Shift-left testing (early QA involvement)
- Automation and continuous improvement
- Fast feedback loops

### Docker for Testing
- Solves "works on my machine"
- Consistent, isolated environments
- Easy CI/CD integration
- Faster than VMs, portable

### Kubernetes
- Orchestrates containers at scale
- Massive parallel execution
- Self-healing, resource management
- Use only when scale justifies complexity

### DevOps Best Practices
- Version control everything
- Automate repetitive tasks
- Monitor and measure (DORA)
- Continuous learning

---

## Interview Prep Checklist

After studying, you should be able to:

- [ ] Explain DevOps in 2 minutes
- [ ] Describe QA's role in DevOps
- [ ] Explain shift-left testing
- [ ] List 3 Docker benefits for test automation
- [ ] Explain Dockerfile instructions
- [ ] Describe Docker Compose use cases
- [ ] Explain K8s concepts (pods, jobs)
- [ ] Discuss when to use K8s vs Docker Compose
- [ ] Describe Git PR workflows
- [ ] Explain DORA metrics
- [ ] Give one STAR DevOps project example

**Next**: Practice `02-interview-qa.md`
