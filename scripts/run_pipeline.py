#!/usr/bin/env python3
"""
run_pipeline.py — drive the marketing multi-agent pipeline with the Claude Agent SDK.

Runs the fixed workflow (Research -> Strategy -> Content -> Review) end to end,
invoking the project's registered subagents in `.claude/agents/`, threading each
agent's output into the next, then parses the review score and reports pass/fail.

This is the automated counterpart to driving the agents by hand: the Agent SDK's
main loop plays the Orchestrator and delegates to each specialist subagent.

Usage:
    python scripts/run_pipeline.py                 # review in DRAFT mode (default)
    python scripts/run_pipeline.py --mode final    # review in FINAL mode (strict)
    python scripts/run_pipeline.py --assemble       # also write the package to outputs/

Prereqs:
    pip install claude-agent-sdk
    # plus the Claude Code CLI the SDK drives, and ANTHROPIC_API_KEY (or `claude` login)

Exit code: 0 if the review is acceptable for the chosen mode, 1 otherwise.
"""

import argparse
import asyncio
import re
import sys
from pathlib import Path

from claude_agent_sdk import (
    AssistantMessage,
    ClaudeAgentOptions,
    ResultMessage,
    TextBlock,
    query,
)

# Project root = the directory that contains .claude/agents and prompts/.
ROOT = Path(__file__).resolve().parent.parent

# Acceptance thresholds — keep in sync with CLAUDE.md "Acceptance criteria".
ACCEPT_TOTAL = 20
ACCEPT_MIN_DIMENSION = 3


def _options() -> ClaudeAgentOptions:
    """Shared options: load the project's .claude/agents subagents, run unattended."""
    return ClaudeAgentOptions(
        cwd=str(ROOT),
        # Load .claude/agents (and project settings) so the registered subagents
        # — research-agent, strategy-agent, content-agent, review-agent,
        # orchestrator — are available to delegate to.
        setting_sources=["project"],
        # Unattended run: don't block on tool-permission prompts. The specialist
        # agents are read-only (Read/Grep/Glob); only the orchestrator writes.
        permission_mode="bypassPermissions",
        allowed_tools=["Read", "Grep", "Glob", "Task", "Write", "Edit"],
    )


async def run_step(title: str, prompt: str) -> str:
    """Run one pipeline step as a single query; return the final assistant text."""
    print(f"\n{'=' * 70}\n{title}\n{'=' * 70}")
    chunks: list[str] = []
    async for message in query(prompt=prompt, options=_options()):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    chunks.append(block.text)
        elif isinstance(message, ResultMessage):
            # ResultMessage.result holds the final text of the turn.
            if getattr(message, "result", None):
                chunks.append(message.result)
    text = "\n".join(c for c in chunks if c).strip()
    print(text)
    return text


def parse_scores(review_text: str) -> tuple[int | None, list[int]]:
    """Pull the overall /25 total and the per-dimension x/5 scores from a review."""
    total = None
    m = re.search(r"(\d{1,2})\s*/\s*25", review_text)
    if m:
        total = int(m.group(1))
    dims = [int(x) for x in re.findall(r"(\d)\s*/\s*5", review_text)]
    return total, dims


def is_acceptable(total: int | None, dims: list[int], review_text: str) -> bool:
    """Apply the mechanical acceptance gate. Verdict string wins if present."""
    upper = review_text.upper()
    if "BELOW ACCEPTABLE" in upper:
        return False
    if "FINAL-APPROVED" in upper or "DRAFT-ACCEPTABLE" in upper:
        return True
    # Fall back to the numeric gate if no verdict keyword was found.
    if total is None:
        return False
    return total >= ACCEPT_TOTAL and all(d >= ACCEPT_MIN_DIMENSION for d in dims)


async def main(mode: str, assemble: bool) -> int:
    brief_path = ROOT / "prompts" / "project-brief.md"
    if not brief_path.exists():
        print(f"ERROR: {brief_path} not found. Build the brief first.", file=sys.stderr)
        return 2

    # Step 2 — Research
    insights = await run_step(
        "STEP 2 — research-agent",
        "Use the research-agent subagent to produce Audience Insights for the "
        "current campaign in prompts/project-brief.md. Return the subagent's "
        "output verbatim as your entire response, with no preamble.",
    )

    # Step 3 — Strategy
    strategy = await run_step(
        "STEP 3 — strategy-agent",
        "Use the strategy-agent subagent to produce the Campaign Strategy "
        "(objective, main message, content pillars) from prompts/project-brief.md "
        "and the Audience Insights below. Return its output verbatim.\n\n"
        f"=== AUDIENCE INSIGHTS ===\n{insights}",
    )

    # Step 4 — Content
    content = await run_step(
        "STEP 4 — content-agent",
        "Use the content-agent subagent to write the Campaign Content (social "
        "posts, one WhatsApp message, one CTA) from the strategy below. Leave any "
        "human-owed proof/link as a [TODO] placeholder; do not fabricate. Return "
        "its output verbatim.\n\n"
        f"=== CAMPAIGN STRATEGY ===\n{strategy}",
    )

    # Step 5 — Review (mode-aware)
    review = await run_step(
        f"STEP 5 — review-agent ({mode.upper()} mode)",
        f"Use the review-agent subagent to score the Campaign Content below in "
        f"{mode.upper()} mode against prompts/project-brief.md and the strategy. "
        "Apply the mechanical rubric exactly. Return its Review verbatim.\n\n"
        f"=== CAMPAIGN STRATEGY ===\n{strategy}\n\n"
        f"=== CAMPAIGN CONTENT ===\n{content}",
    )

    total, dims = parse_scores(review)
    ok = is_acceptable(total, dims, review)

    print(f"\n{'=' * 70}\nRESULT\n{'=' * 70}")
    print(f"Mode:        {mode.upper()}")
    print(f"Total score: {total if total is not None else 'unparsed'}/25")
    print(f"Dimensions:  {dims}")
    print(f"Verdict:     {'ACCEPTABLE' if ok else 'BELOW ACCEPTABLE'}")

    if ok and assemble:
        await run_step(
            "STEP 6 — orchestrator (assemble)",
            "Use the orchestrator subagent to assemble the approved run into "
            "outputs/<campaign-slug>.md, including every required Output-Format "
            "element and a Provenance section. Use the strategy, content, and "
            "review already produced this run.\n\n"
            f"=== STRATEGY ===\n{strategy}\n\n=== CONTENT ===\n{content}\n\n"
            f"=== REVIEW ===\n{review}",
        )

    return 0 if ok else 1


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Run the marketing pipeline via the Agent SDK.")
    ap.add_argument("--mode", choices=["draft", "final"], default="draft",
                    help="Review mode (default: draft).")
    ap.add_argument("--assemble", action="store_true",
                    help="On an acceptable review, assemble the package to outputs/.")
    args = ap.parse_args()
    raise SystemExit(asyncio.run(main(args.mode, args.assemble)))
