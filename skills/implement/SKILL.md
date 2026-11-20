---
name: implement
description: Only use when the user explicitly invokes this skill by name.
---

# Implement (orchestrator)

The one thread for everything after Publish (`~/dev/skills/WORKFLOW.md`): dispatches each phase of `{TASKDIR}/plan.md` as parallel item subagents, watches their PRs, collects their reports, revises the plan between phases, and writes every Linear status. It writes no code and never merges.

The launch message names `{TASKDIR}`.

## Setup

Read `{TASKDIR}/task.md` and `{TASKDIR}/plan.md` FULLY. In the `task.md` frontmatter set `phase: implement`. `linear_project` names the project; sub-issues are found on it by `list_issues` with the item id as query. Call `orchestrator_capabilities` once, before the first dispatch.

Derive the current state from Linear, not memory: the current phase is the first whose sub-issues are not all Done. In Review ones are waiting on the user's merge. An In Progress sub-issue has a live child only if this thread started it. On a thread started by `handoff`, or after a restart, no child is live: an In Progress item with no `{TASKDIR}/reports/{id}.md` is dispatched again, and its child picks up from the branch and PR it finds.

The orchestrator keeps the decision trail at `{TASKDIR}/decisions.tsv` per the `show-me-your-work` skill (`~/dev/skills/skills/show-me-your-work/SKILL.md`); that skill says what earns a row.

## Dispatch a phase

For every item of the phase, together, with no concurrency cap:

1. **Base branch.** `origin/main`, or the parent PR's branch when `## Phase transitions` stacks this item on it. `git -C ~/dev/valency/{REPOBASENAME} fetch origin` first.
2. **Worktree** (items with a repo): `git -C ~/dev/valency/{REPOBASENAME} worktree add {TASKDIR}/repos/{REPOBASENAME}-X-Y -b {TASKSLUG}/{id} <base>`. The task project is not the code repo, so `delegate_task`'s `worktree` isolation cannot create this; the child runs in the shared task checkout and works in this path.
3. **Spawn** one `delegate_task` child, `mode: async`, default isolation:
   - title `PR X.Y: [title]` for `pr`, `PROMO X.Y: [title]` for `ops`, `TEST X.Y: [title]` for `test`
   - `target`: the newest Opus model when this thread runs on Claude, the newest Sol model when it runs on Codex, with effort `high` (see Relay in `~/dev/skills/WORKFLOW.md`)
   - task: `Read ~/dev/skills/skills/implement-item/SKILL.md FULLY and run it for {TASKDIR} item {id}. Your worktree is {worktree path} on branch {branch}; run every repo command there. You may start delegate_task children wherever that skill or a skill it calls says to spawn.` Drop the worktree sentence for an item with no repo.
4. **Linear**: sub-issue → In Progress; phase issue → In Progress at its first item.

Then end the turn. Each child's completion wakes this thread.

## When a child finishes

Its last line says which of these happened:

- **`PR open`** (`pr`, and `ops` with a PR): the PR is open with the inner loop clean. Call `link_pull_request` and `watch_pull_request` on it, then end the turn. A child cannot wait on bots, so this thread does the waiting.
- **`round {n}: pushed {sha}`**: an outer-loop round pushed fixes. The watch persists across pushes, so end the turn and wait for the next wakeup.
- **`done`**: the report is written. For a PR item, `unwatch_pull_request`. Read `{TASKDIR}/reports/{id}.md`. Sub-issue → In Review (`pr`, `ops`: a PR is open and waiting on the user) or Done (`test`, when the checks passed).
- **`blocked`**: relay its NEEDS FROM USER block to the user as numbered steps and stop there; the sub-issue stays In Progress. The user's answer goes to a new child for the item, with the answer in its task.

**When a watched PR wakes this thread**, check that a review newer than the last push exists from each bot the repo has enabled and that CI has finished (`review-loop` outer loop, step 1, names the logins). If not, end the turn. If so, spawn a new child for the item, on the same model and title with ` round {n}` appended: `Read ~/dev/skills/skills/implement-item/SKILL.md FULLY and run its Outer-loop round for {TASKDIR} item {id}, PR {url}, round {n}. Your worktree is {worktree path} on branch {branch}.` After the fifth round, the next child writes the report with what is still open, as `review-loop` caps the loop at five rounds.

When every sub-issue of the phase is In Review or Done, the phase has converged: run `revise-plan` (it reads the phase's reports and updates `plan.md`, `plan-changelog.md`, and the next phase's sub-issue bodies; a change beyond the approved outcome becomes a proposal to the user and a pause; their ruling is applied by running `revise-plan` again). Then:

- **stacked** next phase: dispatch it now.
- **merge-first** next phase: list the PRs the user must merge, each as a link (`[repo#n](url)`), and end the turn. When the user reports the merges (or says continue): sub-issues → Done, phase issue → Done, dispatch the next phase.
- no next phase: project → In Review. The user runs `close-task` when the work is merged, promoted, and validated.

A status message the user has not seen for a while follows the `catch-up` skill's shape (`~/dev/skills/skills/catch-up/SKILL.md`).

## Guardrails

- **Agents never merge.** The user merges every PR and runs every promotion action; an `ops` child opens the pin PR, nothing more.
- `plan.md` has one writer: this thread, through `revise-plan`. Completed phases are not rewritten; their reports are the record.
- Never poll a running child with `task_status`, `sleep`, or a loop; its completion wakes this thread.
- Linear identifiers and links never go into code, commits, PR titles or bodies, or branch names. Neither do the task's documents (`tdd.md`, `plan.md`, …), paths under `{TASKDIR}`, or phrases like "per the TDD".
