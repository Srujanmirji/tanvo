# TANVO Backend Security

This system holds client contact details, billing addresses, GSTINs, contract
values and payment records, and it moves real money. Treat it accordingly.

Controls are grouped by the thing that can go wrong, because a list of
mitigations with no attached threat is a list nobody re-reads.

---

## 0. Immediate: the Razorpay key in the repository

`rzp-key.csv` is in the repository root, is **not** in `.gitignore`, and is
untracked. One `git add .` publishes it to GitHub permanently — the commit
survives deletion, and public repositories are scraped for credentials within
minutes.

**Do now:**

- [ ] Move the file out of the repository entirely
- [ ] Add `*.csv`, `*-key*`, `.env*` (except `.env.example`) to `.gitignore`
- [ ] **Rotate the key in the Razorpay dashboard** if it was ever committed,
      pushed, emailed, or shared in chat — assume exposure rather than hoping
- [ ] Run a history scan (`gitleaks detect`, or `git log -p -S 'rzp_'`) before
      the repository is made public
- [ ] Store credentials in the Vercel and Supabase environment settings, and
      nowhere else

A leaked Razorpay secret key allows API calls against your account. This is
the highest-severity item in this document.

---

## 1. Secrets

**Threat:** a key reaches the browser bundle, the repository, or a log, and is
used against your account.

- Server-only secrets never carry a `VITE_` or `NEXT_PUBLIC_` prefix. Both
  prefixes mean "inline this into the JavaScript every visitor downloads".
- `SUPABASE_SERVICE_ROLE_KEY` **bypasses Row-Level Security entirely.** It is
  a full-database credential. Server-side only, never in a client component,
  never in a response body.
- Test and live Razorpay credentials live in separate environments from the
  first commit. A test key in production accepts payments that never arrive; a
  live key in development charges real cards.
- Never log a full request body from Razorpay or Supabase, and never log
  headers — signatures and tokens live there.
- Rotate on any staff change and on any suspected exposure.

## 2. Authentication

**Threat:** someone who is not you reaches the admin panel.

- **Supabase Auth, server-verified.** The existing
  `VITE_ADMIN_PASSWORD_HASH` / `VITE_ADMIN_SALT` scheme is obfuscation — the
  hash ships in the bundle and the comparison runs in the browser, so it is
  bypassed from devtools in seconds. It must not guard money or client data,
  and both variables should be deleted when the admin panel ships.
- Enforce **MFA** on the admin account. It is the only account with access to
  every client record you hold.
- Verify the session **on the server** for every admin route. Hiding a nav
  link is not access control; the route underneath is what matters.
- Short session lifetimes with refresh. An admin session that lives forever on
  a laptop is a credential.
- Enforce MFA on the Razorpay, Supabase and Vercel dashboard logins too. The
  application being secure does not help if the dashboard is not.

## 3. Authorization

**Threat:** one client reads another client's invoices.

- **RLS enabled on every table, without exception.** The anon key is public by
  design; RLS is the only thing between it and the database. A single table
  with RLS switched off is an open table.
- Default deny. Write policies that grant, never policies that exclude.
- The public invoice page reads server-side with the service role, scoped to
  one resolved row — it does not expose a table to the anon key.
- When the client portal arrives, test policies **with the anon key directly**,
  not only through the UI. The app not offering a query is not the same as the
  database refusing it.
- Every server route re-derives identity from the verified session. Never from
  a client id in the request body — that is an IDOR waiting to happen.

## 4. Payment integrity

**Threat:** an invoice is marked paid without money arriving.

- **Only a signature-verified webhook sets `PAID`.** The post-payment browser
  redirect is a display hint, replayable by anyone who has seen the URL.
- Verify HMAC-SHA256 over the **raw request body** against
  `X-Razorpay-Signature`, using a **constant-time** comparison
  (`crypto.timingSafeEqual`). A `===` comparison leaks timing information.
- Parse the body **after** verification, never before.
- Framework note: re-serialising parsed JSON changes whitespace and key order,
  so the signature will never match. Capture the raw body explicitly.
- **Amounts are computed server-side** from stored line items. A submitted
  total is input, not truth — validate and reject on mismatch.
- Idempotency: a unique constraint on `razorpay_payment_id`. Retried
  deliveries must be no-ops, not double credits.
- Confirm the webhook amount matches the invoice total before marking paid.
- Restrict the webhook endpoint to Razorpay's published source ranges if
  practical, but **never in place of signature verification**.

## 5. Public invoice links

**Threat:** invoice URLs are guessed or leaked, exposing client financial data.

The token is a bearer credential — whoever holds it sees the invoice.

- At least 128 bits of entropy from a CSPRNG. Never sequential ids, never a
  uuid that appears elsewhere in the system, never anything derived from the
  invoice number.
