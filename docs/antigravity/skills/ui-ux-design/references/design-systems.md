# Design Systems & Tokens

A design system is the upstream source of consistency. When architecting a new design, establish the
system *before* placing components — screens assembled from a coherent system look designed; screens
styled ad-hoc look assembled. When adapting, learn the existing system and extend it faithfully.

## Contents
- [Why & when](#why--when)
- [Design tokens: the three tiers](#design-tokens-the-three-tiers)
- [Token categories](#token-categories)
- [Theming & dark mode](#theming--dark-mode)
- [Component architecture](#component-architecture)
- [Adopting or extending an existing system](#adopting-or-extending-an-existing-system)
- [Established systems: when to reach for each](#established-systems-when-to-reach-for-each)

## Why & when

A design system buys **consistency** (everything feels like one product), **speed** (compose from parts
instead of reinventing), and **scale** (change a token, update everywhere). You don't need a giant
system for a small job — but you *always* need the foundations (a spacing scale, a type scale, a
palette, radii/shadows). Even a one-page site benefits from defining those five things up front, because
it's what keeps the output coherent.

Scale the formality to the task: a landing page needs tokens + a few components; a product needs a real
component library with documented variants and states.

## Design tokens: the three tiers

Tokens are named design decisions — the atoms of the system. Structure them in tiers so the system is
both consistent and themeable. This indirection is what makes theming, dark mode, and rebrands trivial
instead of a find-and-replace nightmare.

1. **Primitive / global tokens** — the raw palette. Context-free values:
   `blue-500: #3b82f6`, `gray-900: #111827`, `space-4: 16px`, `radius-md: 8px`. A complete scale for
   each dimension. Components never reference these directly.
2. **Semantic / alias tokens** — meaning mapped onto primitives:
   `color-bg-surface → gray-50`, `color-text-primary → gray-900`, `color-action-primary → blue-500`,
   `color-border-default → gray-200`. Components reference *these*. Semantic tokens are the seam where
   theming happens — flip them for dark mode and everything follows.
3. **Component tokens** (optional, for large systems) — per-component overrides:
   `button-primary-bg → color-action-primary`. Useful when a component needs to diverge without touching
   global semantics.

The golden rule: **components consume semantic tokens, semantic tokens point at primitives** — reserve
raw hex/pixel values for genuinely one-off or optical-correction cases, not everyday component styling.
This tiered structure maps onto the emerging **W3C Design Tokens (DTCG)** format that Style Dictionary,
Figma Variables, and Tokens Studio consume, so authoring tokens this way keeps them portable across
tools.

## Token categories

Define these dimensions; each should be a small, deliberate scale (see `design-foundations.md` for the
craft behind each):

- **Color** — neutral ramp, one brand ramp, semantic set (success/warning/error/info), plus semantic
  roles (bg/surface/text/border/action and their `on-` pairs and states like hover/active/disabled).
- **Typography** — font families, a modular size scale, weights, line-heights, letter-spacing; ideally
  bundled into named text styles (`heading-lg`, `body`, `caption`).
- **Spacing** — the one true spacing scale (multiples of 4), used for padding, margin, and gap.
- **Radius** — a small set (`sm`, `md`, `lg`, `full`).
- **Shadow / elevation** — 2–4 levels, consistently applied.
- **Motion** — duration and easing tokens (`duration-fast: 150ms`, `ease-standard`).
- **Breakpoints** and **z-index** layers — named, not scattered magic numbers.
- **Border widths, opacity, icon sizes** — small scales as needed.

Encode tokens in whatever the stack uses: CSS custom properties on `:root`; a Tailwind theme (the
`@theme` CSS block in Tailwind v4, or the `tailwind.config` theme in v3); a JS/TS theme object; Style
Dictionary; or platform resources (Android `colors.xml`/theme, iOS asset catalog + a Swift constants
file). The principle is identical everywhere: one named source of truth.

## Theming & dark mode

Because components reference semantic tokens, a theme is just a different mapping of semantic → primitive.

- **Light/dark:** define both mappings for every semantic token. Dark mode is not an inversion — use
  dark-gray surfaces (not `#000`), de-saturate accents (bright hues vibrate on dark), soften text to
  off-white, and show elevation with lighter surfaces rather than heavier shadows. Re-verify contrast in
  *both* themes.
- **Multi-brand / white-label:** swap the primitive palette (or the seed color) behind stable semantic
  tokens; components don't change.
- **Same seam, more themes:** the semantic-token indirection also enables density variants
  (comfortable/compact) and a **high-contrast / forced-colors** theme. Test against OS forced-colors mode
  (the `forced-colors` media feature / Windows High Contrast), where the system overrides your colors.
- Drive theme from `prefers-color-scheme` by default and let users override; persist the choice.

## Component architecture

Design components as small systems, not one-offs. For each meaningful component, define its full matrix:

- **Anatomy** — the parts (a button = container + label + optional icon + optional loading spinner).
- **Variants** — semantic kinds: `primary`, `secondary`, `tertiary/ghost`, `destructive`. One primary
  emphasis per context.
- **Sizes** — a small set (`sm`, `md`, `lg`) sharing the spacing/type scale.
- **States** — *design every one*: default, hover, focus (visible ring), active/pressed, disabled,
  loading, selected, error. Missing states are where UIs feel unfinished. This is the single most
  common gap in AI-generated components.
- **Composition** — prefer composable primitives (a `Card` with `CardHeader`/`CardBody`/`CardFooter`
  slots) over monolithic components with 20 props. Composition scales; prop-explosion doesn't.
- **Consistency** — a new component should reuse existing tokens and patterns so it looks native to the
  system on arrival.

## Adopting or extending an existing system

When the project already has a design language (the common case — always check first):

1. **Audit before touching anything.** Find the token definitions (theme file, CSS vars, Tailwind
   config, `colors.xml`, asset catalog), the component library, and a few representative screens. Read
   how spacing, type, color roles, radii, and naming actually work in practice.
2. **Match the conventions exactly** — the existing spacing scale, naming pattern, file structure, and
   component API. New work should be indistinguishable from what's there.
3. **Reuse before you create.** Compose from existing components; only add a new one when nothing fits,
   and build it in the system's style using its tokens.
4. **Extend, don't fork.** Need a new color or size? Add it to the token scale following the existing
   pattern, don't introduce a parallel system. Deviations from an established system should be *deliberate
   and justified* — an intentional improvement or a genuine gap, never accidental drift — and a full
   restyle only when the user wants a redesign.

## Established systems: when to reach for each

Don't reinvent a design system when a mature one fits — but theme it to the brand so the product doesn't
look stock.

- **Material Design 3** — Android-first, and a solid cross-platform choice; great when you want dynamic
  color and a complete, documented component set.
- **Apple HIG** — the standard for native Apple platforms; use it for anything that should feel like iOS/
  macOS.
- **Tailwind CSS** — not a component library but an excellent token/utility foundation for custom web
  design; pairs with headless primitives.
- **Radix UI / shadcn/ui** — unstyled, accessible React primitives you own and theme; the strong default
  for custom, accessible web apps.
- **Ant Design / MUI** — component-catalog React libraries (large sets of ready-made components); fast for
  dashboards and internal tools. **Chakra / Mantine** — more style-prop / primitive-oriented, giving
  composable building blocks with less opinionated chrome. Theme any of them to your tokens, or the
  product looks generic.
- **Carbon (IBM), Polaris (Shopify), Fluent (Microsoft), Primer (GitHub)** — mature, opinionated systems
  worth studying and, in their ecosystems, using directly.

Pick based on platform, how much you need to customize, and whether accessibility is built in. When the
brief calls for a distinctive look, a headless/token approach (Tailwind + Radix, or a custom system)
gives the most control; when speed matters most, a batteries-included library wins.
