# Deliverables

This skill produces four kinds of output. Choose per task; when the request is ambiguous, pick the most
useful default and offer the others. Whatever you produce, the craft in `design-foundations.md` and the
final quality gate in `SKILL.md` still apply.

## Contents
- [Choosing the deliverable](#choosing-the-deliverable)
- [Working front-end code](#working-front-end-code)
- [Design specs & rationale](#design-specs--rationale)
- [Visual mockups](#visual-mockups)
- [Design critique / audit](#design-critique--audit)

## Choosing the deliverable

- **Working code** — the user is building a real product, says "build / make / implement / add," or is in
  a codebase. Default here when in doubt and the context is a real app.
- **Design specs** — the user is planning, needs a design system or handoff doc, is deciding *what* to
  build before building, or asks for a "design," "spec," "plan," or "wireframe."
- **Mockups** — the user wants to *see* options fast, compare directions, or get a visual without
  committing to code ("show me," "what could this look like," "mock up").
- **Critique / audit** — the user shares existing UI and wants it evaluated or improved ("review,"
  "critique," "what's wrong with," "make this better").

These combine: often the best answer is a short rationale + working code, or two mockups + a
recommendation.

## Working front-end code

The default deliverable for real products. It must be genuinely good, not a sketch.

**Pick the tech by context:**
- **Respect the existing stack first** — match the framework, styling approach, and component library
  already in the repo. Introducing a second paradigm is a defect.
- **No stack yet?** Pick the lightest tool that fits the scale. A single self-contained **HTML/CSS/JS**
  file for a static page, demo, or small interactive widget — it just opens, no build step. Reach for
  **React + Tailwind** (optionally shadcn/ui + Radix for accessible primitives) only for a genuine
  multi-view app, and only when the user actually has that build/runtime. The platform's native toolkit
  for native apps.

**Quality bar for code you ship:**
- **Tokenized:** colors, spacing, type, radius, and shadows come from CSS variables / Tailwind theme /
  a theme object — never magic numbers sprinkled through markup. (See `design-systems.md`.)
- **Responsive:** works from ~320px to wide screens; mobile-first; no horizontal scroll or overflow.
- **Semantic & accessible:** real `<button>`/`<a>`/`<nav>`/`<label>`, headings in order, labels on
  inputs, visible focus states, AA contrast, keyboard-operable. (See `accessibility.md`.)
- **All states present:** hover, focus, active, disabled, loading, empty, error — not just the default.
- **Real content:** realistic strings/data, not lorem ipsum or "Card Title"; tested with short and long
  text.
- **Runnable:** self-contained and actually works when opened/run. Include what's needed to see it; don't
  leave `// TODO: style this` in a design deliverable.
- **Clean structure:** small, composable components; variants from props; styling co-located; readable
  and matching the surrounding code's conventions.

Then run the SKILL.md quality gate against the result before delivering.

## Design specs & rationale

When the user needs a plan or handoff rather than code. A good spec is concrete enough to build from and
explains the *why* so decisions survive contact with implementation. Adapt this structure to the task —
don't pad a small ask into a giant document:

```
# [Feature/Product] Design Spec

## Overview & goals
Who uses this, the job they're doing, the context, and what success looks like.

## Information architecture & flow
Structure, navigation, and the key user flows (step by step or a simple flow description).

## Layout & wireframes
What goes where at each breakpoint. Describe regions and hierarchy; ASCII sketches or described
wireframes are fine — the point is structure, not pixels.

## Visual design / tokens
Color roles, type scale, spacing scale, radii, shadows, iconography. The design-system foundations.

## Components
For each key component: anatomy, variants, sizes, and every state (default/hover/focus/active/
disabled/loading/empty/error).

## Responsive & platform behavior
How it adapts across sizes/platforms; what changes at each breakpoint.

## Accessibility notes
Contrast, keyboard flow, screen-reader labels, focus management, motion.

## Rationale
The key decisions and *why* — trade-offs considered, alternatives rejected. This is what makes a spec
trustworthy rather than arbitrary.
```

Use ASCII wireframes for layout when helpful:
```
┌───────────────────────────────────┐
│ Logo            Nav      [Sign in] │  ← header, primary action right
├───────────────────────────────────┤
│   H1 headline (one clear message)  │
│   sub-copy · [ Primary CTA ]       │  ← hero, single focal action
├──────────────┬──────────────┬──────┤
│  feature     │  feature     │ feat │  ← 3-up on desktop, stacks on mobile
└──────────────┴──────────────┴──────┘
```

## Visual mockups

When the user wants to *see* it quickly. The reliable, portable default is a **self-contained HTML file**
(inline `<style>`, minimal JS) the user can open in any browser. If the `visualize` / `show_widget` tool
is available in your environment, use it to render SVG or HTML inline as an enhancement — but never depend
on it; fall back to the standalone file when it isn't present.

- **Make mockups realistic**, not wireframe-gray boxes: real content, correct spacing from the scale,
  actual color palette, true type hierarchy, and representative states. A realistic mockup gets useful
  feedback; a gray-box wireframe gets "looks fine."
- **Show meaningful alternatives** when exploring direction — 2–3 distinct approaches (not
  near-duplicates), each internally coherent, with a one-line note on the concept and a recommendation.
  Distinct directions help the user choose; ten tweaks of one idea don't.
- Keep the widget self-contained (inline styles / a `<style>` block), transparent background, no
  top-level padding, and use CSS variables for theming so it adapts to the host.
- For interactive prototypes (clickable flows, hover/press behavior), HTML + a little JS in the widget
  conveys feel better than a static image.

## Design critique / audit

When evaluating existing UI. Be specific, prioritized, and constructive — a vague "make it pop" helps no
one; "the primary CTA doesn't stand out because three buttons share the same weight — make one solid
accent and demote the rest to ghost" does.

**Start from the job, not the checklist.** For each screen, state the intended user and their primary
task, then judge first whether the design lets them do it. A heuristic sweep ungrounded in the actual
goal produces generic, checklist-y feedback. Rank findings by their impact on that primary task.

**Evaluate against usability heuristics** (Nielsen's ten are the durable checklist): visibility of
system status; match to the real world; user control & freedom (undo, exits); consistency & standards;
error prevention; recognition over recall; flexibility & efficiency; aesthetic & minimalist design;
help users recognize/recover from errors; help & documentation. Plus the craft dimensions from
`design-foundations.md` (spacing, hierarchy, type, color, alignment, states) and the accessibility pass.

**Structure the findings:**
- Lead with what *works* — don't only criticize; note the strengths worth preserving.
- Group issues and **rank by impact**: usability/accessibility blockers first, then clarity/hierarchy,
  then polish. Don't drown a broken flow in nitpicks about border-radius.
- For each issue: what it is, *why* it hurts the user, and a concrete fix (ideally with the specific
  value or pattern to use).
- Offer to implement the top fixes as code or mockups.

## Design QA (implementation vs. intent)

A coding agent can close a loop most design processes can't: checking that the *built* UI matches the
*intended* design. When reviewing an implementation against a spec or design system, audit fidelity — do
spacing, type, and color come from the right tokens (not eyeballed values)? Are all states implemented
(hover/focus/disabled/loading/empty/error), not just the default? Does it hold at every breakpoint and in
both themes? Surface deviations as concrete, prioritized fixes (the wrong value + its location + the
correct token), the same way you'd rank a critique. This is the check that keeps a good design from
quietly eroding as it's coded.
