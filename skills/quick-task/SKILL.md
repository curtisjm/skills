---
name: quick-task
description: Only use when the user explicitly invokes this skill by name.
---

# Quick Task

The Quick path (`~/dev/skills/WORKFLOW.md`): small, understood, one thread, one or a few PRs. Mini research and a plan go into `task.md`; then per PR: worktree, implement, review loop. No Linear project, no planning documents, no close step: the last merge is the close.

This thread runs in the task's T3 project, rooted at `{TASKDIR}`; `{TASKSLUG}` is its basename.

## Steps

1. **Pull in the reference** (Linear `get_issue`, `gh issue view`, or fetch the URL) and the user's words. Read @-mentioned files FULLY. Confirm `repos` with the user if not stated.

2. **Write `{TASKDIR}/task.md`** from `{SKILLBASE}/../task-start/references/task_template.md` with `path: quick`, `phase: quick`, no `linear_project`; set `linear_issue` when the source is a Linear issue. Create `{TASKDIR}/html/`, `reports/`, `repos/`.

3. **Research in place.** Delegate to `codebase-locator` / `codebase-analyzer` / `codebase-pattern-finder` as needed, then write `## Research` in `task.md`: what exists, where, the pattern to follow, how it is tested (file:line citations). Describe only the current state.

4. **Settle the design.** Where the research left the change ambiguous, ask the user clarifying questions one at a time, each answerable in a sentence and carrying the context needed to answer it (what the code does today in that spot, with file references, and what each option implies), until it is not. Where more than one approach is reasonable, name the alternatives in a line each and the one you would take and why; let the user pick. Record the answers in `## Decisions`.

5. **Plan in place.** Write `## Plan` in `task.md`: the approach in a few sentences, then the PRs it will take (one per repo, or more when a repo needs separate reviewable changes; a second PR in the same repo stacks on the first unless the plan says to wait for its merge), then numbered steps grouped by PR, each small enough to verify on its own, with its indicative files, the change (a `diff` sketch where it helps), and the command or check that proves it; manual checks last, if any. Keep it under what a reviewer can read in a minute. **Gate**: tell the user the review URL (`~/dev/skills/bin/gate --url {TASKDIR}/task.md`), then run `~/dev/skills/bin/gate {TASKDIR}/task.md`. Process annotations as feedback: revise `## Research`, `## Plan`, or `## Decisions` in `task.md` as they say, verifying each against the code rather than accepting it blindly, then run the gate again. Continue only on approval. If the work turns out to need phases, rollout, or a design decision research cannot settle, stop and recommend `task-start`.

6. **If `linear_issue` is set**, move the issue to In Progress.

7. **Worktree**, per PR: run `setup-worktree` (worktree `{TASKDIR}/repos/{REPOBASENAME}`, branch `{TASKSLUG}`; a second PR in the same repo uses `{REPOBASENAME}-2` and branch `{TASKSLUG}-2`, from the first branch when stacked). Work inside it with absolute paths; this thread stays bound to `{TASKDIR}`.

8. **Implement** that PR's steps, run their automated verification, and commit with `ci-commit`. Before writing code, read the index in `~/dev/skills/skills/principles/SKILL.md` and open the leaf for any principle you apply. When the PR fixes a bug with a cheap local test path, follow the `tdd` skill (`~/dev/skills/skills/tdd/SKILL.md`) so the failing test lands before the fix.
8. **Implement** that PR's steps, run their automated verification, and commit with `ci-commit`. A PR that reports a speedup, regression, or other measured number runs it through the `benchmark-checklist` skill (`~/dev/skills/skills/benchmark-checklist/SKILL.md`) before it is reported.

9. **Review loop**: run `review-loop` (base is `origin/main`, or the prior branch when stacked). It opens the PR via `describe-pr` and returns when the branch is review-clean or a limit is hit. Repeat 7–9 for the next PR.

10. **If `linear_issue` is set**, move the issue to In Review. The user marks it Done at merge.

11. **Report**: write `{TASKDIR}/reports/quick.md` (divergences from the plan, each principle applied and the decision it changed, rejected review findings and why, manual checks for the user) through the `unslop` skill, then respond with exactly:

```markdown
### Next Steps

PRs open: {one line per PR: [repo#n](url) · stacked on … if so · review loop clean | stopped at limit — what is left}.

- Report: `{TASKDIR}/reports/quick.md`
- Manual checks before merge: {list or "none"}

Merge when satisfied; the last merge closes the task.
```
