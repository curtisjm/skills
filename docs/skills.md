# Skills

Every skill, agent, and script in this repo, grouped by when you reach for it. [`WORKFLOW.md`](../WORKFLOW.md) defines the paths and steps named here, and [`models.md`](../models.md) gives each role's model and effort.

## Entry points

Reach for an entry point when a task starts, since each one picks the path the task follows.

- [`triage`](../skills/triage/SKILL.md) files something that came up as a well-formed issue in the Linear Triage project and stops. Invoke it with a reference when you are not scoping the work now, then promote the issue later with `task-start` or `quick-task`.
- [`task-start`](../skills/task-start/SKILL.md) turns a reference and your notes into `task.md` and a Linear project, then launches `create-research-questions`. Invoke it to start the Standard or Long path, or with the path undecided until research recommends one.
- [`quick-task`](../skills/quick-task/SKILL.md) runs the whole Quick path in one thread, from a mini plan in `task.md` through a worktree, implementation, and the review loop for each PR. Invoke it for small, understood work that fits one thread and one or a few PRs.
- [`auto-task`](../skills/auto-task/SKILL.md) routes a request to a playbook and plans, prototypes, and implements inside it with no gates, keeping a decision trail and stopping at merge-ready. Invoke it for the Auto path, when the agent should lead and you review only the PRs.

## Steps of the gated paths

Reach for these on the Standard and Long paths, where each step runs in its own thread and launches the next when its gate passes.

- [`create-research-questions`](../skills/create-research-questions/SKILL.md) writes `research-questions.md`, a query plan of what to learn about the code and its dependencies. `task-start` launches it, and it hands straight to `create-research` with no gate.
- [`create-research`](../skills/create-research/SKILL.md) answers the research questions with parallel sub-agents and writes `research.md`, recommending Standard or Long when the path is undecided. It runs after `create-research-questions` and is gated in Plannotator before the design step.
- [`create-design-discussion`](../skills/create-design-discussion/SKILL.md) works through the design decisions with you from the research and writes `design-discussion.md`. It is the design step of the Standard path, and an independent model review follows its approval before `create-plan`.
- [`create-prd`](../skills/create-prd/SKILL.md) turns the idea or ticket into `prd.md`, a product spec of what to build and why. It is the first design step of the Long path, replacing `create-design-discussion`, and `create-tdd` follows it.
- [`create-tdd`](../skills/create-tdd/SKILL.md) writes `tdd.md`, the technical design for how to build it. It is the second design step of the Long path, and an independent model review follows its approval before `create-plan`.
- [`create-plan`](../skills/create-plan/SKILL.md) converts the design documents into `plan.md`, phased items the orchestrator can dispatch, checked by `bin/check-plan`. It is the last planning step of both paths and, after approval, runs `publish` and launches `implement`.
- [`publish`](../skills/publish/SKILL.md) creates the Linear issue tree from the plan's Items table and moves the project to Implementing. `create-plan` runs it unattended after plan approval.
- [`implement`](../skills/implement/SKILL.md) is the orchestrator, which dispatches each phase as parallel item threads, collects their reports, and writes every Linear status. `create-plan` launches it after `publish`, and it runs everything after planning, rollout included, without ever merging.
- [`implement-item`](../skills/implement-item/SKILL.md) heads one item thread, taking one plan row to a review-clean PR, a promotion, or a check and reporting back to the orchestrator. `implement` launches one per item, inside the item's worktree.
- [`revise-plan`](../skills/revise-plan/SKILL.md) folds a finished phase's item reports into `plan.md` and records each change in `plan-changelog.md`. `implement` runs it between phases, before dispatching the next one.
- [`close-task`](../skills/close-task/SKILL.md) writes the retro, closes the Linear project, removes the task's worktrees, and commits the task directory. Invoke it last on Standard and Long, once the work is merged, promoted, and validated, since Quick has no close.
- [`handoff`](../skills/handoff/SKILL.md) compacts the current conversation into a note under `{TASKDIR}/handoffs/` for a fresh agent. Invoke it by name when a thread should continue in a new session, which `session-pickup` then resumes from.

