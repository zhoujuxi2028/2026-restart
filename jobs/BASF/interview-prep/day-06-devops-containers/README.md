# Day 6: DevOps + Docker & Kubernetes

## Overview
**Focus**: DevOps culture, Docker containerization, Kubernetes basics
**Time**: 3-4 hours
**Difficulty**: Intermediate-Advanced

## Learning Objectives

After Day 6, you will be able to:
- Explain DevOps principles and QA's role in DevOps culture
- Describe Docker benefits for test automation and create basic Dockerfiles
- Understand Kubernetes concepts for test orchestration
- Discuss CI/CD integration with containerized tests
- Answer 12 high-frequency DevOps/Container interview questions

## Quick Start

### Option A: Full Study (4 hours)
```
1. Core concepts (90 min)      → 01-core-concepts.md
2. Docker examples (45 min)    → 03-docker-examples/
3. Interview prep (90 min)     → 02-interview-qa.md
4. Quick reference (30 min)    → 04-quick-reference.md
5. Daily checklist (15 min)    → 05-checklist.md
```

### Option B: Focused Review (3 hours)
```
1. Core concepts (60 min)      → 01-core-concepts.md sections 1-3
2. Interview questions (90 min) → 02-interview-qa.md
3. English practice (45 min)   → Record 3-min explanation
4. Checklist (15 min)          → 05-checklist.md
```

### Option C: Quick Refresh (2 hours)
```
1. Concepts review (30 min)    → Skim 01-core-concepts.md
2. Interview questions (60 min) → 02-interview-qa.md
3. Practice answers (30 min)   → Record yourself
```

## Study Path

### Step 1: Master Core Concepts (90 min)
Read `01-core-concepts.md` - covers:
- DevOps fundamentals and shift-left testing
- Docker for test automation (benefits, Dockerfile basics)
- Docker Compose for multi-service testing
- Kubernetes basics (pods, jobs, deployments)
- DevOps workflows (Git, PR, code review)

**Focus on**: Why these tools matter for QA, not just how to use them.

### Step 2: Hands-on Docker (45 min)
Explore `03-docker-examples/`:
- Dockerfile.cypress - Containerized Cypress tests
- docker-compose.yml - Full-stack test environment
- k8s-cypress-job.yaml - Kubernetes test job

**If you have Docker installed**, try running:
```bash
cd 03-docker-examples
docker build -f Dockerfile.cypress -t my-cypress-tests .
docker run my-cypress-tests
```

**If no Docker**: Read files and practice explaining what each line does.

### Step 3: Interview Preparation (90 min)
Study `02-interview-qa.md` - 12 critical questions:
- Questions 1-4: DevOps culture and principles
- Questions 5-8: Docker for testing
- Questions 9-12: Kubernetes and orchestration

**Practice**: Write your own answers for 3-5 questions using your experience.
**Record**: Answer 2-3 questions out loud in English (2-3 minutes each).

### Step 4: Quick Reference (30 min)
Review `04-quick-reference.md`:
- Key DevOps/Docker/K8s terminology
- Common commands cheat sheet
- English phrases for technical discussions
- Project description templates

### Step 5: Self-Assessment (15 min)
Complete `05-checklist.md`:
- Rate your understanding (1-5 scale)
- Identify gaps for additional study
- Set goals for tomorrow (Day 7)

## Success Criteria

You're ready to move on when you can:

- [ ] Explain DevOps culture in 2 minutes (with shift-left testing example)
- [ ] List 4 benefits of Docker for test automation
- [ ] Describe a Dockerfile line by line
- [ ] Explain docker-compose for multi-service testing
- [ ] Discuss Kubernetes basics (pods, jobs, when to use K8s)
- [ ] Answer "How do tests integrate into CI/CD?" with specifics
- [ ] Give one STAR format DevOps project example

## Key Deliverables

1. **Written**: Personal answers to 5 interview questions
2. **Audio**: 3-5 minute recording on "DevOps in QA Automation"
3. **Technical**: Can explain Dockerfile and Docker Compose purpose

## Connection to BASF Requirements

This day directly addresses:
- **DevOps methodology** - Core focus
- **CI/CD pipeline** - Integration practices
- **Agile methodologies** - DevOps extends Agile
- **Cross-functional teams** - Collaboration principles

## Prerequisites

Before starting:
- [ ] Completed Days 1-5 (especially Day 4 CI/CD, Day 5 Cloud)
- [ ] 3-4 hours available
- [ ] Recording device for English practice

**Docker installation optional** - You can learn concepts without hands-on execution.

## Docker Setup (Optional)

### Install Docker
**macOS**: `brew install --cask docker`
**Windows**: Download from https://docker.com/products/docker-desktop
**Linux**: `curl -fsSL https://get.docker.com | sh`

### Verify
```bash
docker --version
docker run hello-world
```

## English Practice Tips

**Daily vocabulary drill**:
- DevOps (dev-ops)
- Kubernetes (koo-ber-net-eez)
- Containerization (con-tain-er-i-zay-shun)
- Orchestration (or-kes-tray-shun)

**Recording structure**:
1. Introduction (topic overview)
2. Three main points
3. One concrete example
4. Conclusion

**Common mistakes to avoid**:
- ❌ "Docker containers is running" → ✅ "Docker containers are running"
- ❌ "We use Kubernetes for deploy" → ✅ "...for deployment"
- ❌ "CI/CD pipeline is fail" → ✅ "...has failed"

## Connection to Previous Days

- **Day 4 (CI/CD)**: Where pipelines are defined → **Day 6**: What runs in pipelines (Docker containers)
- **Day 5 (Cloud)**: Where tests run (AWS/Azure) → **Day 6**: How tests are packaged (Docker)

## Tomorrow's Preview

**Day 7**: Software Testing Methodologies
- STLC, BDD, OOP concepts
- ISTQB knowledge system
- Test strategy and planning

## Quick Reference Commands

### Docker
```bash
docker build -t my-tests .           # Build image
docker run my-tests                  # Run container
docker ps                            # List running containers
docker-compose up                    # Start all services
docker-compose down                  # Stop all services
```

### Kubernetes
```bash
kubectl apply -f job.yaml            # Create job
kubectl get pods                     # List pods
kubectl logs <pod-name>              # View logs
kubectl delete job <job-name>        # Delete job
```

## Notes

- DevOps is 50% culture, 50% tools - focus on collaboration, not just technology
- For BASF's global team, DevOps practices enable seamless distributed collaboration
- Containers solve "works on my machine" - critical for multi-timezone teams
- You don't need to be a K8s expert, but understand its value for large-scale testing
- Real project examples > theoretical knowledge

---

**Ready to start?** Open `01-core-concepts.md` and begin your Day 6 journey!
