import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { test } from "node:test";

const checker = join(import.meta.dirname, "check-plan");

const validPlan = `---
task: demo
type: plan
repos: [demo]
---

# Demo Implementation Plan

## Items

| phase | id | repo | title | type | est. LOC |
|---|---|---|---|---|---|
| 1 | 1-1-thing | demo | Add the thing | pr | 100 |
| 2 | 2-1-pin | valency-foundation | Staging pin | ops | 5 |

## Rollout

Staging, then production.

## Phase transitions

Merge every phase before the next.

---

## Phase 1: The thing

### Overview
Adds the thing.

### If promoted after this phase
The thing is visible.

### Item 1-1-thing — Add the thing (\`demo\`, pr)

Adds the thing.

**You see**: The thing on the settings page.

#### Success Criteria:

##### Automated Verification:
- [ ] Tests pass: \`make test\`

##### Live Verification:
- [ ] Open settings. Save \`thing.png\`. Pass when the thing shows.

---

## Phase 2: Staging

### If promoted after this phase
Nothing changes.

### Item 2-1-pin — Staging pin (\`valency-foundation\`, ops)

The user pins staging.

**You see**: \`services.lock.toml\` names the new commit.
`;

const runPlan = (plan, expectedExit) => {
	const directory = mkdtempSync(join(tmpdir(), "check-plan-test-"));
	const file = join(directory, "plan.md");
	writeFileSync(file, plan);
	try {
		const result = spawnSync("node", [checker, file], { encoding: "utf8" });
		assert.equal(result.status, expectedExit, result.stderr);
		return result;
	} finally {
		rmSync(directory, { recursive: true, force: true });
	}
};
const append = (example, expectedExit) => runPlan(validPlan + example, expectedExit);
const replace = (from, to, expectedExit) => {
	assert.ok(validPlan.includes(from), `fixture lacks ${from}`);
	return runPlan(validPlan.replace(from, to), expectedExit);
};

test("accepts a plan in the template's format", () => {
	const result = runPlan(validPlan, 0);
	assert.match(result.stdout, /1-1-thing  type=pr  boxes=2  automated=1 live=1 manual=0/);
	assert.match(result.stdout, /2 items, 0 problems/);
});

test("accepts ordinary, indented, and longer closing fences", () => {
	for (const indent of ["", " ", "  ", "   "])
		append(`${indent}\`\`\`markdown\n### Item 9-9-example — Example only\n${indent}\`\`\`\n`, 0);
	append("```markdown\n### Item 9-9-example — Example only\n````\n", 0);
});

test("accepts nested backticks and tilde info strings", () => {
	append("````markdown\n```markdown\n### Item 9-9-example — Example only\n```\n````\n", 0);
	append("~~~markdown `info`\n### Item 9-9-example — Example only\n ~~~\n", 0);
});

test("keeps mismatched, shorter, and suffixed closers inside the fence", () => {
	append("````markdown\n~~~\n### Item 9-9-example — Example only\n````\n", 0);
	append("````markdown\n```\n### Item 9-9-example — Example only\n````\n", 0);
	append("````markdown\n``` info\n### Item 9-9-example — Example only\n````\n", 0);
});

test("rejects headings outside a proper close", () => {
	for (const suffix of ["  ", "\t"]) {
		const result = append(`\`\`\`markdown\n## Example only\n\`\`\`${suffix}\n### Item 9-9-example — Example only\n`, 1);
		assert.match(result.stderr, /Item 9-9-example has no Items table row/);
	}
	const backtick = append("```markdown `invalid`\n### Item 9-9-example — Example only\n```\n", 1);
	assert.match(backtick.stderr, /Item 9-9-example has no Items table row/);
});

test("rejects a long dash or mid-sentence colon in a heading, not in prose or code spans", () => {
	append("Prose may use a colon: here.\n", 0);
	append("### Use `a: b` and `c — d`\n", 0);
	assert.match(replace("# Demo Implementation Plan", "# Demo — Implementation Plan", 1).stderr, /long dash in heading/);
	assert.match(replace("## Phase 1: The thing", "## Phase 1: The thing: part one", 1).stderr, /mid-sentence colon in heading/);
	assert.match(replace("Add the thing (`demo`", "Add the thing — fast (`demo`", 1).stderr, /long dash in heading/);
});

test("rejects other Items columns", () => {
	const result = replace("| phase | id | repo | title | type | est. LOC |", "| phase | id | title | type |", 1);
	assert.match(result.stderr, /Items columns are \[phase, id, title, type\]/);
});

test("rejects a row without a section and a section without a row", () => {
	const row = replace("| 2 | 2-1-pin |", "| 2 | 2-1-pinned |", 1);
	assert.match(row.stderr, /Items row 2-1-pinned has no "### Item 2-1-pinned" section/);
	assert.match(row.stderr, /Item 2-1-pin has no Items table row/);
});

test("rejects a pr item without Live Verification", () => {
	const result = replace("##### Live Verification:\n- [ ] Open settings. Save `thing.png`. Pass when the thing shows.\n", "", 1);
	assert.match(result.stderr, /Item 1-1-thing has no "##### Live Verification"/);
});

test("rejects an item without a You see line", () => {
	const result = replace("**You see**: `services.lock.toml` names the new commit.\n", "", 1);
	assert.match(result.stderr, /Item 2-1-pin has no "You see" line/);
});

test("rejects a missing Phase transitions and a missing If promoted", () => {
	assert.match(replace("## Phase transitions", "## Transitions", 1).stderr, /no "## Phase transitions" section/);
	assert.match(replace("### If promoted after this phase\nNothing changes.\n", "", 1).stderr, /Phase 2 lacks "### If promoted after this phase"/);
});
