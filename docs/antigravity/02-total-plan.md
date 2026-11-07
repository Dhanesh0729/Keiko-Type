# Total implementation and release plan

## Phase 1: authentication

Keep the selected Clerk app and prebuilt dialogs. Keep guest access open. Match the accent and center social labels independently of their icons. Diagnose the actual Protect event before changing settings. The supplied logs confirm action_blocked and reason policy, not a specific matching rule. Inspect decision details, blocked verification scripts, current ClerkJS and enabled protections. Never add a public testing-token bypass. The user enters credentials, Google authorization and email codes. Verify actual signup, reload, sign-out and sign-in.

## Phase 2: local data and consent

ProgressProvider separates guest and account storage. Migrate legacy browser data into guest storage only after successful persistence. Validate and deduplicate imports. Keep bounded summaries without storing full passages. Offer guest history import after login; never silently upload it.

## Phase 3: cloud sync

Connect the supplied Supabase project using Clerk third-party auth. Apply both migrations. Use current Clerk tokens and derive ownership from the verified JWT subject. Enforce owner-only reads and scoped authenticated RPC mutations.

Serialize uploads, check revisions and reset generations, merge completed histories, and retry on reconnect/focus/interval. Locally edited preferences win conflicts. Preserve edits made during a request. A new reset generation discards stale history and backups instead of resurrecting them. Keep local saving when cloud requests fail.

## Phase 4: data controls

Provide export, validated import, optional preferences restoration, three daily browser snapshots, restore/download and a typed DELETE reset. Explain that browser snapshots are not managed cloud backups or protection against clearing browser storage.

Keep 500 summaries and detailed analytics for the newest 50 matches within 7/30/90 days (default 30). Retain at most 3600 detailed seconds per match. Clean on load, while open, during server reads/writes and through the daily SQL schedule. Apply current retention to automatic backups. Reset only the current profile; downloaded files and Clerk login are separate. Retain a minimal reset marker to defeat stale clients.

## Phase 5: public experience

Public routes: /about, /help, /contact, /privacy. Data controls /data, progress /progress, appearance /appearance, practice /. Include SPA hosting rewrites. Contact details are editable deployment settings, never fictional addresses.

Adapt existing themes. Check 320/390/768/1440 px widths, touch targets, wrapped modes, keyboard navigation and scrollable dialogs. Honor system/manual reduced motion. Keep typing stationary. Provide rendering recovery and local diagnostic downloads without personal content.

## Release gates

Run tests/build and selective God Mode rollback checks. Complete real authentication and live two-user cloud isolation tests. Confirm the retention job, public contact details and privacy wording. Record pending checks honestly. Hosting/domain purchase and ads remain later decisions.
