---
name: create-prd
description: Only use when the user explicitly invokes this skill by name.
---

# PRD Phase

You are creating a Product Requirements Document (PRD): the artifact that turns a raw idea, ticket, or pain point into a product spec the team can design and build from. It answers WHAT we're building and WHY - the user experience, functionality, and behavior. Leave technical implementation to the downstream TDD.

You run the PRD as a guided conversation. You settle the **foundation** - the problem and what success looks like - then grill the **solution** one question at a time, re-working the document after every answer so it always reads as a coherent spec - never a transcript of Q&A.

## How the conversation works (read this before you start)

**Exactly one question per message.** End every message with a single question - never a second question, a stacked follow-up, or an "and also...". Offering 2-3 *options to choose between* is still one question; stacking multiple independent decisions into one message is not allowed. Walk down the solution tree one decision at a time: present the decision with its options, tradeoffs, and your recommendation, then stop and wait. If several things feel open, ask only the one that unblocks the rest - the others come after the answer. Never ask for a vague "any feedback?".

**Present the context needed to answer the question.** Give the user the background to answer without going to look anything up: what the code does today in the relevant spot, with file references; the constraint or finding that makes this a decision; and what each option implies. The user should be able to answer from your message alone.

**Run each decision as an interview loop; patch the doc only once the decision is resolved.** Ask your one question, then work back and forth until it's settled. The user won't always answer outright - they may push back, think out loud, or ask a clarifying question of their own ("well, how would it work if quality finding = 'passing'?"). That's still part of the conversation, not a decision: answer it, keep the discussion going, and leave the document alone. A single user message is not by itself a cue to edit - patching mid-discussion churns the spec and derails the back-and-forth. Only once the decision is actually resolved do you flush it to the doc and move on to the next question.

**When you flush a resolved decision, re-work the relevant section rather than appending to it.** Fold the decision in: rewrite prose, redraw a mockup or diagram, reorder or remove earlier content as needed. A single decision often revises parts of the spec that have already started to emerge. Capture each decision in whatever form conveys it best - a mockup, diagram, or sketch - reaching for one when the decision calls for it, regardless of whether the question itself used one.

**The doc is always a cohesive description of what's known - never a log.** At any point, the PRD should read like a spec someone wrote on purpose: high-level, coherent, and current - not a list of answers, and not a changelog of decisions. Treat each answer as a reason to re-paint: restructure, reorder, and rebuild the section so it stays a clean, unified description of everything decided so far. **Rewriting entire sections as you go is expected, not exceptional.**

**Show, don't tell.** When discussing anything visual - UI flows, layouts, interactions, states - create an HTML mockup and link to it. A quick sketch communicates more than paragraphs of prose. Keep mockups up to date as decisions evolve.

**Make it read like a document a human designed for other humans.** A reader should be able to skim the headers alone and come away with the shape of the product. Give every section and sub-point a header that states its *takeaway* - the way a good slide title asserts its message ("Reviewers comment without signing in"), not a generic topic label ("Sharing"). Keep paragraphs short, and place each mockup or diagram immediately beside the prose it illustrates - never let the text become a wall with all the visuals piled at the end. Lead with the point, then support it.

**Stay in product space.** Only ask product questions - user experience, functionality, and behavior. If you find yourself reaching for database schemas, storage locations, or implementation architecture, note it in a "Deferred to TDD" section and move on.

**Get more context when you need it.** When a decision depends on how the product or codebase actually works, spawn Agent() calls (codebase-locator, codebase-analyzer, codebase-pattern-finder, web-search-researcher) before presenting options. Fold any new findings back into the research artifact.

---

<step index="1" name="understand-the-context">

