---
task: [task slug]
type: design-prd
repo: [current repository]
branch: [current branch name]
sha: [result of git rev-parse HEAD]
---

# [PRD Title]

### Problem to Solve

[What problem are we solving? What user pain point or business need does this address?]

- [What the user sees or experiences today]
- [Current product behavior, UX gaps, user pain points]
- [No file paths or function names - focus on user experience]
- ..

[if appropriate, mermaid diagram of logic flow or user workflow or business process that demonstrates the "Problem to Solve"]

### What does business success look like, and how can we measure it?

- [What will be true when this work is done]
- [User story, problems that will be solved, new things a user can do]
- [What the system does after the change that it did not do before: a flow that completes, an error that no longer occurs, a target met, a capability that exists]
- [How each outcome is checked after shipping]
- [Adoption or usage signal, only if the user wants one]
- [references to experiments or feature flag system if relevant]

### Proposed Solution

[leave blank to start, fill out with high-level bullet-points of the proposed solution and any relevant diagrams / mockups]

- [path taken] - [rationale]
- ...

### Alternative Solutions Considered

[leave blank to start, fill out with high-level bullet-points of the paths not taken w/ rationale]

- [path not taken] - [rationale]
- ...

### Solution Details

[Detailed description of the solution with mockups embedded inline]

#### [Feature/Component 1]

[Description of this feature]

[if appropriate, mermaid diagram of logic flow or user workflow or business process that demonstrates the "Proposed Solution"]

[if appropriate, link to an html mockup]
[{TASKDIR}/mockup-{description}.html]({TASKDIR}/mockup-{description}.html)
[or, with an in-repo prototype, the branch name `{TASKSLUG}-prototype` and a screenshot in {TASKDIR}/html/]

[Explanation of mockup and any behavioral notes]

#### [Feature/Component 2]

..

### Out of Scope

[leave blank to start, fill out with high-level bullet-points of the paths not taken w/ rationale]

- [Things that are explicitly out of scope]
- [Features or behaviors we're intentionally not building]
- ..
