# Copilot Instructions

Project context and conventions for GitHub Copilot.

## Project Overview

This is a collection of skills for AI agents following the [Agent Skills specification](https://agentskills.io/specification).

## Structure

- `skills/` - Public skills for distribution
- `.claude/skills/` - Local Claude Code skills
- `.learnings/` - Captured learnings, errors, and feature requests

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

## Skill Format

Each skill folder must contain:
- `SKILL.md` - Required, with YAML frontmatter (`name`, `description`)
- `scripts/` - Optional executable code
- `references/` - Optional documentation
- `assets/` - Optional templates and resources

The `name` field in frontmatter must match the folder name.

## Conventions

- Follow the Agent Skills specification at agentskills.io
- No README.md files inside skill folders (per spec)
- Use lowercase with hyphens for skill names
- When a skill references tool calls, add Copilot-compatible guidance to ask in chat

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