<instructions>
- The launch message names `{TASKDIR}`: `ls -la {TASKDIR}`.
- Read every relevant file in the task directory **fully** (Read with no limit/offset), excluding research-questions docs. Read `{TASKDIR}/task.md` and set its `phase: prd`.
- Read the PRD template: `Read({SKILLBASE}/references/prd_template.md)`.
- If `{TASKDIR}/prd.md` already exists, this run revises it. Skip Step 2 and 3; if the user gave no feedback, ask:

  ```
  I'm ready to iterate on the PRD. Would you like to:
  1. Provide specific feedback or changes to incorporate
  2. Continue grilling the solution - I'll walk the solution details one decision at a time, presenting each with options and my recommendation
  3. Have me surface additional design questions

  Let me know which direction, or share your feedback directly.
  ```

  Resolve feedback one item at a time with the same reflexes as the interview (re-paint, don't append), continue grilling from Step 5, and finish with Steps 6 and 7.
</instructions>

<guidance>
## Working from whatever inputs exist

There is no required upstream artifact. The product context might be a detailed ticket, a research doc, or just a couple of sentences describing what the user wants. Work from whatever is present.

- Ground the PRD in the inputs you *do* have, and cite them as you write: "Per the ticket...", "The research doc notes...".
- Don't duplicate upstream content into the PRD - reference it.
- If the context is thin, don't invent requirements. Surface the gaps as questions during the interview and let the user fill them in.

## Design system for mockups

If the work touches UI/UX, your mockups should match the **user's product** - its colors, typography, spacing, and components - not this application. Check the research doc for design-system details first. If none are documented, spawn a **codebase-analyzer** before you build mockups:
- What design system or component library is used for $PRODUCT_AREA?
- Primary colors (with hex codes), typography, spacing, borders, shadows?
- What theming system exists, if any?
</guidance>

</step>

<step index="2" name="write-the-skeleton">

<instructions>
Write the doc to `{TASKDIR}/prd.md`.

**Keep the skeleton as minimal as possible. No preamble, no setup, no summaries.** The faster you reach the first question, the more the user stays engaged in building the PRD. Write only:
- Frontmatter with `type: design-prd`, plus the top-level title
- A **Problem to Solve** section with your first-draft problem statement
- Empty **What does business success look like, and how can we measure it?**, **Proposed Solution**, and **Solution Details** headers - built out through the interview

Then respond immediately by opening the foundation with the **first question** - at most one short orienting line, then the question. Quote the actual "Problem to Solve" content you drafted so the user reacts to the exact wording, not a summary. For example:

> I've started the PRD at `{TASKDIR}/prd.md`. First question: does this **Problem to Solve** sound right?
>
> > ...your statement of the problem...
>
> Tell me what's off, or confirm it and we'll move to what success looks like.
</instructions>

<guidance>
## Markdown formatting

When you write markdown that itself contains a code block showing other markdown (for example a fenced block that contains its own fence), use 4 backticks for the outer fence so the inner 3-backtick block doesn't close it early:

````markdown
# Example heading
```bash
npm install example
```
````
</guidance>

</step>

<step index="3" name="settle-the-foundation">

<instructions>
Settle the foundation one piece at a time, re-working the document as each is locked in. Wait for the user's response at each step.

**a. Problem to Solve.** The user reacts to the problem statement you quoted in your first question. Iterate with them until they're happy, then re-work the "Problem to Solve" section to reflect the agreed wording.

**b. What success looks like.** Once the problem is settled, move to success. The point of this section is to align on **what the system does after the change that it did not do before** - observable behaviour someone can check after shipping to decide whether the work landed. Treat that check as part of the definition of done. Define it in terms of functionality, not product analytics: a flow that completes, an error that no longer occurs, a latency or correctness target met, a capability that now exists. Fit it to the work: this skill serves backend internal tooling, full-stack product, DevOps, and everything between. Anything worth doing is worth measuring, and the measure is the behaviour. Propose the success criteria (or a few options) with your recommendation and iterate until the user is happy. Add an adoption or usage signal only when the user wants one - reference experiments or feature flags if relevant. For very small changes the change itself may be the only sensible check; if so, say that plainly and, with the user's agreement, record that rather than inventing a metric. Then re-work the "What does business success look like, and how can we measure it?" section.

Only open the solution interview (Step 5) once the problem and success metrics are both settled.
</instructions>

</step>

<step index="4" name="choose-the-prototype-form">

<instructions>
Skip this step when the work touches no UI. Otherwise, once the foundation is settled and before the first UI question, ask the user one question: prototype as HTML mockups, or as an in-repo prototype?

- **HTML mockups.** Static files in `{TASKDIR}/html/` that follow the product's design system (the Step 5 guidance).
- **In-repo prototype.** A throwaway branch in the real codebase. Create a worktree: `git -C ~/dev/valency/{REPOBASENAME} worktree add {TASKDIR}/repos/{REPOBASENAME}-prototype -b {TASKSLUG}-prototype origin/main`, run the repo's own setup, then build the feature directly and roughly so it is clickable. Replace the feature outright; add no switches or flags. The branch is never committed to main and never gets a PR. Delete it after the PRD is approved unless the user says to keep it.

Record the choice as one line in `## Decisions` of `{TASKDIR}/task.md`.

With an in-repo prototype:
- The PRD links to the branch name (`{TASKSLUG}-prototype`) instead of mockup files.
- Answer the interview's UI questions by looking at or screenshotting the running prototype. Save screenshots to `{TASKDIR}/html/` and link them where a mockup would go.
- Grill only what the prototype needs to show. Leave production concerns (error handling, tests, performance) to the TDD.
</instructions>

</step>

<step index="5" name="solution-interview">

<instructions>
Now grill the solution. **Ask exactly one question per message, walking down each branch of the solution tree.** Resolve one decision, let it inform the next, and only then ask the next. Presenting 2-3 options to choose between is still one question - don't stack multiple decisions into one message, and don't append a second question or an "any feedback?". Each question is a brush stroke that adds detail to the document - you're progressively painting the Solution Details, not logging Q&A.

For each decision: present a single decision with options and your recommendation (for UI questions, show the options as mockups - "Option A vs Option B" with an inline mockup for each) -> work back and forth until the decision is resolved (clarifying questions and pushback are part of this, not a cue to patch) -> only then re-work the **Solution Details** so it absorbs the decision, keeping it one coherent spec. Reach for a mockup or diagram whenever it captures the decision best.

When an answer reshapes the work, touch every affected section in the same pass: refine **Proposed Solution** if the high-level approach changed, move ruled-out paths into **Out of Scope**, and keep mockups in sync with the prose. If the user requests changes to a mockup, pause the question flow, iterate on the mockup until they approve it, then resume. When a mockup is approved, link it from the document if it isn't already linked.

**Stay in product space.** Only ask product questions. If a question is really about schemas, storage, or implementation architecture, note it under a "Deferred to TDD" section and move on.
</instructions>

<guidance>
## HTML mockups

Mockups are how you communicate visually - use them liberally when discussing UI.

- Write HTML files to `{TASKDIR}/html/mockup-{description}.html`
- Follow the **user's product** design system (colors, fonts, components) found in Step 1; use realistic labels, not lorem ipsum
- Keep each mockup focused on the decision at hand

Link from the document:
[{TASKDIR}/html/mockup-{description}.html]({TASKDIR}/html/mockup-{description}.html)

Update mockups as decisions evolve; the final PRD should embed the "winning" versions.
</guidance>

</step>

<step index="6" name="solution-review-gate">

<instructions>
When the solution is fully fleshed out, stop and hand it back for review. Because you've been building it decision by decision, the user hasn't read it as a whole yet. Say something like:

> I think the solution is complete. Since we've built it up decision by decision, can you read the **Solution Details** top to bottom and confirm it hangs together before we wrap up?

Then run the gate: tell the user the review URL (`~/dev/skills/bin/gate --url {TASKDIR}/prd.md`), then run `~/dev/skills/bin/gate {TASKDIR}/prd.md`. Annotations are the user's fixes: fold each one in (re-paint the affected section, update mockups), then run the gate again. Continue only on approval.
</instructions>

</step>

<step index="7" name="wrap-up">

<instructions>
When the solution is approved:

- **Mirror to Linear**: upload `prd.md` as a document on the project named by `linear_project` in `task.md`, titled with its file name; update the document if one with that title exists, otherwise create it. Keep its URL for the final answer. Mockups stay local in `{TASKDIR}/html/`.
- **Launch the TDD step**: `t3_thread_launch` (`runtimeMode: full-access`) with title `TDD: {TASKSLUG}` and message `Run /create-tdd for {TASKDIR}`.
- **Remove the prototype**: if an in-repo prototype exists, remove its worktree and branch unless the user said to keep it.
- Read the final answer template and follow it exactly: `Read({SKILLBASE}/references/prd_final_answer_resolved.md)`.
</instructions>

</step>
