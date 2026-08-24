# TANVO Backend Task List

Build in this order. Each phase ends in something demonstrable.

**The milestone that matters is Phase 7: one real invoice, sent to one real
client, paid.** Everything before it is scaffolding for that; everything after
it is improvement. Do not start Phase 8 until Phase 7 has happened with real
money.

Reference: [BACKEND.md](./BACKEND.md) · [DATA_MODEL.md](./DATA_MODEL.md) ·
[INVOICING.md](./INVOICING.md) · [SECURITY.md](./SECURITY.md)

---

## Phase 0 — Stop the leak

Before any code. See [SECURITY.md](./SECURITY.md#0-immediate-the-razorpay-key-in-the-repository).

- [ ] Move `rzp-key.csv` out of the repository
- [ ] Add `*.csv`, `*-key*` and `.env*` (keeping `.env.example`) to `.gitignore`
- [ ] Rotate the Razorpay key if it was ever committed, pushed or shared
- [ ] Scan history for credentials (`gitleaks detect`)
- [ ] Confirm the repository's public/private status is what you intend

## Phase 1 — Repository split

- [ ] Move the Vite site into `frontend/`
- [ ] Verify `npm run build` and `npm run dev` from `frontend/`
- [ ] **Update the Vercel project's Root Directory to `frontend`** — the
      existing deployment breaks until this is done
- [ ] Create `backend/` with these documents
- [ ] Root `README.md` explaining both sides and how to run each

## Phase 2 — Foundations

- [ ] Supabase project created; connection verified
- [ ] Supabase CLI wired up, migrations directory checked in
- [ ] Next.js App Router app scaffolded in `backend/`
- [ ] Second Vercel project with root directory `backend`
- [ ] `admin.tanvo.in` DNS and domain attached
- [ ] Environment variables set in Vercel — none prefixed `VITE_`/`NEXT_PUBLIC_`
- [ ] Supabase Auth with a single admin user, **MFA enabled**
- [ ] Server-side session guard on every `/admin` route
- [ ] Confirm the guard by requesting an admin route with no session

## Phase 3 — Clients and projects

- [ ] Migration: `clients`, `projects`
- [ ] **RLS enabled on both**, default deny, admin-only policies
- [ ] Verify RLS by querying with the anon key and getting nothing back
- [ ] Client list, create, edit
- [ ] `phone_e164` normalised and validated on write — the WhatsApp share
      depends on it
- [ ] GSTIN format validation when present
- [ ] Project list, create, edit, link to client
- [ ] Delete the old `VITE_ADMIN_PASSWORD_HASH` / `VITE_ADMIN_SALT` variables

## Phase 4 — Invoice drafting

- [ ] Migration: `invoices`, `invoice_line_items`, `number_sequences`,
      `invoice_events`
- [ ] RLS on all four
- [ ] Create a draft invoice against a client and project
- [ ] Line item editor: description, qty, unit price, tax rate, HSN/SAC
- [ ] **Server-side total computation** — reject any client-supplied total
- [ ] CGST+SGST versus IGST decided from `place_of_supply`
- [ ] Draft list with filters and status
- [ ] Draft delete (hard delete permitted only while draft)

## Phase 5 — Issuing

- [ ] Number allocation inside the issuing transaction, with a row lock
- [ ] Financial-year sequence reset (April–March)
- [ ] Concurrency test: issue two invoices simultaneously, confirm no
      duplicate and no gap
- [ ] Snapshot `bill_to` from the client at issue
- [ ] Freeze the row: reject any write to an issued invoice at the API layer
- [ ] Generate the PDF **after** commit; store in a **private** bucket
- [ ] PDF served only through short-lived signed URLs
- [ ] Cancel flow: status change only, number retained
- [ ] Every transition writes an `invoice_events` row

## Phase 6 — Public invoice page and sharing

- [ ] Token generation: ≥128 bits CSPRNG, **hash stored**, never the token
- [ ] `tanvo.in/i/<token>` renders server-side, one row, service role
- [ ] TANVO-branded layout with line items, totals, terms and Pay Now
- [ ] `noindex` header plus `robots.txt` disallow on `/i/*`
- [ ] Rate limit the route
- [ ] `viewed` event written on open
- [ ] Share menu: WhatsApp, Email, Copy link
- [ ] WhatsApp `wa.me` deep link, phone and text URL-encoded
- [ ] Email via Resend, PDF attached, public link in the body
- [ ] `navigator.share()` where available, falling back to `wa.me`
- [ ] `sent_at` and a share event recorded

## Phase 7 — Payments · **the milestone**

- [ ] Migration: `payments` with a **unique** `razorpay_payment_id`
- [ ] Create a Payment Link server-side at issue, `reference_id` = invoice id
- [ ] Store the link id and URL on the invoice
- [ ] Webhook endpoint: **verify signature over the raw body first**,
      constant-time comparison, parse only after
- [ ] Handle `payment_link.paid`, `payment.captured`, `payment.failed`
- [ ] Idempotency proven by replaying the same event twice
- [ ] Amount checked against the invoice total before marking paid
- [ ] `PAID` / `PARTIALLY_PAID` derived from the payments log
- [ ] Return 2xx fast; queue email rather than sending inline
- [ ] Receipt email on payment
- [ ] **Full test-mode run: create → issue → share → pay → PAID**
- [ ] Switch to live keys
- [ ] **One real invoice to one real client, paid**

## Phase 8 — Operations

- [ ] Daily reconciliation job against Razorpay, with alerting
- [ ] Overdue view, derived at query time (never a stored flag)
- [ ] Payment reminder — manual trigger first, automation later
- [ ] Manual payment recording (bank transfer, cash) with reference
- [ ] Credit notes with their own sequence
- [ ] Dashboard: outstanding, overdue, paid this month
- [ ] CSV export for the accountant

## Phase 9 — Hardening

- [ ] Work the [pre-launch checklist](./SECURITY.md#pre-launch-checklist) end
      to end
- [ ] Security headers verified in production
- [ ] `npm audit` clean, in CI
- [ ] **Backup restore tested** — not just enabled
- [ ] Runbooks: leaked key, missed-webhook day
- [ ] Preview deployments confirmed isolated from production data and live keys

---

## Deferred

Not "later" as a polite refusal — these are real, and each has a trigger.

| Item | Build it when |
|---|---|
| Client portal | Clients ask where to find past invoices |
| WhatsApp Cloud API | Pressing send yourself is genuinely a burden. Note the API number can no longer be used in the normal WhatsApp app |
| Recurring invoices | A retainer client exists |
| Multi-currency | An international client exists |
| Multi-channel inbox | Its own product decision, not part of invoicing |
| Proposals, CMS | After the portal |

## Open questions

- [ ] GST registration status, and whether e-invoicing applies — **confirm
      with your CA before the first live invoice**
- [ ] Confirm `support@tanvo.in` can receive mail — the site links to it and
      the contact form falls back to it
- [ ] Payment terms: net 15, net 30, or per project?
- [ ] Who else needs admin access, now and in six months?
