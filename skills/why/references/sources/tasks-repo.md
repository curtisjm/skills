# Tasks repo

## What this source contains

`~/dev/valency/tasks` is the record of every task run through the skills in `~/dev/skills`, one directory per task slug. It holds the planning that preceded the code, written by the agents and reviewed by Curtis, and it is often more complete than the PR because it records what was considered and rejected.

- `task.md` with the request, `## Research`, `## Decisions` (rulings made during the task, with dates), and `## Plan`
- `research.md`, `design-discussion.md`, `prd.md`, `tdd.md`: the research and design documents behind Standard and Long tasks, with resolved design questions
- `plan.md` and `plan-changelog.md`: the item list and how it changed during implementation
- `decisions.tsv`, the decision trail from `show-me-your-work`, and `hillclimb.tsv` for hillclimb runs
- `reports/<id>.md`: per-item reports naming divergences from the plan, principles applied, and review findings rejected and why
- `pr-<n>-description.md`: the PR descriptions as written, including the Merge risk and Evidence sections
- `handoff.md` and `html/`: handoff notes, mockups, and screenshots

Most of these documents are mirrored to the Linear project, so a Linear hit often has a fuller original here.

## How to search it

The repo is local; no MCP is needed. Always available, like git.

1. **Find the task by the PR or branch.** `rg -l '<repo>#<pr-number>|<branch-name>' ~/dev/valency/tasks` finds the task directory whose reports or descriptions name the PR. The branch name is usually the task slug.
2. **Read `## Decisions` first.** `rg -n -A3 '## Decisions' ~/dev/valency/tasks/<slug>/task.md`. Rulings are dated and short, and they are the most direct answer to "why".
3. **Search the documents for the symbol, feature, or constant.** `rg -n '<term>' ~/dev/valency/tasks --glob '*.md' --glob '*.tsv'`. Research documents cite `file:line`, so a symbol search lands on the analysis that preceded the change.
4. **Read the resolved design questions.** In `design-discussion.md`, `prd.md`, and `tdd.md`, the "Resolved Design Questions" or decision sections record the alternatives and the pick.
5. **Read the item report.** `reports/<id>.md` for the item that produced the PR names what diverged from the plan and why, and which review findings were rejected.
6. **Check the repo's own history.** `git -C ~/dev/valency/tasks log -p -- <slug>/` shows how the plan and decisions changed over time, including rulings that were later reversed.

## What good evidence looks like here

- A dated ruling in `## Decisions`: "2026-10-12: cap at 50 MB, per the customer call; revisit after launch"
- A resolved design question weighing two approaches with the reason for the pick
- A `plan-changelog.md` entry explaining why an item was split, dropped, or reordered
- A report line: "diverged from the plan: used a table instead of a switch because ..."
- A `decisions.tsv` row with its evidence pointer

## Common pitfalls

- **Plans are not outcomes.** `plan.md` says what was intended; `reports/` and the PR say what shipped. Read both before claiming a reason.
- **Reversed rulings.** A decision may be overturned further down `## Decisions` or in the changelog. Read to the end.
- **Quick tasks are thin.** A Quick task has only `task.md` and `reports/quick.md`. An empty result is normal there, not a gap.
- **Tasks predate the convention.** Older directories may lack `decisions.tsv` or reports. Say what the directory contains rather than assuming.
- **No Linear or task documents on GitHub.** Cite task documents by local path in the answer. Never paste them into a PR or issue.

## What to return

For each relevant document:
- Task slug and file path
- The decision, question, or divergence quoted (not paraphrased), with its date when present
- The PR or item it concerns
- Whether a later entry reversed or refined it
