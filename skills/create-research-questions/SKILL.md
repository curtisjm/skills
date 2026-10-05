---
name: create-research-questions
description: Write or revise {TASKDIR}/research-questions.md, gate it, mirror it to Linear, launch create-research.
disable-model-invocation: true
---

# Create research questions

The step after `task-start` on the Standard and Long paths (`WORKFLOW.md`). It produces `{TASKDIR}/research-questions.md`: the query plan `create-research` answers about the codebase as it is today. The reader is an agent that has not seen the task, so every question says where to look as well as what to find.

The launch message names `{TASKDIR}`.

## Steps

1. **Read `{TASKDIR}/task.md` fully** and set its `phase: research-questions`. Collect every link, repository, library, path, and directory named in it or by the user in this thread — verbatim; they become the Key Context Pointers. Open collateral only where `task.md` or the user points at it; other documents in `{TASKDIR}` stay closed. Done when the goal, scope, decisions, and pointers are in hand.

2. **Revise if the document exists.** When `{TASKDIR}/research-questions.md` is already there, read it fully, apply the user's feedback (this thread, plus any `## Decisions` added since it was written), keep its frontmatter and format, and continue at step 5.

3. **Scout.** Delegate only to the role agents: `codebase-locator` for the files involved, `codebase-pattern-finder` for the conventions around them, `codebase-analyzer` when a flow must be traced, `web-search-researcher` only for an external library or SDK the task leans on. Scouting orients the questions; the answers are the next step's work. Done when you can name the packages, services, and dependencies the task touches.

4. **Write `{TASKDIR}/research-questions.md`** following `{SKILLBASE}/references/research_questions_template.md`. Two to eight questions, scaled to the task. Each question:
   - **describes** the present system — how X works, where Y lives, who uses Z — and keeps the task's intent out of its wording. "How does the hub load a source's settings?" is a question; "how would we add a toggle?" is a plan and belongs in a later document.
   - **points** at where the answer lives: the repo, package, directory, or doc ("in `packages/ui`…", "in the WorkOS docs…").
   - takes one of the useful shapes: a feature end to end; the contract between two components; the path from an endpoint to a datastore; every user of a table or column; how a dependency is wired in and what it can do.

   When the task may touch UI, even implicitly, add questions on the design system: which component library and theming system are used, and the tokens (colors with hex codes, typography, spacing, borders, shadows). These are the one generic set; mockups later depend on them.

   Fill **Key Context Pointers** from step 1, verbatim; omit the section only when there are none.

5. **Gate.** Run `plannotator annotate {TASKDIR}/research-questions.md --gate --json`. Approved: continue. Annotated: apply every annotation to the file and run the gate again. Done only on approval.

6. **Mirror to Linear.** `task.md` carries `linear_project`. Upload `research-questions.md` as a document on that project titled with the file name (`research-questions.md`); when a document with that title exists, update it by id, otherwise create it. Done when the Linear document equals the file.

7. **Relay.** `t3_thread_launch` with title `create-research {TASKSLUG}` and message `Run /create-research for {TASKDIR}`. Then reply with the final answer and end the thread.

## Final answer

```markdown
### Next Steps

`{TASKDIR}/research-questions.md` is approved and mirrored on the Linear project. It is the query plan for the research step; nobody answers it by hand.

Launched `create-research {TASKSLUG}`.
```
