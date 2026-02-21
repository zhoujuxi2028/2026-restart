# CLAUDE.md - Test Project Organization Guide

This file provides guidance to Claude Code when working with this test project.

## Project Purpose

This is a **hands-on CI/CD practice project** for BASF QA Automation Engineer interview preparation. It demonstrates real-world skills with:
- Cypress E2E and API testing
- Newman/Postman API testing
- Docker containerization
- CI/CD pipeline integration
- Test reporting and artifact management

**Primary Language**: English (for interview preparation)
**Project Type**: Learning/demonstration project with production-quality structure

## Repository Structure

```
test-project/
├── README.md                      # Main project documentation
├── CLAUDE.md                      # This file - organization guidance
├── package.json                   # Node.js project configuration
├── cypress.config.js              # Cypress test configuration
├── docker-compose.yml             # Multi-container orchestration
├── Dockerfile.newman              # Newman container definition
│
├── cypress/                       # Cypress test suite
│   ├── e2e/                       # E2E test files
│   ├── fixtures/                  # Test data
│   ├── support/                   # Support files and commands
│   ├── videos/                    # Test execution videos (gitignored)
│   └── screenshots/               # Failure screenshots (gitignored)
│
├── postman/                       # Postman/Newman tests
│   ├── api-collection.json        # API test collection
│   └── environment.json           # Environment variables
│
├── newman/                        # Newman test output
│   ├── report.html                # HTML test report
│   └── junit.xml                  # JUnit XML for CI integration
│
├── test-logs/                     # Test execution logs
│   └── README.md                  # Log directory documentation
│
├── scripts/                       # Utility scripts
│   └── run-regression-test-with-logs.sh  # Regression test runner
│
└── docs/                          # Project documentation
    ├── README.md                  # Documentation directory overview
    ├── guides/                    # User guides
    │   ├── CI-CD-GUIDE.md
    │   └── TROUBLESHOOTING.md
    ├── analysis/                  # Analysis reports
    │   ├── CICD-COMPLETE-ANALYSIS.md
    │   └── REGRESSION-TEST-RESULT.md
    └── fixes/                     # Bug fix records
        ├── BUGFIX-SUMMARY.md
        ├── BUG-LIST.md
        ├── README-DOCKER-FIXES.md
        └── *.txt (various fix logs)
```

## File Organization Rules

### Root Directory - Keep It Clean
**What belongs in root**:
- Core configuration files (package.json, cypress.config.js, docker-compose.yml)
- Dockerfile(s)
- README.md and CLAUDE.md
- .gitignore, .dockerignore
- CI/CD configuration (when added: .github/, .gitlab-ci.yml, Jenkinsfile)

**What does NOT belong in root**:
- Documentation files (move to `docs/`)
- Scripts (move to `scripts/`)
- Test output (should be in `cypress/`, `newman/`, `test-logs/`)
- Bug reports, analysis docs, troubleshooting guides (move to `docs/`)

### Documentation (`docs/`)
- **`docs/guides/`**: Step-by-step guides, how-tos, setup instructions
- **`docs/analysis/`**: Analysis reports, test assessments, investigation results
- **`docs/fixes/`**: Bug fix history, troubleshooting records, patch notes

When creating new documentation:
1. Determine the purpose (guide/analysis/fix)
2. Use descriptive kebab-case names
3. Update `docs/README.md` if adding a significant document
4. Add date prefix for time-sensitive reports

### Scripts (`scripts/`)
All executable scripts (.sh, .py, etc.) should be in `scripts/` directory.

After moving scripts:
- Update references in `package.json` scripts
- Update references in documentation
- Ensure execute permissions: `chmod +x scripts/*.sh`

### Test Output Directories
- **`cypress/videos/`**: Auto-generated test videos (gitignored)
- **`cypress/screenshots/`**: Auto-generated failure screenshots (gitignored)
- **`newman/`**: Newman HTML and JUnit reports
- **`test-logs/`**: Custom test logs from regression scripts

These directories should NOT be cleaned up manually - let the tools manage them.

## Common Tasks

### Adding New Documentation
```bash
# Create a new guide
touch docs/guides/my-new-guide.md

# Create a new analysis report with date
touch docs/analysis/2026-02-21-performance-analysis.md

# Update docs/README.md to list the new document
```

### Cleaning Up Root Directory
When you find documentation files in root:
1. Determine category (guide/analysis/fix)
2. Move to appropriate `docs/` subdirectory
3. Search for references: `grep -r "filename" .`
4. Update any references in package.json, README, or other docs

