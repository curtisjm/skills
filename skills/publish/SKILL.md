---
name: publish
description: Create the Linear issue tree from plan.md and move the project to Implementing. Use from create-plan after plan approval.
---

# Publish

Runs unattended from `create-plan` after plan approval (`~/dev/skills/WORKFLOW.md`). Turns the Items table of `{TASKDIR}/plan.md` into the Linear issue tree and moves the project to Implementing.

## Steps

1. **Read `{TASKDIR}/task.md` and `{TASKDIR}/plan.md` FULLY.** `linear_project` names the project; the Items table and the per-item sections of the plan are the source for every issue below.

2. **Create one issue per phase** on the project, in phase order: `save_issue` with the team the project belongs to, title `Phase N: [phase name from the plan]`, description = that phase's `### Overview`. State Todo.

3. **Create one sub-issue per item** under its phase issue (`parentId`), in table order: title `[id] [title]` (e.g. `1-1-add-toggle-column add toggle column`), description = the item's section from `plan.md` verbatim, preceded by one line `repo: [repo] · type: [type] · est. LOC: [n]`. State Todo. The id prefix is how the orchestrator finds the sub-issue later (`list_issues` on the project with the id as query), so keep it exact.

   Idempotence: if a sub-issue whose title starts with the id already exists on the project, update it instead of creating a second one; same for a phase issue with the same title.

4. **Move the project to Implementing**: `save_project` with `state: Implementing`.

5. **Return to the caller** the project URL and the counts of phases and items created.

Linear issue identifiers and links stay in Linear: they never go into code, commits, PR titles or bodies, or branch names.
