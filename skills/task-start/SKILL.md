---
name: task-start
description: Only use when the user explicitly invokes this skill by name.
---

# Task Start

Entry point of the Standard and Long paths (`~/dev/skills/WORKFLOW.md`). Turns a reference (Linear issue, GitHub issue, Asana task, URL) plus whatever the user says about it into `{TASKDIR}/task.md` and a Linear project, then launches `create-research-questions`.

The user has already created the T3 project for this task, rooted at `{TASKDIR}`; this thread runs in it, so `{TASKDIR}` is the working directory and `{TASKSLUG}` its basename.

## Steps

1. **Pull in the reference.** If the user gave one, fetch it (Linear: `get_issue`; GitHub: `gh issue view`; otherwise fetch the URL) and keep its text verbatim for `## Source`. Read any files the user @-mentioned FULLY.

2. **Settle the frontmatter with the user.** Confirm, in one message, the things only they can decide:
   - `repos`: which repositories the task touches (basenames under `~/dev/valency/`); a first guess is fine, research and planning correct it
   - `path`: `standard`, `long`, or `undecided` (then `create-research` recommends one)
   - `linear_project`: a short Title Case name for the Linear project, derived from the goal (slug `hub-source-toggles` -> "Hub source toggles"); never the slug itself
   - anything in the reference or their description that contradicts itself
   Skip the question for anything they already stated.

3. **Write `{TASKDIR}/task.md`** from `{SKILLBASE}/references/task_template.md`. `## Goal` is one paragraph stating the goal in the user's terms, written by this skill; it is not a transcript of the prompt. Create `{TASKDIR}/html/`, `reports/`, `repos/` empty.

4. **Create the Linear project**: `save_project` named as confirmed in step 2, team per the user's default, state Researching, description = `## Goal`. Record its name as `linear_project`. If the source is a Linear issue, attach it to the project and leave its status alone; the orchestrator owns status writes later.

5. **Mirror to Linear**: upload `task.md` as a document on the project, titled `task.md`.

6. **Launch the next step**: `t3_thread_launch` with title `create-research-questions {TASKSLUG}` and message `Run /create-research-questions for {TASKDIR}`.

7. **Respond** with exactly:

```markdown
### Next Steps

Task `{TASKSLUG}` is set up.

- Local: `{TASKDIR}/task.md`
- Linear: [{linear_project}]({project URL})

Research questions have been launched in thread `create-research-questions {TASKSLUG}`.
```
