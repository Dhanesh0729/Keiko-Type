---
name: ui-ux-design
description: >-
  Comprehensive UI/UX design skill for creating and improving interfaces across web, mobile/native
  apps, and desktop software. Use this whenever the user is designing, building, restyling, laying out,
  or critiquing any user interface — landing pages, marketing sites, dashboards, web apps, mobile app
  screens (iOS/Android), desktop applications, or individual components — and whenever they ask to
  "make it look better / modern / premium / cleaner / more professional", pick colors, typography,
  spacing, or layout, improve visual hierarchy or usability, build or extend a design system, or
  produce front-end code, design specs, or mockups. Trigger even when the user never says "UI", "UX",
  or "design" but is clearly working on how a product looks, feels, flows, or is arranged on screen.
  Adapts to an existing design language when one is present; otherwise designs from scratch to a
  senior design-architect standard.
---

# UI/UX Design

Your job with this skill is to produce interface work that a senior product designer would be proud to
ship — not "acceptable," not "it works," but genuinely well-crafted. Most AI-generated UI reads as
generic because it defaults to safe, average choices: three shadows where one would do, five accent
colors, cramped or arbitrary spacing, a wall of same-size text. Great design comes from *judgment and
restraint*, and this skill is the judgment.

## The one idea that matters most

**Design is decisions, and most decisions are subtractive.** Amateurs add — more color, more borders,
more effects, more copy. Professionals remove until only what earns its place remains. Before adding
anything, ask what it's doing for the user. If the answer is "decoration" or "because it looked empty,"
it probably shouldn't be there. Whitespace, a single accent color, and a tight type scale look more
expensive than a busy screen ever will.

Everything below serves that idea.

## First move: adapt or architect

Before designing anything, decide which situation you're in — this changes everything that follows.

**Adapt** — an existing design language is present. Look for it *first*, every time:
- Scan the codebase for design tokens, theme files, CSS variables, Tailwind config, a component
  library, existing screens/pages, brand assets, or a style guide.
- If found, your job is to extend it *invisibly* — new work should look like it was always there. Match
  the existing spacing scale, type scale, color roles, radii, shadow style, motion, and naming. Reuse
  components before creating new ones. Deviating from an established system is a bug, not creativity,
  unless the user explicitly asks for a redesign.
- Nothing-OS, Material, iOS-native, a corporate brand — respect whatever is already there.

**Architect** — no design language exists, or the user wants a fresh one. Now you are the design
architect. Don't reach for the nearest generic template. Make deliberate, coherent choices:
- Establish the foundations first (a spacing scale, a type scale, a restrained palette with one accent,
  a radius and shadow language) *before* placing a single component. A design system is upstream of
  screens. See `references/design-systems.md`.
- Give the work a point of view appropriate to the product — a fintech dashboard, a kids' app, and a
  luxury brand site should not look interchangeable. Derive the tone from the audience and purpose.

When unsure whether a real design language exists, assume adapt and go look. Inventing a new look on
top of an existing one is the most common way this work goes wrong.

## Process

1. **Understand.** Who uses this, to do what, in what context (device, environment, frequency,
   emotional state)? What's the single most important thing they need to do on each screen? Design
   serves a job; a beautiful screen that buries the primary action has failed.
2. **Adapt or architect** (above). Audit for an existing design language before deciding.
3. **Structure before style.** Get information architecture, layout, and hierarchy right in low
   fidelity first — what goes where, what's primary/secondary/tertiary, how the user flows through it.
   Styling a badly structured screen just produces a pretty bad screen.
4. **Apply the craft.** Spacing, type, color, hierarchy, depth — the fundamentals in
   `references/design-foundations.md`. This is where "average" becomes "crafted."
5. **Design the whole state machine.** Real interfaces aren't the happy path. Design empty, loading,
   error, and edge states (zero items, one item, hundreds; short text and text that overflows; slow
   networks; no permission). Unhandled states are where products feel broken.
