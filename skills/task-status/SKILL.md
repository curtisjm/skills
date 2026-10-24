---
name: task-status
description: Only use when the user explicitly invokes this skill by name.
---

# Task status

Where does this task stand (`~/dev/skills/WORKFLOW.md`)? Read the task record, the Linear mirror, and the open PRs, then answer in one short block. Writes nothing: no file, no Linear change.

Runs in the task project; `{TASKDIR}` is the working directory, or the message names it.

## Steps

1. **Read `{TASKDIR}/task.md`**: the frontmatter (`path`, `phase`, `repos`, `linear_project`, `linear_issue`) and `## Decisions`.

2. **Read the plan record** where it exists: the Items table of `{TASKDIR}/plan.md` and the newest entry of `{TASKDIR}/plan-changelog.md` (its **Needs a decision** line).

3. **Planning steps** (`phase` before `implement`): the current document is the one for `phase`, in path order `research-questions.md`, `research.md`, `design-discussion.md` (Standard) or `prd.md` → `tdd.md` (Long), `plan.md`. It passed its gate when the next step's document exists or the document is mirrored on the Linear project (`list_documents` with `projectId`). Otherwise say "unknown"; do not guess.

4. **Implementation** (Standard/Long, `phase: implement` or later): `list_issues` on `linear_project`. Phase issues are titled `Phase N: …`; sub-issues carry the item id. Count each phase's sub-issues by state. **Quick**: read `{TASKDIR}/reports/quick.md` if it exists.

5. **Open PRs**: per repo in `repos`, `gh pr list --repo valencyio/{REPOBASENAME} --state open --search "head:{TASKSLUG}" --json number,title,url,headRefName`. Branches start with `{TASKSLUG}`; keep only those.

6. **Respond** with exactly:

```markdown
### {TASKSLUG}

`{TASKDIR}` · path {path} · phase {phase}

{planning: "Current document: `{file}` · gate: passed | unknown"}
{implementation, one line per phase: "Phase N: x of y items Done, z In Review, w In Progress" · PRs as [#123 title](url)}
{Quick: PRs from reports/quick.md and step 5}

Needs a decision: {the newest changelog entry's line, or omit when "None."}

Waiting on you:
1. {merge / ruling / go-ahead}

(or: Nothing is waiting on you.)
```

Waiting on the user means: open PRs to merge, a changelog decision not yet in `## Decisions`, a gate that is open, or a merge-first phase whose PRs are all open.
