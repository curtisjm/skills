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

5. **Gate**: tell the user the review URL (`~/dev/skills/bin/gate --url {TASKDIR}/plan.md`), then run `~/dev/skills/bin/gate {TASKDIR}/plan.md`. This is plan approval, the last planning gate. Process annotations as feedback (step 1's revision rules), then run the gate again. Continue only on approval.

6. **Mirror to Linear**: set `repos` in the `task.md` frontmatter to the repositories the Items table names, then upload `plan.md` and `task.md` as a document on the project named by `linear_project` in `task.md`, titled with its file name; update the document if one with that title exists, otherwise create it. Keep its URL for the final answer.

7. **Publish**: run the `publish` skill for `{TASKDIR}`. It creates the Linear issue tree from the Items table and moves the project to Implementing; keep the project URL and the phase and item counts it returns for the final answer.

8. **Launch the orchestrator**: `t3_thread_launch` (`runtimeMode: full-access`) with title `Implement: {TASKSLUG}` and message `Run /implement for {TASKDIR}`, and `modelSelection` set to the newest Fable model when this thread runs on Claude or the newest Astra model when it runs on Codex, at medium reasoning (`orchestrator_capabilities` lists the models; see Relay in `~/dev/skills/WORKFLOW.md`).

9. **Read the final output template**

`Read({SKILLBASE}/references/plan_final_answer.md)`

Respond following the template exactly. Do not include a summary or other information.

## Plan Writing Guidelines

- A phase is a vertical slice: the items in it run in parallel, each in its own thread and worktree. Two items that cannot run in parallel belong in different phases. Each phase cuts across layers, services, or module boundaries where it can, so surprises surface early; never structure phase N so that phase N+1 must be done before N can be verified.
- Each `pr` item targets under 1000 lines and is independently testable. Files named in an item are indicative, never a binding list.
- Include specific code examples, not just descriptions
- Automated verification should be runnable commands
- Manual verification should be specific, actionable steps
- Not every item needs manual verification; don't add manual steps just to have them. If an item cannot be checked at all, it may be too small or not vertical enough.
- Between phases the orchestrator pauses for the user when the plan merges phase by phase; stacked phases run on
- Every phase states what goes live if it is promoted on its own (`### If promoted after this phase`): what becomes visible or active, what stays dark and safe, what must not ship without a later phase. Reference `## Rollout` for environments and validation; do not repeat it.
- Every phase is safe to promote alone. Teammates may promote staging or production at any time, so a merged phase may reach production before the next phase exists, with unrelated commits alongside. Work that is only safe together with later work (a migration whose reader lands later, a UI that calls an endpoint from the next phase) is either made inert (flag, dark launch, unused column) or moved into the same phase as what makes it safe.
- If the research documented testing patterns for the components being changed, include test code in the plan (new test files or additions to existing test files). Follow the existing test patterns found in the research.

A horizontal breakdown — schema, then API, then UI, then tests — creates handoff problems and partially finished work. A vertical slice cuts through the stack: the user can create the simplest version of the thing end to end; then edit one field end to end; then see the first validation error end to end. Each item carries the schema, API, UI, and tests its slice needs. This is illustrative; not all work fits it, but cross boundaries where you can.

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
