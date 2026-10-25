# Granola Meeting Notes

## What this source contains

Granola holds the notes and transcripts of recorded meetings: planning sessions, design reviews, customer calls, standups, and retros. It is where decisions are made out loud before anyone writes them down, and often the only record of the alternatives that were rejected.

- Meeting notes with attendees, date, and an AI summary
- Transcripts, searchable by phrase
- Action items and decisions pulled out of the discussion
- Customer calls that carry the request behind a feature in the customer's own words

## How to search it

Use the Granola MCP. Inspect its tool schema first; tool names vary. If authentication fails, stop and report the gap.

1. **Date-bound the search.** Meetings in the two to four weeks before the PR merge or the Linear project's creation date. Decisions precede code.
2. **Search by feature name, customer name, and the names on the PR.** Transcripts use spoken names, not symbols. Try the words people would say.
3. **Read the whole note, then the transcript around the hit.** The summary names the decision; the transcript carries the reasons and the rejected options.
4. **Follow attendees.** If the PR author and a product owner were in the same meeting that week, read it even when the title is generic.
5. **Check for the customer call.** When the Linear issue names a customer, look for a call with that customer near the issue's creation date.

## What good evidence looks like here

- A decision stated in the summary: "Agreed to cap uploads at 50 MB for now and revisit after launch"
- A transcript passage weighing two options and picking one, with the reason
- A customer saying what they need and why, quoted
- An action item that became the Linear issue or the PR

## Common pitfalls

- **Transcript errors.** Names and technical terms are often mis-transcribed. Search for variants and read around the hit.
- **Spoken tentativeness.** "We could just do X" in a meeting is not a decision. Look for agreement, an action item, or the same point repeated in the summary.
- **Unrecorded meetings.** Hallway and DM decisions never reach Granola. An empty result is a gap, not proof that no discussion happened.
- **Attribution.** Quote the speaker only when the transcript names them clearly; otherwise attribute to the meeting.

## What to return

For each relevant meeting:
- Meeting title, date, attendees
- The decision or request quoted from the summary or transcript (not paraphrased), with the speaker when clear
- Rejected alternatives mentioned, if any
- Action items that connect to the Linear issue or PR
- Link to the note
