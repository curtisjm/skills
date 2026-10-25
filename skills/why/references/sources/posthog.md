# PostHog Product Analytics

## What this source contains

PostHog is the product analytics layer: what users did, which flags and experiments ran, which errors they hit, and how feature usage evolved. It complements AWS. AWS is the infrastructure view, PostHog is the product view.

- **Events and persons.** Captured product events with properties, sessions, and person profiles. Feature invocations, clicks, submissions, client-reported errors.
- **Insights and dashboards.** Saved trends, funnels, and retention charts, often the chart someone looked at before deciding to change the code.
- **Feature flags and experiments.** Flag definitions, rollout history, experiment variants and results. Flag-gated code exists because of these.
- **Error tracking.** Grouped exceptions with first-seen and last-seen dates and affected user counts.
- **Annotations.** Dated notes on charts marking launches, incidents, and experiments.
- **Activity log.** Who changed a flag, insight, or dashboard and when.
- **Session replays.** Not readable as text; name them as a lead for the user rather than watching them.

## How to search it

Use the PostHog MCP (`exec`). Run `info <tool>` before a tool you have not used. Confirm the active project first with `project-get`, since staging and production are separate projects.

**Time-bound every query.** Bracket the PR merge date, typically 30 days before and after.

1. **Event usage trajectory.** Confirm the event exists with `read-data-schema`, then `query-trends` for daily counts across the window. A step from zero to steady volume within a day or two of the merge suggests the PR launched the feature. A decay to zero suggests a deprecation.
2. **Threshold origin.** `execute-sql` for the distribution (median, p99, max) of the relevant event property in the weeks before the PR. A p99 that matches a constant in the code suggests the number came from data.
3. **Flag and experiment lookup.** `feature-flag-get-all` and the experiment tools for the flag key in the diff, then the activity log for when it was created, rolled out, or removed.
4. **Error tracking.** `query-error-tracking-issues-list` for the exception class or message the target handles, with first-seen and last-seen dates around the PR.
5. **Annotations and saved insights.** Search `system.insights` and annotations for the feature name. A saved chart from the week before the branch was created is often the analysis that motivated it.

## What good evidence looks like here

- An error-tracking issue's volume drops to near zero in the days after a defensive-code PR
- A flag's activity log shows it created the day the branch was opened and rolled to 100% the week after merge
- A saved insight named after the feature, created by the PR author, dated before the PR
- A property's p99 before the PR equals the limit constant in the diff

## Common pitfalls

- **Instrumented is not caused.** An event's existence means someone logged it, not that the code exists because of it. Pair with a PR or ticket citation before claiming causation.
- **Silent instrumentation changes.** A step in event volume may mean a new event started being logged. Check for instrumentation PRs in the same window.
- **Wrong project.** Staging and production are separate PostHog projects. Say which you queried.
- **Property drift.** Properties are added and renamed. A property on today's events may not exist for the window you need.
- **Retention cliff.** If the window predates the project's data, that is a gap, not a null result.
- **Replays are not text.** Hand the user a replay link as a lead; do not describe what you did not watch.

## What to return

For each relevant finding:
- Type (event trend, property distribution, flag or experiment, error issue, insight, annotation, activity-log entry)
- Project, the tool or query you ran, and the time window
- Compact numeric summary (counts, percentiles, first and last seen). Do not dump raw rows.
- Temporal correlation with the target's ship date
- Relevance and strength: direct, circumstantial, or weak
