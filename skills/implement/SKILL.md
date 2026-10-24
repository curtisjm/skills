---
name: implement
description: Only use when the user explicitly invokes this skill by name.
---

# Implement (orchestrator)

The one thread for everything after Publish (`~/dev/skills/WORKFLOW.md`): dispatches each phase of `{TASKDIR}/plan.md` as parallel item threads, collects their reports, revises the plan between phases, and writes every Linear status. It writes no code and never merges.

The launch message names `{TASKDIR}`.

## Setup

Read `{TASKDIR}/task.md` and `{TASKDIR}/plan.md` FULLY. In the `task.md` frontmatter set `phase: implement` and `orchestrator_thread: <this thread's id>` (item threads report to it). `linear_project` names the project; sub-issues are found on it by `list_issues` with the item id as query.

Derive the current state from Linear, not memory: the current phase is the first whose sub-issues are not all Done. Sub-issues already In Progress have a live thread; In Review ones are waiting on the user's merge. This is also how a thread started by `handoff` resumes.

## Dispatch a phase

For every item of the phase, together, with no concurrency cap:

1. **Base branch.** `origin/main`, or the parent PR's branch when `## Phase transitions` stacks this item on it. `git -C ~/dev/valency/{REPOBASENAME} fetch origin` first.
2. **Worktree** (items with a repo): `git -C ~/dev/valency/{REPOBASENAME} worktree add {TASKDIR}/repos/{REPOBASENAME}-X-Y -b {TASKSLUG}/{id} <base>`. The task project is not the code repo, so T3 cannot create this itself.
3. **Launch** with `t3_thread_launch` (`runtimeMode: full-access`):
   - title `PR X.Y: [title]` for `pr`, `PROMO X.Y: [title]` for `ops`, `TEST X.Y: [title]` for `test`
   - `workspaceStrategy: {type: existing_worktree, worktreePath, branch}` when a worktree was made; omitted for items with no repo
   - message `Run /implement-item for {TASKDIR} item {id}`
   - `modelSelection`: the newest Opus model when this thread runs on Claude, the newest Sol model when it runs on Codex, at high reasoning (`orchestrator_capabilities` lists the models; see Relay in `~/dev/skills/WORKFLOW.md`)
4. **Linear**: sub-issue → In Progress; phase issue → In Progress at its first item.

Then end the turn. Item threads wake this thread with `t3_thread_send` when they finish.

## When an item reports

Read `{TASKDIR}/reports/{id}.md`. Sub-issue → In Review (`pr`, `ops`: a PR is open and waiting on the user) or Done (`test`, when the checks passed). A report that says the item is blocked or failed its checks: tell the user what it needs and stop there; the sub-issue stays In Progress.

When every sub-issue of the phase is In Review or Done, the phase has converged: run `revise-plan` (it reads the phase's reports and updates `plan.md`, `plan-changelog.md`, and the next phase's sub-issue bodies; a change beyond the approved outcome becomes a proposal to the user and a pause; their ruling is applied by running `revise-plan` again). Then:

- **stacked** next phase: dispatch it now.
- **merge-first** next phase: list the PRs the user must merge, each as a link (`[repo#n](url)`), and end the turn. When the user reports the merges (or says continue): sub-issues → Done, phase issue → Done, dispatch the next phase.
- no next phase: project → In Review. The user runs `close-task` when the work is merged, promoted, and validated.

## Guardrails

- **Agents never merge.** The user merges every PR and runs every promotion action; an `ops` thread opens the pin PR, nothing more.
- `plan.md` has one writer: this thread, through `revise-plan`. Completed phases are not rewritten; their reports are the record.
- Linear identifiers and links never go into code, commits, PR titles or bodies, or branch names. Neither do the task's documents (`tdd.md`, `plan.md`, …), paths under `{TASKDIR}`, or phrases like "per the TDD".
