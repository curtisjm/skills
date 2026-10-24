---
name: create-design-discussion
description: Only use when the user explicitly invokes this skill by name.
---

# Design Discussion Phase

You are now in the Design Discussion phase. Based on the research findings and the user's change request, work with them to make design decisions.

## Steps to follow after receiving the user's request

1. **Read the files in the task directory and any mentioned files immediately and FULLY** (the launch message names `{TASKDIR}`):
   - `ls -la {TASKDIR}` to find all related documents in the task directory.
   - `{TASKDIR}/task.md`; set its `phase: design-discussion`
   - Research documents (e.g. `{TASKDIR}/research.md`)
   - If `{TASKDIR}/design-discussion.md` already exists, this run revises it: read it, then process the user's feedback (this thread and any `## Decisions` added to `task.md` since). Verify corrections against the files they mention rather than accepting them blindly, update the document at its path (current/end state, architecture, patterns; move answered questions to "Resolved Design Questions"; add new questions that emerged), and continue from step 6.
   - **DO NOT read research questions documents** - research questions are inputs to the research phase only.
   - **IMPORTANT**: Use the Read tool WITHOUT limit/offset parameters to read entire files, never read files partially - if a file is mentioned, read it completely
   - do not spawn sub-tasks before reading these files yourself in the main context

2. **Check for related task content**:
   - if a path in `{TASKDIR}` is mentioned, use Bash(`ls -la {TASKDIR}`)
   - read all relevant files in the task directory to fully understand the work so far, excluding research questions documents

3. **Optional - Spawn parallel sub-tasks for comprehensive research**:
   - If not clear from the research, spawn sub-tasks to research different aspects concurrently
   - Create multiple Agent() calls to research different aspects concurrently
   - Use the right agent for each type of research:

   **For deeper investigation:**
   - **codebase-locator** - To find more specific files (e.g., "find all files that handle [specific component]")
   - **codebase-analyzer** - To understand implementation details (e.g., "analyze how [system] works")
   - **codebase-pattern-finder** - To find similar implementation patterns we can model after

   Each agent knows how to:
   - Find the right files and code patterns
   - Identify conventions and patterns to follow
   - Look for integration points and dependencies
   - Return specific file:line references
   - Find tests and examples

<important if="the user asks you to find how things work or add detail about existing functionality">
  prefer to use an initial pass with one or more Agent() calls before reading files yourself
  <else if="the user gives straightforward feedback that doesn't require loading more codebase context">
      skip Agent() calls if you already have the context
  </else>
</important>

4. **Read the design discussion template and visual guidance**

`Read({SKILLBASE}/references/design_discussion_template.md)`

`Read({SKILLBASE}/references/show-me.md)`

- Follow the `show-me` guidance throughout the design discussion.
- Use the smallest set of visual views needed to make the current state, proposed end state, and key design choices clear.
- Place each visual next to the short text it supports. Do not add visuals that do not help the user make a design decision.

5. **Write the design discussion** to `{TASKDIR}/design-discussion.md`

<content_guidance>
**Outline High-level product spec** - Current state, desired end state, what we're not doing in terms of user experience or functionality

**Outline the proposed end state architecture** - Use focused before-and-after diagrams, trees, pseudocode, or other views from the `show-me` guidance. Prefer `diff` blocks when the key point is what changes, and show the full target shape when it makes ownership or order clearer.

**Discuss design decisions**
   - For each major design choice, present options with pros/cons
   - Make recommendations based on codebase conventions
   - If the research surfaced testing patterns for the components being changed, include a brief testing approach (e.g. "follow the existing unit test pattern in `__tests__/foo.test.ts`")

**IMPORTANT: All design questions must be written in the OPEN state**
   - Put ALL questions under "Design Questions", NOT under "Resolved Design Questions"
   - You may recommend an option, but you must NOT resolve or close a question yourself
   - Only the user can resolve a design question — through explicit feedback or approval
   - The "Resolved Design Questions" section should be empty in the initial document
   - Do NOT auto-resolve questions even if the answer seems obvious from the research

**Resolving questions after user feedback**
   - When the user provides a clear answer (e.g. "for X we should do Y"), move the question to "Resolved Design Questions"
   - They don't need to say "resolve" explicitly — any clear indication of a decision counts
   - Record the final decision with rationale
   - Record the options that were considered but not chosen, with brief rationale for why they were discarded

**Present patterns to follow**
   - Identify existing patterns in the codebase that should be followed
   - Include file locations and multiline code snippets showing the pattern

</content_guidance>

6. **Gate**: tell the user the review URL (`~/dev/skills/bin/gate --url {TASKDIR}/design-discussion.md`), then run `~/dev/skills/bin/gate {TASKDIR}/design-discussion.md`. Annotations are where the user answers design questions and corrects the document: process them as feedback (step 1's revision rules), then run the gate again. Continue only on approval.

7. **If design questions remain open after approval**: read `{SKILLBASE}/references/design_discussion_final_answer.md`, respond following it exactly, and keep working with the user in this thread to resolve them. Once all are resolved, return to step 6.

8. **Mirror to Linear**: upload `design-discussion.md` as a document on the project named by `linear_project` in `task.md`, titled with its file name; update the document if one with that title exists, otherwise create it. Keep its URL for the final answer.

9. **Launch the plan step**: `t3_thread_launch` (`runtimeMode: full-access`) with title `Plan: {TASKSLUG}` and message `Run /create-plan for {TASKDIR}`.

10. **Read the final output template**

`Read({SKILLBASE}/references/design_discussion_final_answer_resolved.md)`

Respond following the template exactly. Do not include a summary or other information.

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

## Document Precedence

When documents conflict, the most recent document wins:
**design discussion > research > ticket**

Decisions made during the design discussion supersede the original ticket description.
The ticket provides the initial request; the design discussion refines and finalizes the approach.
</guidance>
