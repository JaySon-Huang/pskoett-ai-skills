---
name: self-improvement-opencode
description: "OpenCode plugin hook that injects self-improvement reminders and command-error nudges"
---

# Self-Improvement Hook (OpenCode)

This hook is implemented as an OpenCode plugin.

## What It Does

- Adds a short self-improvement reminder via `experimental.chat.system.transform`
- Watches `tool.execute.after` and appends an `.learnings/ERRORS.md` nudge when Bash output looks like a failure

## Setup

1. Copy `hooks/opencode/plugin.ts` to `.opencode/plugins/self-improvement.ts`
2. Restart OpenCode

OpenCode auto-loads project plugins from `.opencode/plugins/`.