### Creating New Scripts
```bash
# Create script in scripts/ directory
touch scripts/my-script.sh

# Make executable
chmod +x scripts/my-script.sh

# If referenced in package.json, use relative path
"my-script": "./scripts/my-script.sh"
```

### Updating Documentation Links
After moving files, always check for broken references:
```bash
# Search for old file references
grep -r "old-filename" docs/ README.md package.json

# Update package.json script paths
# Update README.md links
# Update docs/ cross-references
```

## CI/CD Pipeline Files

When adding CI/CD configurations, place them in standard locations:
- **GitHub Actions**: `.github/workflows/*.yml`
- **GitLab CI**: `.gitlab-ci.yml` (root)
- **Jenkins**: `Jenkinsfile` (root)
- **CircleCI**: `.circleci/config.yml`

## Docker Configuration

- **Main compose file**: `docker-compose.yml` (root)
- **Dockerfiles**: Root directory, named `Dockerfile` or `Dockerfile.<service>`
- **Docker ignore**: `.dockerignore` (root)
- **Docker volumes**: Configured in docker-compose.yml, output to standard directories

## Test Configuration

- **Cypress config**: `cypress.config.js` (root)
- **Cypress tests**: `cypress/e2e/*.cy.js`
- **Cypress fixtures**: `cypress/fixtures/*.json`
- **Postman collections**: `postman/*.json`
- **Newman output**: `newman/` directory

## Interview Preparation Context

This project is designed for interview demonstrations. When working with it:

### Priority Features to Demonstrate
1. Clear project structure and organization
2. Working tests that can be run on-demand
3. Docker containerization
4. CI/CD integration readiness
5. Comprehensive documentation
6. Professional git commit history

### Interview-Ready Checklist
Before showing this project in an interview:
- [ ] Root directory is clean (< 10 files)
- [ ] All tests pass: `npm test`
- [ ] Docker compose works: `docker compose up`
- [ ] Documentation is organized in `docs/`
- [ ] README.md accurately describes structure
- [ ] No debug files, temp files, or .log files in root

### Common Interview Questions - Quick Reference
- **"Walk me through your project"**: Start with README.md structure section
- **"Show me your tests"**: `npm run test:cypress:headed` for interactive demo
- **"How do you handle failures?"**: Show `cypress/screenshots/` and `cypress/videos/`
- **"CI/CD setup?"**: Point to `docs/guides/CI-CD-GUIDE.md`
- **"Any challenges you faced?"**: Reference `docs/fixes/` for real problem-solving examples

## Maintenance Guidelines

### Weekly Maintenance
- Remove old test output: `rm -rf cypress/videos/* cypress/screenshots/*`
- Clean old logs: `find test-logs/ -name '*.log' -mtime +7 -delete`
- Review and archive old analysis docs

### Before Committing
- Verify root directory cleanliness: `ls -1 | wc -l` (should be < 15)
- Ensure test output is gitignored
- Check for sensitive data in fixtures
- Update README.md if structure changed

### Archive Strategy
When documents become outdated:
```bash
# Create archive directory
mkdir -p docs/archive/2026-Q1

# Move outdated docs
mv docs/analysis/old-analysis.md docs/archive/2026-Q1/

# Update docs/README.md to note archived items
```

## Git Workflow

### What to Commit
- Source code and tests
- Configuration files
- Documentation in `docs/`
- Scripts in `scripts/`
- README.md and CLAUDE.md updates

### What NOT to Commit
- `node_modules/`
- Test output (videos, screenshots, reports)
- Log files
- Environment files with secrets
- `.DS_Store`, `.idea/`, etc.

Already configured in `.gitignore`.

## Questions to Ask Before Adding Files

1. **Is this a configuration file?** → Root directory
2. **Is this documentation?** → `docs/guides/`, `docs/analysis/`, or `docs/fixes/`
3. **Is this a script?** → `scripts/`
4. **Is this test code?** → `cypress/e2e/` or `postman/`
5. **Is this test output?** → Appropriate output directory (cypress/videos/, newman/, test-logs/)
6. **Is this temporary?** → Should it be gitignored? Should it even exist?

## Success Criteria

A well-organized project should have:
- ✅ Clean root directory (only essential files)
- ✅ Organized documentation (categorized in `docs/`)
- ✅ All scripts in `scripts/` directory
- ✅ Test code in appropriate test directories
- ✅ No broken file references
- ✅ Accurate README.md describing actual structure
- ✅ Interview-ready with clear narrative

When in doubt, ask: "Would this structure impress a hiring manager during a project walkthrough?"
