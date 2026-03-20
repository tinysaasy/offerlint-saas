# Asana Progress (manual sync pending integration)

## Done
- Enforced auth gate: `/` now redirects to `/auth`
- Implemented robust auth flow:
  - email+password signup
  - login
  - magic-link fallback
  - auto-redirect to `/app` after session
- Dashboard remains protected by session check

## In Progress
- Harden API access to authenticated users only
- UX polish pass (Linear/Apple quality details)
- onboarding improvements after first login

## Blocker
- No direct Asana API connection configured in this runtime.
  When credentials/integration are provided, this file can be auto-synced.
