# AWS Infrastructure

## What this source contains

AWS is the infrastructure and runtime layer, reached through the `aws` CLI. It is the record of what the system actually did in production: errors, latency, scaling, deploys, and configuration changes that motivated defensive or corrective code.

- **CloudWatch Logs.** Application and service logs, searchable with Logs Insights. Error strings, stack traces, request IDs.
- **CloudWatch Metrics and Alarms.** Latency, error rates, throttles, queue depth, memory and CPU. Alarm history shows when something paged.
- **CloudTrail.** Who changed what configuration and when: IAM, security groups, parameter store, service settings.
- **Deployment history.** ECS service events and task definition revisions, Lambda versions and aliases, CodeDeploy or CodePipeline executions. These date the moment code reached production.
- **Service configuration.** Timeouts, memory limits, concurrency, retry policies, and queue settings in ECS, Lambda, SQS, API Gateway, RDS, and the rest. A constant in code often mirrors one of these.

## How to search it

Use the `aws` CLI with the account's configured profile. Confirm the profile and region first with `aws sts get-caller-identity`. If credentials are missing or expired, stop and report the gap.

**Time-bound every query.** Bracket the PR merge date, typically two weeks before and one week after, wider only for a strong reason.

1. **Logs Insights for the error or symbol.** `aws logs start-query` on the service's log group with a filter for the error string, exception class, or symbol the target code handles, then `aws logs get-query-results`. A burst of a specific error just before a defensive-code PR is strong evidence.
2. **Metric history for the threshold.** `aws cloudwatch get-metric-statistics` or `get-metric-data` for the metric the code responds to (duration, throttles, 5xx, queue age) across the window. A p99 that matches a constant in the code suggests the number came from data.
3. **Alarm history.** `aws cloudwatch describe-alarm-history` for alarms on the service in the window. Alarm state changes often date the incident that motivated the change.
4. **Deploy dates.** `aws ecs describe-services` events and `describe-task-definition` revisions, or `aws lambda list-versions-by-function`, to date when the target shipped and what configuration shipped with it.
5. **Configuration changes.** `aws cloudtrail lookup-events` filtered by resource name or event name in the window, for infra changes that a code change compensates for.

## What good evidence looks like here

- Log volume for an exception class spikes before the PR and drops to near zero after
- A metric's p99 in the window matches a timeout or limit constant in the diff
- An alarm fired the day before the branch was created
- A task definition revision changed a memory or timeout setting in the same deploy as the code

## Common pitfalls

- **Correlation is not cause.** An error that stopped after the PR may have stopped because of an infra change in the same window. Check CloudTrail and deploy history before claiming the code fixed it.
- **Log retention.** Log groups expire. An empty query before the retention cliff is a gap, not a null result. Name it.
- **Metric resolution.** Metrics older than 15 days are aggregated to coarser periods; a short spike can disappear. Say which period you queried.
- **Wrong account or region.** Staging and production live in different accounts or regions. Confirm which one the question is about and say which you queried.
- **Cost of broad queries.** Unbounded Logs Insights queries over large groups are slow and cost money. Always filter by time and log group.

## What to return

For each relevant finding:
- Type (log query, metric, alarm, deploy event, CloudTrail event, configuration value)
- Account, region, log group or resource, and the exact command or query you ran
- Time window queried
- Compact numeric summary (counts, percentiles, first and last seen). Do not dump raw log lines.
- Temporal correlation with the target's ship date
- Relevance and strength: direct, circumstantial, or weak