- Store the **hash**, look up by hash. A database read must not yield working
  links to every invoice.
- `X-Robots-Tag: noindex` and a `robots.txt` disallow on `/i/*`. A client
  forwarding a link into an indexed context is otherwise how invoices reach
  search results.
- Rate limit by IP: token guessing should be expensive.
- Consider expiry after payment, and support revoking and reissuing a token if
  a client says a link was forwarded in error.
- The page shows only what the invoice needs. No internal notes, no project
  margins, no other invoices.

## 6. Input validation

**Threat:** malformed or hostile input corrupts data or executes.

- Validate every input at the boundary with a schema (Zod), including webhook
  payloads after signature verification.
- Parameterised queries only. The Supabase client does this; any raw SQL must
  use bind parameters — never string interpolation.
- Validate `phone_e164` on write. It is interpolated into a `wa.me` URL, so
  it must be digits only, and it must be URL-encoded at the point of use.
- Escape and encode anything client-supplied that reaches the invoice PDF or
  the public page. A line item description is user input.
- Cap sizes: line items per invoice, characters per field, upload bytes.

## 7. File storage

**Threat:** invoice PDFs are readable by anyone with the URL.

- Private Supabase Storage buckets. **Never public.**
- Serve PDFs through short-lived signed URLs generated per request, after the
  session or token check.
- Validate content type and size on upload; never trust a client-supplied
  filename as a storage path.

## 8. Rate limiting and abuse

**Threat:** brute force against tokens or login, or cost amplification.

- Rate limit the login route, the public invoice route, and any share or send
  action.
- Sending email and WhatsApp costs money and reputation — cap sends per
  invoice per hour.
- Cloudflare or Vercel's firewall in front of the public routes.

## 9. Auditability

**Threat:** something is wrong with an invoice and nobody can say what
happened.

- `invoice_events` records every meaningful action: created, issued, shared,
  viewed, paid, cancelled — with actor and timestamp.
- The `payments` table is append-only. Never update a payment row.
- Keep the verified webhook payload in `raw_payload`. In a payment dispute it
  is the evidence.
- Cancelled invoices retain their numbers. Gaps in a sequence are what an
  audit asks about.

## 10. Data protection

**Threat:** a breach exposes client personal and financial data.

- Collect the minimum. There is no reason to store card details — Razorpay
  holds those, and storing them would pull you into PCI-DSS scope. **Do not.**
- Postgres encryption at rest is handled by Supabase; TLS everywhere in
  transit; HSTS on all domains.
- Restrict who has Supabase dashboard access, and review it when people leave.
- Have a documented retention position for old invoices, and a plan for a
  client asking for their data to be removed. Note that tax record-keeping
  obligations may require retention regardless — confirm with your CA.
- Backups: Supabase's automated backups plus a periodic export you hold
  yourself. **Test a restore before you need one.**

## 11. Dependencies and deployment

- `npm audit` in CI; keep Supabase, Next.js and the Razorpay SDK current.
- Pin versions; review changelogs before major upgrades.
- Preview deployments must never point at the production database or live
  Razorpay keys.
- No source maps exposing server code in production.
- Security headers on the admin app and public routes:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; frame-ancestors 'none'
```

---

## Pre-launch checklist

Nothing goes live with an unticked box.

**Secrets**
- [ ] `rzp-key.csv` removed from the repository and the key rotated
- [ ] No secret carries a `VITE_` or `NEXT_PUBLIC_` prefix
- [ ] Service role key exists only in server environment settings
- [ ] Test and live Razorpay keys separated by environment
- [ ] History scanned for committed credentials

**Access**
- [ ] MFA on admin, Razorpay, Supabase and Vercel accounts
- [ ] RLS enabled on **every** table, verified by querying with the anon key
- [ ] Server-side session check on every admin route
- [ ] `VITE_ADMIN_PASSWORD_HASH` and `VITE_ADMIN_SALT` deleted

**Money**
- [ ] Webhook signature verified over the raw body, constant-time comparison
- [ ] Unique constraint on `razorpay_payment_id` proven by replaying an event
- [ ] Totals recomputed server-side; a tampered total is rejected
- [ ] Webhook amount checked against invoice total
- [ ] Reconciliation job running and alerting
- [ ] A test-mode payment has completed end to end

**Exposure**
- [ ] Invoice tokens ≥128 bits, stored hashed
- [ ] `/i/*` set to noindex and rate limited
- [ ] Storage buckets private, PDFs served by signed URL
- [ ] Security headers present in production

**Recovery**
- [ ] Backups enabled **and a restore tested**
- [ ] Runbook written for a leaked key and for a missed-webhook day
