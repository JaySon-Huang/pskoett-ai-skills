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

## Self-Improvement Workflow

When errors or corrections occur:
1. Log to `.learnings/ERRORS.md`, `LEARNINGS.md`, or `FEATURE_REQUESTS.md`
2. Review and promote broadly applicable learnings to:
   - `CLAUDE.md` - project facts and conventions
   - `AGENTS.md` - workflows and automation
   - `.github/copilot-instructions.md` - Copilot context
