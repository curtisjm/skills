---
name: session-pickup
description: "Resuming or taking over a prior agent's in-flight work from a transcript, T3 thread, or pushed branch."
disable-model-invocation: true
---

# Session pickup

**You own the resume point. Read the prior trail, don't redo it.**

1. Locate the prior trail. `{TASKDIR}/resume.md`, the newest note in `{TASKDIR}/handoffs/`, a local transcript under `~/.claude/projects/<slug>/` (Claude Code) or `~/.codex/sessions/` (Codex), a T3 thread (`t3_thread_read`), or a pushed branch. `<slug>` is the workspace path with each `/` and `.` turned into `-`. Do not read another project's transcripts. Read the metadata overview and last messages first, then scan back for the decision points. Parse a long transcript in a subagent and keep the reduced timeline in the main thread (the **principle-guard-the-context-window** skill). Subagents are `delegate_task` children on the item-thread model and effort per the Relay rule in `~/dev/skills/WORKFLOW.md`.
2. Reconstruct operational state. The branch and worktree, what already landed (`git log`, `git diff` against the base), the open todos, the decisions made. The prior trail is authoritative input. Resist the bias to re-derive it.
3. Diff done vs pending. Compare what shipped against what was planned, name the resume point, do not re-run the prior repro or redo completed work. A "let me verify from scratch" pass means you're treating the trail as untrustworthy when it's authoritative.
4. Route the remaining work to the matching playbook skill or the task's current step in `task.md` and pick the verdict: continue the execution, ship a finished recommendation, ratify or override a prior conclusion, or postmortem a failed run. The pickup playbook ends here. The routed playbook owns the rest.
5. Verify the inherited claims against the original goal on the real artifact (the **principle-prove-it-works** skill). A passing prior self-report is not the proof.

**Reply:** where the prior agent stopped, what you inherited vs redid (ideally nothing redone), the resume point, and the outcome.
