---
name: implement-item
description: Only use when the user explicitly invokes this skill by name.
---

# Implement item

Head of one item thread (`~/dev/skills/WORKFLOW.md`): a single row of `{TASKDIR}/plan.md`, run to a review-clean PR (or a completed promotion or check), then reported to the orchestrator. The orchestrator launched this thread inside the item's worktree when the item has a repo.

The launch message names `{TASKDIR}` and the item `id`.

## Steps

1. **Read the item.** `{TASKDIR}/task.md` frontmatter (`orchestrator_thread`, `linear_project`), the item's row and section in `{TASKDIR}/plan.md`, and its sub-issue on the Linear project (`list_issues` with the id as query) — the sub-issue body may carry revisions made after the plan was published, and it wins. Read `{TASKDIR}/reports/` for earlier phases this item builds on.

2. **Set up the repo.** The worktree is a fresh checkout with no setup run: install dependencies and run whatever the repo's README or package manager calls setup. Secrets come from AWS; nothing is copied from another checkout.

3. **Do the work, by type:**
   - `pr`: implement the item yourself in this worktree. When the item fixes a bug with a cheap local test path, follow the `tdd` skill (`~/dev/skills/skills/tdd/SKILL.md`) so the failing test lands before the fix. Read every file the item section names FULLY first; follow the plan's intent while adapting to what the code actually looks like. Plans are carefully designed, but reality can be messy: when the code does not match what the plan assumed, first make sure you have read and understood the relevant code and consider whether the codebase moved since the plan was written; if the intent still holds, follow it and note the divergence for the report; if it cannot be followed, stop and report blocked with what the plan expected, what you found, and why it matters. Run the item's automated verification until it passes; manual verification is listed in the report for the user, never marked done by you. Commit with `ci-commit`. Then run `review-loop` to take the branch through the inner loop, `describe-pr`, the PR, and the outer loop.
   - `pr`: implement the item yourself in this worktree. Before writing code, read the index in `~/dev/skills/skills/principles/SKILL.md` and open the leaf for any principle you apply. Read every file the item section names FULLY first; follow the plan's intent while adapting to what the code actually looks like. Plans are carefully designed, but reality can be messy: when the code does not match what the plan assumed, first make sure you have read and understood the relevant code and consider whether the codebase moved since the plan was written; if the intent still holds, follow it and note the divergence for the report; if it cannot be followed, stop and report blocked with what the plan expected, what you found, and why it matters. Run the item's automated verification until it passes; manual verification is listed in the report for the user, never marked done by you. Commit with `ci-commit`. Then run `review-loop` to take the branch through the inner loop, `describe-pr`, the PR, and the outer loop.
   - `ops`: open the pin or activation PR the item describes (same `ci-commit` + `review-loop`; review-loop's proportionality rule skips the inner loop for pin PRs), or, for an action only the user can run, write out the exact steps. The user merges and runs it; this thread does neither.
   - `test`: run the checks the item describes against the real system (logs, flows, dashboards) and record what was observed, pass or fail.

4. **Write `{TASKDIR}/reports/{id}.md`:** the PR as a link, `[repo#n](url)` (if any); what diverged from the plan and why; rulings made; review findings rejected and why; each principle applied and the decision it changed; manual verification still owed; anything later phases must know. Facts only; the orchestrator folds them into the plan.

5. **Report**: `t3_thread_send` to `orchestrator_thread` with `Item {id} done: {TASKDIR}/reports/{id}.md` (or `Item {id} blocked: …` when stuck). Then end.

## Guardrails

- Never merge, never push to a branch that is not this item's.
- Linear identifiers and links never go into code, commits, PR titles or bodies, or branch names. Neither do the task's documents (`tdd.md`, `plan.md`, …), paths under `{TASKDIR}`, or phrases like "per the TDD".
- Scope is the item. Work the plan did not ask for goes in the report as a note, not into the PR.
