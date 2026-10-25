---
name: autopilot-stack
description: A queue of changes built and verified with full autonomy, delivered as one linear reviewed base-branch stack the operator lands ("autopilot-stack", "stack them, don't ship", "build the stack, I'll land it").
disable-model-invocation: true
---

# Autopilot-stack

**You own the stack, never the landing. Hand the operator one linear stack of base-chained PRs to review and land.** `autopilot-full` holds except for how verified work leaves. Each tick re-reads both skills, and this one wins where they differ.

1. **Run `autopilot-full`'s owners, minus the landing.** Owners report STACK-READY in place of merge-ready. They never rebase onto another branch, trunk included, and never retarget, merge, close a PR, or arm auto-merge, because the root owns the chain's topology and the operator owns the landing. When an item depends on another, its owner branches from that item's branch, not from trunk.
2. **Give the topology one writer.** Owners push only their own branches and report each tip and its intended parent. Only you rebase or retarget a link, because two writers on one chain undo each other. Append each clean PR in dependency order, with its base set to its parent's branch (`gh pr edit <pr> --base <parent-branch>`). Never require `gt`. An owner takes your push as its new base and lease, and on a conflict resolves its own slice for you to push.
3. **Absorb drift at the root.** Until landing starts, apply `autopilot-full` step 5's test to each link and rebase the chain bottom-up where it calls for one. Then, link by link, a rebase that leaves the patch-id unchanged carries the verdict, since a link's base is its parent.
4. **Deliver the chain, then keep your hands off it.** Each link carries its verdict in its PR. Once landing starts, nobody writes to the chain except the post-merge retarget after Curtis lands a link, because a second writer breaks a landing in flight. A mid-landing problem goes through you to the operator, and any fix waits for the operator's go.

**Choosing between the autopilots.** `autopilot-full` when the PRs are independent. `autopilot-stack` when the operator wants review before landing, the work is sequenced or coupled.

**Reply:** catch the operator up per the **catch-up** skill, with links to the stack root and tip, a one-line verdict per link, and anything parked or excluded with the reason.
