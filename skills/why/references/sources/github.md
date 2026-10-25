# GitHub (git, PRs, issues)

## What this source contains

- Commit history (messages, dates, authors, diffs)
- PR descriptions, review comments, and discussion threads (via `gh`)
- GitHub issues and discussions, including ones never linked from a commit
- Inline code comments, TODOs, FIXMEs, deprecation notes
- ADRs (architectural decision records) if the repo keeps them
- Tests, whose names and assertions often encode the edge cases that motivated a change
- Related files modified in the same commits (co-change signal)
- CHANGELOG entries and release notes in the repo
- Issue/ticket IDs in commit messages and PR bodies (Linear IDs and GitHub `#123` references)

The most trustworthy source, tied directly to the code, and the most complete. Everything that went through the repo should be here.

## How to search it

Expand the seed commit list:

```bash
# History through renames
git log --follow --oneline -- <file>

# Pickaxe: commits that added or removed this exact text
git log -S '<exact_string_from_code>' -- <file>

# Or for patterns:
git log -G '<regex>' -- <file>

# Who wrote each line and when
git blame -L <start>,<end> <file>

# One commit's full diff
git show <hash>

# Commits between two points affecting this file
git log <old>..<new> -p -- <file>
```

Look for out-of-band docs:

```bash
# ADRs often live in docs/adr/ or similar
rg -l -i 'architecture.decision' --glob '*.md'

# TODOs and FIXMEs near the target
rg -n -C2 '(TODO|FIXME|HACK|XXX|NOTE)' <target_file>

# Related tests
rg -l '<symbol>' --glob '*test*'
```

Search PRs and issues with `gh`:

```bash
# PRs that touched the file, newest first
gh pr list --state merged --search 'path:<file>' --limit 30 --json number,title,mergedAt,author

# PRs and issues mentioning a symbol, error string, or feature name
gh search prs --repo <owner>/<repo> '<term>' --limit 30
gh search issues --repo <owner>/<repo> '<term>' --limit 30

# The PR a commit landed in, then its body, review threads, and linked issues
gh pr list --search '<sha>' --state merged --json number
gh pr view <number> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews
gh api repos/<owner>/<repo>/pulls/<number>/comments --paginate

# An issue with its comments
gh issue view <number> --comments
```

Read the PR body and the review threads in full. The rationale is often in a reviewer's question and the author's answer, not in the description.
