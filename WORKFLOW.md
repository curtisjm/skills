# Workflow

How a task moves from an idea to merged, promoted, validated code using the skills in this repo. Skills read this file for shared vocabulary; humans read it to know which skill to invoke next. The diagram at `docs/workflow-map.html` draws the same thing.

T3 Code is the harness that runs the threads. A thread may run Claude or Codex; the skills do not care which. Skills refer to T3 tools by name (`t3_thread_launch`, `delegate_task`, `t3_thread_send`).

## Placeholders

- `{TASKDIR}` — `~/dev/valency/tasks/{TASKSLUG}`. Holds `task.md`, every planning document, `plan-changelog.md`, `html/` (mockups, diagrams, explainers), `handoffs/`, `reports/`, and `repos/` (worktrees). Plain directory; ordinary file tools work on it. `~/dev/valency/tasks` is a git repo (`repos/` ignored) committed by `close-task`.
- `{TASKSLUG}` — basename of `{TASKDIR}`. Branch names start with it. Each task has a T3 project of the same name whose workspace root is `{TASKDIR}`; every thread of the task lives in it.
- `{SKILLBASE}` — directory containing the current skill's `SKILL.md`. `{SKILLBASE}/references/...` are that skill's templates.
- `{REPOBASENAME}` — basename of a repository directory. Repos live at `~/dev/valency/{REPOBASENAME}`.

## Paths

A **path** is the chain of steps a task follows. A **step** is one T3 thread running one skill. Every path ends the same way: a PR that has been through the review loop, merged by the user.

| Path | When | Steps |
|---|---|---|
| Triage | Something came up; not scoping it now | `triage` → stop |
| Quick | Small, understood, one thread, one or a few PRs | `quick-task` (one thread: mini research + plan in `task.md`, worktree, implement, review loop, `describe-pr`) |
| Auto | Agent-led: the run plans, prototypes and implements inside a playbook skill with no gates; Curtis reviews the PRs | `auto-task` (one thread; routes to a playbook skill such as `feature` or `figure-it-out`) |
| Standard | Needs research and a plan | `task-start` → `create-research-questions` → `create-research` → `create-design-discussion` → `create-plan` → `implement` → `close-task` |
| Long | Standard, plus product and technical design docs | as Standard, with `create-prd` → `create-tdd` replacing `create-design-discussion` |

Quick and Auto are chosen at entry. Standard vs Long may be chosen at entry too; when it is not, `task-start` writes `path: undecided` and `create-research` recommends one for the user to confirm. There is no greenfield path.

Every entry skill (`triage`, `task-start`, `quick-task`, `auto-task`) accepts a reference — Linear issue, GitHub issue, Asana task, URL — plus whatever the user says about it. Triage files a well-formed issue in the Linear triage project and stops; promoting it means invoking `task-start` or `quick-task` with that issue.

### Relay

Each step runs in its own top-level thread. When a step passes its gate it launches the next step's thread with `t3_thread_launch` and ends. The launch passes `title`, `message`, and `runtimeMode: full-access`; project and model are still inherited (`workspaceStrategy` is omitted too: planning steps run in the task project's root, `{TASKDIR}`). Planning threads inherit the launcher's model. The orchestrator runs on the newest Fable model (Claude) or Astra model (Codex) at medium reasoning; item threads run on the newest Opus model (Claude) or Sol model (Codex) at high reasoning, always on the launcher's provider. The launcher finds the newest version of the family by calling `orchestrator_capabilities` and passes it as `modelSelection` with the reasoning option set (`effort` on Claude, `reasoningEffort` on Codex); model ids are never hardcoded in a skill. The launch message names only the skill and `{TASKDIR}`; the skill reads `task.md` for everything else. Any step can also be started by hand the same way. Thread titles follow one convention: `Label: {TASKSLUG}` for steps (`PRD: {TASKSLUG}`, `Plan: {TASKSLUG}`), `PR X.Y: title` for items. There are no `iterate-*` skills: a `create-*` skill whose document already exists revises it from the user's feedback instead of starting over, and gates it again.

## `task.md`

Created by the entry skill, read first by every skill.

