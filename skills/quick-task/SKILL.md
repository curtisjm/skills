---
name: quick-task
description: Only use when the user explicitly invokes this skill by name.
---

# Quick Task

The Quick path (`WORKFLOW.md`): small, understood, one PR, one thread. Mini research and a plan go into `task.md`; then worktree, implement, review loop, PR. No Linear project, no planning documents, no close step: the merge is the close.

This thread runs in the task's T3 project, rooted at `{TASKDIR}`; `{TASKSLUG}` is its basename.

## Steps

1. **Pull in the reference** (Linear `get_issue`, `gh issue view`, or fetch the URL) and the user's words. Read @-mentioned files FULLY. Confirm `repos` with the user if not stated; Quick touches one repository.

2. **Write `{TASKDIR}/task.md`** from `{SKILLBASE}/../task-start/references/task_template.md` with `path: quick`, `phase: quick`, no `linear_project`; set `linear_issue` when the source is a Linear issue. Create `{TASKDIR}/html/`, `reports/`, `repos/`.

3. **Research in place.** Delegate to `codebase-locator` / `codebase-analyzer` / `codebase-pattern-finder` as needed, then write `## Research` in `task.md`: what exists, where, the pattern to follow, how it is tested (file:line citations). Describe only the current state.

4. **Plan in place.** Write `## Plan` in `task.md`: the change in a few sentences, indicative files, a `diff` sketch where it helps, automated verification commands, manual checks if any. Keep it under what a reviewer can read in a minute. Show the user the plan and get a go-ahead before touching code; if the work turns out to need more than one PR or a design decision, stop and recommend `task-start`.

5. **If `linear_issue` is set**, move the issue to In Progress.

6. **Worktree**: run `setup-worktree` (worktree `{TASKDIR}/repos/{REPOBASENAME}`, branch `{TASKSLUG}`, from fresh `origin/main`). Work inside it with absolute paths; this thread stays bound to `{TASKDIR}`.

7. **Implement** the plan, run the automated verification, and commit with `ci-commit`.

8. **Review loop**: run `review-loop`. It opens the PR via `describe-pr` and returns when the branch is review-clean or a limit is hit.

9. **If `linear_issue` is set**, move the issue to In Review. The user marks it Done at merge.

10. **Report**: write `{TASKDIR}/reports/quick.md` (divergences from the plan, rejected review findings and why, manual checks for the user), then respond with exactly:

```markdown
### Next Steps

PR open: {PR URL}. Review loop: {clean | stopped at limit — what is left}.

- Report: `{TASKDIR}/reports/quick.md`
- Manual checks before merge: {list or "none"}

Merge when satisfied; that closes the task.
```
