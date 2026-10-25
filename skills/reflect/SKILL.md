---
name: reflect
description: Spawn three parallel review subagents over the active transcript, surface learnings, and route each to a concrete edit on an existing skill. Use when the user says reflect.
disable-model-invocation: true
---

# Reflect

Mine the current conversation for durable learnings, then route them into skill edits.

Invoke when the user says "reflect" or "/reflect". Skip when the conversation is trivial, off-topic, or already covered by an existing skill the parent followed correctly. One-offs are not learnings.

## 1. Locate the active transcript

Before fanning out, find this conversation's transcript under `~/.claude/projects/<slug>/` (Claude Code) or `~/.codex/sessions/` (Codex), where `<slug>` is the workspace path with each `/` and `.` turned into `-` (so `/home/curtis/dev/valency/tasks` is `-home-curtis-dev-valency-tasks`). Do not glob across `~/.claude/projects/*/`. That crosses workspace boundaries and reads private chats from unrelated projects. Codex keeps every workspace in one tree, so keep only files whose first line (`session_meta`) has this workspace's `cwd`.

```bash
ls -t ~/.claude/projects/<slug>/*.jsonl ~/.claude/projects/<slug>/*/subagents/*.jsonl 2>/dev/null | head -10
ls -t ~/.codex/sessions/*/*/*/*.jsonl 2>/dev/null | head -10
```

That covers the Claude Code session (`<id>.jsonl`) and subagent (`<id>/subagents/agent-<child>.jsonl`) layouts and the Codex date-nested (`YYYY/MM/DD/rollout-*.jsonl`) layout. For each candidate, read its first user message (the first `"type":"user"` line in Claude Code, the first `response_item` with `role: "user"` in Codex). Take the file whose text contains the conversation's opening user prompt. If none matches, pass a tight digest of the session instead.

## 2. Spawn three reviewers in parallel

One message, three `delegate_task` children, `mode: async`. Reviewers need MCP access to look up the tickets, chat threads, and observability traces the transcript references, and `delegate_task` children keep the session's MCP servers.

| Lens | Model | Prompt template |
|---|---|---|
| Judgment | the highest tier model of its family (the Fable tier on Claude, the Astra tier on Codex; newest version from `orchestrator_capabilities`) at `xhigh` reasoning | `references/judgment-reviewer.md` |
| Tooling | the item-thread model and effort per the Relay rule in `~/dev/skills/WORKFLOW.md` | `references/tooling-reviewer.md` |
| Divergent | the highest tier model of its family (the Fable tier on Claude, the Astra tier on Codex; newest version from `orchestrator_capabilities`) at `xhigh` reasoning | `references/divergent-reviewer.md` |

Pass each template verbatim, substituting the transcript path or digest where marked. Reviewers return findings in the `delegate_task` result.

## 3. Synthesize

One `delegate_task` child on the highest tier model of its family (the Fable tier on Claude, the Astra tier on Codex; newest version from `orchestrator_capabilities`) at `xhigh` reasoning. It spot-verifies citations through MCP, which `delegate_task` children keep. Pass `references/synthesizer.md` verbatim, with each reviewer's full output inlined where marked. It returns an Accepted / Rejected / Backlog list.

## 4. Structural enforcement check

Move any Accepted item that a lint rule, script, metadata flag, or runtime check would enforce more reliably to Backlog. See the **encode-lessons-in-structure** principle skill.

## 5. Apply

Present the synthesizer's full Accepted / Rejected / Backlog output and wait for explicit approval before applying any Accepted edit. The user picks the subset and may redirect routings. Skill changes affect every future agent in the org. Do not auto-apply.

File each Backlog item as an issue in the Linear Triage project (the `triage` skill's target) without waiting. Only the Accepted list waits for approval.

Never edit a skill under `plugins/cache/`. Before approval, show its destination, `skills/<skill>/` in `~/dev/skills` (`curtisjm/skills`), or `.claude/skills/<skill>/` and `.agents/skills/<skill>/` in a code repo for a project-local skill. After approval, make every edit by PR, never in place. For `~/dev/skills`, create a worktree with `git -C ~/dev/skills worktree add {TASKDIR}/repos/skills-<skill> -b reflect-<skill> origin/main`, edit there, and open a PR against `curtisjm/skills`. For a project-local skill, do the same in that code repo, with the worktree at `{TASKDIR}/repos/{REPOBASENAME}-reflect-<skill>`. Then run `describe-pr` (`~/dev/skills/skills/describe-pr/SKILL.md`) and `review-loop` (`~/dev/skills/skills/review-loop/SKILL.md`). Never edit `~/dev/skills` or `~/dev/skills/WORKFLOW.md` in place. Never merge.

Follow each approved row's Routing exactly:

- Trivial existing-skill edit (a one-line bullet, a tightened sentence, a stale fact corrected): the parent does it directly.
- Substantive existing-skill edit (a new section, a new pattern table, more than ~10 lines): draft it in the worktree, then test and iterate on it with the `eval` skill.
- `tune description: <skill path>` (the skill exists but didn't trigger when it should have): tune the description in the worktree and test with the `eval` skill that it now triggers.
- `new skill: <kebab-name>`: create it in the worktree in the shape of the existing skills under `~/dev/skills/skills/`, then test it with the `eval` skill. Do not invent the shape ad hoc.

If your environment ships a SKILL.md validator, run it on every touched skill before declaring done.

## 6. Summarize for the user

Short list, no preamble:

- Edits applied: `<skill path>`. What changed, one line each.
- New skills created: `<skill path>`. One line each (rare).
- Backlog filed to Triage: `<issue title>` (`<tags>`). One line each.
- Dropped: one line per rejected finding + reason from the synthesizer.