```yaml
---
slug: hub-source-toggles
path: standard          # quick | standard | long | undecided (until create-research)
phase: plan             # the step currently running or last completed
repos: [valency-mcp-server, valency-hub]   # initial guess; create-research and create-plan correct it
source: https://linear.app/.../CUR-123     # entry reference, any tracker
linear_project: Hub source toggles         # Standard/Long only; Title Case name, not the slug
linear_issue: CUR-123                      # Quick only, when source is a Linear issue; else absent
orchestrator_thread: 4016b326-…             # written by `implement`; where item threads report
created: 2026-10-04
---
```

Body: `## Goal` (one paragraph stating the goal in the user's terms, written by the entry skill, not the prompt verbatim), `## Source` (issue text pulled in), `## Scope notes`, `## Decisions` (one line per ruling, appended by any step). Quick adds `## Research` and `## Plan`. No links to artifacts; each document owns its own.

## Documents

One document per type per task, no numeric prefixes: `research-questions.md`, `research.md`, `design-discussion.md`, `prd.md`, `tdd.md`, `plan.md`. If a second of the same type seems needed, ask.

Every planning document except `research-questions.md` is reviewed through Plannotator (`~/dev/skills/bin/gate <file>`, which runs `plannotator annotate --tailscale --gate --json`) before the step hands off; research questions go straight to `create-research`, as in HumanLayer. Plan approval is the last planning gate. Threads run on the server, so the gate publishes the review page over the tailnet via `tailscale serve`, on a port derived from the task slug so tasks don't collide; the step tells the user the URL (`gate --url <file>`) before it blocks, since the page only exists while the gate is open.

HTML artifacts (mockups, diagrams, explainers) live in `{TASKDIR}/html/` and are opened from disk. `publish-internal-artifact` is used only when the user explicitly asks to publish one.

### Syncing to Linear

On Standard and Long, `task.md` and every planning document are uploaded as documents on the task's Linear project, titled with the file name, and kept identical to the local files. Each `create-*` skill re-syncs its document before handing off; the orchestrator re-syncs `plan.md` and `plan-changelog.md` after every revision. Local is the source of truth; Linear is a mirror and is never edited there.

### `plan.md`

The plan is read by the orchestrator, so it carries a table:

| phase | id | repo | title | type | est. LOC |
|---|---|---|---|---|---|
| 1 | 1-1-add-toggle-column | valency-mcp-server | add toggle column | pr | 200 |
| 1 | 1-2-hub-settings-ui | valency-hub | hub settings UI | pr | 600 |
| 2 | 2-1-staging-pin | valency-foundation | staging pin | ops | 20 |
| 2 | 2-2-staging-smoke | — | staging smoke | test | — |

- A **phase** is a vertical slice: the set of items that can run in parallel, each cutting across layers where it can rather than one layer at a time. Phases are sequential. Two items that cannot run in parallel belong in different phases, and no phase depends on a later one to be verifiable or to be safe in production.
- Each `pr` item targets under 1000 lines. Files it will touch may be named in prose as indicative, never as a binding list.
- `type`: `pr` (code), `ops` (promotion pin PRs in `valency-foundation`, activation, database scripts — the prose row says which), `test` (verifying the real system: AWS logs, walking user flows; not writing more tests).
- `## Rollout` states environments, promotion order and how each step is validated. Rollout items sit in the same table, either inside implementation phases or as phases of their own.
- `## Phase transitions` states, with no default, one of: merge every phase before the next; stack all phases; mixed, annotated per phase. A stacked item names the single prior PR it branches from. An item depending on several prior PRs cannot stack.

## Implementation

After plan approval `create-plan` runs `publish` unattended: it creates the issue tree below from the plan table and moves the project to Implementing, then `create-plan` launches the orchestrator. Documents are already mirrored on the project by then (see Syncing to Linear).

The **orchestrator** is one thread for everything after Publish, implementation and rollout alike. It launches one top-level thread per plan item with `t3_thread_launch` (`runtimeMode: full-access`), each with its own worktree:

- thread title `PR 1.2: hub settings UI` (`PROMO 2.1: …` / `TEST 2.2: …` for ops and test items)
- the orchestrator first runs `git -C ~/dev/valency/{REPOBASENAME} worktree add {TASKDIR}/repos/{REPOBASENAME}-1-2 -b {TASKSLUG}/1-2-hub-settings-ui <base>`, base `origin/main` or the named parent PR branch when stacking (the task project is not the code repo, so T3's `worktree` strategy cannot create it)
- `workspaceStrategy: {type: existing_worktree, worktreePath, branch}` binds the thread to that checkout (verified: a task project accepts a worktree of another repo)
- T3 runs no setup script for it; the item thread runs the repo's own setup first. Nothing is copied between worktrees (secrets come from AWS)

All items of a phase launch together; there is no concurrency cap.

An **item thread** (`implement-item`): read its plan row and sub-issue → implement → inner loop (roborev refine locally until clean) → `describe-pr`, push, open the PR → outer loop (address CodeRabbit/Copilot comments, re-run the inner loop after each fix round, until the bots are quiet and CI is green) → write `{TASKDIR}/reports/<id>.md` (divergences from the plan, rulings, what later phases must know) → tell the orchestrator with `t3_thread_send`.

The orchestrator is the only writer of `plan.md`. After a phase it runs `revise-plan`: read the phase's reports, apply what they change to `plan.md` and the next phase's sub-issue bodies, then dispatch the next phase — on its own if the plan stacks, otherwise when the user says go after merging.

`revise-plan` rules:

- `plan.md` is always the current plan and nothing else. No strikethroughs, no "changed from", no dated notes, no commentary about earlier versions.
- Every change is recorded in `{TASKDIR}/plan-changelog.md`, newest first: when (after which phase, date), what changed (rows added, removed, re-estimated, moved between phases; prose sections rewritten), why (which report or ruling drove it), and anything the user must decide. One entry per revision.
- Changes within the approved outcome are applied unattended. New outcomes, a different approach, or excluded work are proposed in the changelog entry with a recommendation and applied only after the user rules; the orchestrator pauses until then.
- Completed phases are not rewritten; their reports are the record.
- After the edit, `plan.md` and `plan-changelog.md` are re-synced to the Linear project.

**Agents never merge.** The user merges every PR, including promotion pins, and runs every promotion action. An ops thread may open a production pin PR; opening is harmless.

### Mentioning PRs

Every PR mentioned to the user is a markdown link to it: `[repo#n](url)`. Reports under `reports/` and the retro follow the same rule.

## Linear

Linear is personal work management; the user is the only one on the team using it. There is no Linear↔GitHub integration.

Teammates have GitHub access only: they see neither Linear nor `{TASKDIR}`. So nothing on GitHub refers to either. Issue identifiers and links never appear in code, code comments, commit messages, PR titles or bodies, review replies, or branch names. Neither do the task's documents (`task.md`, `research.md`, `design-discussion.md`, `prd.md`, `tdd.md`, `plan.md`, `reports/`), paths under `{TASKDIR}`, or phrases like "per the TDD" or "as the plan says". A PR explains its change on its own terms. In Linear and in `{TASKDIR}` all of these may be mentioned freely.

- Triage project collects unscoped issues.
- Standard/Long: one project per task, created by `task-start`; documents mirrored onto it as they pass their gates; one issue per phase and one sub-issue per plan item, created by `publish`. Project statuses: Researching / Planning / Implementing / In Review / Blocked / Done.
- Sub-issue flow, all written by the orchestrator: Todo → In Progress (thread launched) → In Review (PR open, loop converged) → Done (user reports the merge or tells the orchestrator to continue). Phase issue In Progress at its first item, Done when all sub-issues are Done.
- Quick: no project. If `source` is a Linear issue, the Quick thread moves that issue In Progress → In Review in place and the user marks it Done at merge. Any other source means no Linear writes.

## Gates

Human: every planning document after research questions; plan approval, including the Quick plan in `task.md`; every merge; the go-ahead between phases when waiting on merges; `close-task`. An independent model review of the last design document (`tdd.md` on Long, `design-discussion.md` on Standard), model chosen by the user, runs after that document's approval and before `create-plan`.

Unattended: `publish`, Linear document sync, worktree creation, opening PRs, the review loop, `revise-plan` for changes within the approved outcome.

`close-task` is user-invoked after the work is merged, promoted through staging and production where the plan says so, and validated at each step. It writes the retro to the Linear project. Quick has no close; the merge is the close.

## Non-negotiables

Skills named here that are not yet in the Skills table arrive in later PRs.

The `principles` skill grounds every trigger. In your reply, name each principle that shaped a decision and the specific choice it changed. Cite only principles whose leaf under `skills/principles/references/` you read this session.

Remaining triggers:

- Nontrivial change, architecture decision, or "are we sure?" → the **how** skill.
- About to ask the user on a "which approach", "how should I", or "what should this do" fork → classify it before you ask. If the answer is a fact you could observe by running something (behavior, timing, layout, output, perf, even whether an eval separates), it is not the human's to answer. Sketch it via the `prototype` skill and let the result decide. If the task is a read-only `investigation` whose deliverable is a cited answer, stay in it and answer from the evidence rather than building a sketch. Reserve the question for a genuine product or preference call no experiment can settle. Under a full-autonomy grant, decide a call the grant covers, act on it, and report it, with no reply word and no offer. Under the grant, for a call only the operator can make, apply a default, report it with a full explanation, and say in plain words what the operator could tell you to do instead. The operator answers in their own words. Never give a shorthand token to type back. Gates the operator named still need the operator.
- Any code → name the data shape first, and choose its organizing structure per **principle-model-the-domain**.
- Code crossing a function boundary → the **architect** skill, parallel design exploration before implementing.
- Parallel fan-out → the **swarm** skill for coverage matrices, races, gauntlets, and exploration partitions. Use **arena** for design or code bakeoffs with base selection and grafting.
- Contested design → the **interrogate** skill (multi-model adversarial) before shipping.
- Nontrivial multi-step → write the throughput checkpoint (`feature` step 3).
- Any prose surface, your reply to the user included → the **unslop** skill.
- Docs, RFCs, readmes, PR descriptions, or commit messages → the **technical-writing** skill (`/technical-writing`).
- Before review → the **no-comments** skill (`/no-comments`).
- Shipping UI or CLI → verify on the real surface via the repo's `verify-<app>` skill when it has one, otherwise by driving the surface directly. For bug fixes, reproduce first on the same surface yourself. Hand to the user only under the narrow `bug-fix` step 1 exception.
- Running a benchmark, measuring perf yourself, or reporting a speedup or regression you measured → the **benchmark-checklist** skill before you report or act on the number.
- Any PR-status request ("babysit this", "get it green", "address the bot comments", and most often "check on PR X" or "anything outstanding on X") → `review-loop`'s outer loop, which owns the request-to-mode mapping. Never triggered by merely opening a PR. Declare its mode before polling.
- CodeRabbit or Copilot or the agentic security review commented → skeptical posture. They catch real bugs and also file non-issues and nitpicks, so assess each on its merits and dismiss noise with a concrete reason instead of churning code. Triage fix / dismiss / ask per `skills/review-loop/references/bot-triage.md`.
- Broken skill mid-task → fix it in its own PR. Don't block. Don't silently work around it.
- Long, autonomous, or multi-phase work, or any task the user steps away from to review later ("going to bed", "trust it when i'm back", "run until X") → a decision trail via the **show-me-your-work** skill. Commit it when stakes need an auditable record. Keep it local otherwise.

## Skills

User-invoked: entry points and step heads. Model-invoked: building blocks other skills call.

| Skill | Kind |
|---|---|
| `triage`, `task-start`, `quick-task` | user |
| `auto-task` | user |
| `create-research-questions`, `create-research`, `create-design-discussion`, `create-prd`, `create-tdd`, `create-plan` | user |
| `implement` (orchestrator), `implement-item` (item thread head) | user |
| `publish` | model, from `create-plan` |
| `revise-plan` (orchestrator, between phases) | model |
| `close-task`, `handoff`, `bro`, `sharpen`, `in-your-own-words`, `catch-up` | user |
| `teach`, `interrogate` | user |
| `prototype`, `visual-parity` | user |
| `investigation`, `runtime-forensics`, `trace-forensics` | user |
| `perf-issue`, `hillclimb` | user |
| `bug-fix`, `feature`, `refactoring` | user |
| `describe-pr`, `review-loop`, `ci-commit` | model |
| `typescript-best-practices`, `show-me-your-work` | model |
| `how` | model |
| `why` | model |
| `setup-worktree` | model, Quick only |
| `unslop`, `technical-writing`, `principles`, `tdd`, `benchmark-checklist`, `blast-radius` | model |
| `autonomous-run` | user |
| `architect` | user |
| `arena` | model |
| `swarm` | model |

Sub-agents are named by role (`codebase-locator`, `codebase-analyzer`, `codebase-pattern-finder`, `web-search-researcher`); use whatever name the current harness exposes for the role. Definitions live in `agents/`. Within a step, sub-work runs as `delegate_task` children, not new top-level threads. Children run with `runtimeMode: full-access` too.

## Invoking skills

Final-answer templates suggest the next skill as `/skill-name`. In Claude Code that is a slash command; in Codex, invoke the same skill by name.
