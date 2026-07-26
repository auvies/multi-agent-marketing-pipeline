# Multi-Agent Marketing Team

## Project Purpose
This project builds a small team of AI agents that turns a basic business
request into a complete, reviewed social media campaign.

## Agent Roles
- Orchestrator: coordinates all agents, assembles the final package. Never
  writes research, strategy, or content itself.
- Research Agent: produces audience insights only.
- Strategy Agent: produces campaign objective, main message, and 2–3 content pillars.
- Content Agent: writes 3 social posts and one WhatsApp message.
- Review Agent: scores the content out of 10 and improves it.

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
- No agent invents facts (stats, reviews, quotes, links). Anything the human
  must supply is left as a `[TODO: …]` placeholder — never fabricated.

## Output Format
Final package must include: audience insights, campaign objective, main
message, content pillars, 3 social posts, one WhatsApp message, one call to
action, review score (out of 10), and improvement notes.

## Quality Standards
- Content must match the stated tone exactly.
- No repeated ideas across posts.
- Every post must connect back to the stated goal.

## Acceptance
The Review Agent scores the campaign out of 10. Content is **acceptable at
8/10 or higher**. Below that, the flagged parts go back for a rewrite before
the Orchestrator assembles the final package.

## Error Handling
- If an agent's output is missing required information, the Orchestrator
  asks that agent to redo its step before moving on.
- The Review Agent rewrites weak or off-tone lines directly. If the campaign
  still scores below acceptable, the Orchestrator sends the flagged section
  back to the responsible agent once more, then escalates to the human with
  the current score and what's blocking.

## Handoff Rules
Each agent must end its output with a clear "Handoff to [next agent]:"
line summarizing what the next agent needs to know.

## Folder Structure
See agents/ for job descriptions, prompts/project-brief.md for shared
input, and outputs/ for finished campaigns.
