# TANVO Invoicing, Payments and Sharing

How an invoice is created, issued, shared, paid and recorded. This is the core
domain — read it before writing any invoice code.

## The one rule

**An invoice is a financial record, not a CRUD row.** Once issued it must not
change. Corrections happen through credit notes. Numbering must be sequential
with no gaps. These are not product preferences; if you are GST-registered
they are obligations, and the code has to enforce them because a careful
operator will not be enough.

> Tax specifics — registration thresholds, e-invoicing applicability, HSN/SAC
> requirements — change and depend on turnover. **Confirm the current rules
> with your CA before the first live invoice.** Treat everything in this
> document about tax as structure, not as tax advice.

## Invoice state machine

```text
DRAFT ──issue──► ISSUED ──share──► SENT ──payment webhook──► PAID
  │                 │                │
  │                 └────────────────┴──cancel──► CANCELLED
  └──delete (hard, only while draft)
```

| State | Editable | Meaning |
|---|---|---|
| `DRAFT` | Yes | Being written. No number. Can be deleted outright |
| `ISSUED` | **No** | Number assigned, totals frozen, PDF generated |
| `SENT` | No | Delivered to the client. `sent_at` recorded |
| `PAID` | No | Full payment captured and verified |
| `PARTIALLY_PAID` | No | Payments received, balance outstanding |
| `OVERDUE` | No | Derived, not stored: `due_date < today` and balance > 0 |
| `CANCELLED` | No | Voided. The number is retained and never reused |

`OVERDUE` is computed at query time. Storing it means a cron job that can fail
and leave the system lying about which invoices need chasing.

**Cancellation never deletes.** A cancelled invoice keeps its number and stays
in the table. A missing number in a sequence is what an audit asks about.

## Issuing

Issuing is a single database transaction. Everything in it succeeds together
or none of it happens:

1. Validate: at least one line item, a client with billing details, a due date.
2. **Recompute every amount server-side** from quantity, unit price and tax
   rate. Never persist a total that arrived from the browser.
3. Allocate the next number from `number_sequences` with a row lock.
4. Snapshot the client's billing details onto the invoice as `bill_to`.
5. Generate the public token, store **only its hash**.
6. Set `status = ISSUED`, `issued_at = now()`.

PDF generation and Payment Link creation happen **after** the transaction
commits. Both are network calls to third parties; neither should be able to
hold a database transaction open or roll back a legitimately issued invoice.
If PDF generation fails, the invoice still exists and the PDF can be retried.

### Numbering

Format: `TNV/25-26/0001` — prefix, Indian financial year, zero-padded counter.

- The counter resets per financial year (April to March).
- Allocation happens inside the issuing transaction, using `SELECT … FOR
  UPDATE` on the `number_sequences` row or an atomic increment. Two invoices
  issued in the same second must not collide.
- **Never** derive a number by counting existing invoices
  (`SELECT count(*) + 1`). Concurrent issues produce duplicates, and a deleted
  draft shifts every subsequent number.
- Credit notes use their own sequence: `CN-TNV/25-26/0001`.

Once allocated, a number is permanent — including for cancelled invoices.

## Payment links

Razorpay Payment Links, created server-side after the invoice is issued.

Send with the request:

| Field | Value |
|---|---|
| `amount` | The invoice total in paise. Server-computed, never client-supplied |
| `currency` | `INR` |
| `description` | Invoice number and a short project reference |
| `customer` | Name, email, `contact` (the E.164 phone) |
| `reference_id` | **The invoice id.** This is how the webhook is matched back |
| `expire_by` | Optional. A sensible window past the due date |
| `notify` | Razorpay's own email/SMS notification, if you want it in addition to your own sharing |

`reference_id` is the important one. When the webhook arrives, it identifies
the invoice directly — matching on amount is guesswork that breaks the moment
two invoices share a value.

Store `razorpay_payment_link_id` and the returned URL on the invoice.

### On branding the payment page

The hosted page carries your business name, logo and brand colour from the
Razorpay account settings, but the URL stays a Razorpay domain. Getting
`pay.tanvo.in/...` means hosting checkout yourself and taking on the payment
flow — **not worth it**. Clients trust a recognisable payment domain at the
moment money moves.

The better arrangement is already in the design: **our** invoice page at
`tanvo.in/i/<token>` carries TANVO's design and the line items; the Razorpay
page appears only after Pay Now is clicked.

## The public invoice page

`https://tanvo.in/i/<token>` — unauthenticated, because a client should not
need an account to read an invoice.

**Token requirements:**

- At least 128 bits of entropy from a CSPRNG. Not a uuid v4 that appears
  elsewhere, not a sequential id, not anything derived from the invoice number.
