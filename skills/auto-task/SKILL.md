---
name: auto-task
description: "Agent-led path: route a request to a playbook skill, plan, prototype and implement inside it with no gates, keep a decision trail, stop at merge-ready. Use for /auto-task <reference>."
disable-model-invocation: true
---

# Auto task

Entry point of the Auto path in `~/dev/skills/WORKFLOW.md`. Curtis gives a reference and a request. The run owns planning and implementation. It routes the request to a playbook skill, plans, prototypes and implements inside it with no gates, and keeps a decision trail. Merging is always Curtis's.

## Setup

This thread runs in the task's T3 project, rooted at `{TASKDIR}`; `{TASKSLUG}` is its basename.

1. **Pull in the reference** (Linear `get_issue`, `gh issue view`, or fetch the URL) and the user's words. Read @-mentioned files FULLY.

2. **Write `{TASKDIR}/task.md`** from `{SKILLBASE}/../task-start/references/task_template.md` with `path: auto`, `phase: auto`; set `linear_issue` when the source is a Linear issue. Create `{TASKDIR}/html/`, `reports/`, `repos/`. State the done predicate as one checkable sentence under `## Done when`.

3. **Create a Linear project** named after the task, whose description is the request plus the done predicate, and set `linear_project` in `task.md`. If `linear_issue` is set, move the issue to In Progress.

4. **Open the decision trail** at `{TASKDIR}/decisions.tsv` per the `show-me-your-work` skill (`~/dev/skills/skills/show-me-your-work/SKILL.md`).

## Playbooks

Open a todolist whose first items are the matched playbook's steps, copied in verbatim, before any task-specific todos. A step you choose not to do stays in the list with a one-line `skip: <reason>`. Match the task to a playbook below and open the skill at `~/dev/skills/skills/<name>/SKILL.md`. Copy its steps in verbatim.

A large or cross-cutting effort (a migration across many call sites, an ambitious multi-part change), or work the user steps away from to trust later, routes to the **figure-it-out** skill even when a narrower playbook like Feature fits. Use **figure-it-out** whenever no bundled playbook fits. It designs a bespoke, rigorous playbook for the task. A standing project-scale program (multi-day, many stacked PRs, a fleet of subagents under one coordinator) routes to **Orchestrate** instead. figure-it-out designs one bespoke run, orchestrate runs the program.

