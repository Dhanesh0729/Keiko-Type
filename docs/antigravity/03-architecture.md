# Architecture and data contract

## Source map

- src/main.jsx: app shell, typing, analytics, themes and original SVG mascot.
- src/auth.jsx: optional Clerk provider, account context and themed controls.
- src/data/model.js: validation, deduplication, retention, backup schema.
- src/data/cloud.js: official Supabase SDK and authenticated RPC transport.
- src/data/ProgressProvider.jsx: partitions, persistence, consent, backups, serialized sync.
- src/DataPage.jsx: status, retention, export/import, restore, reset and diagnostics.
- src/PublicPages.jsx: About, Help, Contact and Privacy.
- src/navigation.js: public paths and reduced motion.
- src/diagnostics.jsx: local diagnostics and rendering recovery.
- supabase/migrations: schema/security/RPCs and scheduled cleanup.

## Local storage

Scopes: keiko:v2:guest and keiko:v2:<Clerk ID>, with :backups and :guest-choice. Legacy keiko-history/keiko-settings migrate into guest storage. Tokens/passwords never go into snapshots. Separate caches prevent accidental UI mixing; they do not stop someone inspecting the same browser profile. Signing out does not erase caches. Use separate browser/OS profiles on shared computers.

## Cloud data and access

public.keiko_progress stores owner text ID, bounded JSON history/settings, revision, generation and update time. One-row atomic snapshots fit this app's scale. Maximum 500 summaries and 8 MiB history payload. Cloud detail excludes mistaken characters and full passages.

RLS SELECT checks owner_id = auth.jwt()->>'sub'. Anonymous access and direct authenticated mutations are revoked. Security-definer RPCs use an empty search_path, derive the owner internally and filter every operation by it. Only authenticated roles can call them; cleaners and maintenance are not client-accessible.

RPCs: keiko_read(), keiko_write(expected_revision, expected_generation, new_history, new_settings), keiko_reset(). SQLSTATE 40001 means reload/reconcile. Reset increments generation. Browser code obtains a current Clerk token; it never sends an owner ID to authorize a query.

## Backup and deletion semantics

Three daily browser snapshots are convenience copies, not managed database backups. Imports merge history; preferences restore is explicit. Reset clears current-profile history/settings/local snapshots and keeps a minimal cloud reset marker. Downloaded files and other profiles are separate.

Clear Keiko data before deleting the Clerk login. Automatic cleanup after an external/admin Clerk account deletion is not implemented. Add a verified user.deleted webhook before promising automated backend account-erasure synchronization. Never put service-role credentials in client code.
