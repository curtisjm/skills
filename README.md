# skills

Personal RPI (Research, Plan, Implement) workflow skills, run as T3 Code threads on Claude or Codex. Linear mirrors the task; HTML artifacts stay in the task folder.

Start with `WORKFLOW.md`: the paths, which skill runs each step, placeholders, `task.md` and `plan.md` shape, the Linear mapping, and gates. `docs/workflow-map.html` draws it.

## Layout

- `WORKFLOW.md` — the shared contract every skill reads.
- `skills/<name>/SKILL.md` — one skill per directory, with `references/` for templates and final-answer text.
- `agents/*.md` — sub-agent definitions the skills dispatch to via `delegate_task`.
- `docs/` — the workflow map and the item-thread diagram (standalone HTML).
