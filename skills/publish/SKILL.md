---
name: publish
description: Only use when the user explicitly invokes this skill by name.
---

# Publish

Runs unattended after plan approval (`~/dev/skills/WORKFLOW.md`). Turns the Items table of `{TASKDIR}/plan.md` into the Linear issue tree, moves the project to Implementing, and launches the orchestrator.

The launch message names `{TASKDIR}`.

## Steps

1. **Read `{TASKDIR}/task.md` and `{TASKDIR}/plan.md` FULLY.** Set `phase: publish` in the `task.md` frontmatter. `linear_project` names the project; the Items table and the per-item sections of the plan are the source for every issue below.

2. **Create one issue per phase** on the project, in phase order: `save_issue` with the team the project belongs to, title `Phase N: [phase name from the plan]`, description = that phase's `### Overview`. State Todo.

3. **Create one sub-issue per item** under its phase issue (`parentId`), in table order: title `[id] [title]` (e.g. `1-1-add-toggle-column add toggle column`), description = the item's section from `plan.md` verbatim, preceded by one line `repo: [repo] · type: [type] · est. LOC: [n]`. State Todo. The id prefix is how the orchestrator finds the sub-issue later (`list_issues` on the project with the id as query), so keep it exact.

   Idempotence: if a sub-issue whose title starts with the id already exists on the project, update it instead of creating a second one; same for a phase issue with the same title.

4. **Move the project to Implementing**: `save_project` with `state: Implementing`.

5. **Launch the orchestrator**: `t3_thread_launch` with title `implement {TASKSLUG}` and message `Run /implement for {TASKDIR}`.

6. **Respond** with exactly:

```markdown
### Next Steps

Published `{TASKSLUG}`: [N] phases, [M] items.

- Linear: [{linear_project}]({project URL})

The orchestrator has been launched in thread `implement {TASKSLUG}`.
```

Linear issue identifiers and links stay in Linear: they never go into code, commits, PR titles or bodies, or branch names.
