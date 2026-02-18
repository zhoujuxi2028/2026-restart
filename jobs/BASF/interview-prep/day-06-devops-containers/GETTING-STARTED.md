# Day 6: Getting Started Guide - DevOps Practices + Docker & Kubernetes

## Welcome to Day 6!

Today you'll learn about DevOps culture, Docker containerization for testing, and Kubernetes basics for test orchestration. This knowledge is critical for BASF's role, which emphasizes DevOps methodology and CI/CD integration.

## Prerequisites Check

Before starting, ensure you have:
- [ ] Completed Days 1-5 (especially Day 4 CI/CD and Day 5 Cloud Testing)
- [ ] Basic understanding of CI/CD pipelines
- [ ] Docker installed on your machine (optional, but recommended)
- [ ] 3-4 hours of focused study time
- [ ] Recording device for English practice (phone/computer)

## What You'll Learn Today

### Core Topics
1. **DevOps Culture** - More than just tools, it's a mindset
2. **Docker for Testing** - Containerizing Cypress and Newman tests
3. **Kubernetes Basics** - Orchestrating tests at scale
4. **DevOps Workflows** - Git strategies, code reviews, monitoring

### Key Questions You'll Answer
- "What does DevOps mean to you?"
- "How do you integrate QA into a DevOps pipeline?"
- "Why use Docker for test automation?"
- "How does Kubernetes help with parallel test execution?"

## Learning Path (3-4 Hours)

### Step 1: Read Core Concepts (90 minutes)
```
File: 01-devops-docker-kubernetes-concepts.md
```

**What to do:**
1. Read sections 1-3 first (DevOps principles, Docker basics)
2. Take notes on key terms in English
3. Try to explain each concept out loud in English
4. Mark any concepts you don't understand for deeper research

**Learning tips:**
- Don't rush through Docker commands - understand the "why" behind each line
- Focus on how these tools solve QA problems
- Think about how to connect concepts to your past projects

### Step 2: Study Docker Examples (45 minutes)
```
Directory: 03-docker-examples/
Files:
  - Dockerfile.cypress
  - docker-compose.yml
  - k8s-cypress-job.yaml
```

**What to do:**
1. Open each file and read all comments carefully
2. Try to run the Docker examples if you have Docker installed
3. Identify which parts you could use in your own projects
4. Practice explaining each file's purpose in English

**Hands-on practice (if Docker installed):**
```bash
cd 03-docker-examples
docker build -f Dockerfile.cypress -t my-cypress-tests .
docker run my-cypress-tests
```

### Step 3: Review Interview Questions (60 minutes)
```
File: 02-interview-questions.md
```

**What to do:**
1. Read all 12 questions and provided answers
2. Write your own version of 3-5 answers based on your experience
3. Practice delivering answers out loud in English
4. Time yourself - aim for 2-3 minute responses
5. Record yourself answering 2-3 questions

**Focus areas:**
- Questions 1-4: DevOps culture and principles
- Questions 5-8: Docker for testing
- Questions 9-12: Kubernetes and orchestration

### Step 4: Master English Templates (30 minutes)
```
File: 04-english-templates.md
```

**What to do:**
1. Read through all vocabulary and phrases
2. Create your own DevOps project description (2 minutes)
3. Prepare a STAR story about containerized testing
4. Practice technical explanations without reading notes

**Recording exercise:**
Record a 3-minute explanation of:
"How DevOps practices improve software quality and testing efficiency"

### Step 5: Complete Daily Checklist (30 minutes)
```
File: 05-daily-checklist.md
```

**What to do:**
1. Go through each checklist item honestly
2. Rate your understanding (1-5 scale)
3. Note areas that need more practice
4. Set goals for tomorrow (Day 7)
5. Reflect on what you learned today

## Quick Start Options

### Option A: Full Deep Dive (4 hours)
Best for: Those new to Docker/Kubernetes or wanting comprehensive preparation
- Follow all 5 steps in order
- Complete all practice exercises
- Record multiple English explanations
- Try running Docker examples

### Option B: Focused Review (3 hours)
Best for: Those with some Docker experience
- Read core concepts (60 min)
- Study interview questions thoroughly (90 min)
- Focus on English articulation (45 min)
- Complete checklist (15 min)

### Option C: Quick Refresh (2 hours)
Best for: Those confident with DevOps/Docker
- Skim core concepts, focus on gaps (30 min)
- Review interview questions (60 min)
- Practice English responses (30 min)

## Docker Setup (Optional but Recommended)

### Install Docker
**macOS:**
```bash
brew install --cask docker
```

**Windows:**
Download Docker Desktop from https://www.docker.com/products/docker-desktop

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Verify Installation
```bash
docker --version
docker run hello-world
```

### If You Can't Install Docker
Don't worry! You can still:
- Understand Docker concepts theoretically
- Read Dockerfile syntax and explain what it does
- Discuss benefits without hands-on execution
- Focus on "why" over "how"

## English Practice Tips

### Vocabulary Drills (Daily)
Practice pronouncing these terms clearly:
- DevOps (dev-ops, not dee-vops)
- Kubernetes (koo-ber-net-eez)
- Containerization (con-tain-er-i-zay-shun)
- Orchestration (or-kes-tray-shun)
- Artifact (ar-ti-fact)

