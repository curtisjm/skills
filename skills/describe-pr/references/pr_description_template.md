[{TICKET_ID}]({TICKET_URL})

## Why the change

{Exactly one sentence explaining the problem this PR solves and what becomes possible after it ships.}

## Special things to note

- {List 1-3 reviewer-relevant warnings, migrations, constraints, deliberate omissions, or surprising decisions. Use "None." when there are no special considerations.}

## Change outline

{Use the smallest combination of the following `/show-me`-style views that explains the implementation. Prefer `diff` blocks for changes to existing shapes and complete blocks for mostly new shapes. Do not include headings for views that are not relevant.}

{...short-description...}

```diff|sql|json|etc
{Show changed SQL tables, important columns and relationships, and endpoint request/response contracts.}
```

{...short-description...}

```typescript|python|etc
{show new data structures that are key to the implementation}
```

{...short-description...}

```diff
{Show concise pseudocode for the changed behavior.}
```

{...short-description...}

```diff
{Show a shallow file tree with changed responsibilities.}
```

{...short-description...}

```diff
{Show changed React component trees, important hooks or state, and package boundaries.}
```

{...short-description...}

```diff
{Show changed call trees, call stacks, control flow, or data flow.}
```

{Tell the story in the order that makes it easiest to understand. It may make sense to show files first, or it may make sense to establish a data structure, SQL table, or API contract first. All views and subheadings are optional. Use only the views that help explain the pr, and name or order them based on the change rather than a fixed template. It should be written as one human would write to another. Use `diff` for a focused change to an existing shape. Show the complete target shape in a language-specific or `text` block when it is new, high-level, or clearer without diff notation.}

## Evidence

{Concrete before/after proof that the change does what the body says. For UI changes, a screenshot of each changed screen or state, before/after when the shape already existed. For behaviour changes, the specific observation: a named test that failed before and passes now with the relevant assertion or output excerpt, a command and its before/after output, a log line that no longer appears, a measured number. Omit this section when there is nothing specific to show. Never write "all tests pass" or "x/x passing"; that is not evidence.}

## Merge risk

**Door:** {one-way | two-way} — {one clause: what makes it so, e.g. "revert restores it" or "migration drops a column"}

**Blast radius:** {one or two words, e.g. "this page", "all API consumers", "none"} — {one clause: who or what notices if it is wrong}
