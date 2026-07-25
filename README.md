# Multi-Agent Marketing Team

Turns a basic business request into a **complete, reviewed social media
campaign** using a small team of AI agents. See `CLAUDE.md` for the full rules.

## The team

| Agent | Produces |
|-------|----------|
| Orchestrator | Coordinates all agents; assembles the final package. Never writes research, strategy, or content. |
| Research Agent | Audience insights only |
| Strategy Agent | Objective, main message, content pillars |
| Content Agent | Social posts + one WhatsApp message |
| Review Agent | Score + improvements |

## Fixed workflow

```
Orchestrator builds brief
      → Research (audience insights)
      → Strategy (objective, message, pillars)
      → Content (posts + WhatsApp)
      → Review (score + improve)
      → Orchestrator assembles final package
```

The order never changes. Every handoff passes the full brief plus the previous
agent's output, and every agent ends with a `Handoff to [next agent]:` line.

## Review runs in two modes: draft → final
The Review Agent scores content on a mechanical rubric (five dimensions, /25, with
fixed deductions and hard-fail gates — see [CLAUDE.md](CLAUDE.md)). It runs in one of
two modes, which the Orchestrator states:

- **DRAFT** — while the human still owes brief inputs. An expected `[TODO]` (a real
  proof point or link the brief marks as theirs) is logged as a *noted gap*, not a
  failure, so the pipeline can keep moving while the Orchestrator escalates for those
  values in parallel. Passing verdict: **DRAFT-ACCEPTABLE**.
- **FINAL** — before shipping. Full strictness: any leftover placeholder hard-fails.
  Passing verdict: **FINAL-APPROVED** — and only FINAL-APPROVED content may be assembled
  into the shipping package.

This keeps a work-in-progress from being branded a failure just for having expected
gaps, while still refusing to ship a campaign with holes. (Fabrication and any change to
the goal or tone hard-fail in *both* modes.)

## Final package includes
Audience insights · campaign objective · main message · content pillars ·
social posts · one WhatsApp message · one call to action · review score ·
improvement notes.

## Project layout
```
CLAUDE.md              master rules every agent obeys
README.md              this file
agents/                the five job descriptions
prompts/project-brief.md   shared input all agents read
outputs/               finished campaigns (see outputs/RUN-LOG.md for the index)
sample-request.md      example request to test with
```

## Try it
1. Read `sample-request.md`.
2. Have the Orchestrator build `prompts/project-brief.md` from it.
3. Run the fixed workflow in `agents/orchestrator.md`.
4. Find the finished campaign in `outputs/`.

## Worked examples
See **[outputs/RUN-LOG.md](outputs/RUN-LOG.md)** for a consolidated index of every
run of the sample request — the baseline campaign, the rewrite-loop and escalation
demos, the live end-to-end run using the real subagents (blocked at 22/25, then
approved at 24/25 once the missing inputs were supplied), and the draft→final run
(DRAFT-ACCEPTABLE at 24/25 with open gaps, then FINAL-APPROVED at 25/25 after fill-in).
