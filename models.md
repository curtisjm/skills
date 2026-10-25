# Models

This is the one place roles map to a model family and effort, as the Relay rule in `~/dev/skills/WORKFLOW.md` and the skills in each row set them; ids are never hardcoded, and the newest version of each family comes from `orchestrator_capabilities`.

| Role | Skills | Family and tier | Effort |
|---|---|---|---|
| Orchestrator | `implement` | newest Fable (Claude) or Astra (Codex) | `medium` |
| Item thread | `implement-item` | newest Opus (Claude) or Sol (Codex), the item-thread model | `high` |
| Code playbook delegates | `feature`, `refactoring`, `bug-fix`, `perf-issue`, `hillclimb`, `auto-task` | item-thread model | `high` |
| Swarm workers | `swarm` | item-thread model; a model race names each arm's model | `high` |
| Why investigators | `why` | item-thread model | `high` |
| How explorer | `how` | the `codebase-analyzer` role (`agents/codebase-analyzer.md`) | per the role |
| How explainer | `how` | item-thread model | `high` |
| Arena runners | `arena` | item-thread model, one runner per provider family that can run child tasks | `high` |
| Architect runners | `architect` | item-thread model, one runner per provider family that can run child tasks | `high` |
| Judgment and prose | `auto-task` | highest tier, Fable (Claude) or Astra (Codex) | `xhigh` |
| Why synthesizer | `why` | highest tier, Fable (Claude) or Astra (Codex) | `xhigh` |
| Arena cross-judge | `arena` | highest tier, one judge, from a family other than the parent's when possible | `xhigh` |
| Interrogate reviewers | `interrogate` | highest tier, one reviewer per provider family that can run child tasks | `xhigh` |
