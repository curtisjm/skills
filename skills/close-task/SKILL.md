---
name: close-task
description: Only use when the user explicitly invokes this skill by name.
---

# Close task

Last step of the Standard and Long paths (`WORKFLOW.md`). The user invokes it after the work is merged, promoted through staging and production where the plan says so, and validated at each step. It writes the retro, closes the Linear project, and removes the task's worktrees. Quick has no close; the merge is the close.

Runs in the task project; `{TASKDIR}` is the working directory.

## Steps

1. **Read** `{TASKDIR}/task.md` (set `phase: close`), `plan.md`, `plan-changelog.md`, and every `reports/*.md` FULLY.

2. **Confirm with the user** in one message anything the records leave open: PRs not reported merged, rollout items without a validation note, manual verification still owed. Continue only when they say it is all done.

3. **Write `{TASKDIR}/retro.md`** from `{SKILLBASE}/references/retro_template.md`: what shipped (PRs, promotions), how the plan changed and why (from the changelog), what the reports flagged for the future, and what to change in the workflow or skills next time.

4. **Linear**: mirror `retro.md` to the project (titled `retro.md`); set every remaining issue and sub-issue to Done; project → Done.

5. **Clean up worktrees**: for each checkout under `{TASKDIR}/repos/`, `git -C ~/dev/valency/{REPOBASENAME} worktree remove <path>`. Branches are left alone; they are merged.

6. **Respond** with exactly:

```markdown
### Done

Task `{TASKSLUG}` is closed.

- Retro: `{TASKDIR}/retro.md` · [retro.md]({url of the Linear document})
- Linear: [{linear_project}]({project URL}) → Done
```