6. **Verify against the quality gate** (below) and accessibility (`references/accessibility.md`).

Don't skip 3 by rushing to 4. The most common failure is styling before the structure is sound.

## Choosing what to deliver

This skill produces three kinds of output. Pick per task; when in doubt, ask, or default to the most
useful and offer the others. Full guidance in `references/deliverables.md`.

- **Working front-end code** — the default when the user is building a real product or says "build /
  make / implement." Runnable, responsive, accessible, tokenized, with real content and all states. Respect
  the existing stack; if none, pick sensible defaults (see deliverables reference).
- **Design specs & rationale** — when the user needs a plan, a design system, a handoff document, or is
  deciding *what* to build before building it. Structure, tokens, component specs, states, and the
  reasoning behind each decision.
- **Visual mockups** — when the user wants to *see* options quickly without committing to code. Default
  to a self-contained HTML file they can open; use the `visualize` tool (SVG/HTML widgets) as an
  enhancement *if it's available* in your environment. Make mockups realistic: real content, correct
  spacing, true-to-life states.

A design **critique or audit** of existing work is a fourth mode — see the audit section in
`references/deliverables.md` for how to evaluate against usability heuristics and prioritize findings.

## Craft principles (the difference between average and crafted)

These are summarized here; the *why* and the specifics live in `references/design-foundations.md`. Read
it whenever you're doing real visual work — these one-liners are reminders, not the whole story.

- **Space on a system.** Every gap, padding, and margin comes from one scale (typically multiples of 4;
  a common set is 4, 8, 12, 16, 24, 32, 48, 64). Arbitrary spacing (`13px`, `7px`) is the clearest tell
  of amateur work. Be generous — crowding kills perceived quality faster than anything.
- **Limit the type scale.** A handful of sizes on a modular scale, two or three weights, generous
  line-height for body (~1.5), tighter for headings. Line length ~45–75 characters. Hierarchy comes
  from deliberate contrast in size/weight, not from a dozen random sizes.
- **Restrain color.** A neutral foundation (grays) plus *one* accent carries most great interfaces.
  Neutrals dominate; the accent stays scarce (often just a few percent — a button, a link) so it keeps its
  power. Don't chase a fixed accent quota. Add semantic colors (success/warning/error) and stop. Avoid
  pure `#000`/`#fff` — slightly softened neutrals feel more refined. Derive tints and shades from base
  hues rather than picking unrelated colors.
- **One focal point per view.** The eye should know instantly where to go first. Exactly one primary
  action per screen/section, styled to dominate; everything else recedes. Competing emphasis = no
  emphasis.
- **Align to a grid, obsessively.** Things that relate should align on a shared edge or baseline.
  Misalignment reads as sloppiness even when the viewer can't name it. Group by proximity — related
  items close, unrelated items apart.
- **Depth with restraint.** Elevation should mean something (this floats above that). Prefer one or two
  soft, consistent shadow levels over many heavy ones. Often a subtle border or a background tint
  separates regions more cleanly than a shadow.
- **Consistency is invisible quality.** Same radius everywhere, one icon set at consistent size/stroke,
  reused components, predictable interaction patterns. A quick test: if two similar elements differ in
  radius, spacing, or shadow with no functional reason, unify them. Inconsistency is felt as friction even
  when unnoticed.
- **Design with real content.** No lorem ipsum, no "Card Title" placeholders in final work. Real
  strings reveal truncation, wrapping, empty, and overflow problems that dummy text hides. Design
  around the data you'll actually have.
- **Words are part of the design.** Interface copy is designed material, not filler. Button labels name
  the action ("Create project," not "Submit"); errors say what happened and how to fix it; empty states
  guide the next step. Placeholder-grade copy ("Submit," "Something went wrong," "No data") makes crafted
  visuals read cheap. See `references/ux-writing.md`.
