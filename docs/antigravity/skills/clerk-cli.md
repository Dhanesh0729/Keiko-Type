# Clerk CLI workflow

Applied source: https://raw.githubusercontent.com/clerk/skills/c5d2c0d6c5b63243146b4893c875f6ebef55977c/skills/clerk-cli/SKILL.md (MIT).

Use the official clerk npm package, not a guessed CLI package. Prefer an existing current binary; otherwise use the project's package runner. Check help against the installed version and start with clerk doctor --json on the host.

This run used CLI 4.1.0. Host execution passed, but login/project linking were absent. That limits private log/config access; it does not prove the browser integration is broken. A browser-only Vite application does not need a client-exposed server secret.

Authenticate and link only to the existing intended application. Never initialize a replacement to evade a signup policy. Discover API paths through help/catalog before calls. Read public diagnostics without dumping credentials. Preview mutations and verify their scope; do not change protections or delete users as a diagnostic shortcut.

Never print environment files, claim URLs, secret keys or session tokens into handoff documents. Report evidence and unresolved access accurately.