## Playbooks

Reach for a playbook when the work has a known shape, either through `auto-task`, which routes to one, or by invoking it by name.

- [`bug-fix`](../skills/bug-fix/SKILL.md) reproduces a reported defect, root-causes it, and fixes it with runtime evidence. Auto routes reported defects here.
- [`feature`](../skills/feature/SKILL.md) builds new or changed behavior from a named data shape, delegating the implementation while it stays in the lead. Auto routes new behavior here, and `prototype` hands its chosen direction to it.
- [`refactoring`](../skills/refactoring/SKILL.md) changes structure or shape (rename, extract, inline, dedupe, move) while the behavior stays the same. Auto routes behavior-preserving restructures here.
- [`perf-issue`](../skills/perf-issue/SKILL.md) traces a measured slowness and improves it against a baseline, tying every fix to a measurement. Auto routes one-off slowness here, and sustained work against a target goes to `hillclimb`.
- [`hillclimb`](../skills/hillclimb/SKILL.md) improves one metric against a target in a loop of hypotheses with before and after measurement, a decision log, and one commit per accepted win. Auto routes sustained metric work here.
- [`investigation`](../skills/investigation/SKILL.md) answers a read-only question (how X works, why Y was built this way, are we sure about Z) with a cited answer. Auto routes questions with no code change here, and it hands back when a fix should follow.
- [`prototype`](../skills/prototype/SKILL.md) builds a throwaway sketch to settle a design or behavioral fork by observing it. The Non-negotiables send any fork you could answer by running something here instead of to the user.
- [`runtime-forensics`](../skills/runtime-forensics/SKILL.md) diagnoses a live symptom such as a leak, an idle-CPU spin, or a glitch from instrumentation, and delivers a diagnosis rather than a fix. Auto routes live runtime symptoms here.
- [`trace-forensics`](../skills/trace-forensics/SKILL.md) diagnoses a captured profiling artifact such as a cpuprofile, trace, spindump, or heap snapshot. Auto routes artifacts handed over after the fact here.
- [`visual-parity`](../skills/visual-parity/SKILL.md) makes two UI implementations match pixel for pixel, verified by image diff against a baseline it never touches. Auto routes UI equivalence work and styling-system migrations here.
- [`autonomous-run`](../skills/autonomous-run/SKILL.md) defines done and drives one long task to it without stopping. Auto routes "run until done" requests here, and a multi-day program goes to `orchestrate`.
- [`figure-it-out`](../skills/figure-it-out/SKILL.md) designs a bespoke, auditable playbook when no narrower one fits, with a hypothesis loop and a decision trail. Auto routes large migrations, ambitious multi-part changes, and work you step away from here.
- [`orchestrate`](../skills/orchestrate/SKILL.md) runs a standing multi-day project from one coordinator chat that authors briefs, drains a queue of many stacked PRs, and keeps the frontier green. Auto routes project-scale programs here, with bookkeeping in `bin/orch`.
- [`autopilot-full`](../skills/autopilot-full/SKILL.md) runs a queue of independent PRs to merge-ready with one owner per PR and a swarm that verifies each before it is reported. Auto routes "autopilot this queue" requests here.
- [`autopilot-stack`](../skills/autopilot-stack/SKILL.md) builds and verifies a queue of changes as one linear base-chained stack for you to review and land. Auto routes "stack them, I'll land it" requests here, and it extends `autopilot-full`.
- [`session-pickup`](../skills/session-pickup/SKILL.md) resumes or takes over a prior agent's in-flight work from a handoff note, transcript, T3 thread, or pushed branch. Invoke it in a fresh thread after `pause-safely` or `handoff`.
- [`pause-safely`](../skills/pause-safely/SKILL.md) stops in-flight work at a safe boundary and leaves a checkpoint a cold-start agent can resume from. Invoke it on an explicit pause, before going offline or restarting, or near compaction, and `handoff` runs its first three steps.

