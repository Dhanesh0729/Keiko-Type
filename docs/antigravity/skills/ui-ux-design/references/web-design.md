# Web Design

Designing and building for the browser. Assumes the craft in `design-foundations.md`; this covers what's
specific to the web.

## Contents
- [Responsive & mobile-first](#responsive--mobile-first)
- [Modern CSS you should be using](#modern-css-you-should-be-using)
- [Styling approach & tokens](#styling-approach--tokens)
- [Page archetypes](#page-archetypes)
- [Navigation patterns](#navigation-patterns)
- [Forms on the web](#forms-on-the-web)
- [Performance & perceived speed](#performance--perceived-speed)
- [Framework & tooling notes](#framework--tooling-notes)

## Responsive & mobile-first

- **Design mobile-first.** Start at the smallest viewport and enhance upward. It forces you to
  prioritize content and produces simpler, more robust layouts. Retrofitting a desktop design down to
  mobile almost always produces a cramped compromise.
- **Break at content, not at devices.** Add a breakpoint when the layout *starts to look bad*, not at a
  fixed list of phone/tablet/laptop widths. That said, common anchor points (~640, 768, 1024, 1280px)
  are fine defaults and match Tailwind's `sm/md/lg/xl`.
- **Fluid over fixed.** Prefer fluid units and intrinsic sizing so layouts flex between breakpoints
  instead of jumping. `clamp()` for fluid type/spacing, `%`/`fr`/`minmax()` for fluid tracks, `min()`/
  `max()` for guardrails. The goal is a design that's comfortable at *every* width, not just three.
- **Test the extremes.** 320px narrow phones and ultra-wide monitors both exist. Cap content width on
  wide screens (don't let text lines run 200 characters) and make sure nothing overflows at 320px.
- **Touch and pointer coexist.** Even on the web, assume touch. The WCAG 2.2 minimum target is 24×24 CSS
  px (with spacing exceptions), but aim for comfortable ~44–48px targets for primary touch controls (see
  `accessibility.md`). No hover-only functionality — hover doesn't exist on touch, so make it an
  enhancement, not a requirement.

## Modern CSS you should be using

Reach for the platform before a library — modern CSS removes most reasons for heavy tooling.

- **Layout:** Flexbox for one-dimensional rows/stacks; CSS Grid for two-dimensional layouts and whole
  page structure. `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))` gives responsive card
  grids with no media queries. `gap` for spacing between flex/grid children (never margin hacks).
- **Fluidity:** `clamp(min, preferred, max)` for type and spacing that scale with the viewport. Container
  queries make *components* respond to their container's width rather than the viewport — the modern
  answer to truly reusable responsive components. (Set `container-type: inline-size` on the parent to
  establish the context *before* `@container` rules apply — the most common gotcha — and use `cqi`/`cqw`
  units for container-relative sizing.)
- **Selection & state:** `:has()` (the "parent selector") for state-driven styling without JS;
  `:focus-visible` for focus rings that show for keyboard but not mouse; logical properties
  (`margin-inline`, `padding-block`) for RTL-safe, writing-mode-agnostic layout.
- **Color & theming:** CSS custom properties for tokens; `color-mix()` and OKLCH for deriving tints and
  ensuring perceptually even ramps; `light-dark()` and `prefers-color-scheme` for theming.
- **Don't over-reach:** avoid absolute positioning for layout, fixed pixel heights that clip content,
  and `!important` chains. Let content define height; let the browser reflow.

## Styling approach & tokens

- **Respect the existing stack.** If the project uses Tailwind, CSS Modules, styled-components,
  vanilla-extract, or plain CSS — match it. Don't introduce a second styling paradigm.
- **Tailwind** is an excellent default for new work: encode your design tokens in `tailwind.config`
  (colors, spacing scale, radius, fonts, shadows) so utilities *are* the system, and utilities stay on
  scale by construction. Extract repeated utility clusters into components, not `@apply` soup.
- **Plain CSS / no framework:** define tokens as custom properties on `:root` (and a `[data-theme]`
  override for dark mode), then reference them everywhere. This is the cleanest tokenization and needs
  no build step.
- Either way, the rule is the same: **spacing, color, type, and radius come from named tokens, not
  magic numbers scattered through the markup.** See `design-systems.md`.

## Page archetypes

Each has a conventional structure users expect — meet the expectation, then refine.

- **Landing / marketing:** a focused hero (one headline stating the value, one primary CTA, supporting
  visual), then alternating content sections with generous vertical rhythm, social proof, and a closing
  CTA. One primary conversion action, repeated; don't scatter competing CTAs. Strong typographic
  hierarchy carries these pages.
- **Dashboard / analytics:** information density done well. Establish a scannable grid of cards/widgets,
  put the most important metric top-left, use restrained color (let the *data* be the color, keep chrome
  neutral), and align numbers with tabular figures. Provide filters, date ranges, and empty/loading
  states for every widget. Reserve saturated color for a single status semantic (alert / positive) and
  keep everything else grayscale, so the meaningful color reads instantly.
- **App shell (web app):** persistent nav (top bar and/or sidebar) framing a content area. Keep chrome
  quiet so content dominates. Handle responsive collapse of the sidebar into a drawer/toggle.
- **E-commerce:** product grids with consistent card shape, clear price/CTA, fast filtering, and a
  frictionless cart/checkout. Use consistent aspect-ratio product images, quick-add on hover/tap, and a
  sticky add-to-cart on the mobile product page; trust signals (reviews, security, returns) matter as much
  as layout.
- **Content / docs / blog:** reading-first. Constrain measure to ~65ch, strong heading hierarchy,
  comfortable line-height, generous paragraph spacing, and a table of contents / clear nav for long
  content. Typography *is* the design here.

## Navigation patterns

- **Top nav bar** for a handful of primary destinations; collapse to a hamburger/drawer on mobile only
  when items genuinely don't fit (a visible tab bar beats a hidden menu when space allows).
- **Sidebar** for apps with many sections; support collapse to icons, and make the current section
  obviously active. On mobile, becomes an off-canvas drawer.
- **Breadcrumbs** for deep hierarchies so users know where they are and can jump up.
- **Always show current location.** The active nav item must be visually distinct. "Where am I?" is the
  most common navigation failure.
- Keep primary navigation consistent across every page — moving or restyling it per page destroys the
  user's mental map.

## Forms on the web

Forms are where usability is won or lost. See `accessibility.md` for the a11y specifics; design-wise:

- Labels *above* fields by default (fastest to scan, best on mobile); never rely on placeholder-as-label
  (disappears on input, fails contrast, hurts a11y). Inline labels are acceptable in dense settings UIs.
  Single column for scannability, but group naturally-paired short fields (first/last, city/state/ZIP)
  onto one row; keep the whole form as short as possible.
- Right-size inputs to their content (a ZIP field shouldn't be as wide as an address field) — it signals
  expected input.
- Use the correct input `type`/`inputmode`/`autocomplete` so mobile shows the right keyboard and
  browsers autofill. This is free, huge UX.
- Validate inline and forgivingly: validate on blur or submit (not on every keystroke), show errors *at*
  the field in plain language with how to fix, and never clear the user's input on error.
- Disable/spinner the submit button during submission to prevent double-submits, and confirm success
  clearly.

## Performance & perceived speed

Speed is UX. A gorgeous page that loads slowly feels cheap.

- **Prevent layout shift (CLS):** reserve space for images (width/height or aspect-ratio), fonts, and
  async content. Content jumping as it loads is jarring and makes people mis-click.
- **Optimize images:** modern formats (WebP/AVIF), responsive `srcset`/`sizes`, lazy-load below-the-fold,
  and never ship a 4000px image into a 400px slot.
- **Fonts:** limit weights and prefer variable fonts. `font-display: swap` avoids invisible text (FOIT)
  but *causes* layout shift unless you pair it with a metric-matched fallback (`size-adjust` /
  `ascent-override`, or a framework helper like `next/font`) — otherwise it fights the CLS goal above. For
  shift-critical text, `font-display: optional` or a matched fallback is safer, and self-hosting a subset
  font often beats preloading a whole family.
- **Perceived performance:** skeletons that match the final layout, optimistic UI, and instant feedback
  on interaction matter more to *felt* speed than raw milliseconds. Never leave a click unacknowledged.

## Framework & tooling notes

- **React / Next.js:** compose small, single-responsibility components; keep styling co-located with the
  component; derive variants from props (see component architecture in `design-systems.md`). Server
  components / SSR for content pages (SEO, first paint); client components for interactivity.
- **shadcn/ui + Radix + Tailwind** is a strong, accessible default for new React apps: unstyled,
  accessible primitives (Radix) you own and theme via tokens. Good when you want control and
  accessibility without building every primitive.
- **Component libraries** (MUI, Ant, Chakra, Mantine) speed up internal tools and dashboards; theme them
  to your tokens rather than accepting defaults, or the product looks like the library.
- **Semantic HTML first.** Use real `<button>`, `<a>`, `<nav>`, `<main>`, `<label>`, headings in order.
  It's better for accessibility, SEO, and behavior than a pile of styled `<div>`s — and it's less code.
