# Current implementation status

Updated 7 November 2026. Read this before making claims about completion.

## Implemented in the repository

- Account-scoped guest/user caches and migration of legacy browser data.
- Optional native Clerk/Supabase integration; current session tokens, account-scope checks, serialized sync, optimistic revision checks and reset generations.
- Explicit guest-history import choice, offline retry, concurrent-edit protection.
- JSON export/import with optional preferences, validation, deduplication, three daily browser snapshots, restore/download and explicit current-profile reset.
- Retention: 500 summaries, newest 50 detailed matches, default 30 days (7/30/90 selectable), up to 3600 seconds of graph detail per match. Cloud timelines exclude mistaken letters.
- Owner-only PostgreSQL access, restricted RPCs and a daily retention migration.
- Data & privacy, public About/Help/Contact/Privacy, mobile layout rules, manual/system reduced motion, recovery boundary and local diagnostic downloads.
- Public contact topics and editable contact channels; actual email/support URL are still owner-provided deployment settings.
- Antigravity plan and separate UI, Clerk, sync and testing guides.
- Secret-in-public-config build guard and lazy database SDK loading.

## Verification evidence

- Final host automated suite: all 41 tests passed after the backup-cleanup refinement. Production build also passed after the final source change. A sandboxed attempt failed because esbuild was denied workspace directory access; the host rerun passed.
- Production build passed; guest app and Supabase SDK split into separate chunks.
- Real local PostgreSQL engine tested owner isolation, anonymous denial, revoked direct writes, scoped RPCs, stale-write rejection, retention and reset behavior.
- React tests covered guest migration/import consent, account changes during requests, concurrent edits and reset propagation. Full-app DOM smoke tests covered public routes and reduced motion.
- Live Supabase anonymous readiness request returned SQLSTATE 42501: permission denied for function keiko_read. This confirms function existence and anonymous execution denial, not signed-in operation or exact deployed schema contents.
- Owner confirmed Clerk/Supabase integration is done.

## Still requires live owner verification

- Clerk signup was rejected by Protect (action_blocked, reason policy). The exact matching rule has not been identified. The owner confirmed Require Device Intelligence checks is Active. Enterprise filtering of verification resources is a hypothesis, not a confirmed cause; a personal-device/personal-network test is pending. Browser automation repeatedly timed out; the Clerk CLI has no authenticated/linked owner session. No security setting has been disabled and no public bypass has been added.
- Use https://dashboard.clerk.com/~/protect/protections, select Keiko and Development, then inspect enabled protections and the failed decision details. Complete a real signup, reload, sign-out and sign-in with the user's credentials/codes.
- Verify signed-in sync with two real users/devices and confirm the daily Cron job. Public-key probes and mocked tokens do not replace this.
- Actual mobile visual inspection remains pending because browser automation failed. DOM tests verify structure/behavior, not rendered geometry.
- Set real public support contacts before launch. No production deployment, domain purchase, ad approval, automatic remote backups or external Clerk-user-deletion webhook has been completed.

Do not claim the entire launch is verified while these gates remain open. Update this file with observed evidence as they are completed. Private log payloads, IP addresses, session tokens and secrets must stay out of the handoff.
