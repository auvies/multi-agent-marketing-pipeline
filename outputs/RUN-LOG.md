# Run Log — Multi-Agent Team

Index of every workflow run. Runs 1–4 are the **Dawn Blend coffee launch** (`sample-request.md`);
Run 5 is a **cross-domain generalization test** (Ruff Day mobile dog grooming) proving the agents
aren't coffee-specific. Each entry links to its full record and summarizes what happened.

**Brief:** [prompts/project-brief.md](../prompts/project-brief.md) · **Sample request:** [sample-request.md](../sample-request.md) · **Rules:** [CLAUDE.md](../CLAUDE.md)

---

## Runs at a glance

| # | Run | File | How it ran | Final score | Status |
|---|-----|------|-----------|:-----------:|--------|
| 1 | Baseline (scripted) | [dawn-blend-launch.md](dawn-blend-launch.md) | Orchestrator-simulated | 23/25 | ✅ Approved |
| 2 | Rewrite-loop demo | [dawn-blend-launch-rewrite-demo.md](dawn-blend-launch-rewrite-demo.md) | Scripted (2 scenarios) | 6→23 · escalate | ⚙️ Demo |
| 3a | Live pipeline (blocked) | [dawn-blend-launch-ESCALATED.md](dawn-blend-launch-ESCALATED.md) | Real subagents | 22/25 | ⛔ Escalated |
| 3b | Live pipeline (unblocked) | [dawn-blend-launch-FINAL.md](dawn-blend-launch-FINAL.md) | Real subagents | 24/25 | ✅ Approved |
| 4 | Draft→final flow | [dawn-blend-launch-draftflow.md](dawn-blend-launch-draftflow.md) | Real subagents | 24 draft → 25 final | ✅ Approved |
| 5 | Cross-domain test (grooming) | [ruff-day-launch-DRAFT.md](ruff-day-launch-DRAFT.md) | Real registered subagents (by type) | 22/25 draft | 📝 Draft record |

> Runs 3a and 3b are the **same live run** in two states — before and after the human supplied the missing inputs.
> Run 5 is a **different campaign** (Ruff Day dog grooming) run to confirm the agents generalize beyond coffee.
> Run 4 re-runs the live pipeline under the new **draft→final** review modes: the same placeholders that
> hard-failed Run 3a now pass a DRAFT review as noted gaps, and the run reaches FINAL-APPROVED after fill-in.

---

## Run 1 — Baseline (scripted)
**File:** [dawn-blend-launch.md](dawn-blend-launch.md) · **Score:** 23/25 ACCEPTABLE · **Status:** ✅ Approved

First end-to-end pass, with the Orchestrator role simulated inline. Produced all nine required
package elements (audience insights → objective → main message → 4 pillars → posts → WhatsApp →
CTA → review → improvement notes). Proof points left as honest `[TODO]`s; review scored
Usability 4/5 and passed. Established the "no fabrication" behavior.

## Run 2 — Rewrite-loop demo
**File:** [dawn-blend-launch-rewrite-demo.md](dawn-blend-launch-rewrite-demo.md) · **Status:** ⚙️ Demonstration

Two scripted scenarios exercising error handling:
- **Demo A — recovery:** deliberately bad draft (hype, repetition, a fabricated "9/10 experts" stat)
  → Review **6/25 BELOW ACCEPTABLE** → Orchestrator routes back → rewrite → **23/25 ACCEPTABLE**. Loop closes in 1 round.
- **Demo B — escalation:** a blocker the loop can't fix (missing proof vs. hard sales goal)
  → 2 rewrites both fail (fabricate / too weak) → **rewrite cap hit** → structured escalation to human.

Proves: catch → route back → cap at 2 → escalate. The system refuses to fabricate to hit a number.

## Run 3 — Live pipeline (real subagents)
Each step ran as a **real, isolated subagent context** (`.claude/agents/*.md`), with delegation driven
from the main session in the fixed order. This is the authoritative live run.

### 3a — Blocked / Escalated
**File:** [dawn-blend-launch-ESCALATED.md](dawn-blend-launch-ESCALATED.md) · **Score:** 22/25 · **Status:** ⛔ Escalated

| Step | Agent | Result |
|------|-------|--------|
| 2 | research-agent | Audience insights → handoff |
| 3 | strategy-agent | Objective + main message + 4 pillars → handoff |
| 4 | content-agent | 4 posts + WhatsApp + CTA, proof left as `[TODO]` → handoff |
| 5 | review-agent | **22/25 BELOW ACCEPTABLE** — Usability 2/5 (placeholder CTAs, no buy path) |
| 6 | orchestrator | Diagnosed a **missing-human-input** blocker; escalated instead of a futile rewrite loop |

Root cause: brief §2 proof points (order link, WhatsApp link, origin/farm, roast notes) owed by
Priya — the Content Agent is barred from inventing them. Orchestrator escalated with the structured format.

### 3b — Unblocked / Approved
**File:** [dawn-blend-launch-FINAL.md](dawn-blend-launch-FINAL.md) · **Score:** 24/25 · **Status:** ✅ Approved

Human (simulated) supplied the four values → **Content fill-in pass** (insert, not rewrite) →
**Review re-run 24/25 ACCEPTABLE** → Orchestrator assembled the approved package.

Score movement — only the blocked dimension moved:

| Dimension | 3a Blocked | 3b Approved |
|-----------|:---:|:---:|
| Tone match | 5 | 5 |
| Goal connection | 5 | 5 |
| No repetition | 5 | 4 |
| Pillar coverage | 5 | 5 |
| **Usability** | **2** ⛔ | **5** |
| **Total** | **22 BELOW** | **24 ACCEPTABLE** |

