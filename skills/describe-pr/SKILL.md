---
name: describe-pr
description: Write or rewrite the current branch's PR description from the template, with screenshots when UI changed. Use when opening a PR or after its scope changes.
---

# Describe a Pull Request

Create or update the pull request for the current task with a concise description that helps a reviewer understand why the change exists and the shape of the implementation.

## Workflow

1. Read the description template:

   `Read({SKILLBASE}/references/pr_description_template.md)`

2. Identify or create the pull request:
   - If `gh` is missing or signed out, stop and tell the user. Do not work around it.
   - Check the current branch for a PR with `gh pr view --json url,number,title,state,baseRefName,headRefName 2>/dev/null`.
   - If no PR exists, inspect `git status --short --branch` and the commits on the current branch.
   - Commit task-related changes when needed, push the branch with an upstream, and create a PR for it. Follow the repository's git safety protocol.
   - Ask the user to select a PR only when the current branch has no relevant work and there is no safe current-branch PR to create.

3. Gather only the context needed to explain the change:
   - Read the ticket and any relevant task artifacts.
   - Read the complete PR diff and enough surrounding code to understand behavior and ownership.
   - Use `gh pr view` to collect PR metadata and changed files.
   - Read `{SKILLBASE}/references/show-me.md` for the visual-outline conventions used in the PR body.

4. Write the PR description using the template:
   - The body is written through the `unslop` skill (`~/dev/skills/skills/unslop/SKILL.md`).
   - The title, body, and commit messages follow the `technical-writing` skill (`~/dev/skills/skills/technical-writing/SKILL.md`), every layer except Diátaxis.
   - Keep **Why the change** to exactly one sentence.
   - Keep **Special things to note** to 1-3 bullets. Prioritize reviewer warnings, migrations, compatibility constraints, deliberate omissions, or surprising decisions. Write `- None.` when there are no special considerations.
   - Make **Change outline** a compact, `/show-me`-inspired structural view rather than prose or a file-by-file changelog.
   - Include only the views that help explain this PR:
     - SQL table and endpoint contract changes, plus pseudocode for business logic.
     - key data structure / type changes
     - A shallow file tree showing changed responsibilities.
     - React component tree changes, including important hooks, state, and package boundaries.
     - Call-tree, call-stack, control-flow, or data-flow changes.
   - Prefer `diff` blocks when showing changes to an existing shape. Show the complete target shape when most of it is new or diff notation would obscure ownership or order.
   - Keep each view focused on the calls, files, fields, components, and boundaries a reviewer needs. Omit categories that did not change.
   - Do not add walkthrough artifacts, exhaustive implementation narratives, verification checklists, changelog text, or plan-deviation sections.
   - Fill **Merge risk** honestly: a change is a one-way door when rolling it back does not restore the prior state (destructive migrations, data rewrites, published contracts, sent messages); otherwise two-way. Blast radius is who notices if the change is wrong, judged from the diff and its callers, not from the PR's size. For a change whose safety rests on one fact, the `blast-radius` skill (`~/dev/skills/skills/blast-radius/SKILL.md`) finds and proves that fact, and its "one fact" line goes in Merge risk.
   - Add an **Evidence** section when there is something specific to show: concrete before/after proof that the change does what the body says, such as a named test that failed before and passes now with the relevant assertion, a command and its before/after output, a log line that no longer appears, or a measured number. Never write "all tests pass" or "x/x passing"; that is not evidence. Gather evidence from what this session actually ran; do not run the whole suite just to quote it. When the PR changes UI, run the app and capture each changed screen or state (before/after when the shape already existed) to `{TASKDIR}/html/pr-{number}/`, and reference each as `![alt](./file.png)` in the body. When the `tdd` skill ran, its final-response evidence (the failing-before test and its failure, the passing-after run) is the Evidence section. When the repo has a `verify-<app>` skill, Evidence cites its artifacts (screenshots, transcripts, response bodies) by path.
   - Never cite the ticket, Linear, or task documents in the body; explain the change on its own terms.

5. Save and publish the description:
   - Write the description to `{TASKDIR}/pr-description.md`.
   - Update the PR with `gh pr edit {number} --body-file {output-path}`, adding `--attach '{path}#{alt}'` for each screenshot; `gh` uploads the files and rewrites the body references to the hosted assets.
   - Confirm the update succeeded.

6. Report completion:
   - Read `{SKILLBASE}/references/describe_pr_final_answer.md`.
   - Respond using that final answer template with the PR as a link, saved description path, and concise list of changed files.

Always read and follow `{SKILLBASE}/references/pr_description_template.md`. Do not expand the PR body beyond that template.

Write as one human talking to another: avoid jargon and slang, and use simple, coherent, concise language.
