#!/usr/bin/env bash
# Symlink every skill and agent into the harness directories. Re-run after adding a skill; `git pull` covers edits.
set -euo pipefail

repo="$(cd "$(dirname "$0")" && pwd)"
[ "$repo" = "$HOME/dev/skills" ] || echo "warning: skills reference ~/dev/skills/WORKFLOW.md; this clone is at $repo" >&2

link_dir() {
  mkdir -p "$1"
  for d in "$repo"/skills/*/; do ln -sfn "$d" "$1/$(basename "$d")"; done
}

link_dir "$HOME/.claude/skills"   # Claude Code
link_dir "$HOME/.agents/skills"   # Codex and other AGENTS.md-aware tools

mkdir -p "$HOME/.claude/agents"
for f in "$repo"/agents/*.md; do ln -sfn "$f" "$HOME/.claude/agents/$(basename "$f")"; done

for c in gh plannotator roborev coderabbit bun; do command -v "$c" >/dev/null || echo "missing: $c" >&2; done
