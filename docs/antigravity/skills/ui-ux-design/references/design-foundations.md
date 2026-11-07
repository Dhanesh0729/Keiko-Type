# Design Foundations

The universal craft that applies to every platform. This is where average output becomes crafted
output. Read the section you need; each explains *why* the rule exists so you can apply judgment rather
than follow it blindly.

## Contents
- [Spacing & rhythm](#spacing--rhythm)
- [Typography](#typography)
- [Color](#color)
- [Layout & grid](#layout--grid)
- [Visual hierarchy](#visual-hierarchy)
- [Depth & elevation](#depth--elevation)
- [Borders, radii & dividers](#borders-radii--dividers)
- [Iconography](#iconography)
- [Imagery](#imagery)
- [Motion](#motion)
- [Content & states](#content--states)

---

## Spacing & rhythm

Spacing is the single highest-leverage thing you control. Consistent, generous spacing is *the* visual
signature of professional work; arbitrary spacing is the clearest tell of amateur work.

- **Use one scale.** Pick a base unit (4px or 8px) and derive everything from it: 4, 8, 12, 16, 24, 32,
  48, 64, 96. Never `13px` or `7px`. A scale creates rhythm the eye reads as intentional even
  subconsciously. Multiples-of-4 is the de facto industry standard because it divides cleanly across
  densities.
- **Be generous.** When unsure, add more space, not less. Crowding destroys perceived quality faster
  than almost anything. Whitespace isn't wasted — it directs attention, groups content, and signals
  confidence. When a layout feels cheap, the fix is usually more space around the key elements, not more
  decoration.
- **Space communicates relationships (proximity).** Elements close together are read as related; far
  apart, as separate. The space *between* a label and its field should be smaller than the space to the
  next field. Getting proximity right does half the work of hierarchy for free.
- **Respect inner vs outer space.** Padding inside a container should relate to the gap between
  containers — usually inner padding ≤ the gap between siblings, so groups stay visually distinct.
- **Density is a deliberate choice.** Consumer/marketing UI breathes (large spacing); data-dense tools
  (dashboards, IDEs, spreadsheets) compress it intentionally. Choose density for the audience, then
  apply it consistently — don't let it drift screen to screen.

## Typography

Type is ~90% of most interfaces. Getting it right does more than any graphic.

- **A modular scale, not a grab-bag.** Derive sizes from a ratio (1.2 minor third, 1.25, or 1.333 for
  more drama): e.g. 12, 14, 16, 20, 24, 32, 48. A body of 16px on the web is the sane default (never
  below 14px for primary reading; 16px avoids mobile-Safari zoom-on-focus). Limit yourself to ~5 sizes
  in one product.
- **Two or three weights.** Regular for body, medium/semibold for emphasis and UI labels, bold for
  headings. More weights rarely help; they muddy hierarchy. Avoid ultra-thin weights for small text —
  they fail on low-quality screens and for low-vision users.
- **Line height.** Body text wants ~1.4–1.6; the smaller the text, the more it needs. Headings want
  tighter (~1.1–1.25) because large text already has visual mass. Set line-height unitless so it scales
  with size.
- **Line length (measure).** ~45–75 characters per line for body. Longer and the eye loses its place
  returning to the next line; much shorter and rhythm breaks. Constrain with `max-width` (roughly
  `60–75ch`), not by luck.
- **Hierarchy through contrast, not count.** Distinguish levels with clear jumps in size *and/or*
  weight *and/or* color, not a dozen slightly-different sizes. Two well-differentiated levels beat five
  mushy ones. Use color/opacity (a lighter gray for secondary text) as a hierarchy tool too.
- **Alignment.** Left-align by default (or right in RTL). Center only short runs (a hero headline, an
  empty-state message) — centered body text is hard to read because each line starts at a different
  place. Avoid justified text on the web; it creates ugly rivers of whitespace.
- **Pairing.** One typeface, well-used, is safe and clean. If pairing, contrast roles clearly (e.g. a
  characterful display face for headings + a neutral, highly-legible sans for body). Match x-heights
  and moods. When in doubt, use a single high-quality variable font (Inter, Geist, and the platform
  system fonts are reliable defaults).
- **Numbers & data.** Use tabular (monospaced) figures for tables and anything that must align in
  columns, so digits don't jitter.

## Color

Color is where amateur work most often goes loud and inconsistent. Discipline reads as quality.

- **Structure the palette.** Build in tiers:
  1. **Neutrals** — a ramp of grays (often 9–11 steps from near-white to near-black) that does the vast
     majority of the work: backgrounds, text, borders, surfaces.
  2. **One brand/accent hue** — with its own ramp of tints and shades — for primary actions and
     identity. A second accent only if the product genuinely needs it.
  3. **Semantic colors** — success (green), warning (amber), error (red), info (blue) — each a small
     ramp, used *only* for meaning.
- **Let neutrals dominate; keep the accent scarce.** Neutrals carry the vast majority of the UI —
  surfaces and text are *almost all* neutral — while the accent appears rarely (often just a few percent:
  a primary button, a link, an active state) precisely so it still commands attention. The old 60-30-10
  rule is a loose intuition borrowed from interior design; don't treat "10% accent" as a target to hit, or
  the interface goes loud. When unsure, use less accent, not more.
- **Avoid pure black and pure white.** `#000` on `#fff` is harsh and vibrates. Use a very dark gray/blue
  for text (e.g. `#111`–`#1a1a1a`) and an off-white or faintly tinted surface. Slightly desaturating
  and warming/cooling neutrals toward the brand hue makes a palette feel cohesive and designed.
- **Derive, don't collect.** Generate tints/shades from base hues (adjust lightness/saturation in
  HSL/OKLCH) rather than eyedropping unrelated colors. OKLCH gives perceptually even ramps. Cohesive
  palettes share underlying hue relationships.
- **Contrast is non-negotiable.** Body text ≥ 4.5:1 against its background; large text and UI
  components/icons ≥ 3:1 (WCAG AA). Check it — don't eyeball it. See `accessibility.md`.
- **Never rely on color alone.** Colorblind users and grayscale contexts exist. Pair color with an
  icon, label, shape, or position (e.g. error = red *and* an icon *and* text).
- **Dark mode is a re-mapping, not an inversion.** The full treatment lives in `design-systems.md`
  (§ Theming & dark mode); the short version: dark-gray surfaces (not pure black), de-saturated accents
  (bright colors vibrate on dark), off-white text, elevation shown by *lighter* surfaces, and re-checked
  contrast — all driven from semantic tokens so you flip roles rather than scatter overrides.

## Layout & grid

- **Grids create order.** A column grid (12 columns is the web convention; 4–8 on mobile) with
  consistent gutters keeps everything aligned and makes responsive behavior predictable. Content doesn't
  need to fill every column — align *to* the grid.
- **Alignment is a promise.** Every element should align to something. A shared left edge for a stack, a
  shared baseline for a row. Ragged, unaligned edges read as broken even when nothing is technically
  wrong.
- **Optical over mathematical alignment.** Trust the eye. Circular icons, glyphs like triangles/play
  buttons, and text with ascenders/descenders often need a nudge to *look* centered even when they're
  mathematically off. Center a play triangle by its visual mass, not its bounding box.
- **Balance & focal point.** Distribute visual weight so no corner feels heavy and empty. Establish one
  clear focal point (hierarchy, below), then arrange supporting elements around it.
- **Constrain width.** Full-bleed text and forms on wide screens are unusable. Cap content width and
  center it; let backgrounds go edge-to-edge while content stays in a comfortable measure.
- **White space is structural.** Use it to chunk the page into scannable regions. A page is a hierarchy
  of grouped spaces, not a uniform field of stuff.

## Visual hierarchy

The viewer should, in under a second, know where to look first, second, third. You control this with:

- **Size** — bigger = more important. The biggest thing is seen first.
- **Weight & color** — bolder and higher-contrast pulls forward; lighter grays recede to secondary.
- **Space** — isolation draws the eye; a lone element in whitespace outranks one in a crowd.
- **Position** — top and left (in LTR) are seen first; the optical center commands attention.
- **Contrast against surroundings** — the accent-colored button in a neutral field wins instantly.

**One primary action per view.** Style exactly one action as primary (solid, accent-filled); make
secondary actions quieter (outline/ghost/text). Two competing "primary" buttons cancel out and leave
the user unsure. This single rule fixes a huge share of confusing screens.

## Depth & elevation

- **Elevation should mean something.** A shadow says "this floats above the page" — a menu, a modal, a
  card that lifts on hover. Don't shadow things that don't lift.
- **One or two soft levels, applied consistently.** Define a small elevation scale (e.g. resting, raised,
  overlay) and reuse it. A single soft, low-opacity shadow with a slight vertical offset looks modern;
  multiple heavy dark shadows look dated and muddy. A realistic shadow often stacks two layers (a soft
  ambient shadow plus a tighter, closer one).
- **Tint shadows toward the surface, not pure black.** `rgba(0, 0, 0, α)` shadows read grey and muddy — a
  common tell of generic work. Nudge the shadow color toward the background or brand hue (a darkened,
  slightly desaturated version of the surface beneath) so depth reads as real light rather than a smudge.
- **Often you don't need a shadow at all.** A 1px border, a subtle background-tint change, or spacing
  separates regions more crisply than a shadow — especially in dense or flat/minimal designs. Reach for
  the lightest tool that does the job.
- **In dark mode, elevate with light,** not shadow — higher surfaces get slightly lighter backgrounds.

## Borders, radii & dividers

- **Pick one radius language.** A consistent corner radius (e.g. 8px for cards/inputs, fully-round for
  pills/avatars) unifies a UI. Mixing 4px, 6px, 11px radii randomly looks careless. Nested elements:
  inner radius = outer radius − the inset between the two corners (clamped at 0), so they stay concentric;
  when the inset meets or exceeds the outer radius, the inner corner should be square.
- **Borders vs shadows vs fills.** Three ways to separate regions. Borders are crisp and flat; shadows
  imply elevation; fills (a tinted surface) group calmly. Choose per intent and use sparingly — a page
  boxed in borders everywhere feels like a spreadsheet.
- **Dividers are a last resort.** Whitespace usually separates content better than a line. Use dividers
  only when space alone is ambiguous, and keep them low-contrast (a light neutral, not black).

## Iconography

- **One set, one style.** Use a single icon library (outline *or* filled, consistent stroke width) —
  don't mix Material, SF Symbols, and random SVGs. Consistency of stroke and corner style matters as
  much as the glyphs themselves. Reliable sets: Lucide/Feather, Heroicons, Material Symbols, SF Symbols
  (Apple platforms), Phosphor.
- **Size and align with text.** Icons in labels/buttons should optically match the cap height of
  adjacent text and sit on its baseline/center. Give a consistent icon box (e.g. 20 or 24px).
- **Icons need labels.** Icon-only controls are ambiguous except for a tiny set of universal ones
  (search, close, menu). Add a visible label or at minimum an accessible name/tooltip.

## Imagery

- **Consistent aspect ratios and treatment.** Pick ratios (16:9, 4:3, 1:1) and stick to them; enforce
  with `object-fit: cover`. A grid of mismatched image shapes looks broken.
- **Always reserve space.** Set width/height or an aspect-ratio box so images don't cause layout shift
  (CLS) as they load. Provide a placeholder (blurred, skeleton, or solid tint).
- **Never distort.** Crop, don't stretch. Distorted faces and logos are instantly noticeable.
- **Legible overlays.** Text over images needs a scrim (gradient or semi-opaque layer) or it fails
  contrast on light parts of the photo.

## Motion

- **Motion earns its place by explaining change.** A menu should appear to come *from* the button; a new
  item should slide in so the user tracks where it landed; a deletion should animate out so it's clear
  what left. Motion that doesn't clarify is decoration — cut it.
- **Fast and eased.** UI transitions live around 150–250ms; large or entering elements can take a touch
  longer, exits should be quicker. Use ease-out for things entering (decelerate into place) and standard
  easing over linear. Linear motion feels robotic. For interactive, gesture-driven, or playful movement —
  especially on native — spring/physics-based easing feels more natural than a fixed cubic-bezier (iOS uses
  springs by default; on the web, Framer Motion or CSS `linear()` springs).
- **Animate cheap properties.** Prefer `transform` and `opacity` (GPU-composited, smooth) over animating
  layout properties like width/height/top, which cause janky reflows.
- **Respect `prefers-reduced-motion`.** Some users get motion sickness from large movement. Provide a
  reduced variant (fade instead of slide, or no transition) — it's a one-media-query win.

## Content & states

Interfaces fail in the states designers forget. The happy path is the easy 20%.

- **Design real content.** Use realistic strings, names, numbers, and lengths — not "Lorem ipsum" or
  "Title goes here." Real content surfaces the truncation, wrapping, and alignment problems that dummy
  text hides. Design around the messiest realistic data, not the tidiest.
- **The four states every data-bearing view needs:**
  - **Empty** — first-run or no-results. This is an opportunity, not a dead end: explain what goes here
    and offer the action to create the first item. A blank screen feels broken.
  - **Loading** — skeletons that mirror the eventual layout beat spinners (they set expectations and
    reduce perceived wait and layout shift). For quick loads, show nothing rather than a flash.
  - **Error** — say what went wrong in plain language and how to recover (retry, contact, go back). Never
    a raw stack trace or a dead end.
  - **Ideal/populated** — the happy path, but stress-tested with *one* item and with *hundreds*.
- **Edge cases to always check:** very long text (names, titles, URLs) and how it truncates or wraps;
  zero / one / many; the smallest and largest supported viewport; slow and offline networks; missing
  images/avatars; RTL and long-word languages (German) if relevant.
- **Feedback for every action.** Every user action gets an immediate, visible response — hover, active,
  focus, loading, success, disabled. Silence after a click makes users click again. Optimistic UI
  (update immediately, reconcile later) makes interfaces feel instant.
