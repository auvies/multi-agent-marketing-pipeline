# Rewrite-Loop Demo — Dawn Blend Launch

> This file demonstrates the error-handling loop in `CLAUDE.md`:
> **"If the Review Agent scores below acceptable, the Orchestrator sends the
> flagged section back to the responsible agent for a rewrite."**
>
> Same brief, same Research and Strategy. The Content Agent's **first draft is
> deliberately weak**. Watch Review reject it, the Orchestrator route it back,
> and the rewrite pass.

**Goal (unchanged):** Sell 300 bags in launch week.
**Tone (unchanged):** Calm, honest, slightly nerdy — no hype, no "world's best" claims.

---

## Round 1

### 3. Campaign Content — DRAFT 1
_(Content Agent — first attempt)_

#### Social Posts
1. Dawn Blend is the **BEST COFFEE IN THE WORLD** 🔥🔥 You have NEVER tasted anything this good. Trust us, nothing else compares!!!
2. The world's greatest coffee is finally here. Nothing beats Dawn Blend. Best coffee ever, period.
3. Wake up to amazing coffee. Amazing taste, amazing mornings, amazing everything. So amazing.
4. Studies show 9 out of 10 coffee experts rank Dawn Blend #1 worldwide. The data doesn't lie!
5. Buy now. Best coffee. World's best. Don't miss out on the greatest coffee on earth.

#### WhatsApp Message
> 🚨🚨 HUGE NEWS!!! The BEST coffee in the WORLD is here!!! Buy Dawn Blend NOW before you regret it forever!!! 🔥🔥🔥

#### Call to Action
Buy the world's best coffee now!!!

**Handoff to Review Agent:** All five posts + WhatsApp done, pushing hard on quality.

---

### 4. Review — DRAFT 1
_(Review Agent)_

- **Tone match:** 1/5 — Hype-heavy, all-caps, emoji spam, superlatives. Directly violates the "calm, honest, no 'world's best' claims" tone. This alone fails the brief.
- **Goal connection:** 2/5 — Posts assert greatness but give the audience no concrete reason to buy; weak tie to the 300-bag goal beyond "buy now."
- **No repetition:** 1/5 — Posts 1, 2, 3, and 5 all repeat the same "best coffee in the world" idea. No distinct pillars.
- **Pillar coverage:** 1/5 — None of the four strategy pillars (effortless, traceable, WFH ritual, direct & fair) appear.
- **Usability:** 1/5 — Post 4 invents a fake "9 out of 10 experts / studies show" statistic — a fabrication banned by CLAUDE.md. Not shippable.
- **Overall: 6/25 — BELOW ACCEPTABLE**

### Improvement Notes
- **[All posts] Tone** — Strip hype, caps, emoji, and every "world's best" claim. Rewrite calm, plain, slightly nerdy.
- **[Posts 1/2/3/5] Repetition** — Give each post one distinct pillar; stop repeating "best coffee."
- **[Post 4] Fabrication** — Delete the invented "9 out of 10 experts" statistic entirely. No fake proof.
- **[Pillars] Coverage** — Rebuild around the four pillars from Strategy.

**Handoff to Orchestrator:** Score 6/25, below acceptable. Content Agent must rewrite the entire content section. Flagged: tone, repetition, fabrication, missing pillars.

---

### Orchestrator action
_(Per CLAUDE.md error handling)_

> Review scored 6/25 (below acceptable). Routing the **entire Campaign Content
> section back to the Content Agent** for rewrite. Goal and tone unchanged.
> Research and Strategy stand — only content is redone.
>
> **Handoff to Content Agent:** Redo all posts + WhatsApp. Match the calm/honest/
> nerdy tone exactly, one pillar per post (no repeats), delete the fabricated
> stat, and cover all four pillars. This is rewrite **1 of max 2**.

---

## Round 2 (rewrite)

### 3. Campaign Content — DRAFT 2
_(Content Agent — rewrite)_

#### Social Posts
1. **[Effortless mornings]** You don't need an espresso machine to drink well. Dawn Blend is a light roast built for the brewer you already own — drip, pour-over, or French press. Good coffee, minus the learning curve.
2. **[Honest & traceable]** Single-origin means we can tell you exactly where this coffee comes from and how it's roasted — no vague "premium blend" language. Light, bright, and clean. `[TODO: origin name + roast notes]`
3. **[The WFH ritual]** The commute is gone, but the morning still deserves a start. Grind, brew, first sip, then open the laptop. Dawn Blend is for people who decided working from home shouldn't mean worse coffee.
4. **[Direct & fair]** $18 a bag, shipped straight to your door. No café markup, no distributor in the middle — just coffee, from us to your kitchen.
5. **[Effortless + launch]** Dawn Blend is live this week: a light-roast single-origin made for home mornings and the brewer on your counter. If you've meant to upgrade the first cup of the day, this is the easy version. `[TODO: link]`

#### WhatsApp Message
> Morning ☕ Dawn Blend is officially live — our light-roast single-origin, made for home brewing, no fancy gear needed. $18 a bag, shipped to you. Launch week is on; grab yours here: `[TODO: link]`. — Priya

