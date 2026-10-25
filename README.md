# skills

Personal RPI (Research, Plan, Implement) workflow skills, run as T3 Code threads on Claude or Codex. Linear mirrors the task; HTML artifacts stay in the task folder.

Start with `WORKFLOW.md`: the paths, which skill runs each step, placeholders, `task.md` and `plan.md` shape, the Linear mapping, and gates. `docs/workflow-map.html` draws it.

## Install

Clone to `~/dev/skills` (skills reference `~/dev/skills/WORKFLOW.md` by that path) and run `./install.sh`. It symlinks `skills/*` into `~/.claude/skills` and `~/.agents/skills`, and `agents/*.md` into `~/.claude/agents`, so a `git pull` updates everything. It also reports which of `gh`, `plannotator`, `roborev`, `coderabbit`, `bun` are missing.

Also expected on the machine: repositories at `~/dev/valency/{REPOBASENAME}`, the tasks repo cloned at `~/dev/valency/tasks`, and the Linear and T3 MCP servers configured in each harness.

## Layout

- `WORKFLOW.md` — the shared contract every skill reads.
- `skills/<name>/SKILL.md` — one skill per directory, with `references/` for templates and final-answer text.
- `agents/*.md` — sub-agent definitions the skills dispatch to via `delegate_task`.
- `docs/` — the workflow map and the item-thread diagram (standalone HTML).
