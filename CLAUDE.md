# Claude Instructions

Project facts, conventions, and gotchas for Claude interactions.

## Project Overview

A collection of skills for AI agents following the [Agent Skills specification](https://agentskills.io/specification).

## Structure

- `skills/` - Public skills for distribution
- `.claude/skills/` - Local Claude Code skills
- `.learnings/` - Captured learnings, errors, and feature requests

## Skill Format

Each skill folder must contain:
- `SKILL.md` - Required, with YAML frontmatter (`name`, `description`)
- `scripts/` - Optional executable code
- `references/` - Optional documentation
- `assets/` - Optional templates and resources

## Conventions

- The `name` field in frontmatter must match the folder name
- No README.md files inside skill folders (per spec)
- Use lowercase with hyphens for skill names
- Keep SKILL.md under 500 lines; use references/ for detailed content
