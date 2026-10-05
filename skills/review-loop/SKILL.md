---
name: review-loop
description: Drive the current branch's PR to review-clean. Use after the implementation of a plan item or Quick task is committed, inside its worktree; runs the inner loop (roborev refine + CodeRabbit CLI) before the PR opens and the outer loop (CodeRabbit/Copilot bots + CI) after.
---

# Review loop

Runs inside a worktree on a task branch. Ends only when the branch is clean through both loops, or an iteration limit is hit and the caller is told what is left. Agents never merge.

## Inner loop (local, before the PR opens)

Repeat until a full pass makes no changes, at most 5 passes:

1. `/roborev-refine` — fix → commit → re-review until roborev passes.
2. `coderabbit review --agent --base <base branch>` — address every finding you agree with, commit; record the ones you reject with a one-line reason for the report.
3. A pass that fixed anything is followed by another pass; a pass with nothing to fix ends the loop.

## Open the PR

Push with an upstream and run `describe-pr`. Base is `origin/main`, or the parent PR branch when the plan stacks this item. No Linear identifiers in the title, body, commits, or branch.

## Outer loop (bots + CI)

Repeat until every condition in the stop check holds, at most 5 rounds:

1. Wait for the bots. Poll `gh api repos/{owner}/{repo}/pulls/{n}/reviews` and `gh pr checks {n}` until a review newer than the last push exists from each bot the repo has enabled (`coderabbitai[bot]`, `copilot-pull-request-reviewer[bot]`; confirm logins against actual authors) and CI has finished. Cap the wait at 20 minutes per round.
2. Collect open review threads (`gh api graphql` on `reviewThreads`, `isResolved: false`). For each: fix and commit, or reply with why not. Resolve the threads you addressed.
3. If anything was committed, run the inner loop again and push.

**Stop check:** no open threads; no new commits this round; CI green.

## Report

End with: PR URL, rounds run, what was rejected and why, and anything still open if a limit was hit. The caller (the item thread or Quick thread) writes the task report; this skill only returns facts.
