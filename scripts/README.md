# scripts/ — automated pipeline runner

`run_pipeline.py` runs the marketing multi-agent workflow end to end using the
**[Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk)**, instead of you
driving each agent by hand in a Claude Code session.

## What it does

Runs the fixed workflow automatically, invoking the project's registered subagents
in [`.claude/agents/`](../.claude/agents/):

```
Research → Strategy → Content → Review → (optional) assemble
```

The Agent SDK's main loop acts as the Orchestrator and **delegates to each
specialist subagent** — this is the piece the interactive session can't do on its
own (a subagent can't call another subagent, but the SDK's main loop can call them
all). The script threads each agent's output into the next, parses the review
score, prints a PASS/FAIL summary, and **exits non-zero when the review is below
acceptable** — so it works as a CI check.

## Setup

```bash
pip install -r scripts/requirements.txt
```

The SDK drives the Claude Code CLI under the hood, so you also need the `claude`
CLI available and authenticated (an `ANTHROPIC_API_KEY` env var, or a completed
`claude` login).

## Run

```bash
python scripts/run_pipeline.py                 # review in DRAFT mode (default)
```

```bash
python scripts/run_pipeline.py --mode final    # strict FINAL-mode review
```

```bash
python scripts/run_pipeline.py --assemble       # on pass, write the package to outputs/
```

It reads the current campaign from [`prompts/project-brief.md`](../prompts/project-brief.md),
so build/point the brief at the campaign you want before running.

## Notes & knobs

- **Unattended by design.** It runs with `permission_mode="bypassPermissions"` so
  it never blocks on tool prompts. The specialists are read-only (Read/Grep/Glob);
  only `--assemble` (the orchestrator) writes files.
- **Single source of truth.** Subagents are loaded from `.claude/agents/` via
  `setting_sources=["project"]` — the same definitions you use interactively, not a
  second copy.
- **Score parsing is tolerant.** It keys off the verdict string
  (`DRAFT-ACCEPTABLE` / `FINAL-APPROVED` / `BELOW ACCEPTABLE`) and falls back to the
  numeric gate (≥20/25, no dimension <3) from `CLAUDE.md`.
- **Language.** This is the Python SDK; the same flow exists in the TypeScript SDK
  (`@anthropic-ai/claude-agent-sdk`) if you'd rather run it in Node.
