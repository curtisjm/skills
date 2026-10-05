---
name: triage
description: Only use when the user explicitly invokes this skill by name.
---

# Triage

Something came up and is not being scoped now. File it as a well-formed issue in the Linear Triage project and stop. Promoting it later means invoking `task-start` or `quick-task` with the issue.

## Steps

1. **Pull in what was given**: the user's words, plus any reference (GitHub issue, URL, log excerpt, file) read FULLY. Ask at most one question, and only if the issue cannot be stated without it.

2. **Scout briefly if it helps the title**: one `codebase-locator` call to name the repo or component, when the user's description does not. Skip for anything already specific.

3. **File the issue** with `save_issue` in the Triage project of the user's default team, state Triage:
   - title: one line, specific, in the user's terms
   - description: `## What` (the user's words verbatim), `## Where` (repo, component, URL, log excerpt), `## Why it matters` (one or two lines, only if the user said), `## Notes` (links, related issues)
   - labels only if the user named them

4. **Respond** with exactly:

```markdown
Filed [{identifier}: {title}]({url}) in Triage.

To take it on later: `/task-start {url}` or `/quick-task {url}`.
```
