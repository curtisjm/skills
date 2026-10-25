---
name: visual-parity
description: "Pixel-exact UI equivalence: matching two implementations or migrating a styling system."
disable-model-invocation: true
---

# Visual parity

**You own pixel-exact equivalence. The baseline is the spec. You do not touch it.** Equivalence is verified by image diff, not by eye.

1. Establish the baseline first, before any migration: a visual regression harness that screenshots the current component across its states, plus the target when matching two implementations. No baseline, no parity claim. A blocking prerequisite, not a follow-up.
2. Anti-shortcut clauses, stated and held: no harness modifications, no baseline tampering, no component restructuring to make a diff pass. If the baseline looks wrong, stop and ask, don't edit it.
3. Migrate one component at a time. Parallelize across worktrees, one owner per component (the **separate-before-serializing-shared-state** principle skill). Shared primitives migrate first as a blocking phase.
4. Verify each component against its baseline via image diff on the matching surface via the repo's `verify-<app>` skill when the repo has one (`.claude/skills/verify-<app>/`), otherwise by driving the surface directly (T3 `preview_*` tools for web, the CLI itself for CLIs). A nonzero diff is a fail. Investigate the pixel delta. Repeat per component until the diff is zero (a plain repeat, or a T3 `schedule_task` loop).
5. Run `describe-pr` (`~/dev/skills/skills/describe-pr/SKILL.md`) then `review-loop` (`~/dev/skills/skills/review-loop/SKILL.md`) per component or per safe batch.

**Reply:** components migrated, the diff result for each, the baseline harness location, what's left.
