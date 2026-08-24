# TANVO Backend Architecture

The operations backend behind `tanvo.in`: an admin panel for running the
agency, and the client-facing surfaces it produces.

## What this system does

| Capability | Description |
|---|---|
| Clients | Company, contacts, phone (E.164), billing address, GSTIN |
| Projects | Belong to a client. Status, dates, value, deliverables |
| Invoices | Line items, tax, totals. Issued, sent, paid, overdue, cancelled |
| Payments | Razorpay Payment Links. Status arrives by webhook, never by browser |
| Sharing | One click from an invoice to WhatsApp, email, or a copied link |
| Public invoice page | Unauthenticated, token-addressed, pay button |

Everything else in earlier drafts of this project — a multi-channel inbox,
proposals, a CMS, a full client portal — is **out of scope** until the above
runs in production for real invoices. See [Scope discipline](#scope-discipline).

## Build versus buy

This was a real decision, recorded here so it is not re-argued later.

Zoho Books and Refrens already do clients, invoices, GST formats and payment
collection for less per year than a few days of engineering. **If invoicing
were the only goal, buying is the correct answer.**

We build because the invoice is intended to be a TANVO-branded artefact and
because the client portal — project tracking, sprint updates, sign-offs — is
the eventual product, with invoicing as one tab inside it. That is a
defensible reason to own the stack. It is not a reason to rebuild an
accounting package: bookkeeping, ledgers, tax filing and reconciliation stay
with the accountant's tooling. We produce the invoice and collect the money.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Database, auth, storage | **Supabase** | Postgres, Auth, Storage and Row-Level Security in one managed service. RLS lets "admin sees everything, a client sees only their own rows" be a database policy rather than a check we might forget on one endpoint |
| Admin application | **Next.js (App Router) on Vercel** | Server routes are required — see [Why a server is mandatory](#why-a-server-is-mandatory). App Router keeps server actions, PDF generation and webhook handlers in one deployable |
| Payments | **Razorpay Payment Links** | Account already exists. Hosted payment page covers UPI, cards, netbanking and wallets with no checkout code of our own |
| Transactional email | **Resend** | Invoice delivery and portal invitations |
| Marketing site | **Existing Vite + React app**, unchanged | It works, it is WebGL-heavy, and it has no reason to become a Next.js app |

### Why a server is mandatory

The marketing site is a Vite SPA. Every `VITE_*` variable is inlined into the
browser bundle at build time and is therefore public. Three requirements make
a server non-optional:

1. **The Razorpay secret key** signs API calls and must never reach a browser.
2. **Webhook signature verification** needs the webhook secret and must happen
   server-side. A browser reporting "payment succeeded" can be forged by
   anyone who reads the redirect URL.
3. **Invoice totals** must be computed and stored server-side. A client that
   can post its own amount can post `1`.

This is the single reason the admin panel cannot live inside the existing SPA,
independent of any preference about frameworks.

## Application topology

Three deployables, one Supabase project.

```text
tanvo.in              Marketing site      Vite SPA, static, unchanged
admin.tanvo.in        Admin panel         Next.js, authenticated, Vercel
tanvo.in/i/<token>    Public invoice      Next.js route, unauthenticated
```

The public invoice page is served by the admin Next.js app and mapped onto the
main domain by a rewrite, so clients never see an `admin.` URL.

### Why the admin panel is a separate app

- Secrets cannot live in the SPA bundle, as above.
- The marketing bundle already ships roughly 490 KB of Three.js. An admin
  dashboard does not belong in the same download as the hero crystal.
- The marketing site is finished and performs. Rewriting it into Next.js to
  obtain server routes would be work spent to gain nothing.

Same repository, two Vercel projects with different root directories.

## Repository layout

```text
frontend/     Marketing website (Vite + React + Three.js)
backend/      Admin panel, API routes, database migrations, these documents
```

See [TASKS.md](./TASKS.md) Phase 1 for the split, and the root `README.md` for
how to run each side.

## Data flow: invoice to cash

```text
Admin creates invoice          Draft in Postgres, editable
        │
Admin issues invoice           Number assigned, row frozen, PDF stored
        │
Server creates Payment Link    Razorpay returns a hosted URL
        │
Admin clicks Share             WhatsApp / email / copy, carrying tanvo.in/i/<token>
        │
Client opens the link          Public invoice page, our branding, Pay button
        │
Client pays                    Razorpay's hosted page handles the money
        │
Razorpay calls our webhook     Signature verified, invoice marked PAID
        │
Admin sees PAID                Ledger row written, receipt emailed
```

The client's browser is never trusted at any step. The only event that moves
an invoice to `PAID` is a signature-verified webhook. Full detail in
[INVOICING.md](./INVOICING.md).

## Environment variables

Server-side only. None of these may be prefixed `VITE_` or `NEXT_PUBLIC_`.

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=      # bypasses RLS — server only, never shipped
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=            # signs API calls
RAZORPAY_WEBHOOK_SECRET=        # verifies inbound webhooks
RESEND_API_KEY=
INVOICE_TOKEN_PEPPER=           # additional entropy for public invoice tokens
APP_BASE_URL=https://tanvo.in
```

Browser-safe, on the admin app only:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # public by design, safe only because RLS is enforced
```

The anon key is safe to expose **only if every table has RLS enabled**. An
un-policied table plus a public anon key is an open database. See
[SECURITY.md](./SECURITY.md).

Keep test-mode and live-mode Razorpay credentials in separate environments
from the first commit. A test key in production silently accepts payments that
never arrive; a live key in development takes real money from real cards.

## What replaces the current admin gate

`frontend/.env.example` describes `VITE_ADMIN_PASSWORD_HASH` and
`VITE_ADMIN_SALT`, and the file itself notes this is obfuscation rather than
authentication. It is client-side: the hash ships in the bundle and the check
runs in the browser, so anyone can step past it in devtools.

It cannot guard client data or money. Supabase Auth replaces it entirely, and
both variables should be deleted when the admin panel ships so nobody mistakes
them for a security control.

## Scope discipline

Ship in the order given in [TASKS.md](./TASKS.md). The first milestone that
matters is **one real invoice, sent to one real client, paid**. Every feature
that does not serve that milestone waits.

Specifically deferred, with the reasoning:

- **Client portal** — needs client auth, invitations and a permission model.
  Worth building, but after invoicing earns its keep.
- **Multi-channel inbox** — WhatsApp Business Cloud API and the Instagram
  Graph API each carry their own review process and per-message pricing. This
  is a product in itself, not a feature of an invoicing tool.
- **Recurring invoices, multi-currency, credit notes** — add when a real
  client requires one, not in anticipation.

## Related documents

- [DATA_MODEL.md](./DATA_MODEL.md) — tables, relationships, RLS policies
- [INVOICING.md](./INVOICING.md) — invoice lifecycle, payment links, sharing
- [SECURITY.md](./SECURITY.md) — threats, controls, pre-launch checklist
- [TASKS.md](./TASKS.md) — phased build plan
