# Desktop Software Design

Designing desktop applications — native (macOS, Windows, Linux) and Electron/web-desktop (VS Code,
Slack, Figma-style tools). Assumes `design-foundations.md`. Desktop is a different medium from web
pages and phones: large screens, a mouse *and* keyboard, long sessions, and power users who value speed
over hand-holding.

## Contents
- [How desktop differs](#how-desktop-differs)
- [Information density](#information-density)
- [Layout: panels & multi-pane](#layout-panels--multi-pane)
- [Keyboard, menus & command palettes](#keyboard-menus--command-palettes)
- [Data-heavy interfaces](#data-heavy-interfaces)
- [Platform conventions](#platform-conventions)
- [Windowing & chrome](#windowing--chrome)

## How desktop differs

- **Precision input.** A mouse/trackpad allows small, precise targets and hover, so you can afford denser
  UI and richer hover affordances (tooltips, hover toolbars) — but keyboard access must still be
  complete (below).
- **Power users, long sessions.** Desktop tools are often used all day by people who become experts.
  Optimize for efficiency and speed after the learning curve — keyboard shortcuts, batch actions,
  customization — not just first-run friendliness. Progressive disclosure lets novices and experts share
  one UI.
- **Big, resizable canvas.** You have room, but empty acres of space or a single centered column on a
  27" monitor wastes it. Design for a *range* of window sizes, with sensible min sizes and reflow.
- **Multiple windows / documents** may be open at once; design for that reality.

## Information density

Desktop tolerates — and power users prefer — higher density than web/mobile. But density is not the same
as clutter:

- Tighten the spacing scale relative to consumer web, but keep it *systematic* and keep hierarchy
  intact. Dense ≠ cramped-and-random.
- Use grouping, dividers, and subtle background tints to structure dense regions so the eye can still
  parse them at a glance.
- Consider offering a density setting (comfortable / compact) for data tables and lists, as many pro
  tools do.
- Even dense UIs need one clear focal point and breathing room around primary actions.
- **Concrete density levers** (apply while keeping the scale systematic): step vertical padding down (row
  height ~28–32px compact vs ~40px comfortable), tighten the base spacing unit, replace card
  borders/shadows with hairline dividers and background tints, and drop secondary metadata a step down the
  type scale.

## Layout: panels & multi-pane

The dominant desktop pattern is a persistent frame of panels around a central work area:

- **Sidebar / navigator** (left): navigation, file tree, or object list. Often collapsible.
- **Main content / canvas** (center): the primary work surface — the document, editor, or detail view.
- **Inspector / properties** (right): context-sensitive details and settings for the current selection.
- **Toolbar** (top) and **status bar** (bottom): frequent actions and ambient state.
- **Master–detail / split views:** list on one side, detail on the other — the backbone of mail clients,
  settings, file browsers. Selection in the master updates the detail.
- Make panels **resizable and collapsible**, and remember the user's layout between sessions. Respect the
  user's arrangement — don't reset it.

## Keyboard, menus & command palettes

Keyboard support isn't optional on desktop — it's how power users work and how the app stays accessible.

- **Full keyboard operability.** Every action reachable by mouse must be reachable by keyboard. Logical
  tab order, visible focus, no keyboard traps. See `accessibility.md`.
- **Shortcuts** for frequent actions, following platform conventions (⌘ on macOS, Ctrl on Windows/Linux;
  ⌘C/Ctrl+C to copy, etc.). Show shortcuts in menus and tooltips so users discover and learn them. Don't
  override standard OS shortcuts.
- **Menu bar** (native apps): the complete, discoverable list of commands, organized conventionally
  (File, Edit, View, …). Even shortcut-driven apps keep menus as the map of what's possible.
- **Command palette:** fuzzy-searchable access to commands — the modern power-user accelerator. Two
  conventions: **⌘⇧P / Ctrl+Shift+P** for a full command list (VS Code), or **⌘K / Ctrl+K** for a unified
  command-and-navigation palette (Slack, Linear, Notion). Quick-open of files/objects is a distinct,
  lighter shortcut (⌘P / Ctrl+P). Excellent for feature-rich apps — it scales to hundreds of commands
  without cluttering the UI.
- **Context menus** (right-click) for actions relevant to the object under the cursor. Keep them short
  and contextual.
- **Tooltips** on hover for icon-only controls, with the keyboard shortcut included.

## Data-heavy interfaces

Tables, grids, and lists are the heart of most desktop business software. Do them well:

- **Tables:** align text left and numbers right (tabular figures); keep row height comfortable but
  compact; prefer either zebra striping *or* hairline row borders rather than heavy versions of both —
  though in very dense multi-column grids a faint stripe plus a light rule can aid horizontal scanning;
  the goal is separation without noise. Sticky headers for long tables. Let users sort, filter,
  resize/reorder/hide columns, and paginate or virtualize large sets. Right-align or freeze a key/action
  column if helpful.
- **Full in-grid keyboard navigation:** arrow keys move the active cell/row, type-ahead jumps to matching
  rows, Enter opens/edits, Space toggles selection, and Home/End/PageUp/PageDown and Ctrl+A behave as
  expected. For the power users who live in these tables, being fully operable without the mouse is the
  single biggest speed win — a table that only responds to clicks feels slow no matter how it looks.
- **Selection & bulk actions:** support multi-select (shift/ctrl-click, select-all) and expose bulk
  operations in a contextual action bar. Show how many are selected.
- **Inline editing** where it speeds work, with clear edit/commit/cancel affordances.
- **Filtering & search** are first-class in data tools — make them fast, visible, and combinable, and
  reflect active filters clearly so users aren't confused by a filtered view.
- **Empty, loading, and error states** for every data view (skeleton rows, "no results matching your
  filters" with a clear-filters action).

## Platform conventions

- **macOS:** traffic-light window controls top-left, unified toolbar/title bar, the app menu bar lives in
  the system menu bar (not in-window), a preferences window (⌘,). Feels clean, spacious, and consistent
  with system apps. Use SF Pro and SF Symbols for native look.
- **Windows:** window controls top-right, Fluent Design cues (Mica/acrylic materials, rounded corners on
  Win11), settings often in-window. Use Segoe UI. Respect Windows conventions for dialogs and file
  pickers.
- **Cross-platform / Electron:** either adopt each platform's conventions (best native feel, more work)
  or a consistent custom look (VS Code, Slack, Figma) that's platform-agnostic but internally coherent.
  If custom, still honor OS-level expectations: native menus, standard shortcuts, correct window control
  placement per OS, and system light/dark. Don't reimplement the OS badly.

## Windowing & chrome

- **Keep chrome quiet.** Toolbars, panels, and bars frame the work — they shouldn't compete with it for
  attention. Neutral colors, restrained iconography, content in the spotlight.
- **Resizing & responsive desktop:** define minimum window dimensions, reflow gracefully as the window
  shrinks (collapse panels to icons, wrap toolbars), and use the space when it grows. Test at both small
  and maximized sizes.
- **State persistence:** remember window size/position, open panels, sidebar width, sort order, and
  recent items. Desktop users expect the app to be where they left it.
- **Dialogs:** modal only when truly blocking; give clear primary/secondary actions in the platform-
  correct order — macOS puts Cancel on the left and the confirming/default action on the far right;
  Windows/Fluent puts the primary action on the right with the secondary to its left. Match the OS so
  muscle memory holds. Prefer inline UI or non-modal panels over stacking dialogs.
