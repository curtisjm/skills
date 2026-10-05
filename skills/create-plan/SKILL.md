---
name: create-plan
description: Only use when the user explicitly invokes this skill by name.
---

# Create Plan

You are in the final Plan Writing phase. Convert the design discussion (Standard) or the PRD and TDD (Long) into a complete, detailed implementation plan that the orchestrator can dispatch item by item.

## Steps

1. **Read all input files FULLY** (the launch message names `{TASKDIR}`):
   - Use Read tool WITHOUT limit/offset to read all provided file paths
   - `ls -la {TASKDIR}` to find all related documents in the task directory.
   - Read everything in the task directory to build full context, excluding research questions documents
   - `{TASKDIR}/task.md`; set its `phase: plan`
   - **DO NOT read research questions documents** - research questions are inputs to the research phase only. Use the completed research document instead.
   - If `{TASKDIR}/plan.md` already exists, this run revises it from the user's feedback (this thread and any `## Decisions` added to `task.md` since). DO NOT just accept a correction blindly: read the specific files/directories mentioned and verify code examples and file paths before editing. Reorganize phases or items, update code examples, fix inaccuracies; keep the same YAML frontmatter and format; then continue from step 5.

2. **Read relevant code files**:
   - Read any source files mentioned in the research, design, PRD, or TDD documents
   - Build context for writing specific code examples

3. **Read the plan template**:

`Read({SKILLBASE}/references/plan_template.md)`

4. **Write the implementation plan**:
   - Write to `{TASKDIR}/plan.md`
   - Fill the `## Items` table first; every item in the table has a matching `### Item` section under its phase
   - Include specific code examples for each change
   - Add both automated and manual success criteria
   - State `## Rollout` and `## Phase transitions` explicitly

5. **Gate**: run `plannotator annotate {TASKDIR}/plan.md --gate --json`. This is plan approval, the last planning gate. Process annotations as feedback (step 1's revision rules), then run the gate again. Continue only on approval.

6. **Mirror to Linear**: set `repos` in the `task.md` frontmatter to the repositories the Items table names, then upload `plan.md` and `task.md` as a document on the project named by `linear_project` in `task.md`, titled with its file name; update the document if one with that title exists, otherwise create it. Keep its URL for the final answer.

7. **Launch publish**: `t3_thread_launch` with title `publish {TASKSLUG}` and message `Run /publish for {TASKDIR}`.

8. **Read the final output template**

`Read({SKILLBASE}/references/plan_final_answer.md)`

Respond following the template exactly. Do not include a summary or other information.

## Plan Writing Guidelines

- A phase is a vertical slice: the items in it run in parallel, each in its own thread and worktree. Two items that cannot run in parallel belong in different phases.
- Each `pr` item targets under 1000 lines and is independently testable. Files named in an item are indicative, never a binding list.
- Include specific code examples, not just descriptions
- Automated verification should be runnable commands
- Manual verification should be specific, actionable steps
- Between phases the orchestrator pauses for the user when the plan merges phase by phase; stacked phases run on
- If the research documented testing patterns for the components being changed, include test code in the plan (new test files or additions to existing test files). Follow the existing test patterns found in the research.

## Document Precedence

When documents conflict, the most recent document wins:
**plan > TDD > PRD > design discussion > research > task.md**

The plan is the final authority. Follow the design decisions over the original task description when they differ.

<guidance>
## Markdown Formatting

When writing markdown files that contain code blocks showing other markdown (like README examples or SKILL.md templates), use 4 backticks (````) for the outer fence so inner 3-backtick code blocks don't prematurely close it:

````markdown
# Example README
## Installation
```bash
npm install example
```
````

## Validation Design

Not every phase requires manual validation, don't put steps for manual validation just to have them.
</guidance>
