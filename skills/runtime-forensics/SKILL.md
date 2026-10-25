---
name: runtime-forensics
description: Diagnose a runtime symptom (leak, idle-CPU spin, glitch) from live instrumentation. The deliverable is a diagnosis, not a fix.
disable-model-invocation: true
---

# Runtime forensics

**You own the diagnosis. Instrument the live process, don't theorize from source.** The deliverable is a cited diagnosis, not a fix.

1. Capture the live signal on the matching surface via the repo's `verify-<app>` skill when the repo has one (`.claude/skills/verify-<app>/`), otherwise by driving the surface directly (T3 `preview_*` tools for web, the CLI itself for CLIs): a CPU profile for a spinning process, a heap snapshot for a leak, a CDP trace for a visual glitch. A real artifact, not a guess.
2. Reduce the artifact to the smoking gun: the function on the hot path, the retainer chain from the leaked object to a GC root, the loop firing without input. Parse large artifacts in a subagent (the **guard-the-context-window** principle skill), keep the reduced finding in the main thread. Subagents are `delegate_task` children on the item-thread model and effort per the Relay rule in `~/dev/skills/WORKFLOW.md`.
3. Prove the mechanism before believing it. Inject instrumentation via CDP eval (T3 `preview_evaluate` for web) on the running process, or hotfix the live code without reloading, to confirm the hypothesis cheaply.
4. Map the finding back to source: file, symbol, the line that allocates or schedules.
5. Throughput checkpoint stays one line: `throughput checkpoint: n/a, read-only forensics`.

**Reply:** the signal captured, the reduced finding, how you proved the mechanism, the source location, artifact paths. No fix unless asked. Hand back to `bug-fix` or `perf-issue` once the cause is known.
