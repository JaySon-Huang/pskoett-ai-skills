# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice
**Areas**: frontend | backend | infra | tests | docs | config
**Statuses**: pending | in_progress | resolved | wont_fix | promoted

---

## 2026-02-22 — DX Data: snapshot_team_id vs team_id FK confusion

- **Category**: correction | **Area**: docs | **Status**: resolved
- **Context**: `dx_snapshot_team_scores` has two team FK columns: `snapshot_team_id` (FK to `dx_snapshot_teams.id`) and `team_id` (FK to `dx_teams.id`). All survey score queries that join to `dx_snapshot_teams` must use `snapshot_team_id`, not `team_id`.
- **Resolution**: Fixed all JOINs in SKILL.md and `references/developer-experience.md` to use `ts.snapshot_team_id = st.id`.

## 2026-02-22 — DX MCP server tool name

- **Category**: correction | **Area**: docs | **Status**: resolved
- **Context**: The DX Data MCP server tool is `mcp__dx-mcp-server__queryData`, not `mcp__DX_Data__queryData`. MCP tool names use the server name from config, which may differ from what you'd guess.
- **Resolution**: Updated SKILL.md tool references.

