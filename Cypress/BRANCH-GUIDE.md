# 🌳 Branch Guide

This repository maintains two branches for different purposes:

## 📊 Branches Overview

### `main` - Detailed History Branch
**Purpose:** Development branch with detailed commit history

**Characteristics:**
- ✅ Detailed commit history (16+ commits)
- ✅ Each Day completion tracked separately
- ✅ Individual commits for translations, fixes, and reorganizations
- ✅ Git tags: `day8-complete`, `day9-complete`, `day11-complete`

**Use Cases:**
- Track learning progress step by step
- Review detailed development history
- Understand how each Day evolved
- Debug and trace specific changes

**Recent Commits:**
```
f9e54fd Restructure: Complete Sequential Day Numbering (Day 1-20)
754264f Stage 2 Core Tests: Complete English Translation - 100% Pass Rate (66/66)
9b00f71 Day 14 Complete: Performance & Monitoring - 100% Pass Rate (15/15)
6cf5099 Day 13 Complete: Data-Driven Testing - 100% Pass Rate
82bae6c Days 11 & 12 Complete: File Operations and Custom Commands - 100% Pass Rate
```

---

### `cypress-clean` - Simplified History Branch
**Purpose:** Clean branch with minimal commit history

**Characteristics:**
- ✅ Simplified commit history (8 commits)
- ✅ Single comprehensive Cypress commit
- ✅ Cleaner git log for presentations
- ✅ Version tag: `v1.0-cypress-complete`

**Use Cases:**
- Clean history for portfolios
- Easier to understand project structure
- Simpler for sharing/forking
- Professional presentation

**Main Commit:**
```
f07f296 Cypress Testing Framework - Complete Learning Path (Day 1-20)
        98 files changed, 22,058 insertions
```

---

## 📁 Both Branches Have Identical Content

Both branches contain the same final state:

```
├── 01-basics/     Day 1-3:  Setup, First Tests, Basic Commands (52 tests)
├── 02-core/       Day 4-8:  Selectors, Async, Organization, Network (63+ tests)
├── 03-advanced/   Day 9-12: Files, Custom Commands, Data-Driven (59+ tests)
├── 04-expert/     Day 15-20: Patterns, CI/CD, Optimization, Framework
└── 05-real-world/ Real-world projects and examples
```

**Total:** 170+ passing tests, 100% English documentation

---

## 🎯 Which Branch Should You Use?

| Scenario | Recommended Branch |
|----------|-------------------|
| Learning progress tracking | `main` |
| Understanding development history | `main` |
| Portfolio/Resume projects | `cypress-clean` |
| Forking/Sharing clean code | `cypress-clean` |
| Continuing development | `main` |
| Presentations | `cypress-clean` |

---

## 🔄 Switching Between Branches

```bash
# Switch to main (detailed history)
git checkout main

# Switch to cypress-clean (simplified history)
git checkout cypress-clean

# View branch comparison
git log main --oneline
git log cypress-clean --oneline
```

---

## 📌 Tags

**Main Branch:**
- `day8-complete` - Async Operations complete
- `day9-complete` - File Operations complete
- `day11-complete` - Data-Driven Testing complete

**Cypress-Clean Branch:**
- `v1.0-cypress-complete` - Full framework completion marker

---

**Last Updated:** 2026-01-21
**Maintained By:** Claude Code
