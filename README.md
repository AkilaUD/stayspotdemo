# StaySpot Demo (static / offline)

Full UI + interaction parity with the StaySpot frontend, running entirely in the browser. No ASP.NET backend, database, or PayHere — all data lives in `localStorage`.

## Run

```bash
cd D:\x\demo
npm install
npm run dev
```

Open **http://localhost:5174**

```bash
npm run build
npm run preview
```

## Personas

Use the teal **Demo** bar (top) to switch instantly, or log in on `/login`.

| Persona | Email | Password |
|---------|-------|----------|
| Admin | `admin@stayspot.local` | `Password123!` |
| Seeker | `demo.seeker@stayspot.local` | `Password123!` |
| Advertiser | `demo.advertiser@stayspot.local` | `Password123!` |
| Guest | — | — |

**Reset data** on the demo bar restores seed fixtures and clears the session.

## What’s covered

| Route | Notes |
|-------|--------|
| `/` | Landing, hero search, featured listings, how-it-works, plans, FAQ, mobile CTA |
| `/browse` | Filters, boosted / campus / discount rails |
| `/listings/:id` | Gallery, unlock, inquire, viewing, reviews |
| `/login` `/register` | Auth + `?next=` / role picker |
| `/inbox` | Seeker & advertiser inquiries, reply, WhatsApp |
| `/advertiser/publish` | Create listing (FormData → mock PENDING) |
| `/advertiser/ads` | Slots, boost, mark rented, agreement download |
| `/pricing` | Landlord & renter plans → sandbox checkout |
| `/billing/sandbox/:orderId` | Mock pay / cancel |
| `/billing/return` `/billing/cancel` | Post-payment UX |
| `/seeker/premium` | Saved searches + viewing quota |
| `/admin/analytics` | Live counts from demo store |
| `/admin/postings` | Approve / reject queue |

Also: theme toggle, AppShell role nav, onboarding tour.

## Seed highlights

- 6+ approved listings (Colombo / Moratuwa / Kandy), boosted + discounted
- PENDING, REJECTED, and ARCHIVED (rented) ads for advertiser + admin UIs
- Open + replied inquiries; saved searches; viewing requests
- Seeker Plus + Advertiser Growth subscriptions
- Sample payments (`ORD-DEMO-OPEN`, `ORD-DEMO-DONE`)

## Architecture

- [`src/demo/fixtures.ts`](src/demo/fixtures.ts) — seed data
- [`src/demo/store.ts`](src/demo/store.ts) — `localStorage` persistence
- [`src/demo/mockApi.ts`](src/demo/mockApi.ts) — drop-in replacement for production `api.ts`
- [`src/components/demo/DemoBar.tsx`](src/components/demo/DemoBar.tsx) — persona switcher

Production app under `D:\x\src\frontend` is unchanged.
