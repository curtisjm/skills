---
name: setup-worktree
description: Create the task's worktree(s) under {TASKDIR}/repos from fresh origin/main and run repo setup. Quick path only; the orchestrator makes item worktrees itself.
---

## steps to follow

<step index=0>

### Step 0: Check if you're already in a git worktree

```
Bash(git rev-parse --git-dir)
```

<condition if="output contains '.git/worktrees/'">
You are already inside a worktree. Creating another worktree from here is probably not what the user wants.

**Output this final answer instead of proceeding:**

<output_example>
You're already in a worktree at `[current directory]`. Implementation can continue here.

If you really do want to create a new worktree from here, let me know and I can still help with that.
</output_example>

**Do NOT proceed to Step 1 unless the user explicitly confirms they want to create a worktree anyway.**
</condition>

</step>

<step index=1>

### Step 1: Get required information

1. Figure out what task you're working on - you should have the task directory `{TASKDIR}` already. TASKSLUG is the basename of `{TASKDIR}`.

1a. Read `{TASKDIR}/task.md` if not already read this session.

1b. The repositories the task touches are `repos` in the `task.md` frontmatter. REPOBASENAME is the basename of a repository, e.g. `~/dev/example-api` -> `example-api`.

</step>

<step index=2>

### Step 2: Create the worktree(s)

Defaults (adjust only if the user asks):

- Worktree path: `{TASKDIR}/repos/{REPOBASENAME}`
- Branch name: `{TASKSLUG}`
- Source ref: the latest `origin/main` (or the repository's default branch)
- Nothing is copied from the repository root: secrets come from AWS
- Setup command: infer from the repository (e.g. `bun install`, `npm install`, `uv sync`, `make setup`). Skip if nothing obvious exists.

<loop for="each repository">
  <step index=2.1>
    Fetch the latest default branch and create the worktree:

    ```
    Bash(git -C [REPO_ROOT] fetch origin main)
    Bash(git -C [REPO_ROOT] worktree add -b {TASKSLUG} {TASKDIR}/repos/{REPOBASENAME} origin/main)
    ```
  </step>
  <step index=2.2>
    Run the setup command in the new worktree directory:

    ```
    cd [WORKTREE_FULL_PATH] && [setup-command]
    ```
  </step>
</loop>

If there are any error messages or failures, report the error to the user and work with the user to complete the setup.

Don't proceed to step 3 until the worktrees are created and setup is complete.

</step>

<step index=3>

**Only output this if the worktree(s) were successfully created.**

If you encountered an error in Step 2, do NOT output this section.

<output_example>
Worktree for {TASKSLUG} has been created at [WORKTREE_FULL_PATH] on branch `{TASKSLUG}`; implementation continues there.
</output_example>

</step>
