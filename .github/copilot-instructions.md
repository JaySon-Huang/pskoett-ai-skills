# Copilot Instructions

Project context and conventions for GitHub Copilot.

## Project Overview

This is a collection of skills for AI agents following the [Agent Skills specification](https://agentskills.io/specification).

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

The `name` field in frontmatter must match the folder name.

## Conventions

- Follow the Agent Skills specification at agentskills.io
- No README.md files inside skill folders (per spec)
- Use lowercase with hyphens for skill names
- When a skill references tool calls, add Copilot-compatible guidance to ask in chat
