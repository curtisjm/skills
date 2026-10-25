# Provenance

This file records which of our skills, agents, and scripts carry upstream text, so they can be re-checked when an upstream changes. Each upstream has one pinned commit, recorded once in its section below. The mapping rows name a path at that commit and do not repeat the SHA.

## Upstreams

### HumanLayer

The repository is https://github.com/humanlayer/skills. The pinned commit is `653b6411c1f70c275a18e37673b042ff99f67ceb`, from 2026-10-08.

The first import was on 2026-09-26, before HumanLayer open-sourced the repo. Skills came from the riptide-rpi desktop plugin 0.41.2 and agents from the riptide-rpi-terminal plugin 0.30.34, both read from the local riptide install. The GitHub repo is the successor of those plugins and is the HumanLayer source of truth from here on. Upstream has since merged the phase skills into one `rpi` skill, with one `references/<phase>/process.md` per old skill. Riptide's `describe-pr` lives on as the separate `visual-pr` plugin. Riptide's `create-plan`, `iterate-plan`, `implement-plan`, `ci-commit`, and `setup-worktree` have no counterpart upstream.

To check for drift, diff the upstream path at the pinned SHA against upstream HEAD, then read our skill.

### pstack

The repository is https://github.com/cursor/plugins/tree/main/pstack. The pinned commit is `9580c23696ac8d7abed0c166f2f9918800afb819`, from 2026-10-23, at plugin version 0.15.32. The skills were imported on 2026-10-24 and 2026-10-25. Paths in the mapping are relative to `pstack/` in that repo.

To check for drift, diff the upstream path at the pinned SHA against upstream HEAD, then read our skill.

### Matt Pocock

The repository is https://github.com/mattpocock/skills. The pinned commit is `5beb35b040e3de97e54fa9e386d7e42d15c295c2`, from 2026-10-19.

The architecture skills were imported on 2026-10-25. Paths in the mapping table are relative to the repo root.

To check for drift, diff the upstream path at the pinned SHA against upstream HEAD, then read our skill.

### Other

- `handoff` is Matt Pocock's handoff skill, copied verbatim except the save path. Its repo and commit were not recorded.
- `review-loop` grew from a local `pr-loop` skill that is not in any upstream.

With no pinned commit, check `handoff` for drift by finding Matt Pocock's current handoff skill and diffing it against ours, then read our skill.

## Mapping

Relation is one of these values.

- verbatim means the text is unchanged apart from harness mapping and frontmatter.
- modified means the structure is kept and the content changed.
- borrowed means only ideas or a few sentences came over.
- own means there is no upstream text.

Rows follow the order of `docs/skills.md`. HumanLayer paths are relative to the repo root and pstack paths to `pstack/`.

