---
name: setup-worktree
description: Only use when the user explicitly invokes this skill by name.
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
You're already in a worktree at `[current directory]`.

To start implementation, create a new session with the following command:

```text
/implement-outline
```

If you really do want to create a new worktree from here, let me know and I can still help with that.
</output_example>

**Do NOT proceed to Step 1 unless the user explicitly confirms they want to create a worktree anyway.**
</condition>

</step>

<step index=1>

### Step 1: Get required information

1. Figure out what task you're working on - you should have the task directory `{TASKDIR}` already. TASKSLUG is the basename of `{TASKDIR}`.

1a. Read the ticket and the outline or plan if present:

```
Read({TASKDIR}/ticket.md)   # or task.md
Read({TASKDIR}/structure-outline.md)
Read({TASKDIR}/plan.md)
```

1b. Determine the repository (or repositories) the task touches. The current directory is the primary repository unless the ticket or user says otherwise. REPOBASENAME is the basename of a repository, e.g. `~/dev/example-api` -> `example-api`.

</step>

<step index=2>

### Step 2: Create the worktree(s)

Defaults (adjust only if the user asks):

- Worktree path: `{TASKDIR}/repos/{REPOBASENAME}`
- Branch name: `{TASKSLUG}`
- Source ref: the latest `origin/main` (or the repository's default branch)
- Files to copy from the repository root into the worktree, preserving relative paths, when they exist: `.env*`, `.claude/settings.local.json`, `CLAUDE.local.md`
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
    Copy the local-only files listed above:

    ```bash
    ls -la [REPO_ROOT]/[pattern]
    mkdir -p [WORKTREE_FULL_PATH]/[parent-dir]
    cp [matched-file] [WORKTREE_FULL_PATH]/[same-relative-path]
    ```

    For example, `.claude/settings.local.json` → `[WORKTREE_FULL_PATH]/.claude/settings.local.json`
  </step>
  <step index=2.3>
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
Worktree for {TASKSLUG} has been created at [WORKTREE_FULL_PATH]. You can start implementation by running

```text
use the implement-outline skill for task {TASKDIR}
```

in the [WORKTREE_FULL_PATH] directory.
</output_example>

</step>
