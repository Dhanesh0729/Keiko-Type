# Cloud sync and data safety workflow

This is a project engineering guide, not an installed vendor skill. Primary references: https://supabase.com/docs/guides/auth/third-party/clerk and https://supabase.com/docs/guides/database/postgres/row-level-security.

1. Separate guest and account caches before adding cloud requests. A query must use a token for the same account scope as the data being uploaded.
2. Derive ownership from the verified JWT subject in PostgreSQL. Never trust a browser-supplied owner ID. Keep anonymous access closed and minimize privileges.
3. Serialize requests and use revisions. Preserve edits during requests; a successful old response must not overwrite newer local work.
4. Use reset generations so deletion wins over stale offline snapshots. A reset must also clear in-memory reports and relevant local backups.
5. Validate imported JSON, cap sizes, strip arbitrary fields, and keep only bounded detail. Apply retention on the server as well as the browser.
6. Guest import is opt-in. Mistaken letters and full passages must not enter cloud history. Prefer current, short-lived Clerk tokens; never persist them in progress records.
7. Distinguish local PostgreSQL tests from live Supabase verification. Apply schema/provider setup through owner-authorized tools. A public key cannot execute DDL.
8. Document backup limits and downloaded-file semantics honestly. Never promise automated cloud backups or external-account cleanup that was not configured.
