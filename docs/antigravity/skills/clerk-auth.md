# Clerk authentication workflow

Source: https://clerk.com/.well-known/skills/clerk/SKILL.md (official skill router) and https://clerk.com/docs/react/getting-started/quickstart.

Use prebuilt React components and the installed SDK's actual exports. Preserve the owner's selected instance. Guest access stays open; never gate practice on loading authentication. Keep credentials and verification codes in the user's control.

Theme modal portals through Clerk appearance values: app-scoped CSS variables do not automatically reach portals. Center a social button's label independently from the provider icon and check contrast for custom accents.

For a blocked signup, inspect the actual Protect event. The supplied logs establish action_blocked/policy, not the matching rule. Do not assert that a network, browser or CAPTCHA caused it without evidence. A visible modal is not a completed authentication test.

Use current Clerk session tokens for Supabase; do not revive the deprecated Supabase JWT-template integration. Avoid secret keys in Vite code. Verify sign-up, sign-out, sign-in, refresh and account switching with the real intended application.
