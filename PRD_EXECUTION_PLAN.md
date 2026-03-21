# Vita Santé Club — PRD Execution Plan (Phase 1 MVP)

## Status
- [x] Public homepage + plans/doctors/signup/admin/doctor verify scaffolds
- [x] Supabase core schema initialized (profiles, plans, members, doctors, cards, affiliations, payments)
- [ ] Full bilingual routing (`/fr/*`, `/en/*`) with translation dictionaries
- [ ] Module B multi-step onboarding (standard + diaspora)
- [ ] Member portal complete (plan, credits, card, dependants, payments, profile)
- [ ] Doctor portal complete (verify, atomically decrement credits, immutable visit history)
- [ ] Admin dashboard complete (KPIs, queues, CSV export, plan CRUD, doctor management, audit log)
- [ ] Affiliate/Sponsor portals + conversion tracking + commissions
- [ ] Stripe/Resend foundational integration (feature-flagged; ready for later activation)

## Delivery slices

### Slice A — Public bilingual website (P0)
- `/fr` and `/en` route trees
- Home / Plans / About / Contact / Medical Network / Affiliate
- FR/EN language switcher in nav
- Plan comparison + CTA prefilled signup
- FAQ accordion by plan
- Contact form persistence + confirmation email base (queued)

### Slice B — Onboarding (P0)
- Multi-step forms with persisted state
- Standard flow + diaspora flow
- Dependants capture
- Review step
- Payment integration stubs + webhook base
- Auto-member number generation (`VSC-XXXXX`)

### Slice C — Member portal (P0/P1)
- Dashboard with renewal + credits
- Member card preview/download
- Dependants table
- Payment history
- Profile settings + language preference

### Slice D — Doctor portal (P0/P1)
- Search member by `member_number`
- Active/low/inactive status badge
- Visit recording with transactional decrement
- Immutable consultation history by doctor

### Slice E — Admin (P0/P1)
- KPI dashboard
- Pending registration queue approve/reject
- Member management + CSV export
- Plan/service-credit configuration
- Doctor management
- Admin RBAC + audit logs

### Slice F — Affiliate/Sponsor (P0/P1)
- Affiliate link generation `?ref=`
- Attribution tracking (click→signup→payment)
- Commission lifecycle
- Sponsor funded-members visibility

## UX/UI quality standard
- shadcn/ui design system + responsive primitives
- Magic UI for selective visual polish only (no performance regression)
- Notion/Linear style information density and hierarchy
- Mobile-first QA for all critical flows

## Technical guardrails
- RBAC on every route/API
- Supabase RLS strict isolation by role/user
- Server-side validation and schema guards
- Pagination and query indexes
- Audit trail on critical admin actions