- **Investigation (`investigation`).** Read-only question: how does X work, why was Y built this way, are we sure about Z, should we do X or Y.
- **Bug fix (`bug-fix`).** A reported defect to reproduce, root-cause, and fix with runtime evidence.
- **Perf issue (`perf-issue`).** A measured slowness to trace and improve against a baseline.
- **Hillclimb (`hillclimb`).** Sustained, scientific improvement of one metric against a target: loop hypotheses with before/after measurement, a decision log, and one commit per accepted win. Distinct from Perf issue, which is a one-off fix.
- **Runtime forensics (`runtime-forensics`).** Diagnose a runtime symptom (leak, idle-CPU spin, glitch) from live instrumentation. The deliverable is a diagnosis, not a fix.
- **Trace forensics (`trace-forensics`).** Diagnose a captured profiling artifact (cpuprofile, trace, spindump, heap snapshot) handed to you after the fact. The deliverable is a diagnosis, not a fix.
- **Feature (`feature`).** New or changed behavior, built from a named data shape.
- **Refactoring (`refactoring`).** A behavior-preserving change to structure or shape (rename, extract, inline, dedupe, move).
- **Prototype (`prototype`).** A throwaway sketch to make a design or behavioral decision cheaply, or to settle an empirical fork by observing it instead of asking the human ("prototype", "mock it up", "try this layout", "sketch it to decide").
- **Visual parity (`visual-parity`).** Pixel-exact UI equivalence: matching two implementations or migrating a styling system.
- **Babysit (`review-loop`'s outer loop).** Driving a PR or a stack to merge-ready: conflicts, review threads, CI.
- **Autonomous run (`autonomous-run`).** A long task to drive to completion without stopping ("run until done", "run until X").
- **Orchestrate (`orchestrate`).** A standing project handed to one coordinator chat: multi-day, many stacked PRs, dozens to hundreds of subagents, minimal human turns ("run this whole project", "own this migration until it lands"). Distinct from Autonomous run, which drives one task to a predicate. Work one agent could finish inside the session's budget routes there, not here, however program-shaped the phrasing sounds.
- **Autopilot-full (`autopilot-full`).** A queue of independent PRs run to merge-ready with full autonomy. One owner per PR carries build through merge-ready, and the root swarm-verifies each PR before its owner reports it ("autopilot this queue", "full autopilot", one-owner-per-PR programs).
- **Autopilot-stack (`autopilot-stack`).** A queue of changes built and verified with full autonomy, delivered as one linear reviewed base-branch stack the operator lands ("autopilot-stack", "stack them, don't ship", "build the stack, I'll land it").
- **Session pickup (`session-pickup`).** Resuming or taking over a prior agent's in-flight work from a transcript, cloud-agent URL, or pushed branch.
- **Pause safely (`pause-safely`).** Suspending in-flight work cleanly so it can be resumed, on an explicit pause, going offline, a harness restart, or imminent context compaction. The complement to Session pickup.
- **Opening a PR (`describe-pr` then `review-loop`).** Invoked at the end of every other playbook.

The Non-negotiables section of `~/dev/skills/WORKFLOW.md` and the `principles` skill (`~/dev/skills/skills/principles/SKILL.md`) apply to every step.

## Autonomy

**Just do it.** Use any MCP tool. Reversible work and external actions (team chat, ticket updates, kicking off evals) proceed without asking.

**Always pause** for irreversible writes: force-push to shared branches, deploys, data deletion, customer messages. Merging a PR is always Curtis's; the run ends at merge-ready and never merges, arms auto-merge, or asks for merge authority.

**Session overrides:** "Don't stop" / "going to bed" / "run until done" / "be fully autonomous" → keep going.

**No is an acceptable answer.** Asked whether to do something, invited to add scope, or shown an approach, reply with your real judgment. Decline, push back, or say "this doesn't earn its place" when true. A recommendation is a judgment, not a validation. Agreement is not the default, candor over sycophancy.

## Subagents

**Use a `delegate_task` child for any subagent you spawn inside a playbook step** (code-writing delegates, ad-hoc helpers). The chat that receives `/auto-task` runs the playbook. Never spawn a `delegate_task` child to run the playbook itself. Routed workflow skills (`how`, `why`, `interrogate`, `reflect`, `swarm`) set their own child models for diverse-model review. Respect what the skill prescribes, don't override it.

Every spawn is a `delegate_task` child, `mode: async`, given file pointers not inlined context. Models per the Relay rule in `~/dev/skills/WORKFLOW.md`: code and worker roles on the item-thread model, judgment and prose roles on the highest tier at `xhigh`, one child per provider family where a skill wants diversity.

You own every subagent's work. Review the diff and write your own summary, don't pass through what it said. A second opinion is the same prompt against a different model. Agreement is high-signal.

**Fresh subagents by default.** Give new work to a fresh subagent with consolidated scope, meaning the original brief, every later directive, and the prior agent's report and branch. This holds for a fix round, a follow-up, a retry, and the next queue item. Resume, message, or queue a follow-up on an existing subagent only when the new work strictly needs state that lives in that agent and is costly to move: its local checkout, its uncommitted changes, or a process it still runs, such as a dev server, a simulator, or a babysit watcher. A stop or hold order to a running agent is not reuse. A role such as a PR owner outlives its agent. Once that agent returns, a fresh agent takes the role's next round. Interrupt-chained resumes silently drop directives, so fire a fresh subagent with consolidated scope rather than trusting a "done" summary.

## Writing the reply

Write the reply clean as you draft it. A cleanup pass after drafting does not remove these patterns.

- **Short declarative sentences.** One thought per sentence, ended with a period.
- **No long-dash character anywhere.** Write a file-list bullet as a sentence ("`main.js` owns persistence and the IPC handlers") and a bold section header as its own sentence ("**Verification.** End to end via CDP").
- **A colon as a mid-sentence connector is also out** (unslop rule 14). A colon before a list is fine.
- **Terse is not an excuse to drop content.** Short sentences, but every section the playbook's reply names stays: details, tradeoffs, choices, open decisions.
- **Frame impact for the consumer and the maintainer.** Name who the work is for (an end user, a colleague importing the library) and what changes for them before any implementation detail. Then what the next engineer who owns this code inherits. If you can't say what either would notice, the work or the explanation is off.
- **Never fabricate a link, citation, or transcript reference.** Link only artifacts you produced or read this session.
- **Every claim carries its evidence or its label in the same sentence.** Measured, inferred, or guess. A prediction or an unseen cause is a guess. Never hand the human a check you could run.

Every playbook ends with a reply written this way, PR link as `[repo#n](url)`. Each playbook's own reply lines name only the content unique to that playbook.

## Comments

Comments follow the same rule as the reply. Write them clean as you go. Keep a comment only for a non-obvious *why* the code can't show. A verify or test script gets no phase-narrating comments such as `// Phase 1: add cards`. The assertion or log string documents the step, as in `assert(ok, 'persisted across restart')`. This applies to every file you produce, including the delegate's diff.

## Handback

At each boundary the run reports (started, a PR merge-ready, blocked, done), post a status update on the Linear project whose body is the `catch-up` text (`~/dev/skills/skills/catch-up/SKILL.md`).

When the done predicate holds or the run stops, upload `{TASKDIR}/decisions.tsv`, and the bespoke playbook if `figure-it-out` wrote one, as documents on the Linear project. Write `{TASKDIR}/reports/auto.md` (the playbook followed, divergences from it, each principle applied and the decision it changed, rejected review findings and why, manual checks for the user) through the `unslop` skill, then respond with exactly:

```markdown
### Next Steps

Merge-ready, landing is yours. {or, when the run stopped short of the done predicate: what blocked it}

PRs: {one line per PR: [repo#n](url) · stacked on … if so · review loop clean | stopped at limit, with what is left}.

- Report: `{TASKDIR}/reports/auto.md`
- Decision trail: `{TASKDIR}/decisions.tsv`
- Manual checks before merge: {list or "none"}
```
