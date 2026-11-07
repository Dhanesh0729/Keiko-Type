# Testing and launch workflow

This is Keiko's project verification guide, not a separate installed host skill.

- Start with meaningful regression tests for deadlines, reset cleanup, account isolation, conflicts, deletion and retention.
- Use PGlite to run the actual SQL schema/functions/policies against PostgreSQL. Set distinct authenticated subjects and an anonymous role; test read and mutation denial.
- Exercise React provider races with controlled pending requests. Change accounts during requests and check that old data cannot appear in the new scope.
- Use DOM smoke tests for route rendering and controls, while labeling them as DOM tests rather than browser visual proof.
- Build production output and recheck selective God Mode rollback. Do not regress unrelated companion/untimed features.
- Verify live signup/OAuth/email completion with the user. Do not enter credentials, fabricate users, or treat mocked authentication as real authentication.
- Inspect actual browser layouts at mobile/tablet/desktop, all modes, long labels, dialogs and custom accents. If browser tooling fails, state the visual verification limitation.
- Keep diagnostic reports small and free of messages/stacks/URLs/identity/typed content. No automatic error upload is configured.
- Record exact pending external setup. Do not claim a public website, domain, cloud schema, retention job, support email or advertising approval that was not verified.