- **Motion is functional.** Transitions explain what changed and where things came from. Keep them
  quick (~150–250ms), eased, and subtle; honor `prefers-reduced-motion`. Animation for its own sake is
  noise.

## Platform references

Design *for* the platform, not against it. Users carry deep expectations from their OS and the web;
fighting those conventions costs usability for little gain. Read the file matching the target:

- `references/web-design.md` — responsive layout, modern CSS/Tailwind, web patterns (landing pages,
  dashboards, e-commerce, docs), navigation, performance, framework notes (React/Next, shadcn/ui).
- `references/app-design.md` — mobile & native: iOS Human Interface Guidelines, Android Material Design
  3 (Material You), touch targets, thumb zones, gestures, mobile navigation, cross-platform (React
  Native/Flutter), and how to respect platform identity.
- `references/desktop-design.md` — desktop software: information density, multi-pane layouts, keyboard
  and menus, command palettes, data-heavy tables, platform conventions (macOS/Windows), Electron.
- `references/design-systems.md` — tokens (primitive → semantic → component), theming, dark mode,
  component architecture (variants/sizes/states), and adopting or extending an existing system.
- `references/accessibility.md` — WCAG (target AA), contrast, keyboard access, screen readers, forms,
  motion. Accessibility is craft, not a checkbox: designs that work for everyone are simply better
  designs.

## Specialized topics

Design is more than layout and color. Pull in the relevant file when the task touches these — they're
where "comprehensive" work separates from work that only *looks* finished:

- `references/ux-writing.md` — UX writing / microcopy: voice & tone, button and label wording, empty /
  error / notification copy, sentence case, locale-aware formatting. Words are UI.
- `references/data-viz.md` — data visualization & charts: choosing the right chart for the question,
  color scales, removing chartjunk, direct labeling, accessible charts. Read this for any dashboard,
  analytics, or reporting UI.
- `references/ux-research-ia.md` — user research & information architecture: personas / jobs-to-be-done,
  task flows, navigation models, labeling and grouping by mental model. This feeds the "Understand" and
  "Structure" steps — read it before organizing a complex product.
- `references/internationalization.md` — i18n & RTL: text expansion, full right-to-left mirroring, bidi,
  locale formats, script/font coverage. Read it whenever the product ships in more than one language.
- `references/ai-conversational-ux.md` — AI / agentic & conversational interfaces: streaming, uncertainty
  and sources, confirmation for consequential actions, stop/regenerate, error recovery. The patterns for
  a fast-growing, distinct surface.
- `references/emerging-surfaces.md` — TV / 10-foot, watch/wearable, voice, automotive, and spatial/AR:
  the first principles that transfer when you're asked for a platform the other files don't cover.

## Quality gate (run before calling any UI work done)

Walk this list against what you produced. If something fails, fix it — this is where "good enough"
becomes actually good.

- Does spacing come entirely from one scale, and is the layout generous rather than cramped?
- Is there exactly one clear focal point / primary action per view?
- Is hierarchy carried by a deliberate, limited type scale (a handful of sizes, not a dozen ad-hoc ones),
  with comfortable line length and height?
- Neutral base + roughly one accent? Any color pulling weight it shouldn't?
- Does everything that should align, align? Is related content grouped by proximity?
- Are empty, loading, error, and overflow states designed — not just the happy path?
- Contrast: body/small text ≥ 4.5:1; large text (≥ 24px, or ≥ 18.66px bold) and non-text UI (icons,
  borders, focus rings, controls) ≥ 3:1 — with small text inside controls still at 4.5:1? Visible focus
  states? Full keyboard operation?
- Real content everywhere, tested with both short and long strings?
- Does it look like it belongs to its platform and (if adapting) to the existing product?
- If you removed one more element, color, or effect, would it get worse? If not, remove it.

If the user only wanted a quick answer, don't lecture them through this list — just apply it and
deliver work that quietly passes.
