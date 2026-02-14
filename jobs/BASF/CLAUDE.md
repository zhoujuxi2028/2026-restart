# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This directory contains interview preparation materials for **BASF QA Automation Engineer Position 007133** (Nanjing location with remote possibility). The role requires working with a global team (US manager, India/Europe colleagues) primarily in English, focusing on Cloud + CI/CD + Cypress + Postman + Software Testing Methodologies.

**Primary Language**: English (for interview preparation materials)
**Preparation Timeline**: 10-day intensive plan (3-4 hours daily)
**Learning Approach**: Technical Practice (60%) + English Expression (25%) + Mock Interviews (15%)

## Repository Structure

```
jobs/BASF/
├── 7133.md                    # Complete 10-day preparation plan
├── interview-prep/            # Daily structured learning modules
│   └── day-01-cypress/        # Day 1: Cypress deep dive + English practice
│       ├── README.md          # Daily overview and schedule
│       ├── GETTING-STARTED.md # Quick start guide
│       ├── 01-cypress-core-concepts.md      # Technical concepts (English)
│       ├── 02-interview-questions.md        # 10 Q&A with STAR format
│       ├── 03-test-examples.cy.js           # 5 practical test cases
│       ├── 04-english-templates.md          # Communication templates
│       ├── 05-daily-checklist.md            # Progress tracking
│       └── fixtures/          # Test data files
└── CLAUDE.md                  # This file
```

## Job Requirements Context

### Core Technical Stack
- **Testing Frameworks**: Cypress (2+ years), Postman
- **DevOps**: CI/CD pipelines (Jenkins/GitLab CI/GitHub Actions), Docker
- **Cloud**: AWS/Azure/GCP fundamentals, cloud-based test environments
- **Languages**: JavaScript/TypeScript proficiency
- **Methodologies**: STLC, BDD, OOP, Agile/Scrum
- **Additional**: Performance testing (JMeter), ISTQB certification

### Key Focus Areas
1. Cypress automation (vs Selenium comparison essential)
2. RESTful API testing with Postman + Newman CLI
3. CI/CD integration and DevOps practices
4. Cloud testing strategies (containers, orchestration, IaC basics)
5. Cross-functional team collaboration in English
6. Test strategy and planning skills

## How to Use These Materials

### 10-Day Plan Overview (7133.md)
The master plan document outlines day-by-day preparation with:
- **Days 1-2**: Cypress deep dive + English technical expression
- **Days 3-4**: Postman + RESTful API testing + CI/CD basics
- **Days 5-6**: Cloud testing + DevOps practices
- **Day 7**: Software testing methodologies + ISTQB
- **Day 8**: JavaScript/TypeScript + Performance testing (JMeter)
- **Day 9**: Cross-cultural team collaboration + Agile + Mock interview
- **Day 10**: Final mock interview + gap filling + mental preparation

### Daily Module Structure (interview-prep/)
Each day's materials follow a consistent pattern:
1. **README.md**: Learning objectives, time allocation, success criteria
2. **GETTING-STARTED.md**: Step-by-step guide for using the materials
3. **Technical concepts**: Core concepts explained in English
4. **Interview questions**: 10 high-frequency Q&A with STAR format answers
5. **Practical code**: Working examples with detailed English comments
6. **English templates**: Self-introduction, STAR stories, technical phrases
7. **Daily checklist**: Progress tracking and self-assessment

### Recommended Daily Workflow
```bash
# 1. Start with the daily README to understand objectives
# Example for Day 1:
cat interview-prep/day-01-cypress/README.md

# 2. Read the getting started guide
cat interview-prep/day-01-cypress/GETTING-STARTED.md

# 3. Study technical concepts (60 minutes)
# Read the concepts file and practice explaining each concept in English

# 4. Review and run test examples (60 minutes)
# If you have a Cypress environment:
cd /path/to/cypress-project
cp interview-prep/day-01-cypress/03-test-examples.cy.js cypress/e2e/
npx cypress open

# 5. Prepare interview answers (60 minutes)
# Work through interview questions, write your own answers

# 6. Practice English communication (45 minutes)
# Record yourself explaining concepts, delivering STAR stories

# 7. Complete daily checklist (15 minutes)
# Track progress, self-assess, set goals for tomorrow
```

## English Communication Focus

All materials emphasize English fluency because:
- The role requires daily communication in English
- Technical interviews will be conducted in English
- Documentation and code reviews are in English

### Key English Preparation Elements
- **Technical vocabulary**: flaky tests, retry mechanism, headless execution, etc.
- **STAR format answers**: Situation-Task-Action-Result for behavioral questions
- **Self-introduction templates**: 2-minute and 5-minute versions
- **Project description frameworks**: Structured ways to explain technical work
- **Recording practice**: Audio/video self-recording for improvement

## Cypress Test Examples Structure

The test files (`03-test-examples.cy.js`) demonstrate interview-critical patterns:
1. **API Mocking**: Using `cy.intercept()` for stubbing and spying
2. **Custom Commands**: Reusable logic (authentication flows, common operations)
3. **Environment Configuration**: Environment-based test execution
4. **Cross-origin Testing**: Handling multi-domain scenarios
5. **Advanced Assertions**: Retry logic and complex validations

Each test includes "Interview talking points" comments showing how to explain the approach during interviews.

## Fixtures and Test Data

Test data files in `fixtures/` directories:
- `users.json`: Sample user data for authentication tests
- `products.json`: Sample product catalog for e-commerce scenarios
- Used with `cy.fixture()` to load data in tests

## Important Notes for Content Updates

When helping with this interview preparation:

1. **Maintain English Quality**: All interview-facing content must be in clear, professional English
2. **STAR Format**: Behavioral answers should follow Situation-Task-Action-Result structure
3. **Technical Accuracy**: Cypress patterns should reflect current best practices (v12+)
4. **Quantifiable Results**: Include metrics in project examples (e.g., "reduced flaky tests by 60%")
5. **Cross-reference**: Ensure concepts in technical docs match the questions and test examples

## Progress Tracking

Each day has a checklist (`05-daily-checklist.md`) to track:
- Technical concepts mastered
- Interview questions prepared
- English recordings completed
- Self-assessment scores (1-5 scale)
- Daily reflections and tomorrow's goals

The user should complete each day's checklist before moving to the next day's materials.

## Mock Interview Preparation

The plan includes multiple mock interview sessions:
- **Day 9**: First full 60-minute mock interview
- **Day 10**: Final mock technical round (30 min Q&A + 20 min coding + 10 min scenario)

Mock interviews should simulate real conditions:
- Use video conferencing tool (Teams/Zoom)
- Practice in a quiet environment
- Record sessions for self-review
- Time each section strictly

## Questions to Ask Interviewers

The materials include prepared questions for the candidate to ask, such as:
- "What does a typical sprint look like for your team?"
- "How is the QA team involved in the CI/CD pipeline?"
- "What are the main testing challenges the team is currently facing?"
- "How do you measure the success of test automation?"
- "What opportunities are there for professional growth in this role?"

These demonstrate genuine interest and understanding of QA automation role responsibilities.
