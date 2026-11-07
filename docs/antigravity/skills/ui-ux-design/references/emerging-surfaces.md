# Emerging & Non-Standard Surfaces

Web, mobile, and desktop cover most work, but "every software design" includes TV, wearables, voice,
automotive, and spatial/AR. These are lower-frequency and each has deep platform guidelines of its own —
this file gives the transferable first principles so you can design sensibly for them and know what to
look up. When a task targets one of these, apply these principles and consult the platform's own
guidelines (Apple tvOS/watchOS/visionOS HIG, Android TV / Wear OS, Alexa/Google voice design, automotive
OEM/Android Auto/CarPlay guidelines).

## Contents
- [TV & the 10-foot UI](#tv--the-10-foot-ui)
- [Watch & wearables](#watch--wearables)
- [Voice & conversational (VUI)](#voice--conversational-vui)
- [Automotive](#automotive)
- [Spatial / AR / VR](#spatial--ar--vr)

## TV & the 10-foot UI

Designed to be read from across a room and driven by a remote (D-pad), not a pointer.

- **Legibility at distance**: much larger type and touch-free targets; high contrast; generous spacing.
  What's comfortable at arm's length is illegible at 10 feet — scale everything up.
- **Focus-based navigation**: there's no cursor. A clearly visible **focus state** moves between elements
  via D-pad; the currently-focused item must be unmistakable (scale, glow, border) because it *is* the
  user's location. Lay out in predictable rows/grids so directional navigation is obvious.
- **Minimal input**: text entry is painful on a remote — avoid forms; prefer selection, voice, or
  companion-phone entry. Keep interactions shallow.
- **Safe margins**: keep content within the title-safe area (TVs overscan); don't put critical UI at the
  extreme edges.

## Watch & wearables

Tiny screen, glanceable moments measured in seconds, often one-handed or mid-activity.

- **Glanceability is everything.** Design for a 2–3 second interaction: one primary piece of information or
  one action per view. If it needs study, it doesn't belong on the wrist.
- **Big touch targets, short flows.** Fingertips on a small screen need large, well-spaced targets;
  minimize steps and text entry. Push complexity to the phone.
- **Complications & notifications** are the core surfaces — concise, timely, actionable. Respect that the
  device is intimate and interruptions are costly.
- Use the platform's own components and motion (watchOS, Wear OS) — custom chrome rarely pays off at this
  size.

## Voice & conversational (VUI)

No screen, or screen-optional. The interaction is a conversation (see also `ai-conversational-ux.md`).

- **Design the dialogue, not a UI.** Write the prompts and responses as a script; keep system speech short
  — users can't skim audio, and long spoken menus are forgotten.
- **Confirm consequential actions** explicitly ("You want to transfer $200 to Sam — is that right?") and
  provide feedback for every action, since there's no visual state.
- **Handle the unhappy path**: misrecognition, no input, ambiguous requests. Offer graceful reprompts and
  an escape/help path; don't dead-end.
- **Discoverability is hard** — users don't know what they can say. Suggest capabilities, and support
  natural variations of phrasing rather than rigid commands.
- On multimodal devices (voice + screen), reinforce spoken output with on-screen text and controls.

## Automotive

Safety-critical: the driver's primary task is driving. Minimizing distraction overrides aesthetics.

- **Glance discipline**: interactions must be completable in short glances (guidelines cap individual
  glances ~1.5–2s, total task time low). Large targets, high contrast, minimal steps.
- **Prefer voice and physical/steering controls** for anything done while moving; reserve complex visual
  tasks for when parked.
- **Reduce cognitive load**: few choices, big legible type, unambiguous icons, strong day/night (dark)
  modes for changing light. Never require reading a paragraph while driving.
- Follow the platform (Android Auto / CarPlay project templates, or OEM guidelines) — they encode the
  driver-distraction rules and constrain layouts deliberately.

## Spatial / AR / VR

Content lives in 3D space (visionOS, headsets, AR overlays).

- **Depth, comfort, and ergonomics** are new primary concerns: place content at comfortable focal
  distances, avoid forcing large head/eye movement, and avoid motion that induces sickness (respect
  reduced-motion; be careful with acceleration and locked-to-view content).
- **Gaze, gesture, and voice** replace pointer/touch; targets must be large and well-spaced for imprecise
  input, with clear focus/hover feedback on what you're about to select.
- **Anchor to the world thoughtfully**: respect the user's physical space and safety; don't occlude the
  real environment when it matters. Legibility against unpredictable real-world backgrounds needs scrims
  or adaptive contrast.
- Lean on the platform's spatial design guidelines — conventions here are young and still forming.
