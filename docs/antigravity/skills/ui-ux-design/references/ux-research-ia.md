# User Research & Information Architecture

Good visual craft can't rescue a product built on the wrong structure or a misunderstanding of its users.
This file feeds the **Understand** and **Structure-before-style** steps in `SKILL.md`: how to ground a
design in real user needs, and how to organize a product so people can find and understand things. Read
it before organizing a complex product or when the brief is vague about *who* and *what*.

## Contents
- [Understand the user first](#understand-the-user-first)
- [Lightweight research inputs](#lightweight-research-inputs)
- [Task flows](#task-flows)
- [Information architecture](#information-architecture)
- [Navigation models](#navigation-models)
- [Labeling & grouping](#labeling--grouping)
- [Validating structure](#validating-structure)

## Understand the user first

Before designing, get concrete answers to: **Who** is this for? **What** are they trying to accomplish?
**In what context** (device, environment, frequency, expertise, emotional state, time pressure)? A design
serves a job — a screen that's beautiful but buries the one thing the user came to do has failed. When the
brief doesn't answer these, ask, or state the assumptions you're designing against so they can be
corrected.

Design for the *primary* user and their *primary* task first; secondary users and edge tasks come after.
Trying to serve everyone equally usually serves no one well.

## Lightweight research inputs

You rarely need a formal study to design better — a little structure beats none:

- **Personas / user archetypes** — a short sketch of each key user type (goals, context, expertise, pain
  points). Keeps the team designing for a real person, not a vague "user." One or two focused archetypes
  beat a binder of demographics.
- **Jobs-to-be-Done (JTBD)** — frame needs as the job the user "hires" the product for: "When [situation],
  I want to [motivation], so I can [outcome]." This focuses on the underlying goal rather than a
  presupposed feature, and often reveals a simpler solution.
- **Mental models** — how users already *expect* this domain to work (from competitors, prior tools, the
  physical world). Matching their model is easier than teaching a new one; violating it causes confusion.
- Where real data exists (analytics, support tickets, sales notes, existing user feedback), mine it — it's
  faster and truer than guessing.

## Task flows

Map the key flows as a sequence of steps before designing screens: entry point → steps → decision points →
success (and failure/exit paths). This surfaces missing states, unnecessary steps, and dead ends *before*
you've styled anything.

- **Minimize steps and decisions** to the goal; every extra field, tap, or choice sheds users.
- **Design the unhappy paths**, not just the success path — what happens on error, no permission, no
  network, no results. (See `design-foundations.md` § states.)
- Note where the user needs reassurance (progress, confirmation) or might hesitate (cost, commitment,
  data entry).

## Information architecture

IA is how content and functionality are organized, labeled, and connected — the skeleton beneath the
visuals. It's the most common root cause of "I can't find anything," and no amount of styling fixes bad
structure. Core principles:

- **Organize around the user's mental model**, not your org chart or database schema. Group what users
  think of together, name it in their words.
- **Manage breadth vs. depth.** Broad-and-shallow (many top-level choices) overwhelms; deep-and-narrow
  (many clicks down) buries. Aim for a middle ground; most items reachable in a few steps. Don't nest
  deeper than the content justifies.
- **Prioritize ruthlessly.** Not everything is top-level. Surface the frequent and important; tuck away the
  rare. A flat list of 30 equally-weighted items is an unmade decision.
- **Be consistent and predictable.** Similar things live in similar places; the structure should be
  guessable. Provide clear "you are here" cues everywhere (see navigation, below).

## Navigation models

Match the model to the content shape:

- **Flat** (a handful of peer sections) → a single nav bar / tab bar. Best when everything is top-level and
  few.
- **Hierarchical / tree** (categories → subcategories → items) → sidebar or nested menus with breadcrumbs.
  The default for content-rich apps and sites; keep the tree shallow.
- **Hub-and-spoke** (a home that launches into focused tasks, return to hub between) → common on mobile and
  for tools with distinct modes.
- **Sequential / wizard** (guided, ordered steps) → onboarding, checkout, setup. Show progress and allow
  back.
- Most real products **combine** these (a hierarchical content area inside a flat top-level nav). Keep the
  primary navigation consistent across the whole product — moving or restyling it per screen destroys the
  user's map.

## Labeling & grouping

- **Use the user's vocabulary**, not internal jargon or clever brand names, for navigation and categories.
  A label the user doesn't recognize is a door they won't open.
- **Group by relationship the user perceives** (by task, by topic, by frequency) — and reflect grouping
  visually with proximity and headings (see `design-foundations.md`).
- **One term per concept**, everywhere (see `ux-writing.md`). Consistent labels make the structure feel
  reliable.

## Validating structure

- **Card sorting** (even informal: put the items on cards, ask a couple of real users to group and name
  them) reveals the categories and labels users actually expect — cheap and high-signal.
- **Tree testing / first-click**: give a user a task and see whether they pick the right path from the
  labels alone. If the first click is wrong, the IA or labels are wrong.
- When you can't test, sanity-check against the mental-model and findability questions: for each key task,
  can the user guess where to go from the top level? If you have to explain it, restructure.
