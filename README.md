# skills

Personal, harness-agnostic RPI (Research, Plan, Implement) workflow skills for Claude Code and Codex. Linear is the hub, HTML artifacts publish to GitHub Pages, no HumanLayer infrastructure.

## Layout

- `skills/<name>/SKILL.md` — one skill per directory, with `references/` for templates and final-answer text.
- `agents/*.md` — sub-agent definitions the skills dispatch to.
- `CONVENTIONS.md` — shared placeholders (`{TASKDIR}`, `{SKILLBASE}`, ...) and document naming.

## Provenance

- `skills/` started as a verbatim copy of HumanLayer's `riptide-rpi` desktop plugin v0.41.2 (`~/.humanlayer/riptide/plugins/riptide-rpi/0.41.2/skills`). License terms in `LICENSE-humanlayer`. Personal use only, not for redistribution.
- `agents/` — the seven `rpi:*` sub-agents, copied from the `riptide-rpi-terminal` plugin v0.30.34 `agents/` directory (the desktop plugin defines these in daemon code instead).

Design notes and the proposed target skill set live in the task folder (`04-proposed-skill-set.md`).