#### Call to Action
**Order your first bag of Dawn Blend — $18, shipped direct.** `[TODO: order link]`

**Handoff to Review Agent:** Rewrite complete. Post 1 effortless, 2 traceable, 3 WFH ritual, 4 direct/fair, 5 effortless+launch. Hype and fake stat removed; `[TODO]`s mark real proof/links for Priya.

---

### 4. Review — DRAFT 2
_(Review Agent)_

- **Tone match:** 5/5 — Calm, plain, quietly nerdy. No hype or superlatives.
- **Goal connection:** 4/5 — Every post supports launch-week sales; direct ask carried by Posts 4/5 + WhatsApp.
- **No repetition:** 5/5 — Each post owns a distinct pillar.
- **Pillar coverage:** 5/5 — All four pillars present; main message expressed.
- **Usability:** 4/5 — Clear CTA and working WhatsApp; open `[TODO]`s flagged, not faked.
- **Overall: 23/25 — ACCEPTABLE**

### Improvement Notes
- Fill `[TODO]`s (origin name, roast notes, order link) before publishing.

**Handoff to Orchestrator:** Score 23/25, acceptable. Rewrite loop resolved in 1 of 2 allowed rounds. Clear to assemble.

---

## Provenance
- **Research / Strategy:** unchanged from the main run.
- **Content Agent:** Draft 1 (6/25, rejected) → Draft 2 rewrite (23/25, accepted).
- **Review Agent:** scored both drafts; triggered one rewrite.
- **Orchestrator:** enforced error handling — routed the flagged content section back for rewrite (round 1 of 2), then accepted. Goal and tone unchanged throughout.

### What this demo proves
1. Review **catches** tone violations, repetition, missing pillars, and fabrication.
2. A below-acceptable score **routes the flagged section back** to the responsible agent.
3. The rewrite is **re-scored**, and the loop closes within the 2-round limit.

---
---

# Demo B — When rewrites don't resolve (escalation)

> The first demo closed in one rewrite. This one shows the other branch: a
> blocker the Content Agent **cannot fix on its own**, so both rewrites fail and
> the Orchestrator escalates to the human per CLAUDE.md's rewrite cap.
>
> **The trap:** the brief's proof points are still `[TODO]` (no real origin
> name, no stats), but the aggressive 300-bags-in-a-week goal keeps pulling the
> copy toward claims it can't back up. Content is stuck between fabricating
> (banned) and being too thin to convert.

## Round 1 — Content Draft 1
_(Content Agent)_

Post 3 leans on conviction it doesn't have:
> "Rated the smoothest light roast our customers have ever had — 200+ five-star
> mornings and counting."

**Review:** Usability 1/5 — invents a "200+ five-star" testimonial count that
appears nowhere in the brief. Fabrication. **Overall 11/25 — BELOW ACCEPTABLE.**
**Orchestrator:** Rewrite **1 of 2** — remove all invented proof.

## Round 2 — Content Draft 2 (rewrite)
_(Content Agent)_

Fabrication removed, but with no real proof to substitute and a hard sales
goal, the posts go vague and low-conviction:
> "It's a nice coffee. You might like it. Give it a try sometime."

**Review:**
- Goal connection: 2/5 — "might like it / sometime" undercuts a launch-week sales push.
- Usability: 3/5 — no fake proof now, but nothing persuasive to act on.
- **Overall: 18/25 — BELOW ACCEPTABLE** (under the 20 bar; goal connection below 3).

**Orchestrator:** That was rewrite **2 of 2**. Cap reached — do not loop again.
The real blocker isn't the writing; it's a **missing input** (no proof point)
against an aggressive goal. Escalate.

---

## Escalation to Human
_(Orchestrator output — per `agents/orchestrator.md`)_

**Status:** Blocked — rewrite cap reached (2 rewrites, still below acceptable).
**Section:** Campaign Content (social posts)
**Responsible agent:** Content
**Latest score:** 18/25 (acceptable = 20/25, no dimension below 3)

### Flagged problems (from Review)
- Goal connection — 2/5: copy is too tentative to drive 300 launch-week sales.
- Usability — 3/5: no persuasive, truthful proof point to act on.

### Rewrite history
- Attempt 1 — leaned on a "200+ five-star" testimonial count — **fabrication** — 11/25.
- Attempt 2 — stripped all claims, went vague to avoid fabricating — **too weak** — 18/25.

### What the human needs to decide
The content can be **honest** or **high-conviction**, but not both without a
real proof point. Priya must either:
- **(a)** supply a genuine proof point (real origin/farm name, roast notes, or
  early-taster quotes we're allowed to use), **or**
- **(b)** accept a lower-pressure, brand-first launch that leads on story and
  transparency rather than a hard sell, **or**
- **(c)** soften the 300-bags-in-week-one target for the organic-only channel mix.

**Handoff to Human:** Need a real proof point (a) — or a decision to go
brand-first (b) or adjust the goal (c) — before content can pass Review.

### What Demo B proves
1. The cap is a **hard stop at 2 rewrites** — no infinite loop.
2. Escalation uses the **structured format**, naming the true blocker (a missing
   input), not just "the copy is bad."
3. The system **refuses to fabricate** to hit a number — it escalates instead.
