# skills

Personal RPI (Research, Plan, Implement) workflow skills that take a task from an idea to merged, promoted, validated code. They run as T3 Code threads on Claude or Codex. Linear mirrors the task, and HTML artifacts stay in the task folder.

Four paths carry a task to a merged PR. Quick runs small, understood work in one thread. Auto hands the run to an agent that plans and implements inside a playbook with no gates and stops at merge-ready. Standard and Long run research, design, and a plan through human gates, then an orchestrator dispatches one item thread per plan row. Triage files an issue for later and stops.

Playbooks are skills for work with a known shape: bug fixes, features, refactors, perf work, forensics, prototypes, and long autonomous runs. Building blocks are the skills the model reaches for mid-step, such as `how`, `why`, `architect`, `arena`, `swarm`, `interrogate`, `review-loop`, and `describe-pr`. User tools such as `catch-up`, `recall`, `reflect`, and `eval` are invoked by name. Every role runs on one of three model tiers, and `models.md` gives each role's family and effort.

Start with `WORKFLOW.md`. It defines the paths, which skill runs each step, the placeholders, the `task.md` and `plan.md` shapes, the Linear mapping, and the gates. `docs/skills.md` describes every skill, agent, and script and when the workflow uses it. [`docs/provenance.md`](docs/provenance.md) records which upstream each skill came from and the commit it was last checked against. `docs/workflow-map.html` draws the gated paths but predates the Auto path and the playbooks.

## Install

Clone to `~/dev/skills` (skills reference `~/dev/skills/WORKFLOW.md` by that path) and run `./install.sh`. It symlinks `skills/*` into `~/.claude/skills` and `~/.agents/skills`, and `agents/*.md` into `~/.claude/agents`, so a `git pull` updates everything. Re-run it after adding a skill. It also reports which of `gh`, `plannotator`, `roborev`, `coderabbit`, `bun`, `jq`, and `rg` are missing. `bin/orch` runs on Bun, so `orchestrate` needs `bun` on PATH.

The skills also expect repositories at `~/dev/valency/{REPOBASENAME}`, the tasks repo cloned at `~/dev/valency/tasks`, and the Linear and T3 MCP servers configured in each harness.

## Layout

- `WORKFLOW.md` is the shared contract every skill reads.
- `models.md` maps every role to a model tier, family, and effort.
- `skills/<name>/SKILL.md` holds one skill per directory, with `references/` for templates, prompts, and final-answer text.
- `agents/*.md` defines the sub-agents the skills dispatch via `delegate_task`.
- `bin/` holds the scripts the steps run (`gate`, `check-plan`, `check-skill`, `worktree-audit`, and `orch`, whose source is in `bin/orch-src/`).
- `docs/` holds the skill catalog (`skills.md`), the workflow map, and the item-thread diagram (standalone HTML).
