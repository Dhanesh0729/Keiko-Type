# Service setup and owner handoff

## Supabase

The owner's project is https://cglgcjgjkclinctyixri.supabase.co. Its browser-safe URL/publishable key are configured locally. They are not permission to execute database DDL. No service-role key or database password has been requested or embedded.

1. Open this project in the Supabase Dashboard → SQL Editor.
2. Run supabase/SETUP.sql. It combines migrations 001_progress.sql and 002_retention_schedule.sql in order. Alternatively apply them separately.
3. Confirm keiko_progress has RLS enabled. Anonymous table access and direct authenticated mutation must remain revoked.
4. Confirm cron.job contains keiko-daily-retention. This daily job is required for physical detail cleanup when nobody opens the app. If pg_cron cannot be installed, enable Supabase Cron and run migration 002 again; do not claim inactive-data cleanup is scheduled until confirmed.
5. In Clerk activate the Supabase integration and copy its Clerk instance domain. In Supabase Authentication → Sign In / Providers (or Third-party Auth in some dashboard versions), add Clerk with that domain. Session tokens must have role authenticated. Use the native third-party integration, not the deprecated Supabase JWT template.
6. Restart Vite after configuration changes. Run live tests with two different Clerk users and two browser/device sessions. Do not use real production records as fixtures.

Official setup: https://supabase.com/docs/guides/auth/third-party/clerk and https://clerk.com/docs/guides/development/integrations/databases/supabase

## Clerk signup block

Owner-provided logs confirmed protect.sign_up.blocked with reason policy, followed by action_blocked. This proves a policy rejection, not which rule triggered. The original reference can be used with Clerk support; avoid publishing private logs, IP addresses or device IDs in this repository.

- Open the failed event's decision details and inspect the matching rule.
- Check the Development instance's enabled Protect settings, particularly Device Intelligence and network protections.
- Inspect blocked verification requests in the affected browser. Keep security checks enabled while diagnosing. No captcha or auth bypass is included in the app.
- This computer's Clerk CLI doctor passed host execution but reported no CLI login or linked application. The missing server secret warning is not itself an error for this browser-only Vite app.
- If CLI access is needed, run clerk auth login and clerk link to the existing intended app as the owner. Never generate a replacement instance to hide the problem.
- Complete a real signup, verification/OAuth, reload, sign-out and sign-in. The user enters credentials/codes. Do not label this verified from a modal screenshot or a mock.

Official troubleshooting: https://clerk.com/docs/guides/protect/protections/overview

## Editable public settings

Set these in .env.local for development and your hosting build environment for production. Values beginning VITE_ are public and bundled into browser code.

| Setting | Purpose |
| --- | --- |
| VITE_CLERK_PUBLISHABLE_KEY | Existing Clerk instance's public key |
| VITE_SUPABASE_URL | Base project URL, without /rest/v1 |
| VITE_SUPABASE_PUBLISHABLE_KEY | Public project key only |
| VITE_CONTACT_EMAIL | Public support/privacy contact email |
| VITE_SUPPORT_URL | HTTPS support/issue form URL |

The Contact page includes issue-reporting guidance and diagnostic downloads. Set real contact channels before public launch; the preview must not invent an email address. Text for additional contact categories can be edited in src/PublicPages.jsx.

## Hosting and backup operations

Build with npm run build; deploy dist to an SPA-capable static host. public/_redirects provides Cloudflare Pages-style fallback routing. Configure custom domain and Clerk production OAuth/domain settings separately. Keep public information pages accessible without login. No domain has been purchased or production site deployed.

Browser snapshots are local, not remote disaster recovery. Keep downloaded exports somewhere separate. Before relying on managed database backups, review the actual Supabase plan and configure independent encrypted database backups as needed; this project does not claim that free managed backups were enabled.

### Direct Clerk navigation

Open https://dashboard.clerk.com/~/protect/protections, choose the Keiko application, and select Development in the environment selector. Sign into the dashboard if redirected. Leave settings unchanged while locating the matching rule. The owner has confirmed the Clerk/Supabase integration is complete; real-user sync and signup verification remain separate checks.
