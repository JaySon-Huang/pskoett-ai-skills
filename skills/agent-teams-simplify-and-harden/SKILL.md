---
name: agent-teams-simplify-and-harden
description: "Implementation + audit loop using parallel agent teams with structured simplify, harden, and document passes. Spawns implementation agents to do the work, then audit agents to find complexity, security gaps, and spec deviations, then loops until code compiles cleanly, all tests pass, and auditors find zero issues. Use when: implementing features from a spec or plan, hardening existing code, fixing a batch of issues, or any multi-file task that benefits from a build-verify-fix cycle."
---

# Agent Teams Simplify & Harden

A two-phase team loop that produces production-quality code: **implement**, then **audit using simplify + harden + document passes**, then **fix audit findings**, then **re-audit**, repeating until the codebase is solid.

## When to Use

- Implementing multiple features from a spec or plan
- Hardening a codebase after a batch of changes
- Fixing a list of issues or gaps identified in a review
- Any task touching 5+ files where quality gates matter

## The Pattern

```
┌─────────────────────────────────────────────────────┐
│                  TEAM LEAD (you)                     │
│                                                      │
│  Phase 1: IMPLEMENT                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ impl-1   │ │ impl-2   │ │ impl-3   │  ...       │
│  │ (general │ │ (general │ │ (general │            │
│  │ purpose) │ │ purpose) │ │ purpose) │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│       │             │            │                   │
│       ▼             ▼            ▼                   │
│  ┌─────────────────────────────────────┐            │
│  │  Verify: compile + tests            │            │
│  └─────────────────────────────────────┘            │
│       │                                              │
│  Phase 2: SIMPLIFY & HARDEN AUDIT                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ simplify │ │ harden   │ │ spec     │  ...       │
│  │ auditor  │ │ auditor  │ │ auditor  │            │
│  │ (Explore)│ │ (Explore)│ │ (Explore)│            │
│  └──────────┘ └──────────┘ └──────────┘            │
│       │             │            │                   │
│       ▼             ▼            ▼                   │
│  Findings > 0?                                       │
│    YES → back to Phase 1 with findings as tasks      │
│    NO  → DONE. Ship it.                              │
└─────────────────────────────────────────────────────┘
```

## Step-by-Step Procedure

### 1. Create the Team

```
TeamCreate:
  team_name: "<project>-harden"
  description: "Implement and harden <description>"
```

### 2. Create Tasks

Break the work into discrete, parallelizable tasks. Each task should be independent enough for one agent to complete without blocking on others.

```
TaskCreate for each unit of work:
  subject: "Implement <specific thing>"
  description: "Detailed requirements, file paths, acceptance criteria"
  activeForm: "Implementing <thing>"
```

Set up dependencies if needed:
```
TaskUpdate: { taskId: "2", addBlockedBy: ["1"] }
```

### 3. Spawn Implementation Agents

Spawn `general-purpose` agents (they can read, write, and edit files). One per task or one per logical group. Run them **in parallel**.

```
Task tool (spawn teammate):
  subagent_type: general-purpose
  team_name: "<project>-harden"
  name: "impl-<area>"
  mode: bypassPermissions
  prompt: |
    You are an implementation agent on the <project>-harden team.
    Your name is impl-<area>.

    Check TaskList for your assigned tasks and complete them.
    After completing each task, mark it completed and check for more.

    Quality gates:
    - Code must compile cleanly
    - Tests must pass
    - Follow existing code patterns and conventions

    When all your tasks are done, notify the team lead.
```

### 4. Wait for Implementation to Complete

Monitor agent messages. When all implementation agents report done:

1. Run compile/type checks to verify clean build
2. Run tests to verify all pass
3. If either fails, fix or assign fixes before proceeding

### 5. Spawn Audit Agents

Spawn `Explore` agents (read-only -- they cannot edit files, which prevents them from "fixing" issues silently). Each auditor covers a different concern using the Simplify & Harden methodology.

**Recommended audit dimensions:**

| Auditor | Focus | Mindset |
|---------|-------|---------|
| **simplify-auditor** | Code clarity and unnecessary complexity | "Is there a simpler way to express this?" |
| **harden-auditor** | Security and resilience gaps | "If someone malicious saw this, what would they try?" |
| **spec-auditor** | Implementation vs spec/plan completeness | "Does the code match what was asked for?" |

#### Simplify Auditor