## Run 4 — Draft→final flow (real subagents)
**File:** [dawn-blend-launch-draftflow.md](dawn-blend-launch-draftflow.md) · **Scores:** 24/25 DRAFT-ACCEPTABLE → 25/25 FINAL-APPROVED · **Status:** ✅ Approved

Re-run of the live pipeline under the **draft vs. final** review modes added to
[CLAUDE.md](../CLAUDE.md). Research + Strategy reused from Run 3 (unchanged); Content onward re-run live.

| Step | Agent | Result |
|------|-------|--------|
| 4 | content-agent | Draft with human-owed `[TODO]`s → handoff |
| 5 | review-agent (**DRAFT**) | **24/25 DRAFT-ACCEPTABLE** — placeholders logged as Open gaps, not failed; flagged Post 2's weak goal connection |
| — | orchestrator | Pipeline proceeds; escalates to Priya in parallel for the 3 owed inputs |
| — | content-agent | Fill-in pass: inserts supplied values + fixes Post 2 + removes a negated superlative |
| 5′ | review-agent (**FINAL**) | **25/25 FINAL-APPROVED** — full strictness, no placeholders remain |
| 6 | orchestrator | Assembles shipping package |

**The point of this run:** the *same* placeholder `[TODO]`s that hard-failed Run 3a at 22/25 now pass a
**DRAFT** review as noted gaps (24/25), so the pipeline keeps moving while the Orchestrator escalates for
the real values in parallel — instead of the whole run reading as a failure. Strictness returns at the
**FINAL** gate, which only passes once no placeholder remains (25/25). The DRAFT review also caught a
genuine content issue (Post 2 had no push toward the goal), fixed before FINAL.

The FINAL reviewer added a **verification note**, now recorded as a pre-ship gate: the filled values are
demo stand-ins and must be confirmed as genuinely supplied by Priya — if invented, they would retroactively
trip the fabrication gate.

## Run 5 — Cross-domain generalization test (real registered subagents)
**File:** [ruff-day-launch-DRAFT.md](ruff-day-launch-DRAFT.md) · **Score:** 22/25 DRAFT-ACCEPTABLE · **Status:** 📝 Draft record (not shippable)

A **different campaign** — Ruff Day Mobile Grooming, an Austin dog-grooming van — run to confirm the agents
generalize beyond coffee. Different in every dimension: pet-services domain, **friendly/playful** tone,
a **bookings** goal (50 in month one), and a hard **zero-reviews** constraint (brand new business).
First run to invoke the agents by their **registered `subagent_type`** (not the `general-purpose` fallback).

| Step | Agent | Result |
|------|-------|--------|
| 1 | orchestrator | Built the brief from a raw request; locked goal + playful tone; flagged booking-link `[TODO]` |
| 2 | research-agent | Domain-native insight — anxious/senior dogs, van logistics, *trust-without-social-proof* as #1 barrier |
| 3 | strategy-agent | Turned the zero-reviews liability into a pillar ("Trust through transparency, not reviews") |
| 4 | content-agent | Playful on-tone posts; met the no-reviews rule head-on; booking link left `[TODO]` |
| 5 | review-agent (**DRAFT**) | **22/25 DRAFT-ACCEPTABLE** — placeholders noted as gaps, not failed |

**What it proves:** the pipeline isn't coffee-specific — every agent re-derived a correct, domain-appropriate
campaign from scratch. It also confirmed the **mechanical rubric is genuinely deterministic**: the reviewer
docked Tone −1 for one ALL-CAPS word ("NOT") and Goal-connection −1 each for two posts lacking a booking
push, citing the exact rules. Open (Sam-owed) gaps: booking link + service-area list — a FINAL review would
hard-fail until they're filled, same as the coffee runs.

*Known tension noted during this run:* the ALL-CAPS deduction fired on playful stylistic emphasis that is
arguably on-brand for a "little playful" tone — the reproducibility-vs-nuance trade-off of mechanical scoring.

---

## Standing caveats (apply to all approved runs)
- **Demo stand-in values.** The order link, WhatsApp link, origin/farm (Finca La Esperanza, Huila,
  Colombia), and roast notes used in Run 3b are illustrative fillers to simulate the unblock — **not
  verified facts**. Confirm real values before any actual launch.
- **Nothing was sent or published.** All WhatsApp/social copy exists as text only. No broadcast,
  post, or message went out. Real distribution needs explicit human go-ahead.
- **Goal and tone held fixed** across every run, per [CLAUDE.md](../CLAUDE.md).

## What the runs collectively prove
1. Full pipeline works end-to-end as real subagents: Research → Strategy → Content → Review → assemble.
2. Quality gate has teeth: Review catches tone breaks, repetition, missing pillars, and fabrication.
3. Error handling is complete: route back → cap at 2 rewrites → escalate with context.
4. Hard lines hold: never fabricate proof, never change goal or tone.
5. Independent reviewers showed real judgment variance (Usability 4/5 vs 2/5 on identical `[TODO]` copy).
   **Resolved:** the rubric is now mechanical — fixed per-defect deductions plus hard-fail gates
   (see [CLAUDE.md](../CLAUDE.md) "Acceptance criteria" and [agents/review-agent.md](../agents/review-agent.md)).
   Under those rules, any live `[TODO]` in a CTA/link caps Usability at 2 and fails outright, so both
   of those runs would now deterministically land BELOW ACCEPTABLE.
6. **Draft vs. final modes** (Run 4) let expected `[TODO]` gaps pass a DRAFT review as noted gaps so the
   pipeline can proceed and escalate in parallel, while the FINAL gate stays strict — only shippable once
   no placeholder remains. Best of both: no premature "failure" on a work-in-progress, no shipping with holes.
