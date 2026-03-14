#!/usr/bin/env bash
# Self-Improvement SessionStart hook for Codex CLI.
# Reads JSON hook input from stdin and emits lightweight extra context.

set -euo pipefail

# Codex sends SessionStart payload via stdin. We do not need fields yet,
# but we consume stdin to keep the hook contract clean.
if [ ! -t 0 ]; then
  cat >/dev/null || true
fi

cat <<'EOF'
Self-improvement reminder: if this task reveals non-obvious fixes, repeated errors,
or missing capabilities, log them in .learnings/ (LEARNINGS.md / ERRORS.md / FEATURE_REQUESTS.md).
Promote recurring patterns into AGENTS.md, CLAUDE.md, or .github/copilot-instructions.md.
EOF