```
Task tool (spawn teammate):
  subagent_type: Explore
  team_name: "<project>-harden"
  name: "simplify-auditor"
  prompt: |
    You are a simplify auditor on the <project>-harden team.
    Your name is simplify-auditor.

    Your job is to find unnecessary complexity -- NOT fix it. You are read-only.

    Review all modified files and check for:

    1. Dead code and scaffolding -- debug logs, commented-out attempts,
       unused imports, temporary variables left from iteration
    2. Naming clarity -- function names, variables, and parameters that
       don't read clearly when seen fresh
    3. Control flow -- nested conditionals that could be flattened, early
       returns that could replace deep nesting, boolean expressions that
       could be simplified
    4. API surface -- public methods/functions that should be private,
       more exposure than necessary
    5. Over-abstraction -- classes, interfaces, or wrapper functions not
       justified by current scope. Agents tend to over-engineer.
    6. Consolidation -- logic spread across multiple functions/files that
       could live in one place

    For each finding, categorize as:
    - **Cosmetic** (dead code, unused imports, naming, control flow,
      visibility reduction) -- low risk, easy fix
    - **Refactor** (consolidation, restructuring, abstraction changes)
      -- only flag when genuinely necessary, not just "slightly better."
      The bar: would a senior engineer say the current state is clearly
      wrong, not just imperfect?

    For each finding report:
    1. File and line number
    2. Category (cosmetic or refactor)
    3. What's wrong
    4. What it should be (specific fix, not vague)
    5. Severity: high / medium / low

    Be thorough. Check every relevant file.
    When done, send your complete findings to the team lead.
    If you find ZERO issues, say so explicitly.
```

#### Harden Auditor

```
Task tool (spawn teammate):
  subagent_type: Explore
  team_name: "<project>-harden"
  name: "harden-auditor"
  prompt: |
    You are a security/harden auditor on the <project>-harden team.
    Your name is harden-auditor.

    Your job is to find security and resilience gaps -- NOT fix them.
    You are read-only.

    Review all modified files and check for:

    1. Input validation -- unvalidated external inputs (user input, API
       params, file paths, env vars), type coercion issues, missing
       bounds checks, unconstrained string lengths
    2. Error handling -- non-specific catch blocks, errors logged without
       context, swallowed exceptions, sensitive data in error messages
    3. Injection vectors -- SQL injection, XSS, command injection, path
       traversal, template injection in string-building code
    4. Auth and authorization -- endpoints or functions missing auth,
       incorrect permission checks, privilege escalation risks
    5. Secrets and credentials -- hardcoded secrets, API keys, tokens,
       credentials in log output, unparameterized connection strings
    6. Data exposure -- internal state in error output, stack traces in
       responses, PII in logs, database schemas leaked
    7. Dependency risk -- new dependencies that are unmaintained, poorly
       versioned, or have known vulnerabilities
    8. Race conditions -- unsynchronized shared resources, TOCTOU
       vulnerabilities in concurrent code

    For each finding, categorize as:
    - **Patch** (adding validation, escaping output, removing a secret)
      -- straightforward fix
    - **Security refactor** (restructuring auth flow, replacing a
      vulnerable pattern) -- requires structural changes

    For each finding report:
    1. File and line number
    2. Category (patch or security refactor)
    3. What's wrong
    4. Severity: critical / high / medium / low
    5. Attack vector (if applicable)
    6. Specific fix recommendation

    Be thorough. Check every relevant file.
    When done, send your complete findings to the team lead.
    If you find ZERO issues, say so explicitly.
```

#### Spec Auditor

```
Task tool (spawn teammate):
  subagent_type: Explore
  team_name: "<project>-harden"
  name: "spec-auditor"
  prompt: |
    You are a spec auditor on the <project>-harden team.
    Your name is spec-auditor.

    Your job is to find gaps between implementation and spec -- NOT fix
    them. You are read-only.

    Compare the implementation against the spec/plan. For each issue:
    1. File and line number
    2. What's wrong or missing
    3. What the spec requires
    4. Severity: critical / high / medium / low

    Also check for test coverage gaps: untested code paths, missing edge
    cases, assertions that don't verify enough.

    Be thorough. Cross-reference every spec requirement.
    When done, send your complete findings to the team lead.
    If you find ZERO issues, say so explicitly.
```

### 6. Process Audit Findings

Collect findings from all auditors. For each finding:

- **Critical/High**: Create a task and assign to an implementation agent
- **Medium**: Create a task, include in next implementation round
- **Low/Cosmetic**: Include in next round only if trivial to fix; otherwise note and skip

**Refactor gate:** For findings categorized as **refactor** or **security refactor**, evaluate whether the refactor is genuinely necessary before creating a task. The bar: "Would a senior engineer say the current state is clearly wrong, not just imperfect?" Reject refactor proposals that are style preferences or marginal improvements.

### 7. Document Pass

After audit findings are resolved, include a document task in the implementation round. Implementation agents should add up to 5 single-line comments per area on non-obvious decisions:

- Logic that requires more than 5 seconds of "why does this exist?" thought
- Workarounds or hacks, with context and ideally a TODO with conditions for removal
- Performance-sensitive choices and why the current approach was chosen over the obvious alternative

This is deliberately lightweight -- decision capture, not a documentation sprint.

### 8. Loop

If there are findings to fix:

1. Create tasks from findings (include document pass tasks)
2. Spawn implementation agents (or reuse idle ones via SendMessage)
3. Wait for fixes
4. Run compile + test verification
5. Spawn audit agents again (fresh agents, not reused -- clean context)
6. Repeat until auditors find zero issues

