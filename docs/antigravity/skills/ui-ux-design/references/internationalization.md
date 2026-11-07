# Internationalization (i18n) & RTL

If a product ships in more than one language, i18n is a design concern, not just an engineering one.
Clipped translated labels, un-mirrored right-to-left layouts, and hard-coded date formats are among the
most common ways otherwise-good UI breaks in production. Design for it from the start — retrofitting is
painful.

## Contents
- [Text expansion](#text-expansion)
- [Right-to-left (RTL)](#right-to-left-rtl)
- [Bidirectional text](#bidirectional-text)
- [Locale formatting](#locale-formatting)
- [Scripts & fonts](#scripts--fonts)
- [Design & build practices](#design--build-practices)

## Text expansion

Translated text is rarely the same length as the English source. German, Finnish, and Russian commonly run
**30–40%+ longer**; short UI strings can double. CJK languages are often shorter but taller.

- **Never size a container to fit the English string.** Design layouts that flex — allow labels, buttons,
  menu items, and headings to grow without breaking. Avoid fixed-width buttons and tight single-line
  containers where a translation will overflow.
- **Plan how overflow behaves** (wrap, or truncate with a tooltip) — and prefer wrapping for
  content-bearing text. Test with a long-language pseudo-locale (or literally paste a German translation)
  to catch clipping.
- Avoid concatenating sentence fragments in code ("You have " + n + " items") — grammar and word order
  differ per language; use full, parameterized strings with proper pluralization instead.

## Right-to-left (RTL)

For Arabic, Hebrew, Persian, and Urdu, the entire layout mirrors — this is far more than `text-align`:

- **Mirror the layout**: navigation, columns, back/forward, progress, and reading order flow right-to-left.
  The primary action, logo, and starting point move to the right.
- **Mirror directional icons** (back/forward arrows, indent, list bullets, breadcrumb chevrons, send).
  Do *not* mirror non-directional or universal icons (play button by convention stays, clocks, logos,
  checkmarks, most media controls) — mirroring those confuses.
- **Use CSS logical properties** (`margin-inline-start`, `padding-inline`, `inset-inline`, `text-align:
  start`) instead of physical left/right, so layout flips automatically with `dir="rtl"`. This is the
  single biggest lever for RTL-safe CSS (see `web-design.md`).
- Numbers and embedded LTR content (code, URLs, brand names) stay LTR within RTL text — see bidi below.

## Bidirectional text

Mixed-direction runs (an English product name or a phone number inside an Arabic sentence) need correct
**bidi** handling so characters don't reorder wrongly. Rely on the platform's Unicode bidi algorithm, set
`dir="auto"` on user-generated content whose direction is unknown, and isolate embedded opposite-direction
runs so punctuation and adjacency stay correct.

## Locale formatting

Formats are not universal — never hard-code them:

- **Dates**: order (D/M/Y vs M/D/Y vs Y/M/D), separators, and month/day names differ. `03/04` is
  ambiguous across locales. Use the platform's locale-aware formatter (e.g. `Intl.DateTimeFormat`).
- **Numbers**: decimal and thousands separators swap (`1,234.56` vs `1.234,56`); some locales use spaces.
- **Currency**: symbol, its position (before/after), and spacing vary; show the currency explicitly in
  multi-currency contexts.
- **Time, units, first day of week, name order** all vary. Use locale-aware APIs (`Intl.*`, platform
  equivalents), not manual string building.

## Scripts & fonts

- **Font coverage**: your chosen typeface must include the target scripts (CJK, Arabic, Cyrillic, Devanagari,
  Thai…). Many display fonts don't; fall back to well-designed system or Noto fonts for those scripts.
- **Line height and vertical rhythm** often need to increase for scripts with tall glyphs or complex
  diacritics (Arabic, Thai, Devanagari) — Latin-tuned tight line-heights can clip them.
- Don't assume uppercase exists (CJK has no case) — `text-transform: uppercase` is meaningless or harmful
  in some scripts; don't rely on it for hierarchy universally.

## Design & build practices

- **Externalize all strings** — no user-facing text baked into images or hard-coded in components — so it
  can be translated. Give translators context (where the string appears, what the variables are).
- **Design with a pseudo-locale** (lengthened, accented text and a mirrored layout) early, so expansion and
  RTL problems surface before launch, not after.
- **Icons and imagery**: prefer culturally neutral symbols; be aware colors, gestures, and imagery carry
  different meanings across cultures. Avoid text embedded in graphics.
