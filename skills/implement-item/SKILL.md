---
name: implement-item
description: Only use when the user explicitly invokes this skill by name.
---

# Implement item

Head of one item subagent (`~/dev/skills/WORKFLOW.md`): a single row of `{TASKDIR}/plan.md`, run to a review-clean PR (or a completed promotion or check), then reported to the orchestrator. The orchestrator spawned this child with `delegate_task`; it shares the task checkout and works in the item's worktree.

The task names `{TASKDIR}`, the item `id`, and the worktree path and branch when the item has a repo. Run every repo command in that worktree. When the task says to run the **Outer-loop round**, skip to that section.

## Steps

1. **Read the item.** `{TASKDIR}/task.md` frontmatter (`linear_project`), the item's row and section in `{TASKDIR}/plan.md`, and its sub-issue on the Linear project (`list_issues` with the id as query) — the sub-issue body may carry revisions made after the plan was published, and it wins. Read `{TASKDIR}/reports/` for earlier phases this item builds on.

2. **Set up the repo.** The worktree is a fresh checkout with no setup run: install dependencies and run whatever the repo's README or package manager calls setup. Secrets come from AWS; nothing is copied from another checkout. When the branch already has commits, uncommitted changes, or an open PR, an earlier child for this item was stopped: read what it left, including `git status` and `git diff`, and continue from there. A cancelled child stops mid-edit, so its uncommitted changes may be partial; finish or revert them before the first commit.

3. **Do the work, by type:**
   - `pr`: implement the item yourself in this worktree. Before writing code, read the index in `~/dev/skills/skills/principles/SKILL.md` and open the leaf for any principle you apply. When the item fixes a bug with a cheap local test path, follow the `tdd` skill (`~/dev/skills/skills/tdd/SKILL.md`) so the failing test lands before the fix. Read every file the item section names FULLY first; follow the plan's intent while adapting to what the code actually looks like. Plans are carefully designed, but reality can be messy: when the code does not match what the plan assumed, first make sure you have read and understood the relevant code and consider whether the codebase moved since the plan was written; if the intent still holds, follow it and note the divergence for the report; if it cannot be followed, stop and report blocked with what the plan expected, what you found, and why it matters. When the implementation admits several valid shapes, delegate it via the `arena` skill (`~/dev/skills/skills/arena/SKILL.md`). Verify on the real surface through the repo's `verify-<app>` skill (`.claude/skills/verify-<app>/`) when the repo has one; its evidence goes in the item report. Run the item's automated verification until it passes; manual verification is listed in the report for the user, never marked done by you. An item that reports a speedup, regression, or other measured number runs it through the `benchmark-checklist` skill (`~/dev/skills/skills/benchmark-checklist/SKILL.md`) before it is reported. Commit with `ci-commit`. Then run `review-loop` through its inner loop and Open the PR (`describe-pr`, push, open). Stop before its outer loop: a child cannot wait on bots, so the orchestrator watches the PR and starts one child per outer-loop round.
   - `ops`: open the pin or activation PR the item describes (same `ci-commit` + `review-loop` up to the open PR; review-loop's proportionality rule skips the inner loop for pin PRs), or, for an action only the user can run, write out the exact steps. The user merges and runs it; this child does neither.
   - `test`: run the checks the item describes against the real system (logs, flows, dashboards) and record what was observed, pass or fail. For coverage matrices, races, or gauntlets, fan the runs out via the `swarm` skill (`~/dev/skills/skills/swarm/SKILL.md`).

4. **Write `{TASKDIR}/reports/{id}.md`** now for a `test` item or an `ops` item with no PR. A PR item writes it in the Outer-loop round whose stop check holds. The report holds the PR as a link, `[repo#n](url)` (if any); what diverged from the plan and why; rulings made; review findings rejected and why; each principle applied and the decision it changed; manual verification still owed; anything later phases must know. Facts only; the orchestrator folds them into the plan. The report is written through the `unslop` skill.

5. **Report** in your final message, whose last line is one of:
   - `Item {id} PR open: {url}, head {sha}` after the PR opens.
   - `Item {id} done: {TASKDIR}/reports/{id}.md` once the report is written.
   - `Item {id} blocked: {reason}`, followed by a `NEEDS FROM USER via orchestrator:` block of numbered steps. Never wait on the user.

## Outer-loop round

The orchestrator starts this child after a watched PR got its bot reviews and CI finished, so do not wait for either. Run one round of `review-loop`'s outer loop in `drive` mode from its step 2 (conflicts, review threads, CI, the inner loop again after any commit) and push one wave.

- Anything pushed: end with `Item {id} round {n}: pushed {sha}`.
- Nothing to fix, no open threads, CI green: the stop check holds. Write the report per step 4 with the review-loop facts (rounds run, findings rejected and why), and end with `Item {id} done: …`.
- Round five ended without the stop check holding: write the report with what is still open, and end with `Item {id} done: …`.

## Guardrails

- Never merge, never push to a branch that is not this item's.
- Never call `watch_pull_request`, `sleep`, or a polling loop to wait on bots or CI; the orchestrator owns the waiting.
- Linear identifiers and links never go into code, commits, PR titles or bodies, or branch names. Neither do the task's documents (`tdd.md`, `plan.md`, …), paths under `{TASKDIR}`, or phrases like "per the TDD".
- Scope is the item. Work the plan did not ask for goes in the report as a note, not into the PR.
