---
name: triage
description: Only use when the user explicitly invokes this skill by name.
---

# Triage

Something came up and is not being scoped now. File it as a well-formed issue in the Linear Triage project and stop. Promoting it later means invoking `task-start` or `quick-task` with the issue.

The issue records the **problem and its evidence**, as much as can be gathered now; scoping the solution is the promoting step's job. A suggested direction is welcome and is written down as a suggestion, never as the decision.

## Steps

1. **Pull in what was given**: the user's words, plus any reference (GitHub issue, URL, log excerpt, screenshot, file) read FULLY. Ask at most one question, and only if the issue cannot be stated without it.

2. **Gather evidence.** Collect what shows the problem is real and where it lives: reproduction steps, error text and log lines, the request or data involved, who or what hit it, when it started, the repo and component (one `codebase-locator` call when the description does not name them), related issues or PRs. Quote verbatim; link sources. Stop when the next piece would mean designing a fix rather than describing the problem.

3. **File the issue** with `save_issue` in the Triage project of the user's default team, state Triage:
   - title: one line, specific, in the user's terms
   - description: `## What` (the user's words verbatim), `## Evidence` (everything from step 2, quoted and linked), `## Where` (repo, component, URL), `## Why it matters` (one or two lines, only if the user said), `## Suggested direction` (any fix the user or you have in mind, prefixed "Suggestion, not a decision:"; omit when none), `## Notes` (links, related issues)
   - labels only if the user named them

4. **Respond** with exactly:

```markdown
Filed [{identifier}: {title}]({url}) in Triage.

To take it on later: `/task-start {url}` or `/quick-task {url}`.
```
