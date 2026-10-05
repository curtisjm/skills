---
name: revise-plan
description: Fold a converged phase's item reports into {TASKDIR}/plan.md and plan-changelog.md. Use from the orchestrator (implement) after every sub-issue of a phase is In Review or Done, before dispatching the next phase.
---

# Revise plan

Runs in the orchestrator thread only; it is the one writer of `plan.md` (`WORKFLOW.md`).

## Steps

1. **Read** `{TASKDIR}/plan.md`, `{TASKDIR}/plan-changelog.md` (create it if absent), and every `{TASKDIR}/reports/{id}.md` for the phase that just converged.

2. **Sort what the reports change** into two piles:
   - **In scope**: estimates, file hints, item ordering, rows added or split or removed to deliver the same approved outcome, prose in later phases that a report made stale.
   - **Out of scope**: new outcomes, a different approach, work the approved plan excluded. These are not applied.

3. **Edit `plan.md`** for the in-scope pile. Completed phases stay as they are; their reports are the record. The result is the current plan and nothing else: no strikethroughs, no "changed from", no dates, no commentary about earlier versions.

4. **Prepend one entry to `plan-changelog.md`** (newest first):

   ```markdown
   ## After phase N — YYYY-MM-DD

   **Changed**: rows added / removed / re-estimated / moved between phases; prose sections rewritten.
   **Why**: which report or ruling drove each change.
   **Needs a decision**: the out-of-scope pile, as questions to the user. "None." when empty.
   ```

5. **Update the next phase's sub-issue bodies** on the Linear project to match the revised item sections (`list_issues` with the id as query, then `save_issue`).

6. **Mirror** `plan.md` and `plan-changelog.md` to the Linear project, each titled with its file name (update by title, else create).

7. **Return** to the caller: the changelog entry, and whether **Needs a decision** is empty. When it is not, the orchestrator asks the user and pauses instead of dispatching.
