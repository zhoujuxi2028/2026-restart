# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a personal technical learning and career development repository (2026-restart) focused on test automation, Python development, security certification, and networking. The repository is organized by technology stacks with learning materials, practice projects, and interview preparation resources.

**Primary Language**: Chinese (Simplified) - All documentation and learning materials are in Chinese
**Learning Period**: Started January 2026, ongoing structured learning plans

## Repository Structure

```
testing/              # Test automation frameworks (Cypress, Playwright, Postman)
python/               # Python technical stack (interview prep, FastAPI)
security/             # Security certifications (CISSP)
networking/           # Network technologies (NFV-SDN)
jobs/                 # Job application materials
docs/                 # Reference documentation
```

## Key Learning Projects

### 1. Cypress (testing/Cypress/)
- **Purpose**: E2E testing framework learning with Angular integration
- **Progress Tracking**: See `Cypress-Learning-Progress.md` for detailed daily progress
- **Configuration**:
  - E2E tests with 3 retries configured
  - Component testing configured for Angular with Webpack
  - Uses CommonJS module system
- **Key Documentation**:
  - `CYPRESS-KB.md`: Knowledge base
  - `CYPRESS-FAQ.md`: Frequently asked questions
  - `BRANCH-GUIDE.md`: Git branching strategy
  - `LEARNING-GUIDE.md`: Comprehensive learning guide

### 2. Playwright (testing/playwright/)
- **Purpose**: Cross-browser testing automation
- **Configuration**: Tests in `./tests`, parallel execution enabled, HTML reporter
- **Projects**: Configured for Chromium, Firefox, and WebKit

### 3. Python Interview 300 (python/interview/)
- **Purpose**: Systematic Python interview preparation with 300 questions
- **Structure**: 16 topic modules covering basics to advanced concepts
- **Learning Plan**: 30-day structured plan (started 2026-01-23)
- **Files**: Individual markdown files for each topic (01-基础语法.md through 16-数据分析.md)
- **Progress**: Track progress in README.md

### 4. FastAPI (python/fastapi/)
- **Purpose**: 4-week intensive FastAPI learning (2026-01-22 to 2026-02-19)
- **Goal**: Backend development interview preparation
- **Structure**:
  - `01-学习资料/`: Weekly learning materials (week-1 through week-4)
  - `02-实战项目/`: Three progressive projects (Blog API, E-commerce API, Real-time Dashboard)
- **Daily Practice**: Includes exercises and solutions (day1-main.py, day1-exercises.py, day1-solutions.py pattern)

### 5. CISSP (security/CISSP/)
- **Purpose**: CISSP certification preparation
- **Content**: Eight domains, practice questions, study notes, exam strategies

### 6. NFV-SDN (networking/NFV-SDN/)
- **Purpose**: 4-6 week learning plan for Network Function Virtualization and Software-Defined Networking
- **Topics**: SDN fundamentals, NFV architecture, technology integration, interview prep

## Common Commands

### Cypress Testing
```bash
cd testing/Cypress
npm install                    # Install dependencies
npx cypress open              # Open Cypress interactive mode
npx cypress run               # Run all E2E tests headlessly
npx cypress run --spec "cypress/e2e/specific-test.cy.js"  # Run specific test
```

### Playwright Testing
```bash
cd testing/playwright
npm install                    # Install dependencies
npx playwright test           # Run all tests
npx playwright test --ui      # Run tests in UI mode
npx playwright test --project=chromium  # Run tests on specific browser
npx playwright show-report    # View HTML report
```

### Python Projects
```bash
cd python/fastapi/01-学习资料/week-1/day1
python main.py                # Run day's main example
python exercises.py           # Run practice exercises
python solutions.py           # View solution examples

cd python/interview
# No specific commands - these are markdown-based learning materials
```

## Architecture Notes

### Cypress Project
- **Test Organization**:
  - E2E tests in `cypress/e2e/`
  - Fixtures in `cypress/fixtures/`
  - Support files in `cypress/support/`
  - Temporary test data in `cypress/temp/`
- **Angular Integration**: Configured for Angular component testing with Webpack bundler
- **Test Pattern**: Component tests use `**/*.cy.ts` pattern

### FastAPI Learning Structure
- **Weekly Progression**:
  - Week 1: FastAPI basics (routing, type hints, dependency injection)
  - Week 2: Database and ORM (SQLAlchemy 2.0, async operations, Redis caching)
  - Week 3: Security and testing (JWT, OAuth2, pytest, Docker, CI/CD)
  - Week 4: Performance optimization (async programming, monitoring, production practices)
- **Project Architecture Pattern**: Standard FastAPI structure with `app/`, `api/`, `core/`, `models/`, `schemas/`, `services/`, `utils/` directories
- **Daily Learning Format**: Each day includes documentation (学习文档), exercises (练习题), main examples, exercise code, and solutions

### Python Interview Materials
- **Topic Progression**: Basics (100 questions) → Advanced (100 questions) → Expert (70 questions) → Practical (30 questions)
- **Four Phases**:
  - Days 1-10: Fundamentals (syntax, data structures, functions)
  - Days 11-20: Advanced concepts (OOP, functional programming, exceptions)
  - Days 21-27: Expert level (generators, concurrency, networking)
  - Days 28-30: Practical applications (databases, web frameworks, data analysis)

## Learning Progress Tracking

Each major project maintains its own progress tracking:
- **Cypress**: Check `Cypress-Learning-Progress.md` for day-by-day progress
- **Python Interview**: Progress markers in README.md with completion status
- **FastAPI**: Learning summaries in weekly directories (e.g., `ORGANIZATION_SUMMARY.md`)
- **CISSP**: Progress tracked within eight domain directories

## Git Workflow

The repository maintains a clean commit history:
- Main branch: `main`
- Recent focus: Project reorganization, CISSP framework addition, CI/CD integration tests
- Clean working directory (no uncommitted changes at initialization)

## Development Notes

- **Language Consistency**: Maintain Chinese for all learning materials and documentation
- **File Naming**: Use descriptive Chinese names for learning materials (e.g., 快速开始指南.md)
- **Progress Documentation**: Update progress files when completing learning milestones
- **Test Data**: Cypress temp directory contains JSON test fixtures - these are for testing purposes
- **Learning Plans**: Each project has specific time-boxed goals and daily hour commitments

## Job Application Context

The `jobs/` directory contains materials for specific positions:
- **mate/**: RTOS/embedded systems (Linux/RTOS drivers, FreeRTOS, RISC-V, ARM)
- **yunbao/**: Virtualization/networking (SR-IOV, Virtio-Net, DPDK, OVS, KVM, OpenStack)
- **J-11260/**: Other application materials

This context is relevant when working on projects or exercises that align with these career goals.
