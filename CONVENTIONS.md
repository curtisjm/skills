# Conventions

Shared vocabulary used across the skills in this repo. Skills refer to these placeholders instead of hard-coding paths, so the same skill text works in Claude Code and Codex.

## Placeholders

- `{TASKDIR}` — the task directory. It is a plain directory (not a symlink) that holds the ticket and every document for one task: `ticket.md` or `task.md`, `research-questions.md`, `research.md`, `design-discussion.md`, `prd.md`, `tdd.md`, `structure-outline.md`, `plan.md`, `pr-description.md`, and any HTML mockups or diagrams. The session is normally launched from inside it, or the user names it. Ordinary file tools (Read, Glob, Grep, `ls`) work on it.
- `{TASKSLUG}` — the basename of `{TASKDIR}`. Also used as the branch name.
- `{SKILLBASE}` — the directory that contains the current skill's `SKILL.md`. `{SKILLBASE}/references/...` points at that skill's reference files.
- `{REPOBASENAME}` — the basename of a repository directory, e.g. `~/dev/example-api` → `example-api`.

## Documents

One document per type per task, no numeric prefixes. If a second document of the same type is ever needed, the skill should ask rather than invent a numbering scheme.

## Invoking skills

Final-answer templates suggest the next skill as `/skill-name`. In Claude Code that is a slash command. In Codex, invoke the same skill by name (`$skill-name` or the skills picker).

## Sub-agents

Skills name sub-agents by role (`codebase-locator`, `codebase-analyzer`, `codebase-pattern-finder`, `web-search-researcher`, `implementer-agent`, `outline-implementer-agent`, `implementation-reviewer`). Use whatever exact name the current harness exposes for that role. Definitions live in `agents/`.