| Ours | Upstream | Path at pinned commit | Relation | Notes |
|---|---|---|---|---|
| *Entry points* | | | | |
| `skills/triage` | none | none | own | Written here. |
| `skills/task-start` | none | none | own | Cites pstack `in-your-own-words` for the goal. |
| `skills/quick-task` | none | none | own | The shape step names a pstack playbook skill. |
| `skills/auto-task` | pstack | `skills/poteto-mode/SKILL.md` | modified | Routing for uncopied skills is dropped and merging stays with Curtis. |
| *Steps of the gated paths* | | | | |
| `skills/create-research-questions` | HumanLayer | `plugins/rpi/skills/rpi/references/{create,iterate}-research-questions/process.md` | modified | Rewritten for our workflow with the question guidance kept word for word. |
| `skills/create-research` | HumanLayer | `plugins/rpi/skills/rpi/references/{create,iterate}-research/process.md` | modified | Rewritten for our workflow and calls pstack `how` and `why`. |
| `skills/create-design-discussion` | HumanLayer | `plugins/rpi/skills/rpi/references/{create,iterate}-design-discussion/process.md`, `references/show-me.md` | modified | Rewritten around our gate and review, with the content guidance kept. |
| `skills/create-prd` | HumanLayer | `plugins/rpi/skills/rpi/references/{create,iterate}-prd/process.md` | modified | Rewritten for our workflow with the interview rules kept. |
| `skills/create-tdd` | HumanLayer | `plugins/rpi/skills/rpi/references/{create,iterate}-tdd/process.md` | modified | Rewritten for our workflow and `artifact_template.html` keeps riptide's with paths changed. |
| `skills/create-plan` | HumanLayer, pstack | none for HumanLayer (nearest `plugins/rpi/skills/rpi/references/create-structure-outline/process.md`); pstack `skills/poteto-mode/playbooks/multi-phase-plan.md` | modified | From riptide `create-plan` and `iterate-plan`, which upstream dropped. |
| `skills/publish` | none | none | own | Written here. |
| `skills/implement` | HumanLayer | none (nearest `plugins/rpi/skills/rpi/references/implement-outline/process.md`) | borrowed | Replaces riptide `implement-plan` with no text carried over. |
| `skills/implement-item` | HumanLayer | none (nearest `plugins/rpi/skills/rpi/references/implement-outline/process.md`) | borrowed | Replaces riptide `implement-plan` and `implementer-agent` with no text carried over. |
| `skills/revise-plan` | none | none | own | Written here. |
| `skills/close-task` | none | none | own | Written here. |
| `skills/handoff` | Other | not recorded | verbatim | Matt Pocock's skill with the save path changed. |
| *Playbooks* | | | | |
| `skills/bug-fix` | pstack | `skills/poteto-mode/playbooks/bug-fix.md` | verbatim | Playbook promoted to a skill. |
| `skills/feature` | pstack | `skills/poteto-mode/playbooks/feature.md` | verbatim | Playbook promoted to a skill. |
| `skills/refactoring` | pstack | `skills/poteto-mode/playbooks/refactoring.md` | verbatim | Playbook promoted to a skill. |
| `skills/perf-issue` | pstack | `skills/poteto-mode/playbooks/perf-issue.md` | verbatim | Playbook promoted to a skill. |
| `skills/hillclimb` | pstack | `skills/poteto-mode/playbooks/hillclimb.md` | verbatim | Playbook promoted to a skill with the log under `{TASKDIR}`. |
| `skills/investigation` | pstack | `skills/poteto-mode/playbooks/investigation.md` | verbatim | Playbook promoted to a skill. |
| `skills/prototype` | pstack | `skills/poteto-mode/playbooks/prototype.md` | verbatim | Playbook promoted to a skill. |
| `skills/runtime-forensics` | pstack | `skills/poteto-mode/playbooks/runtime-forensics.md` | verbatim | Playbook promoted to a skill. |
| `skills/trace-forensics` | pstack | `skills/poteto-mode/playbooks/trace-forensics.md` | verbatim | Playbook promoted to a skill. |
| `skills/visual-parity` | pstack | `skills/poteto-mode/playbooks/visual-parity.md` | verbatim | Playbook promoted to a skill. |
| `skills/autonomous-run` | pstack | `skills/poteto-mode/playbooks/autonomous-run.md` | verbatim | Playbook promoted to a skill. |
| `skills/figure-it-out` | pstack | `skills/figure-it-out/SKILL.md` | verbatim | Paths map to `principles` and `{TASKDIR}`. |
| `skills/orchestrate` | pstack | `skills/poteto-mode/playbooks/orchestrate.md` | modified | Agents never merge, so merges are not units. |
| `skills/autopilot-full` | pstack | `skills/poteto-mode/playbooks/autopilot-full.md` | modified | Owners stop at merge-ready and `no-comments` replaces `deslop`. |
| `skills/autopilot-stack` | pstack | `skills/poteto-mode/playbooks/autopilot-stack.md` | modified | Same merge-ready rule as `autopilot-full`. |
| `skills/session-pickup` | pstack | `skills/poteto-mode/playbooks/session-pickup.md` | verbatim | Playbook promoted to a skill with trails under `{TASKDIR}`. |
| `skills/pause-safely` | pstack | `skills/poteto-mode/playbooks/pause-safely.md` | verbatim | Playbook promoted to a skill. |
| *Building blocks* | | | | |
| `skills/how` | pstack | `skills/how/SKILL.md`, `skills/how/references/` | modified | Explorers run as the `codebase-analyzer` role. |
| `skills/why` | pstack | `skills/why/SKILL.md`, `skills/why/references/` | modified | Discovery is rewritten for our tools and most source files are new. |
| `skills/arena` | pstack | `skills/arena/SKILL.md` | verbatim | Runners are `delegate_task` children in worktrees. |
| `skills/architect` | pstack | `skills/architect/SKILL.md`, `skills/architect/references/` | modified | Runners are one per provider family and the checkpoint maps to our gate. |
| `skills/swarm` | pstack | `skills/swarm/SKILL.md` | verbatim | Workers are `delegate_task` children in worktrees. |
| `skills/interrogate` | pstack | `skills/interrogate/SKILL.md`, `skills/interrogate/references/` | verbatim | Reviewers are one child per provider family. |
| `skills/tdd` | pstack | `skills/tdd/SKILL.md` | verbatim | Frontmatter only. |
| `skills/blast-radius` | pstack | `skills/blast-radius/SKILL.md` | verbatim | Frontmatter only. |
| `skills/benchmark-checklist` | pstack | `skills/benchmark-checklist/SKILL.md` | modified | One added bullet requires production evidence for deployed-service latency. |
| `skills/principles` | pstack | `skills/principle-*/SKILL.md`, `skills/poteto-mode/SKILL.md` (Principles), `skills/architect/references/design-red-flags.md` | modified | A new `SKILL.md` frames the verbatim index and leaves. |
| `skills/unslop` | pstack | `skills/unslop/SKILL.md` | verbatim | Frontmatter only. |
| `skills/technical-writing` | pstack | `skills/technical-writing/SKILL.md` | verbatim | Frontmatter only. |
| `skills/typescript-best-practices` | pstack | `skills/typescript-best-practices/SKILL.md`, `references/patterns.md` | verbatim | Principle names map to `principles/references/` paths. |
| `skills/show-me-your-work` | pstack | `skills/show-me-your-work/SKILL.md`, `scripts/log.sh`, `references/decision-log-template.tsv` | modified | The log lives at `{TASKDIR}/decisions.tsv` and never in a code repo. |
| `skills/no-comments` | pstack | `skills/no-comments/SKILL.md` | verbatim | Spawns `comment-sicko` with `delegate_task`. |
| `skills/codebase-design` | Matt Pocock | `skills/engineering/codebase-design/` | verbatim | Byte-identical. |
| `skills/domain-modeling` | Matt Pocock | `skills/engineering/domain-modeling/` | verbatim | Byte-identical. |
| `skills/describe-pr` | HumanLayer | `plugins/visual-pr/skills/visual-pr/SKILL.md`, `plugins/visual-pr/skills/visual-pr/references/` | modified | From riptide `describe-pr`, with the walkthrough removed and screenshots, merge risk, and evidence added. |
| `skills/review-loop` | pstack, Other | `skills/poteto-mode/playbooks/babysit.md`, `skills/poteto-mode/references/bugbot-triage.md` | own | Grew from local `pr-loop`, later adding babysit's steps and a renamed `bot-triage.md`. |
| `skills/ci-commit` | HumanLayer | none | modified | From riptide `ci-commit`, which upstream dropped. |
| `skills/setup-worktree` | HumanLayer | none | modified | From riptide `setup-worktree`, trimmed hard and dropped upstream. |
| *User tools* | | | | |
| `skills/catch-up` | pstack | `skills/ketchup/SKILL.md` | verbatim | Renamed from `ketchup` with `/visualize` mapped to `html_render`. |
| `skills/recall` | pstack | `skills/recall/SKILL.md` | modified | Transcript paths mapped and the `automate-me` routing dropped. |
| `skills/reflect` | pstack | `skills/reflect/SKILL.md`, `skills/reflect/references/` | modified | The apply step opens a PR here and the backlog goes to Linear Triage. |
| `skills/correct` | pstack | `skills/correct/SKILL.md` | modified | Mistakes come from review bot threads and fixes ship through `describe-pr` and `review-loop`. |
| `skills/eval` | pstack | `skills/poteto-mode/playbooks/eval.md` | modified | One added sentence scopes it to behavior-changing PRs to this repo. |
| `skills/sharpen` | pstack | `skills/sharpen/SKILL.md` | verbatim | Byte-identical. |
| `skills/bro` | pstack | `skills/bro/SKILL.md` | verbatim | Byte-identical. |
| `skills/teach` | pstack | `skills/teach/SKILL.md` | verbatim | Byte-identical. |
| `skills/in-your-own-words` | pstack | `skills/in-your-own-words/SKILL.md` | verbatim | Byte-identical. |
| `skills/worktree-cleanup` | pstack | `skills/poteto-mode/playbooks/worktree-cleanup.md` | verbatim | Playbook promoted to a skill without the macOS and Cursor items. |
| `skills/create-verification-skill` | pstack | `skills/create-verification-skill/SKILL.md`, `references/feature-map-example/` | modified | Skills go to `.claude/skills` and a cadence runs as a T3 scheduled task. |
| `skills/maintain-verification-skill` | pstack | `skills/maintain-verification-skill/SKILL.md` | verbatim | `.cursor/skills` maps to `.claude/skills`. |
| `skills/improve-codebase-architecture` | Matt Pocock | `skills/engineering/improve-codebase-architecture/` | verbatim | The report goes to `{TASKDIR}/html/` when a task exists and can render with `html_render`. |
| `skills/grilling` | Matt Pocock | `skills/productivity/grilling/` | verbatim | Byte-identical. |
| *Agents* | | | | |
| `agents/codebase-locator.md` | HumanLayer | `plugins/rpi/agents/codebase-locator.md` | verbatim | Unchanged since the import, and upstream only reformatted the frontmatter. |
| `agents/codebase-analyzer.md` | HumanLayer | `plugins/rpi/agents/codebase-analyzer.md` | verbatim | Unchanged since the import, and upstream swapped `LS` for `Bash` in tools. |
| `agents/codebase-pattern-finder.md` | HumanLayer | `plugins/rpi/agents/codebase-pattern-finder.md` | verbatim | Unchanged since the import, and upstream only reformatted the frontmatter. |
| `agents/web-search-researcher.md` | HumanLayer | `plugins/rpi/agents/web-search-researcher.md` | verbatim | Unchanged since the import, and upstream added tools and a line against browser skills. |
| `agents/comment-sicko.md` | pstack | `agents/comment-sicko.md` | verbatim | Byte-identical. |
| *Scripts* | | | | |
| `bin/gate` | none | none | own | Plannotator gate over the tailnet. |
| `bin/check-plan` | pstack | `skills/poteto-mode/scripts/check-plan.mjs` | modified | A port with the checks rewritten for our plan format. |
| `bin/check-plan.test.mjs` | pstack | `skills/poteto-mode/scripts/check-plan.test.ts` | modified | Tests rewritten with the port. |
| `bin/check-skill` | pstack | `skills/poteto-mode/playbooks/authoring-a-skill.md` | borrowed | Written from step 2 of that playbook. |
| `bin/worktree-audit` | pstack | `skills/poteto-mode/scripts/worktree-audit.sh` | modified | Transcript lookup scans `~/.claude/projects` and `~/.codex/sessions`. |
| `bin/orch` | pstack | `skills/poteto-mode/scripts/orch/orch.ts` | verbatim | Symlink to `orch-src/orch/orch.ts`. |
| `bin/orch-src/` | pstack | `skills/poteto-mode/scripts/` (`bootstrap.ts`, `package.json`, `bun.lock`, `orch/`) | verbatim | `package.json` drops the typecheck script and the watch-pr and check-plan tests. |
| *Top-level files* | | | | |
| `WORKFLOW.md` | pstack, HumanLayer | pstack `skills/poteto-mode/SKILL.md` (Non-negotiables); nearest HumanLayer `plugins/rpi/skills/rpi/references/workflow.md` | own | Written here, with a modified copy of pstack's Non-negotiables. |
| `models.md` | pstack | `skills/setup-pstack/SKILL.md` | borrowed | Its role list seeded the rows and no text was copied. |

## Last checked

2026-10-25. The most recent drift review is `~/dev/valency/tasks/skills/humanlayer-update-evaluation.md`.
