# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **meta-learning project** for systematically improving Claude Code usage skills through an 8-week training program. All documentation is in **Chinese (Simplified)**. The project contains structured learning plans, reusable templates, best practices, workflows, and hands-on projects.

**Training Period**: 2026-02-13 to 2026-04-10 (56 days)
**Goal**: Transform from beginner to power user of Claude Code

## Directory Structure

```
claude/
├── README.md                           # Resource index and quick start
├── Claude-使用能力提升计划.md           # 8-week master training plan (1600+ lines)
├── 进度跟踪.md                         # Daily progress tracking with metrics
├── prompt-templates/                   # 5 reusable prompt templates
├── best-practices/                     # 3 best practice documents
├── workflows/                          # 4 standardized development workflows
└── projects/                           # 11 training projects across 8 weeks
```

## Core Documents

### Main Training Plan: `Claude-使用能力提升计划.md`
The central 8-week curriculum with **daily tasks** organized as follows:
- **Week 1-2**: Conversation patterns & prompt engineering (迭代式对话, Prompt技巧)
- **Week 3-4**: Advanced features & workflows (Task agents, Plan Mode, TDD, Debug SOP)
- **Week 5-6**: Real-world projects (2 enterprise-level projects)
- **Week 7-8**: Advanced applications & knowledge sharing

Each day includes:
- Specific learning objectives (今日目标)
- Hands-on exercises (练习)
- Completion criteria (完成标志)
- Reflection prompts (今日总结)

### Progress Tracking: `进度跟踪.md`
Daily progress log with:
- Weekly goal checklists
- Practice records with templates
- Self-assessment scores (1-10)
- Time tracking
- Capability growth curves
- Milestone achievements

### Resource Index: `README.md`
Quick reference guide with:
- Directory structure overview
- Learning roadmap by week
- Quick start commands
- Milestone tracking

## Key Resource Directories

### 1. Prompt Templates (`prompt-templates/`)
Five reusable templates for common scenarios:
- **code-review-template.md**: Multi-dimensional code review requests
- **debug-template.md**: Structured debugging collaboration (includes context, attempts, environment)
- **feature-development-template.md**: Feature development with iterative approach
- **learning-template.md**: Learning new technologies with examples
- **test-case-template.md**: Test case generation with specific formats

**Usage Pattern**: Copy template → Fill in `[variables]` → Adjust constraints → Use with Claude

### 2. Best Practices (`best-practices/`)
Three comprehensive guides:
- **tools-usage.md**: When and how to use Task agents (Explore/Plan), Read/Edit/Write, Plan Mode
- **prompt-engineering.md**: 5 advanced prompt patterns (roles, constraints, examples, chain-of-thought, iterative refinement)
- **workflow-optimization.md**: Efficiency tips for collaboration

### 3. Workflows (`workflows/`)
Four standardized development processes:
- **tdd-workflow.md**: Test-Driven Development (Red-Green-Refactor cycle)
- **debug-sop.md**: Standard Operating Procedure for debugging (Reproduce → Try 15min → Ask Claude → Validate)
- **code-review-workflow.md**: Multi-dimensional review process (stability, quality, completeness, maintainability, performance)
- **full-development-cycle.md**: Complete development flow (Design → TDD → Implement → Debug → Review → Document)

### 4. Projects (`projects/`)
Eleven progressively complex projects:
- Week 1: Iterative dialogue practice (Cypress tests, 48-hour challenge)
- Week 2: Prompt template library
- Week 3: Explore Agent analysis, Plan Mode refactoring
- Week 4: TDD feature development, workflow documentation
- Week 5-6: Two enterprise-level projects (Cypress framework / FastAPI backend / Python automation tools)
- Week 7-8: Technical presentation materials, 8-week learning summary

## Common Workflows

### Starting a Training Day
```bash
# View today's training tasks
cat claude/Claude-使用能力提升计划.md | grep -A 20 "Day X"

# Or open in editor
code claude/Claude-使用能力提升计划.md
```

### Using a Prompt Template
```bash
# Browse available templates
ls claude/prompt-templates/

# View specific template
cat claude/prompt-templates/debug-template.md

# Copy and customize for your use case
```

### Recording Progress
```bash
# Update daily progress
code claude/进度跟踪.md

# Update milestone achievements
# Edit the checklist sections
```

### Accessing Best Practices
```bash
# When learning prompt techniques
cat claude/best-practices/prompt-engineering.md

# When using Claude Code tools
cat claude/best-practices/tools-usage.md
```

## Training Methodology

### Core Principles
1. **Iterative Dialogue**: Break large tasks into 5+ conversation rounds (avoid one-shot requests)
2. **Specific Prompts**: Replace vague questions with detailed, constrained prompts
3. **Context Provision**: Always provide complete context (error messages, code, attempts, environment)
4. **Task Decomposition**: Split complex features into 6+ small steps
5. **Deep Engagement**: Conduct 10+ round conversations to deepen understanding