- Stored as a **hash** in `public_token_hash`. A database read should not hand
  an attacker working links to every invoice.
- Looked up by hash on each request.
- Optionally expiring after payment. The link is a bearer credential: anyone
  holding it sees the client's billing details and amounts.

The page renders server-side, resolves the token, and reads the single invoice
with the service role. It never exposes a table to the anon key.

Opening the page writes a `viewed` event to `invoice_events` — that is how you
know a client has actually seen an invoice before you chase it.

## Sharing

The Share control offers **WhatsApp**, **Email** and **Copy link**, with
WhatsApp primary.

### The constraint that shapes this

**A WhatsApp click-to-chat link carries text only — no attachments.** You
cannot send the PDF this way. So what gets shared is the link to the public
invoice page plus a short summary. That is the better artefact anyway: it is
branded, it has a Pay button, and it tells you when it was opened.

### WhatsApp (start here)

Build `https://wa.me/<phone_e164>?text=<urlencoded message>`.

```text
Hi {contact_name} — invoice {number} for {formatted_total} is ready.
Due {due_date}. View and pay: {public_url}
— TANVO
```

- `phone_e164` must be digits with country code and **no `+`, spaces or
  dashes**. This is why the column carries that constraint.
- Opens the WhatsApp app on mobile, WhatsApp Web on desktop, with the correct
  chat selected and the message pre-filled. **A human presses send.**
- Zero infrastructure, no approvals, works the day it is built.
- Write a `shared_whatsapp` event and set `sent_at`.

### Email

Resend, with the public link in the body and the PDF attached. Unlike
WhatsApp, email can carry the file.

### Native share sheet

Where `navigator.share()` exists — mobile, primarily — use it first so the
same button also offers Telegram, AirDrop and mail. Fall back to `wa.me`, then
to Copy link. This is progressive enhancement, not a separate feature.

### WhatsApp Business Cloud API — deferred, deliberately

Full automation, server-sent, no human in the loop. Requires a Meta Business
account, a verified WhatsApp Business number, and **pre-approved message
templates** for business-initiated messages. Invoice and payment notifications
are a standard approved category, but expect days of setup and per-message
pricing.

The real cost: **the number used with the API can no longer be used in the
regular WhatsApp app.** If that is your working number, this is disruptive.

Build it only when the volume of invoices makes pressing send yourself an
actual burden. For an agency sending a handful a month, it is not.

## Receiving payment

**The only event that marks an invoice paid is a signature-verified webhook.**

The browser redirect after payment is a convenience for the client. It is not
evidence — anyone who has seen the redirect URL once can replay it. Treat it
as a hint to display "checking payment…", nothing more.

### Webhook handler

1. **Verify the signature first**, before parsing anything. HMAC-SHA256 the
   raw request body with `RAZORPAY_WEBHOOK_SECRET` and compare against the
   `X-Razorpay-Signature` header using a **constant-time** comparison.
   - Use the **raw body**. If the framework parses JSON first and you
     re-serialise it, key order and whitespace change and the signature will
     never match.
   - Reject with 400 on mismatch, and log it. Do not proceed.
2. **Deduplicate.** Insert into `payments` keyed on the unique
   `razorpay_payment_id`. Razorpay retries; the same event will arrive more
   than once. The unique constraint makes a retry a no-op instead of a double
   credit.
3. Resolve the invoice via `reference_id`.
4. Recompute `amount_paid_minor` from the payments log and set `PAID` or
   `PARTIALLY_PAID` accordingly.
5. Write an `invoice_events` row.
6. **Return 2xx quickly.** Slow handlers get retried, which multiplies load
   exactly when payments are busiest. Queue email sending rather than doing it
   inline.

Handle at least `payment_link.paid` and `payment.captured`, plus
`payment.failed` for visibility. Also handle `refund.processed` if refunds are
ever issued.

### Reconciliation

Webhooks get missed — outages, expired endpoints, deploys at the wrong moment.
A daily job should fetch payment links updated in the last 48 hours and
reconcile against local state, logging anything that disagrees. Without it,
the first missed webhook is discovered by a client asking why they were chased
for an invoice they paid.

## Credit notes

The only correction mechanism for an issued invoice. A credit note references
the invoice, states a reason, carries an amount, and takes its own sequential
number. The original invoice stays exactly as issued; the balance is the
invoice total less credit notes less payments.

## Manual payments

Bank transfers and cash exist. Record them as `payments` rows with
`method = 'manual'`, an explicit actor in `invoice_events`, and a reference
field for the transaction id. The same derived balance logic then applies
without a special case.