### Recording Guidelines
1. **Environment**: Quiet room, good microphone
2. **Structure**: Introduction → Main points → Conclusion
3. **Pace**: Speak slowly and clearly (don't rush)
4. **Pauses**: Use natural pauses to think
5. **Review**: Listen back and identify improvements

### Common Mistakes to Avoid
- ❌ "Docker containers is running" → ✅ "Docker containers are running"
- ❌ "We use Kubernetes for deploy" → ✅ "We use Kubernetes for deployment"
- ❌ "CI/CD pipeline is fail" → ✅ "The CI/CD pipeline failed"
- ❌ "Test are containerized" → ✅ "Tests are containerized"

## Connection to Previous Days

### Building on Day 5 (Cloud Testing)
- Day 5: **Where** tests run (AWS, Azure, GCP)
- Day 6: **How** tests are packaged and orchestrated (Docker, K8s)
- **Integration**: Cloud platforms run your containerized tests

### Building on Day 4 (CI/CD)
- Day 4: **Pipeline structure** (GitLab CI, GitHub Actions)
- Day 6: **What runs in pipelines** (Docker containers with tests)
- **Integration**: Pipelines execute Docker images

## Key Deliverables for Today

By the end of Day 6, you should have:

1. **Written Deliverables:**
   - [ ] Personal answers to 5-6 interview questions
   - [ ] One DevOps project description (STAR format)
   - [ ] List of Docker benefits for test automation

2. **Audio Deliverables:**
   - [ ] 3-5 minute recording: "DevOps in QA Automation"
   - [ ] 2-3 interview question responses recorded

3. **Technical Understanding:**
   - [ ] Can explain DevOps culture in 2 minutes
   - [ ] Can describe a Dockerfile line by line
   - [ ] Can discuss when to use Kubernetes vs simpler solutions

## Troubleshooting

### "I don't understand Kubernetes deeply"
**Solution:** You don't need to be a K8s expert! Focus on:
- High-level concepts (pods, deployments, services)
- Why it's useful for test orchestration
- Basic interview-level understanding is sufficient

### "Docker syntax is confusing"
**Solution:** Focus on common commands first:
```dockerfile
FROM - base image
WORKDIR - working directory
COPY - copy files
RUN - execute commands
CMD - default command
```

### "I can't think of DevOps project examples"
**Solution:** Use the templates in `04-english-templates.md` and adapt:
- Any CI/CD integration you've done
- Making tests run in Docker
- Improving team collaboration
- Automating any manual process

### "My English explanations are not fluent"
**Solution:** Practice structure:
1. One-sentence summary
2. Three main points
3. One example
4. Conclusion

## Time Management Tips

### If Short on Time
**Priority 1 (Must do - 90 min):**
- Read sections 1-3 of concepts document
- Review interview questions 1-8

**Priority 2 (Should do - 60 min):**
- Study Docker examples
- Practice English responses

**Priority 3 (Nice to have - 30 min):**
- Kubernetes section
- Recording practice

### If You Have Extra Time
- Create your own Dockerfile for a test project
- Research Docker Compose for multi-service testing
- Read about monitoring and observability (Prometheus, Grafana)
- Explore Kubernetes interactive tutorial: https://kubernetes.io/docs/tutorials/

## Success Indicators

You're ready to move on when you can:

- [✅] Explain DevOps principles without notes (2 minutes)
- [✅] Describe why containerization benefits QA (with 3 specific benefits)
- [✅] Explain a basic Dockerfile (what each line does)
- [✅] Discuss CI/CD integration with Docker (how it works)
- [✅] Answer "How does Kubernetes help with testing?" confidently
- [✅] Give one STAR format DevOps project example
- [✅] Use DevOps terminology correctly in English

## Next Steps

After completing Day 6:

1. **Rest**: Take a break, let information settle
2. **Tomorrow Preview**: Day 7 covers Testing Methodologies & ISTQB
3. **Reflect**: What was challenging today? What clicked?
4. **Connect**: How does DevOps relate to your past projects?

## Quick Reference Commands

### Docker Basics
```bash
docker build -t image-name .          # Build image
docker run image-name                 # Run container
docker ps                              # List running containers
docker images                          # List images
docker-compose up                      # Start services defined in compose file
docker-compose down                    # Stop services
```

### Kubernetes Basics
```bash
kubectl apply -f file.yaml            # Create resources
kubectl get pods                       # List pods
kubectl logs pod-name                  # View logs
kubectl delete -f file.yaml           # Delete resources
```

## Resources for Deeper Learning

### Docker
- Official Tutorial: https://docs.docker.com/get-started/
- Docker for Testers: https://testautomationu.applitools.com/docker-for-testers/

### Kubernetes
- Interactive Tutorial: https://kubernetes.io/docs/tutorials/kubernetes-basics/
- K8s for Beginners: https://www.youtube.com/watch?v=X48VuDVv0do

### DevOps Culture
- The Phoenix Project (book)
- DORA Metrics: https://dora.dev/

## Motivation

Remember: BASF specifically requires "DevOps methodology" and "CI/CD pipeline" experience. Today's learning directly addresses these requirements. You're not just preparing for an interview - you're developing skills that will make you more effective in the role.

DevOps is about collaboration, automation, and continuous improvement. As a QA Automation Engineer, you'll be at the heart of this transformation, helping the team ship quality software faster.

Let's make Day 6 count! 🚀

---

**Ready to start? Begin with:** `01-devops-docker-kubernetes-concepts.md`
