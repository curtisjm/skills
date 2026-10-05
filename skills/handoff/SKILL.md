---
name: handoff
description: Roll the orchestrator (implement) to a fresh thread when its context has grown long. Use from the orchestrator thread only; item threads finish and end instead.
---

# Handoff

The orchestrator keeps no state the fresh thread cannot rebuild: phase progress is in Linear sub-issue statuses, item outcomes in `{TASKDIR}/reports/`, the plan in `plan.md` and `plan-changelog.md`. So a handoff is a launch, not a summary.

## Steps

1. **Finish the turn's bookkeeping** first: any report already received is reflected in Linear, and `plan.md` / `plan-changelog.md` are mirrored.

2. **Launch** `t3_thread_launch` with title `implement {TASKSLUG}` and message `Run /implement for {TASKDIR}`. Write the returned thread id to `orchestrator_thread` in the `task.md` frontmatter at once, so item threads reporting from now on reach the new thread.

3. **Reply** with exactly:

   ```markdown
   Handed off to thread `implement {TASKSLUG}`; it resumes from Linear state. This thread is done.
   ```

   Then end. The fresh thread's Setup (`implement`) derives the current phase from Linear and continues.
