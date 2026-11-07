# App Design (Mobile & Native)

Designing for phones and tablets — iOS, Android, and cross-platform. Assumes `design-foundations.md`.
The governing principle: **users bring deep expectations from their OS. Meet them.** A native-feeling app
respects its platform's conventions; fighting them costs usability and makes an app feel foreign and
cheap.

## Contents
- [Respect the platform](#respect-the-platform)
- [iOS — Human Interface Guidelines essentials](#ios--human-interface-guidelines-essentials)
- [Android — Material Design 3](#android--material-design-3)
- [Touch, targets & thumb zones](#touch-targets--thumb-zones)
- [Mobile navigation patterns](#mobile-navigation-patterns)
- [Adaptive layout](#adaptive-layout)
- [Flows every app needs](#flows-every-app-needs)
- [Cross-platform](#cross-platform)

## Respect the platform

Before styling, decide the app's relationship to its platform:

- **Native / platform-idiomatic** (default for most apps): use the platform's own components, navigation,
  typography, and gestures. An iOS app should feel like iOS; an Android app like Android. This is what
  users expect and it's the lowest-friction, highest-quality path.
- **Custom / branded** (games, highly-branded consumer apps, design-forward products like Nothing OS):
  a distinctive look that's *intentionally* not stock. This is legitimate and can be excellent — but it
  must be *deliberate and complete*, applied with even more rigor and consistency than a native app,
  because you're taking on the platform's job of coherence. Half-custom (stock components in a custom
  skin, applied inconsistently) is the worst of both worlds.

Match whichever the existing app already is. If adapting an app with a strong custom identity, extend
*that* language, not the platform default.

## iOS — Human Interface Guidelines essentials

Apple's HIG values clarity, deference (content over chrome), and depth. Key elements:

- **Navigation:** navigation bar at top (large title that collapses on scroll; back button on the left),
  tab bar at the bottom for top-level sections (2–5 tabs). Sheets/modals slide up for focused,
  self-contained tasks; use detents — medium, large, or custom heights — for resizable sheets, and note a
  sheet can leave the content behind it interactive (non-dimmed) for map/player-style UIs.
- **Liquid Glass (current iOS).** As of iOS 26 (2025), Apple's system UI uses the Liquid Glass material —
  translucent, layered, context-reactive controls — with tab bars and toolbars that float and can minimize
  on scroll. New apps should adopt system materials rather than opaque fills, and account for both the
  classic and Liquid Glass appearances; opaque, static bars now read as a generation stale.
- **Typography:** San Francisco (system font) with Dynamic Type — use the semantic text styles (Large
  Title, Title, Headline, Body, Caption…) so text respects the user's chosen size. Never hard-code font
  sizes that break Dynamic Type; supporting larger text is an accessibility expectation on iOS.
- **Iconography:** SF Symbols — a vast system icon set that aligns optically with SF text and supports
  weights and scales. Use it rather than importing a foreign icon set on Apple platforms.
- **Layout:** respect **safe areas** (notch, Dynamic Island, home indicator) — content must not sit under
  them. Use standard margins; let content scroll under translucent bars.
- **Feel:** subtle, physics-based transitions; haptic feedback for meaningful moments (selection,
  success, impact) used sparingly; controls that respond instantly. iOS feels "alive" through restraint
  and polish, not flashiness.
- **Controls:** use standard controls (switches, segmented controls, steppers, action sheets, context
  menus on long-press) where they fit — users already know them.

## Android — Material Design 3

Material 3 (a.k.a. Material You) is Google's current system. Key elements:

- **Dynamic color:** M3 can derive a whole tonal palette from a seed color (or the user's wallpaper on
  Android 12+). Build color as tonal roles (primary, on-primary, primary-container, surface, surface-
  variant, outline…) rather than fixed hex values, so theming and dark mode "just work."
- **Typography:** Roboto (the Roboto Flex variable family, with weight and optical-size axes) or a brand
  font, mapped to the M3 type scale (Display, Headline, Title, Body, Label — each large/medium/small);
  Material 3 Expressive refreshes these treatments. Use the roles, not arbitrary sizes.
- **Components:** top app bar, navigation bar (bottom, 3–5 destinations) or navigation rail/drawer on
  larger screens, cards, FAB (one primary floating action per screen), chips, snackbars for transient
  feedback, bottom sheets. Use the M3 components rather than reinventing them.
- **Elevation & shape:** M3 leans on tonal elevation (surfaces tinted by overlay) more than heavy
  shadows, and on a defined shape scale (corner radii by component). Keep to the shape scale.
- **Motion:** Material motion is expressive but purposeful — shared-element transitions, container
  transforms, emphasized easing. Fast, meaningful, consistent.

## Touch, targets & thumb zones

- **Minimum touch target ~44×44pt (iOS) / 48×48dp (Android)** with adequate spacing between targets.
  Small or crowded tap targets are the top cause of mobile frustration and mis-taps. Visual size can be
  smaller than the tappable area — pad the hit region.
- **Design for thumbs.** On phones held one-handed, the easy reach is a diagonal arc biased toward the
  holding hand; the genuinely hard spot is the *far top corner* (opposite the thumb), and it worsens on
  large (6.7"+) phones. Keep primary, frequent actions low and within that arc — this is *the* reason
  bottom tab bars and bottom sheets dominate — but the top is still fine for search, back, and infrequent
  controls (and OS one-handed / Reachability modes ease the reach).
- **Gestures enhance, they don't hide.** Swipe-to-delete, pull-to-refresh, swipe-back are great *if*
  they mirror a visible control or match platform convention. Never make a core action *only* reachable
  by an undiscoverable gesture.
- **Feedback is immediate and physical.** Ripples (Android) / highlight + haptics (iOS) on touch. The
  screen must acknowledge every touch instantly.

## Mobile navigation patterns

- **Bottom tab bar** — best for 2–5 equally-important top-level sections; always visible, one tap away,
  in the thumb zone. The modern default for consumer apps.
- **Navigation drawer** — for many destinations or secondary items; hidden behind a menu, so reserve it
  for things accessed less often. Don't bury primary destinations in a drawer.
- **Stack navigation** — push/pop screens with a back affordance for drilling into detail. The
  fundamental hierarchy pattern; keep back behavior predictable (and honor the OS back gesture/button on
  Android).
- **Modals/sheets** — for focused, interruptive tasks (compose, filter, confirm). Bottom sheets feel
  native and stay in the thumb zone; give a clear dismiss.
- **Honor system gestures.** iOS uses an interactive edge-swipe back and home-indicator gestures; Android
  10+ uses gesture navigation with **predictive back** (opt into its animation, and don't intercept the
  gesture). Avoid custom horizontal swipe gestures at the screen edges — they collide with the system back
  gesture and make navigation feel broken.

## Adaptive layout

- **Phones, tablets, foldables, and orientation** are all in scope. Don't just stretch a phone layout to
  a tablet — use the extra space (master–detail/split view, multi-column, a persistent sidebar/rail).
- Use responsive breakpoints (compact / medium / expanded window size classes) the way the web uses
  breakpoints. A tablet in landscape is closer to a small desktop than a big phone.
- Handle rotation, split-screen multitasking, keyboard appearance (content must not hide behind the
  keyboard), and safe-area/insets on notched and foldable devices.
- **Honor system accessibility settings.** Support Dynamic Type / font-scale, Reduce Motion (fade or
  instant fallback for expressive transitions), Increase Contrast, and Bold Text. Custom-branded controls
  lose the free semantics of stock components — give them explicit accessibility labels, roles, and traits
  for VoiceOver and TalkBack.

## Flows every app needs

- **Onboarding:** get users to value fast. Explain only what's needed, defer permission requests until
  they're contextually relevant (ask for camera access *when* they tap the camera, with a reason), and
  let people skip. Long forced tutorials get dismissed.
- **Permissions:** request in context with a plain-language rationale *before* the system dialog; handle
  denial gracefully (don't dead-end the app).
- **Empty / loading / error / offline:** especially important on mobile where connectivity is
  unreliable. Design skeletons, empty states with a next action, retryable errors, and sensible offline
  behavior (cached content, queued actions). See `design-foundations.md` § states.
- **Notifications:** relevant, timed, and respectful. Let users control them. Deep-link notifications to
  the right screen.

## Cross-platform

- **React Native / Flutter / Expo:** you can share one codebase, but decide consciously whether to
  *unify* the look (one brand across platforms) or *adapt* per platform (native feel on each). Both are
  valid; pick one and be consistent. If unifying, still respect platform-level expectations users can't
  unlearn (back gesture/button on Android, safe areas, system font sizing).
- **Don't ship an iOS design on Android or vice-versa by accident** — mismatched navigation and
  controls make an app feel like a cheap port. Flutter's Material and Cupertino widget sets exist for
  exactly this reason; use the right one, or a deliberate custom system.
- **Test on real device sizes** (small phone, large phone, tablet) and both light/dark, not just one
  simulator.
