# pskoett-ai-skills

A collection of skills for AI agents. Follows the [Agent Skills specification](https://agentskills.io/specification).

## Install

```bash
npx skills add pskoett/pskoett-ai-skills
```

## Structure

```
skills/
  skill-name/
    SKILL.md         # Required - skill definition with YAML frontmatter
    scripts/         # Optional - executable code
    references/      # Optional - documentation loaded on demand
    assets/          # Optional - templates, images, data files
```

## Skills

| Skill | Description |
|-------|-------------|
| [self-improvement](skills/self-improvement/) | Captures learnings and errors with hook-based activation and automatic skill extraction |
| [plan-interview](skills/plan-interview/) | Runs a structured interview before planning non-trivial implementations |

## Usage

To use a skill, add it to your agent's configuration or reference it directly.

### Self-Improvement with Hooks

The self-improvement skill supports automatic activation via hooks. Add to `.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "./skills/self-improvement/scripts/activator.sh"
      }]
    }]
  }
}
```

Features:
- **Hook activation**: Automatic reminders to evaluate learnings after tasks
- **Error detection**: PostToolUse hook detects command failures
- **Skill extraction**: Promote high-value learnings to reusable skills
- **Multi-agent support**: Works with Claude Code, Codex CLI, and GitHub Copilot

## Contributing

Feel free to submit PRs with new skills or improvements to existing ones.