### 9. Final Verification

When auditors report zero findings:

1. Compile / type check -- must be clean
2. Tests -- must all pass
3. No `// TODO` or `// FIXME` comments introduced without corresponding tasks

### 10. Cleanup

Send shutdown requests to all agents, then delete the team:

```
SendMessage type: shutdown_request to each agent
TeamDelete
```

## Scope Constraints for Auditors

Auditors MUST only review code modified in the current task. They must NOT:

- Flag issues in adjacent code that was not modified
- Pursue "while I'm here" improvements outside the diff
- Suggest new dependencies or architectural changes
- Make speculative flags based on patterns noticed elsewhere

Auditors SHOULD flag out-of-scope concerns separately from in-scope findings so the team lead can triage them independently.

## Agent Sizing Guide

| Codebase / Task Size | Impl Agents | Audit Agents |
|----------------------|-------------|--------------|
| Small (< 10 files) | 1-2 | 2 (simplify + harden) |
| Medium (10-30 files) | 2-3 | 2-3 |
| Large (30+ files) | 3-5 | 3 (simplify + harden + spec) |

More agents = more parallelism but more coordination overhead. For most tasks, 2-3 implementation agents and 2-3 auditors is the sweet spot.

## Tips

- **Implementation agents should be `general-purpose`** -- they need write access
- **Audit agents should be `Explore`** -- read-only prevents them from silently "fixing" things, which defeats the purpose of auditing
- **Fresh audit agents each round** -- don't reuse auditors from previous rounds; they carry context that biases them toward "already checked" areas
- **Task descriptions must be specific** -- include file paths, function names, exact behavior expected. Vague tasks produce vague implementations.
- **Run compile + tests between phases** -- don't spawn auditors on broken code; fix compilation/test errors first
- **Keep the loop tight** -- if auditors find only 1-2 low-severity cosmetic issues, fix them yourself instead of spawning a full implementation round
- **Assign tasks before spawning** -- set `owner` on tasks via TaskUpdate so agents know what to work on immediately
- **Simplify-first posture** -- when processing audit findings, prioritize cosmetic cleanups that reduce noise before tackling refactors. Cleanup is the default, refactoring is the exception
- **Security over style** -- when budget or time is constrained, prioritize harden findings over simplify findings

## Example: Implementing Spec Features

```
1. Read spec, identify 8 features to implement
2. TeamCreate: "feature-harden"
3. TaskCreate x8 (one per feature)
4. Spawn 3 impl agents, assign ~3 tasks each
5. Wait → all done → compile clean → tests pass
6. Spawn 3 auditors: simplify-auditor, harden-auditor, spec-auditor
7. Simplify-auditor finds 4 cosmetic + 1 refactor proposal
8. Harden-auditor finds 2 patches + 1 security refactor
9. Spec-auditor finds 1 missing feature
10. Team lead evaluates refactors (approve/reject), creates tasks
11. Spawn 2 impl agents for fixes + document pass
12. Wait → compile clean → tests pass
13. Spawn 3 auditors again (fresh)
14. Auditors find 0 issues
15. Final verify: compile + tests
16. Shutdown agents, TeamDelete
```

## Quality Gates (Non-Negotiable)

These must pass before the loop can exit:

1. Clean compile / type check -- zero errors
2. Tests -- zero failures
3. All audit agents report zero findings
4. No `// TODO` or `// FIXME` comments introduced without corresponding tasks

## Design Decisions

**Why separate simplify and harden auditors?**
They require different mindsets. Simplify asks "is this the clearest expression of intent?" while Harden asks "how could this be exploited?" Conflating them leads to mediocre results on both. Separate auditors produce more thorough, focused findings.

**Why simplify-first posture?**
Agents love to refactor. Given permission to "improve" code, they will restructure it. But most post-implementation improvements are cosmetic: a dead import, a bad name, a needlessly deep conditional. These account for 80%+ of the value with near-zero risk. Refactoring carries real risk -- it can introduce bugs, break tests, and bloat diffs. By making simplification the default and refactoring the exception, the loop delivers consistent value without surprise rewrites.

**Why read-only audit agents?**
If audit agents could edit files, they would "fix" issues silently, defeating the purpose of auditing. Read-only agents force findings through the team lead, who decides what to fix, what to skip, and what refactors are genuinely warranted. This prevents audit-implementation oscillation.

**Why fresh audit agents each round?**
Reused auditors carry context from previous rounds that biases them toward "already checked" areas. Fresh agents approach the codebase without assumptions, catching issues that a primed auditor might skip.

**Why a document pass?**
Agents are terrible at documenting their reasoning unprompted. Humans reviewing agent-generated code consistently report that the biggest friction is understanding *why* a choice was made. A few comments capturing non-obvious decisions is a trivial cost for enormous review-time savings.

**Why scope constraints for auditors?**
Without constraints, auditors will flag every issue in the codebase. This creates unbounded work, scope creep, and noise that buries the real findings. Scoping to modified files keeps the loop focused and finite.