## Building blocks the model reaches for

The model reaches for these mid-step, when a Non-negotiable in `WORKFLOW.md` or a calling skill fires, and you can invoke any of them by name.

- [`how`](../skills/how/SKILL.md) explains how a subsystem works, its runtime flow, and where code should live, at onboarding depth. Use it before a nontrivial change. Called by `create-research`, `architect`, `teach`, `investigation`, `feature`, `bug-fix`, `refactoring`, `perf-issue`, `hillclimb`, `no-comments`, and the `comment-sicko` agent.
- [`why`](../skills/why/SKILL.md) queries every available evidence source in parallel for the decisions and tradeoffs behind code and returns a cited read. Use it for design rationale, regressions, and postmortems. Called by `create-research`, `teach`, `investigation`, `bug-fix`, `architect`, `recall`, `blast-radius`, `no-comments`, and the `comment-sicko` agent.
- [`arena`](../skills/arena/SKILL.md) runs N parallel candidates at one task, picks a base, and grafts the strongest parts of the others into it. Use it when one attempt at a non-trivial artifact would lock in the wrong shape. Called by `architect`, `create-design-discussion`, `create-tdd`, `implement-item`, `feature`, `eval`, `blast-radius`, and `orchestrate`.
- [`architect`](../skills/architect/SKILL.md) sketches types, signatures, and module boundaries across several models before code, then stays in the loop as the code fills in. The Non-negotiables call it for code that crosses a function boundary. Called by `feature`, `bug-fix`, `refactoring`, `perf-issue`, `figure-it-out`, `prototype`, and `no-comments`.
- [`swarm`](../skills/swarm/SKILL.md) fans out N parallel workers over slices or races, drains them, and returns one report. Use it for coverage matrices, races, gauntlets, and exploration partitions. Called by `implement-item` and `autopilot-full`.
- [`interrogate`](../skills/interrogate/SKILL.md) has one reviewer per provider family adversarially review a change and synthesizes a verdict without applying it. Use it on a contested design before it ships. Called by `review-loop`, `architect`, and `feature`.
- [`tdd`](../skills/tdd/SKILL.md) writes a focused regression test that fails before the fix and passes after it. Use it only when asked or when the bug has an obvious cheap local test. Called by `implement-item`, `quick-task`, `bug-fix`, and `describe-pr`.
- [`blast-radius`](../skills/blast-radius/SKILL.md) finds what a change could break outside its diff and proves the one fact it is safe because of by running code. Use it on a small diff you don't trust. Called by `review-loop` and `describe-pr`.
- [`benchmark-checklist`](../skills/benchmark-checklist/SKILL.md) vets a performance number for its limiter, tuning, errors, repeatability, and relevance before anyone acts on it. Use it whenever you report a speedup or regression you measured. Called by `implement-item`, `quick-task`, `perf-issue`, `hillclimb`, and the `explain-the-number` principle.
- [`principles`](../skills/principles/SKILL.md) indexes the engineering principles, one leaf per principle under `references/`. Read it before writing code or a design, and name each principle that changed a decision. Routed by the Non-negotiables.
- [`unslop`](../skills/unslop/SKILL.md) cuts AI tells from any prose. Use it on every prose surface, replies included. Routed by the Non-negotiables.
- [`technical-writing`](../skills/technical-writing/SKILL.md) applies a layered standard of Diátaxis structure, Google developer style, STE instruction rules, and Global English. Use it for docs, readmes, PR descriptions, and commit messages. Called by `create-research`, `create-prd`, `create-tdd`, and `describe-pr`.
- [`typescript-best-practices`](../skills/typescript-best-practices/SKILL.md) grounds the type-system-discipline principle in TypeScript syntax. It loads on any `.ts` or `.tsx` file. Cited by the `type-system-discipline` principle.
- [`show-me-your-work`](../skills/show-me-your-work/SKILL.md) keeps a decision trail as a TSV with one row per decision (what, why, evidence, result). Use it for long, autonomous, or multi-phase work someone reviews later. Called by `implement`, `auto-task`, `quick-task`, `autonomous-run`, `autopilot-full`, `orchestrate`, `figure-it-out`, and `hillclimb`, and `why` reads its trails.
- [`no-comments`](../skills/no-comments/SKILL.md) spawns the `comment-sicko` agent over the diff, fixes accepted findings, and offers encodings for claimed constraints. Run it before review. Called by `review-loop` and `autopilot-full`.
- [`codebase-design`](../skills/codebase-design/SKILL.md) gives the shared vocabulary for deep modules (module, interface, depth, seam, adapter, leverage, locality) and the design-it-twice pattern. Use it when designing or restructuring a module's interface. Called by `improve-codebase-architecture`.
- [`domain-modeling`](../skills/domain-modeling/SKILL.md) builds and sharpens a project's domain model by writing `GLOSSARY.md` terms and ADRs as they crystallise. Use it when discussing codebase terminology or recording a decision. Called by `improve-codebase-architecture`.
- [`describe-pr`](../skills/describe-pr/SKILL.md) writes or rewrites the branch's PR description from the template, with screenshots when UI changed. Use it when opening a PR or after its scope changes. Called by `quick-task`, `implement-item`, `review-loop`, `auto-task`, the code playbooks, `autopilot-full`, `correct`, and `reflect`.
- [`review-loop`](../skills/review-loop/SKILL.md) drives a PR to review-clean through the inner loop (roborev refine) before it opens and the outer loop (CodeRabbit, Copilot, CI) after. Use it after an item or Quick task is committed, and for any PR-status request. Called by `implement-item`, `quick-task`, `auto-task`, the code playbooks, `autopilot-full`, `orchestrate`, `correct`, and `reflect`.
- [`ci-commit`](../skills/ci-commit/SKILL.md) commits the session's changes as focused, atomic commits with clear messages. Use it after implementation is verified and before the review loop. Called by `implement-item` and `quick-task`.
- [`setup-worktree`](../skills/setup-worktree/SKILL.md) creates the task's worktrees under `{TASKDIR}/repos` from fresh `origin/main` and runs repo setup. It serves the Quick path only, since the orchestrator makes item worktrees itself. Called by `quick-task`.

