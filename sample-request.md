# Sample Request

> A worked example to test the system end to end. The Orchestrator turns this
> into `prompts/project-brief.md`, then runs the fixed workflow.

---

**From:** Priya, founder of a small coffee brand

> Hey team — we're launching **"Dawn Blend,"** a light-roast single-origin
> coffee for people who work from home and want a better morning cup without a
> barista. It's $18 a bag, ships direct.
>
> I need a **social media campaign** to drive first-week sales: a handful of
> social posts plus a WhatsApp message for our subscriber list. We're **calm,
> honest, slightly nerdy about coffee — no hype, no "world's best" claims.**
>
> Goal: **300 bags sold in launch week.** Mostly organic social + a WhatsApp
> broadcast list of about 800 people.

---

## How the Orchestrator maps this to the brief

| Brief field | From the request |
|-------------|------------------|
| Request | Social campaign: several posts + one WhatsApp message |
| Product | "Dawn Blend" light-roast single-origin, $18/bag, direct-to-consumer |
| Campaign goal | 300 bags sold in launch week |
| Tone (exact) | Calm, honest, slightly nerdy — no hype, no superlative claims |
| Audience hints | Work-from-home coffee drinkers wanting quality without effort |
| Channels | Organic social + WhatsApp list (~800) |

## Expected flow (fixed order)

1. **Orchestrator** builds the brief from this request.
2. **Research** → audience insights, ends with `Handoff to Strategy Agent:`.
3. **Strategy** → objective, main message, content pillars → `Handoff to Content Agent:`.
4. **Content** → social posts + WhatsApp message + CTA → `Handoff to Review Agent:`.
5. **Review** → score out of 25 + improvement notes → `Handoff to Orchestrator:`.
6. **Orchestrator** assembles the final package to `outputs/dawn-blend-launch.md`,
   including: audience insights, objective, main message, pillars, posts,
   WhatsApp message, CTA, review score, and improvement notes.
