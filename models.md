# Models

This is the one place roles map to a model family and effort, as the Relay rule in `~/dev/skills/WORKFLOW.md` and the skills in each row set them; ids are never hardcoded, and the newest version of each family comes from `orchestrator_capabilities`.

| Tier | Role | Skills | Family | Effort |
|---|---|---|---|---|
| Top | Orchestrator threads | `implement`, `orchestrate` coordinator | newest Fable (Claude) or Astra (Codex) | `medium` |
| Top | Interrogate reviewers | `interrogate` | newest Fable (Claude) or Astra (Codex), one reviewer per provider family that can run child tasks | `xhigh` |
| Top | Arena cross-judge | `arena` | newest Fable (Claude) or Astra (Codex), one judge, from a family other than the parent's when possible | `xhigh` |
| Top | Eval judge | `eval` | newest Fable (Claude) or Astra (Codex), per `arena`'s cross-judge | `xhigh` |
| Top | Reflect judgment, divergent, synthesizer | `reflect` | newest Fable (Claude) or Astra (Codex) | `xhigh` |
| Top | Why synthesizer | `why` | newest Fable (Claude) or Astra (Codex) | `xhigh` |
| Top | Judgment and prose | `auto-task` | newest Fable (Claude) or Astra (Codex) | `xhigh` |
| General | Item thread | `implement-item` | newest Opus (Claude) or Sol (Codex), the item-thread model | `high` |
| General | Code playbook delegates | `feature`, `refactoring`, `bug-fix`, `perf-issue`, `hillclimb`, `auto-task` | item-thread model | `high` |
| General | Arena runners | `arena` | item-thread model, one runner per provider family that can run child tasks | `high` |
| General | Architect runners | `architect` | item-thread model, one runner per provider family that can run child tasks | `high` |
| General | Owners | `autopilot-full`, `autopilot-stack` | item-thread model | `high` |
| General | Swarm workers that write or verify code | `swarm` | item-thread model; a model race names each arm's model | `high` |
| General | How explainer | `how` | item-thread model | `high` |
| General | Comment Sicko | `no-comments` | item-thread model | `high` |
| General | Eval candidates | `eval` | item-thread model, different models per `arena`'s runners | `high` |
| General | Orchestrate workers | `orchestrate` | item-thread model | `high` |
| Light | How explorers | `how` | newest Sonnet (Claude) or Luna (Codex), as the `codebase-analyzer` role | `medium` |
| Light | Why investigators | `why` | newest Sonnet (Claude) or Luna (Codex) | `medium` |
| Light | Agents | `agents/codebase-locator.md`, `agents/codebase-analyzer.md`, `agents/codebase-pattern-finder.md`, `agents/web-search-researcher.md` | Sonnet (`model: sonnet`) | `medium` |
| Light | Recall transcript slices | `recall` | newest Sonnet (Claude) or Luna (Codex) | `medium` |
| Light | Transcript readers | `worktree-cleanup` | newest Sonnet (Claude) or Luna (Codex) | `medium` |
| Light | Reflect tooling reviewer | `reflect` | newest Sonnet (Claude) or Luna (Codex) | `medium` |
| Light | Swarm workers that only run a command and report | `swarm` | newest Sonnet (Claude) or Luna (Codex) | `medium` |
