# skills

Personal RPI (Research, Plan, Implement) workflow skills, run as T3 Code threads on Claude or Codex. Linear mirrors the task; HTML artifacts stay in the task folder.

Start with `WORKFLOW.md`: the paths, which skill runs each step, placeholders, `task.md` and `plan.md` shape, the Linear mapping, and gates. `docs/workflow-map.html` draws it.

## Layout

- `WORKFLOW.md` — the shared contract every skill reads.
- `skills/<name>/SKILL.md` — one skill per directory, with `references/` for templates and final-answer text.
- `agents/*.md` — sub-agent definitions the skills dispatch to via `delegate_task`.
- `docs/` — the workflow map and the item-thread diagram (standalone HTML).

## Provenance

- `skills/` started as a verbatim copy of HumanLayer's `riptide-rpi` desktop plugin v0.41.2 (`~/.humanlayer/riptide/plugins/riptide-rpi/0.41.2/skills`). License terms in `LICENSE-humanlayer`. Personal use only, not for redistribution.
- `agents/` — the seven `rpi:*` sub-agents, copied from the `riptide-rpi-terminal` plugin v0.30.34 `agents/` directory (the desktop plugin defines these in daemon code instead).

Skills are being rewritten one at a time against `WORKFLOW.md`; the status table there says which are still HumanLayer copies. Design history lives in `~/dev/valency/tasks/rpi/`.
