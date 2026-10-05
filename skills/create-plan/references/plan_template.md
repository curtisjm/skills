---
task: [task slug]
type: plan
repos: [repo basenames this plan touches]
---

# [Feature/Task Name] Implementation Plan

## Overview

[Brief description of what we're implementing and why]

## Current State Analysis

[What exists now, what's missing, key constraints discovered]

### Key Discoveries:
- [Important finding with file:line reference]
- [Pattern to follow]
- [Constraint to work within]

## Desired End State

[A specification of the desired end state after this plan is complete, and how to verify it]

## What We're NOT Doing

[Explicitly list out-of-scope items to prevent scope creep]

## Implementation Approach

[High-level strategy and reasoning]

## Items

[One row per item. The orchestrator reads this table. A phase is a vertical slice: the items that can run in parallel; phases are sequential. Each `pr` item targets under 1000 lines. `ops` = promotion pins, activation, database scripts; `test` = verifying the real system, not writing tests. Rollout items live here too.]

| phase | id | repo | title | type | est. LOC |
|---|---|---|---|---|---|
| 1 | 1-1-[slug] | [repo] | [title] | pr | [n] |
| 1 | 1-2-[slug] | [repo] | [title] | pr | [n] |
| 2 | 2-1-[slug] | valency-foundation | [staging pin] | ops | [n] |
| 2 | 2-2-[slug] | — | [staging smoke] | test | — |

## Rollout

[Environments, promotion order, and how each step is validated]

## Phase transitions

[One of, with no default: merge every phase before the next; stack all phases; mixed, annotated per phase. A stacked item names the single prior PR it branches from; an item depending on several prior PRs cannot stack.]

---

## Phase 1: [Descriptive Name]

### Overview
[What this phase accomplishes]

### Item 1-1-[slug] — [title] (`[repo]`, pr)

[What the item does. Files below are indicative of where the work lands, not a binding list.]

**File**: `path/to/file.ext`
**Changes**: [Summary of changes] - [around line X | add after Y | etc etc]

```diff
// Specific code to add/modify
+ export function [name]() {
     // existing logic...
+    [code changes to make]
+
+ }

export interface [name]{
   // existing fiels (a, b, c, d, e)
+  [new fields to add]
+  [new fields to add]
}
```

#### Success Criteria:

##### Automated Verification:
- [ ] [Migration applies cleanly: `bun run ...`]
- [ ] [Lint and format pass: `bun run quality`]
- [ ] [Tests pass: `bun run test`]
- [ ] [other automated verification as appropriate: curl, sql queries, etc]

<optional if="manual validation relevant">
##### Manual Verification:
- [ ] [manual step 1]
- [ ] [manual step 2]
</optional>

### Item 1-2-[slug] — [title] (`[repo]`, pr)

...

---

## Phase 2: [Descriptive Name]

### Overview
[What this phase accomplishes]

### Item 2-1-[slug] — [title] (`valency-foundation`, ops)

[Which pin or action, who runs it (the user), how it is validated]

### Item 2-2-[slug] — [title] (test)

[What is checked against the real system: logs, flows, dashboards]

---
