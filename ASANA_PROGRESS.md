# Asana Progress (manual sync pending integration)

## Done
- Enforced auth gate: `/` now redirects to `/auth`
- Implemented robust auth flow:
  - email+password signup
  - login
  - magic-link fallback
  - auto-redirect to `/app` after session
- Built real SaaS shell (sidebar navigation, profile/logout, settings)
- Added core SaaS pages:
  - Dashboard (`/app`)
  - Analyzer (`/app/analyze`)
  - Projects (`/app/projects`)
  - Settings (`/app/settings`)
- Hardened analyze API to require authenticated bearer token
- Added per-user data model + RLS SQL for analyses/projects

## In Progress
- UX polish pass (Linear/Apple quality details)
- onboarding improvements after first login
- copy optimization for pricing/conversion

## Blocker
- No direct Asana API connection configured in this runtime.
  When credentials/integration are provided, this file can be auto-synced.
