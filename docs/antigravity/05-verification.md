# Verification matrix

## Automated local checks

Run npm test and npm run build. Tests include timer deadlines, background reconciliation, untimed inactivity, companion preview restoration, sustained God Mode acceleration, and selective rollback.

New checks cover schema-backed PostgreSQL ownership/RPC privileges, anonymous rejection, revision conflicts, stale-reset rejection, cloud text stripping, timeline retention, bounded/validated backups, guest migration/import consent, account switching, edits during upload, and reset propagation. PGlite runs real PostgreSQL rules locally; it does not prove that a live Supabase project's migrations and third-party integration were applied.

Full-app DOM smoke tests cover all public routes, guest access and manual reduced motion. JSDOM tests do not establish mobile visual quality or actual OAuth behavior.

## Live authentication gate

- User completes signup and Google/email verification on the intended Clerk app.
- User account menu appears; reload keeps the session.
- Sign out returns to the guest cache; sign in returns to the account cache.
- Confirm the original security block is resolved and no protections were bypassed.

## Live cloud gate

- Apply SETUP.sql and enable Clerk third-party auth.
- Account A completes a match; account B cannot read it or mutate it.
- A second device for A sees the match/preferences after sync.
- Offline matches upload once after reconnect.
- Complete matches during a slow request; none disappear.
- Reset A while another device is offline. Reconnecting cannot restore A's old data. B remains unchanged.
- Verify daily cleanup in cron.job and its execution history.
- Download/export/import and restore backups; test malformed/oversized files.

## UI and accessibility gate

Inspect 320/390/768/1440 px, light/dark and custom accents. Check mode wrapping, no horizontal overflow, modal scrolling, focus visibility, keyboard dialog controls, sensible touch targets, theme-matched Google button and truly centered label. Test system and manual reduced motion with God Mode. Reconfirm companion-off full width, ordinary eyes after divine preview, and stationary typing text.

## Privacy and release gate

Confirm real contact details, public routes and provider disclosures. No ads or automatic telemetry are included. Diagnostic downloads must contain categories/timestamps only. Keep tokens, passwords, emails, custom passages and private logs out of fixtures/artifacts. Browser caches and downloaded backups require user-managed deletion. Record the external-account-deletion webhook limitation before claiming complete account-erasure automation.
