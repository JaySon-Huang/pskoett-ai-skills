# Agent Instructions

Agent-specific workflows, tool usage patterns, and automation rules.

## Creating a New Skill

1. Create folder in `skills/` with skill name (lowercase, hyphens)
2. Create `SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: What it does and when to use it.
   ---
   ```
3. Add optional directories: `scripts/`, `references/`, `assets/`
4. Ensure folder name matches `name` field

## Validating Skills

Check against the spec at https://agentskills.io/specification:
- Frontmatter has required `name` and `description`
- `name` is lowercase, hyphens only, matches folder
- `description` explains what AND when to use
- No README.md or other auxiliary files in skill folder
- Provider guidance should cover Copilot when tool calls are referenced

## Skill References In This Repo (Examples)

Use these as canonical references when creating or updating skills.

Public skills (`skills/`):
- `skills/dx-data-navigator/SKILL.md` - Query DX data via MCP + SQL patterns.
- `skills/plan-interview/SKILL.md` - Structured interview before implementation planning.
- `skills/self-improvement/SKILL.md` - Capture learnings, errors, and feature requests.
- `skills/simplify-and-harden/SKILL.md` - Post-completion simplify/harden quality pass.
- `skills/agent-teams-simplify-and-harden/SKILL.md` - Parallel implementation and audit loop.

Local Claude skills (`.claude/skills/`):
- `.claude/skills/mcp-builder/SKILL.md` - Build high-quality MCP servers.
- `.claude/skills/plan-interview/SKILL.md` - Local copy of the plan-interview workflow.
- `.claude/skills/self-improvement/SKILL.md` - Local copy of the self-improvement workflow.
- `.claude/skills/skill-creator/SKILL.md` - Guide for creating or updating skills.

Keep this section synchronized across `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md`.

## Self-Improvement Workflow

When errors or corrections occur:
1. Log to `.learnings/ERRORS.md`, `LEARNINGS.md`, or `FEATURE_REQUESTS.md`
2. Review and promote broadly applicable learnings to:
   - `CLAUDE.md` - project facts and conventions
   - `AGENTS.md` - workflows and automation
   - `.github/copilot-instructions.md` - Copilot context

## Simplify and Harden Workflow

When a coding task with non-trivial code changes is complete:
1. Run `skills/simplify-and-harden/SKILL.md` for a bounded simplify/harden/document pass.
2. For larger multi-file efforts, use `skills/agent-teams-simplify-and-harden/SKILL.md`.
3. Treat independent review findings as the external merge gate and address or explicitly waive them.

Keep this section synchronized across `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md`.