## User tools

Reach for these by name when you want something for yourself rather than the task's next step.

- [`catch-up`](../skills/catch-up/SKILL.md) tells you what changed in this chat since your last message and lists every call waiting on you. Invoke it after stepping away from a thread.
- [`recall`](../skills/recall/SKILL.md) rebuilds your recent context on a topic from your chat history, live state, and the shared record as a current-state brief. Invoke it before starting or resuming work on something.
- [`reflect`](../skills/reflect/SKILL.md) runs three reviewers over the transcript and routes each durable learning to an edit on an existing skill. Invoke it after a long task lands.
- [`correct`](../skills/correct/SKILL.md) finds the mistakes agents keep repeating in a repo and makes each one impossible, preferring architecture, types, and lints over docs. Invoke it when you keep correcting agents for the same thing.
- [`eval`](../skills/eval/SKILL.md) tests how a skill, structure, or prompt change affects agent behavior with blinded parallel candidates and a judge. Run it before opening a PR to this repo that changes what an agent does, per Invoking skills in `WORKFLOW.md`.
- [`sharpen`](../skills/sharpen/SKILL.md) makes a task deeper rather than bigger, then rewrites the prompt. Invoke it on a prompt before you send it.
- [`bro`](../skills/bro/SKILL.md) restates the last message in plain language with no jargon. Invoke it when a reply is too dense.
- [`teach`](../skills/teach/SKILL.md) runs `how` and `why` and weaves what they find into one plain explanation at your pace. Invoke it when you want to understand a change or subsystem rather than change it.
- [`in-your-own-words`](../skills/in-your-own-words/SKILL.md) plays back what the agent thinks your goal and problem are. Invoke it before work starts to check the agent understood.
- [`worktree-cleanup`](../skills/worktree-cleanup/SKILL.md) audits worktrees with `bin/worktree-audit`, cross-checks the active T3 threads, and prunes merged or abandoned worktrees and stale simulators. Invoke it when disk runs low, since `close-task` already removes a finished task's worktrees.
- [`create-verification-skill`](../skills/create-verification-skill/SKILL.md) generates a project-local `verify-<app>` skill that drives the app the way a user does and captures evidence. Invoke it in a repo with no scripted way to prove UI, CLI, or service behavior, and the Non-negotiables then verify through it.
- [`maintain-verification-skill`](../skills/maintain-verification-skill/SKILL.md) reads source per feature and drives every feature live to correct a drifted `verify-<app>` skill in at most one PR. Invoke it periodically or when the feature map has gone stale.
- [`improve-codebase-architecture`](../skills/improve-codebase-architecture/SKILL.md) scans a codebase for deepening opportunities, presents them as an HTML report, and grills through the one you pick. Invoke it when a codebase has grown friction you want to refactor away.
- [`grilling`](../skills/grilling/SKILL.md) interviews you in rounds of numbered questions, each with a recommended answer, until every branch of a plan's decision tree is settled. Invoke it to stress-test a plan or idea. Called by `improve-codebase-architecture`.