### Practice Pattern
Each exercise follows this structure:
1. **Objective** (目标): Clear learning goal
2. **Task** (任务): Specific practice exercise
3. **Requirements** (要求): Completion criteria
4. **Recording** (记录): Document results and insights
5. **Reflection** (总结): Extract learnings and improvements

### Progress Tracking
Three levels of tracking:
1. **Daily**: Complete task checklist, record time spent, capture insights
2. **Weekly**: Self-assess skills (1-10), review achievements, set next week's goals
3. **Milestone**: Evaluate capability growth curves, measure efficiency improvements

## Key Metrics

### Capability Dimensions (Self-Assessment 1-10)
- Basic interaction ability: Week 0 (1/10) → Week 8 (9/10)
- Tool usage proficiency: Week 0 (0/10) → Week 8 (9/10)
- Development efficiency: Week 0 (Baseline) → Week 8 (+300%)
- Code quality: Test coverage, maintainability, bug rate

### Success Criteria (8-Week Goals)
- [ ] Conduct 30+ round deep conversations
- [ ] Prompt first-hit rate >80%
- [ ] Master all Claude Code tools (Task, Read/Edit/Write, Plan Mode)
- [ ] Establish 3 standard workflows
- [ ] Complete 2 enterprise-level projects
- [ ] Build Memory library with 50+ entries
- [ ] Guide others in using Claude

## Architecture Notes

### Document Organization
- **Chinese for learning content**: All training materials, progress logs, and reflections in Chinese
- **Progressive complexity**: Week 1 (basics) → Week 8 (advanced applications)
- **Theory + Practice**: Each concept paired with hands-on exercises
- **Template-driven**: Reusable templates for common scenarios

### Learning Path Flow
```
Week 1-2: Foundation
  ├─ Change conversation patterns (iterative vs one-shot)
  ├─ Master prompt techniques (roles, constraints, examples)
  └─ Build prompt template library

Week 3-4: Tool Mastery
  ├─ Explore agent (codebase analysis)
  ├─ Plan agent (design solutions)
  ├─ Plan Mode (complex refactoring)
  ├─ Read/Edit/Write (precise modifications)
  └─ Establish development workflows (TDD, Debug SOP, Code Review)

Week 5-6: Real Projects
  ├─ Apply all learned techniques
  ├─ Complete 2 enterprise-level projects
  └─ Build Memory knowledge base

Week 7-8: Mastery & Sharing
  ├─ Advanced scenarios (architecture, optimization, security)
  ├─ Prepare technical presentation
  └─ Guide others
```

### Template Variables Convention
Templates use `[brackets]` for fill-in sections:
- `[技术栈]` → Technology stack (e.g., "Cypress", "FastAPI")
- `[代码]` → Code snippet
- `[问题描述]` → Problem description
- `[关注点X]` → Review dimension X

## Development Notes

### When Working in This Directory
- **Language**: Maintain Chinese for all learning materials and personal notes
- **Progress updates**: Update `进度跟踪.md` daily with honest assessments
- **Template refinement**: Improve templates based on usage experience
- **Workflow customization**: Adapt workflows to personal needs while documenting changes

### Key Files to Update
- `进度跟踪.md`: After completing each day's tasks
- Template files in `prompt-templates/`: When discovering more effective prompt patterns
- Best practice documents: When learning new techniques or discovering pitfalls
- Project READMEs: When completing projects with lessons learned

### Git Workflow
- Commit after completing each day's tasks
- Use descriptive commit messages: "Day X: [task completed]"
- Track template evolution through version control
- Document workflow improvements in separate commits

## Context for Claude

This is a **self-improvement project** where the user is learning to use Claude Code more effectively. When working in this directory:

1. **Encourage practice**: Suggest hands-on exercises aligned with the training plan
2. **Reference materials**: Point to relevant templates or best practices when applicable
3. **Track progress**: Remind about updating `进度跟踪.md` after completing tasks
4. **Apply learned techniques**: Use the prompt patterns and workflows documented here
5. **Support reflection**: Ask thought-provoking questions for the daily/weekly reflection sections

The goal is not just to complete tasks, but to **develop mastery** through deliberate practice and reflection.

## Quick Reference

### View Current Week's Goals
```bash
# Week 1 tasks
sed -n '/## Week 1/,/## Week 2/p' claude/Claude-使用能力提升计划.md

# Or use less for navigation
less claude/Claude-使用能力提升计划.md
```

### Check Overall Progress
```bash
# View progress dashboard
cat claude/进度跟踪.md | head -50
```

### Find a Specific Template
```bash
# List all templates
ls claude/prompt-templates/*.md

# Search for debug-related content
grep -r "debug" claude/prompt-templates/
```

### Access Workflows
```bash
# View TDD workflow
cat claude/workflows/tdd-workflow.md

# View Debug SOP
cat claude/workflows/debug-sop.md
```

---

**Note**: This is a living learning system. Templates, best practices, and workflows should evolve based on practical experience. The true value comes from **consistent daily practice** and **honest reflection**, not just reading the materials.
