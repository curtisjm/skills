---
name: implement-item
description: Only use when the user explicitly invokes this skill by name.
---

# Implement item

Head of one item thread (`WORKFLOW.md`): a single row of `{TASKDIR}/plan.md`, run to a review-clean PR (or a completed promotion or check), then reported to the orchestrator. The orchestrator launched this thread inside the item's worktree when the item has a repo.

The launch message names `{TASKDIR}` and the item `id`.

## Steps

1. **Read the item.** `{TASKDIR}/task.md` frontmatter (`orchestrator_thread`, `linear_project`), the item's row and section in `{TASKDIR}/plan.md`, and its sub-issue on the Linear project (`list_issues` with the id as query) — the sub-issue body may carry revisions made after the plan was published, and it wins. Read `{TASKDIR}/reports/` for earlier phases this item builds on.

2. **Set up the repo.** The worktree is a fresh checkout with no setup run: install dependencies and run whatever the repo's README or package manager calls setup. Secrets come from AWS; nothing is copied from another checkout.

3. **Do the work, by type:**
   - `pr`: delegate the implementation to `implementer-agent` with a short prompt — `Implement item {id} of {TASKDIR}/plan.md; stop after its automated verification` — then review its output and run the item's automated verification yourself. Commit with `ci-commit`. Then run `review-loop` to take the branch through the inner loop, `describe-pr`, the PR, and the outer loop.
   - `ops`: open the pin or activation PR the item describes (same `ci-commit` + `review-loop`), or, for an action only the user can run, write out the exact steps. The user merges and runs it; this thread does neither.
   - `test`: run the checks the item describes against the real system (logs, flows, dashboards) and record what was observed, pass or fail.

4. **Write `{TASKDIR}/reports/{id}.md`:** PR URL (if any); what diverged from the plan and why; rulings made; review findings rejected and why; manual verification still owed; anything later phases must know. Facts only; the orchestrator folds them into the plan.

5. **Report**: `t3_thread_send` to `orchestrator_thread` with `Item {id} done: {TASKDIR}/reports/{id}.md` (or `Item {id} blocked: …` when stuck). Then end.

## Guardrails

- Never merge, never push to a branch that is not this item's.
- Linear identifiers and links never go into code, commits, PR titles or bodies, or branch names.
- Scope is the item. Work the plan did not ask for goes in the report as a note, not into the PR.
