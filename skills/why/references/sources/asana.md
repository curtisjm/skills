# Asana Projects and Tasks

## What this source contains

Asana is the product and company planning layer, one level above engineering tickets. Linear says what engineering built; Asana says what the company decided to pursue and why.

- Projects for product initiatives, launches, and quarterly goals
- Tasks and subtasks with descriptions that state the goal, the customer, or the deadline behind a piece of work
- Comments and status updates where scope was cut, reprioritized, or deferred
- Custom fields (priority, quarter, owner, customer) that signal the kind of motivation
- Portfolios and goals that tie projects to company objectives
- Attachments and links to specs, decks, and the Linear project that implements the work

## How to search it

Use the Asana MCP. Inspect its tool schema first; tool names vary between servers. If authentication fails, stop and report the gap.

1. **Start from the Linear project.** If the Linear project or its issues link an Asana task or project, fetch that first. The link is the strongest bridge from code to product intent.
2. **Search tasks by the feature name and business terms.** Try the user-facing name, the customer name, and the launch name, not just the code symbol. Asana rarely contains symbols.
3. **Walk up.** From a task, read its parent task, its project, and the project's portfolio or goal. Rationale is written at the level where the decision was made, usually the project or goal.
4. **Read status updates and comments in date order.** Scope changes and deferrals are recorded as updates, not edits to the description.
5. **Check custom fields and due dates.** A quarter field or a launch date often explains a cut corner or a hard constraint.

## What good evidence looks like here

- A project description stating the business goal: "Win the enterprise segment: SOC2 by Q3"
- A status update recording a cut: "Dropping the export feature from the launch, it moves to Q4"
- A task comment naming the customer or deal behind the request
- A goal or portfolio that the engineering project rolls up to

## Common pitfalls

- **Planning drift.** Asana reflects the plan at planning time. The shipped code may follow a later decision recorded only in Linear or Slack. Compare dates.
- **Duplicate tracking.** The same work can appear as an Asana task and a Linear project. Treat the Asana copy as the product intent and the Linear copy as the engineering record.
- **Generic goals.** "Improve activation" is not a reason for a specific line of code. Look for the task or update that connects the goal to the change.
- **Private projects.** If a project is not visible, record a gap rather than guessing.

## What to return

For each relevant task or project:
- Task or project name and ID
- The goal or motivation quoted from the description, status update, or comment (not paraphrased)
- Parent task, project, portfolio or goal
- Owner, created date, due date, completion date
- Link to the task or project
