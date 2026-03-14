# Hook Setup Guide

Configure automatic self-improvement triggers for AI coding agents.

## Overview

Hooks enable proactive learning capture by injecting reminders at key moments:
- **Prompt/session start**: Reminder to evaluate and log new learnings
- **After command execution**: Error detection nudges for non-obvious failures

## Claude Code Setup

### Option 1: Project-Level Configuration

Create `.claude/settings.json` in your project root:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "./skills/self-improvement/scripts/activator.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "./skills/self-improvement/scripts/error-detector.sh"
          }
        ]
      }
    ]
  }
}
```

### Option 2: User-Level Configuration

Add to `~/.claude/settings.json` for global activation:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/skills/self-improvement/scripts/activator.sh"
          }
        ]
      }
    ]
  }
}
```

### Minimal Setup (Activator Only)

For lower overhead, use only the UserPromptSubmit hook:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "./skills/self-improvement/scripts/activator.sh"
          }
        ]
      }
    ]
  }
}
```

## Codex CLI Setup

Codex supports command hooks through `.codex/hooks.json`.

Create `.codex/hooks.json` in your project root:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear",
        "hooks": [
          {
            "type": "command",
            "command": "./skills/self-improvement/scripts/codex-session-start-hook.sh"
          }
        ]
      }
    ]
  }
}
```

Notes:
- `SessionStart` injects additional context before task execution begins.
- Keep the hook output short so startup context remains lightweight.

## OpenCode Setup

OpenCode's recommended hook path is plugins.

1. Create plugin folder if needed:

```bash
mkdir -p .opencode/plugins
```

2. Copy the skill plugin:

```bash
cp ./skills/self-improvement/hooks/opencode/plugin.ts ./.opencode/plugins/self-improvement.ts
```

3. Restart OpenCode.

The plugin uses:
- `experimental.chat.system.transform` to inject a self-improvement reminder
- `tool.execute.after` to append an error-logging nudge on likely Bash failures

## GitHub Copilot Setup

Copilot doesn't support hooks directly. Instead, add guidance to `.github/copilot-instructions.md`:

```markdown
## Self-Improvement

After completing tasks that involved:
- Debugging non-obvious issues
- Discovering workarounds
- Learning project-specific patterns
- Resolving unexpected errors

Consider logging the learning to `.learnings/` using the format from the self-improvement skill.

For high-value learnings that would benefit other sessions, consider skill extraction.
```

## Verification

### Test Activator Hook

1. Enable the hook configuration
2. Start a new Claude Code session
3. Send any prompt
4. Verify you see `<self-improvement-reminder>` in the context

### Test Codex SessionStart Hook

1. Add `.codex/hooks.json` config above
2. Start a new Codex session in the project
3. Confirm session-start hook executes (Codex prints hook events in CLI output when enabled)
4. Ask the model to restate active reminders; verify self-improvement guidance appears

### Test OpenCode Plugin Hook

1. Install plugin to `.opencode/plugins/self-improvement.ts`
2. Start OpenCode in the project
3. Run a failing bash command (for example `ls /nonexistent/path`) via the agent
4. Verify the resulting tool output includes `<error-detected>` reminder text

### Test Error Detector Hook

1. Enable PostToolUse hook for Bash
2. Run a command that fails: `ls /nonexistent/path`
3. Verify you see `<error-detected>` reminder

### Dry Run Extract Script

```bash
./skills/self-improvement/scripts/extract-skill.sh test-skill --dry-run
```

Expected output shows the skill scaffold that would be created.

## Troubleshooting

### Hook Not Triggering

1. **Check script permissions**: `chmod +x scripts/*.sh`
2. **Verify path**: Use absolute paths or paths relative to project root
3. **Check settings location**: Project vs user-level settings
4. **Restart session**: Hooks are loaded at session start

### Permission Denied

```bash
chmod +x ./skills/self-improvement/scripts/activator.sh
chmod +x ./skills/self-improvement/scripts/error-detector.sh
chmod +x ./skills/self-improvement/scripts/extract-skill.sh
```

### Script Not Found

If using relative paths, ensure you're in the correct directory or use absolute paths:

```json
{
  "command": "/absolute/path/to/skills/self-improvement/scripts/activator.sh"
}
```

### Too Much Overhead

If the activator feels intrusive:

1. **Use minimal setup**: Only UserPromptSubmit, skip PostToolUse
2. **Add matcher filter**: Only trigger for certain prompts:

```json
{
  "matcher": "fix|debug|error|issue",
  "hooks": [...]
}
```

## Hook Output Budget

The activator is designed to be lightweight:
- **Target**: ~50-100 tokens per activation
- **Content**: Structured reminder, not verbose instructions
- **Format**: XML tags for easy parsing

If you need to reduce overhead further, you can edit `activator.sh` to output less text.

## Security Considerations

- Hook scripts run with the same permissions as Claude Code
- Scripts only output text; they don't modify files or run commands
- Error detector reads `CLAUDE_TOOL_OUTPUT` environment variable
- All scripts are opt-in (you must configure them explicitly)

## Disabling Hooks

To temporarily disable without removing configuration:

1. **Comment out in settings**:
```json
{
  "hooks": {
    // "UserPromptSubmit": [...]
  }
}
```

2. **Or delete the settings file**: Hooks won't run without configuration
