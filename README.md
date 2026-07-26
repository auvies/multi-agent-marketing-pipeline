# Multi-Agent Marketing Team

Turns a basic business request into a **complete, reviewed social media
campaign** using a small team of AI agents. See `CLAUDE.md` for the full rules.

## The team

| Agent | Produces |
|-------|----------|
| Orchestrator | Coordinates all agents; assembles the final package. Never writes research, strategy, or content. |
| Research Agent | Audience insights only |
| Strategy Agent | Objective, main message, content pillars |
| Content Agent | 3 social posts + one WhatsApp message + CTA |
| Review Agent | Score out of 10 + improvements |

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

## Review
The Review Agent scores the campaign **out of 10** against the goal and tone,
flags weak or off-tone lines, and rewrites them directly. Content is
**acceptable at 8/10 or higher**; below that, the flagged parts go back for a
rewrite before the package is assembled. Agents never invent proof — anything
the human still owes is left as a `[TODO]` placeholder. See [CLAUDE.md](CLAUDE.md).

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
See **[outputs/RUN-LOG.md](outputs/RUN-LOG.md)** for an index of earlier runs of
the sample request. Note: those runs were produced under an earlier, stricter
review design (a /25 mechanical rubric with draft/final modes); the current
system scores out of 10. They're kept as a historical record of the pipeline
working end to end — the workflow and roles are unchanged.