## Agents

Skills dispatch these sub-agents as `delegate_task` children, named by role, for work a stronger model then judges.

- [`codebase-locator`](../agents/codebase-locator.md) finds where the files, directories, and components for a feature live, without analyzing them. The research and planning steps dispatch it, along with `quick-task` and `triage`.
- [`codebase-analyzer`](../agents/codebase-analyzer.md) explains how specific code works, tracing data flow with file and line references. The research and planning steps dispatch it, `how` uses it for its explorers, and `quick-task` uses it for mini research.
- [`codebase-pattern-finder`](../agents/codebase-pattern-finder.md) finds similar implementations and usage examples to model new work on, with code excerpts. The research and planning steps and `quick-task` dispatch it.
- [`web-search-researcher`](../agents/web-search-researcher.md) researches a question on the web and returns sourced findings. `create-research-questions`, `create-research`, `create-prd`, and `create-tdd` dispatch it.
- [`comment-sicko`](../agents/comment-sicko.md) hunts the diff for comments and workaround code to delete. `no-comments` spawns it before review, on the item-thread model rather than the light one.

## Scripts

Steps run these scripts from `bin/`, and you can run any of them from a shell.

- [`bin/gate`](../bin/gate) opens a Plannotator review of a planning document over the tailnet, on a port derived from the task slug, and prints its URL with `--url`. Every gated planning step runs it before handing off, as do `quick-task` and `architect`.
- [`bin/check-plan`](../bin/check-plan) checks `plan.md` for the Items table, the required sections, and each item's verification blocks. `create-plan` runs it before the plan gate.
- [`bin/check-skill`](../bin/check-skill) checks that each skill directory has matching frontmatter and that its relative links and skill references resolve. Run it before opening a PR that adds or edits a skill.
- [`bin/worktree-audit`](../bin/worktree-audit) classifies every worktree by size, merge state, uncommitted work, PR state, and newest chat, and suggests a bucket without deleting anything. `worktree-cleanup` runs it as its first step.
- [`bin/orch`](../bin/orch) is a Bun CLI that keeps the units, ledger, inbox, gates, frontier, and standing orders of `orchestrate` as plain TSV and JSON. `orchestrate` runs it with `ORCH_STORE={TASKDIR}/orch`.
