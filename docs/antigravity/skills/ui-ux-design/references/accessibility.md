# Accessibility

Accessibility (a11y) is craft, not a compliance checkbox. Designs that work for people with disabilities
are simply *better* designs — clearer contrast, larger targets, keyboard support, and readable text help
everyone, in bright sun, on a trackpad-less laptop, with a broken arm, or just tired. Around 1 in 6
people have a disability; ignoring them is both wrong and, in many jurisdictions, illegal. Target **WCAG
2.2 Level AA** as the baseline for anything shipping to real users.

## Contents
- [POUR — the four principles](#pour--the-four-principles)
- [Color & contrast](#color--contrast)
- [Keyboard access](#keyboard-access)
- [Screen readers & semantics](#screen-readers--semantics)
- [Forms](#forms)
- [Text, motion & targets](#text-motion--targets)
- [How to check](#how-to-check)

## POUR — the four principles

WCAG organizes everything under four ideas. Keep them in mind and most specifics follow:

- **Perceivable** — users can perceive the content (contrast, text alternatives, captions, not relying
  on color/sound alone).
- **Operable** — users can operate the UI by any input (keyboard, not just mouse; enough time; no
  seizure-inducing flashing; clear focus).
- **Understandable** — content and behavior are predictable and clear (consistent navigation, labeled
  inputs, helpful errors, plain language).
- **Robust** — works with assistive tech now and later (valid, semantic markup; correct roles/names/
  states).

## Color & contrast

- **Text contrast:** normal text ≥ **4.5:1** against its background; large text (≥ 18pt / 24px, or
  ≥ 14pt bold / ~18.66px) ≥ **3:1**. This is the most-violated rule — light-gray-on-white body text is the
  classic failure. Note that small text *inside* an interactive element (a small button label or link)
  still needs 4.5:1.
- **Non-text contrast:** UI components (input borders, toggles), icons that carry meaning, and focus
  indicators need ≥ **3:1** against adjacent colors. A 1px `#eee` border on white fails and effectively
  disappears.
- **Never rely on color alone** to convey information. Color-vision deficiency affects roughly 1 in 12
  men (~8%) and ~1 in 200 women, who can't reliably distinguish red/green error/success by hue. Add an
  icon, label, pattern, or text. A red field also needs an error message; a green "valid" also needs a
  checkmark.
- **Don't disable focus outlines** without replacing them with something equally visible. Use
  `:focus-visible` so the ring shows for keyboard users without cluttering mouse clicks.
- Check contrast with a tool (below) rather than trusting your eye — monitors and lighting deceive.

## Keyboard access

Many users can't or don't use a mouse (motor disabilities, screen-reader users, power users, temporary
injuries). Everything must work from the keyboard.

- **Everything operable by mouse must be operable by keyboard** — activate with Enter/Space, navigate
  with Tab/Shift+Tab and arrow keys (within composite widgets like menus, tabs, listboxes).
- **Logical focus order** that follows the visual/reading order. Don't let DOM order diverge from visual
  order in a way that scrambles tabbing.
- **Visible focus indicator** on every interactive element — a clear ring/outline meeting 3:1 contrast.
  Losing track of focus makes keyboard use impossible.
- **No keyboard traps** — focus can always move out of a component. Conversely, *do* trap focus inside an
  open modal (and return it to the trigger on close) so users don't tab into the hidden page behind it.
- **Skip link** ("Skip to main content") as the first focusable element on content-heavy pages, so
  keyboard users bypass repeated nav.
- Use real interactive elements (`<button>`, `<a href>`) — they're keyboard-operable for free. A
  `<div onclick>` is not.

## Screen readers & semantics

- **Semantic HTML is 90% of screen-reader accessibility.** Use `<button>`, `<a>`, `<nav>`, `<main>`,
  `<header>`, `<footer>`, `<h1>`–`<h6>` in order, lists for lists, and `<label>` for inputs. Native
  elements announce their role, name, and state automatically. This is less work *and* more accessible
  than div-soup + ARIA.
- **ARIA only to fill gaps**, never as a substitute for semantics. First rule of ARIA: don't use ARIA if
  a native element does the job. When you must (custom widgets, live regions), use the correct
  role/state (`aria-expanded`, `aria-selected`, `aria-current`) and keep it in sync with the visual
  state. Wrong or stale ARIA is worse than none.
- **Accessible names for everything interactive.** Icon-only buttons need `aria-label` or visually-hidden
  text. Images need `alt` describing their purpose (empty `alt=""` for purely decorative images so
  they're skipped).
- **Landmarks & headings** give screen-reader users a map to navigate by. One `<h1>` per page/view, no
  skipped heading levels, meaningful section landmarks.
- **Live regions** (`aria-live`) to announce async changes (toasts, validation results, loading
  completion) that a sighted user sees but a screen-reader user would otherwise miss.

## Forms

Forms are a top accessibility pain point. Get these right:

- **Every field has a programmatically-associated `<label>`** (`for`/`id` or wrapping). Placeholder text
  is *not* a label — it vanishes on input and usually fails contrast.
- **Errors are announced and associated** with their field (`aria-describedby`), stated in plain
  language, and explain *how to fix*, not just "invalid." Don't rely on red color alone — include text
  and ideally an icon.
- **Group related fields** with `<fieldset>`/`<legend>` (e.g. a set of radio options).
- **Instructions and required-field indicators** are perceivable and not color-only. Mark required fields
  with the native `required` attribute (use `aria-required` only for custom, non-native widgets) plus
  visible text or `*` — not just a red asterisk with no explanation.
- Preserve input on error; never make users re-type everything.

## Text, motion & targets

- **Respect user text sizing / zoom.** Layouts must survive 200% text resize (SC 1.4.4) *and* reflow at
  400% zoom / 320px width without horizontal scrolling (SC 1.4.10) — two distinct AA criteria — plus user
  text-spacing overrides (SC 1.4.12), all without clipping or overlap. Use relative units (rem/em); avoid
  fixed pixel heights on text containers. On native, support Dynamic Type (iOS) / font-scale (Android).
- **`prefers-reduced-motion`:** provide a reduced/none variant of animations for users who get motion
  sickness or vestibular disorders. Large parallax and sweeping transitions are the usual offenders.
- **Target size:** WCAG 2.2 SC 2.5.8 (AA) requires interactive targets of at least **24×24 CSS px** —
  *unless* they have ~24px of spacing around them, or fall under exceptions (inline links, essential, or
  user-agent-controlled targets). The stronger **44×44** figure is SC 2.5.5 (Enhanced, AAA), which backs
  the ~44–48px mobile recommendation. Bigger, well-spaced targets help everyone.
- **Readable text:** sufficient size (≥ 16px body on web is a good floor), adequate line-height and
  measure, and don't set body text in thin weights or low-contrast grays.

## How to check

Automated tools catch maybe a third of issues; the rest need a human pass. Do all three:

1. **Automated scan** — axe DevTools, Lighthouse, or WAVE for contrast, missing labels/alt, ARIA misuse,
   heading order. Fast first pass.
2. **Keyboard walkthrough** — unplug the mouse and Tab through the whole flow. Can you reach and operate
   everything? Is focus always visible and logically ordered? Can you escape modals? This catches what
   scanners can't.
3. **Screen-reader smoke test** — VoiceOver (macOS/iOS), NVDA (Windows), or TalkBack (Android). Does each
   control announce a meaningful name, role, and state? Do dynamic changes get announced? Even five
   minutes surfaces the big problems.

Design accessibly from the start — retrofitting is far more expensive than getting contrast, semantics,
labels, and focus right the first time.
