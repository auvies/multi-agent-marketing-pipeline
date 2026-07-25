# Multi-Agent Marketing Team

## Project Purpose
This project builds a small team of AI agents that turns a basic business
request into a complete, reviewed social media campaign.

## Agent Roles
- Orchestrator: coordinates all agents, assembles the final package. Never
  writes research, strategy, or content itself.
- Research Agent: produces audience insights only.
- Strategy Agent: produces campaign objective, message, and content pillars.
- Content Agent: writes social posts and a WhatsApp message.
- Review Agent: scores and improves the final content.

## Workflow Order (fixed — do not skip or reorder)
1. Orchestrator reads the user request and builds the project brief.
2. Research Agent returns audience insights.
3. Strategy Agent returns the campaign strategy.
4. Content Agent returns draft content.
5. Review Agent scores and improves the content.
6. Orchestrator combines everything into the final package.

## Shared Rules
- Every agent reads the same project brief (prompts/project-brief.md).
- Every agent does only its own job — no agent skips ahead or repeats
  another agent's work.
- Every handoff must pass the full brief plus the previous agent's output.
- The original campaign goal and tone may never be changed by any agent.

## Output Format
Final package must include: audience insights, campaign objective, main
message, content pillars, social posts, one WhatsApp message, one call to
action, review score, and improvement notes.

## Quality Standards
- Content must match the stated tone exactly.
- No repeated ideas across posts.
- Every post must connect back to the stated goal.

## Acceptance criteria (mechanical)
The Review Agent scores five dimensions 0–5 (total /25) using **fixed deductions,
not judgement calls** — the exact per-dimension rules live in
`agents/review-agent.md`. Content is **ACCEPTABLE** only when all three hold:
1. Total ≥ **20/25**, and
2. no single dimension below **3**, and
3. no hard-fail gate fired.

**Hard-fail gates** (any one → BELOW ACCEPTABLE, regardless of total):
- **Fabrication** — any stat, testimonial, award, quote, or claim not in the brief.
- **Live placeholder** — any `[TODO]`/placeholder left in a shipping element (a CTA,
  an order/join link, or a claim presented as final).
- **Altered goal or tone** — either changed from the brief.
- **Missing deliverable** — fewer social posts than strategy pillars, or the WhatsApp
  message or the CTA absent.

## Review modes: draft vs. final
Every review runs in one of two modes; the Orchestrator states which.
- **DRAFT** — while iterating, before the human has supplied outstanding brief inputs.
  The **live-placeholder** gate is relaxed: a `[TODO]` standing in for a value the human
  still owes (a proof point or link the brief marks as theirs) is a **noted gap, not a
  fail**, and does not cap Usability. All other hard-fail gates (fabrication, altered
  goal/tone, missing deliverable) still apply in full. Passing verdict: **DRAFT-ACCEPTABLE**.
- **FINAL** — before shipping. Full strictness: **every** hard-fail gate applies,
  including any live placeholder. Passing verdict: **FINAL-APPROVED**.

A campaign may be assembled into the shipping package **only after a FINAL-APPROVED
review**. DRAFT-ACCEPTABLE lets the pipeline proceed (and lets the Orchestrator escalate
in parallel for the missing human inputs) but is never shippable on its own. If the mode
is unstated, review as **FINAL**.

## Error Handling
- If an agent's output is missing required information, the Orchestrator
  asks that agent to redo its step before moving on.
- If the Review Agent scores below acceptable, the Orchestrator sends the
  flagged section back to the responsible agent for a rewrite.
- **Rewrite cap:** a flagged section may be sent back at most **twice**. If it
  still scores below acceptable after the second rewrite, the Orchestrator
  stops the loop and **escalates to the human**, reporting the current score,
  the flagged section, and what each rewrite attempted.

## Handoff Rules
Each agent must end its output with a clear "Handoff to [next agent]:"
line summarizing what the next agent needs to know.

## Folder Structure
See agents/ for job descriptions, prompts/project-brief.md for shared
input, and outputs/ for finished campaigns.
