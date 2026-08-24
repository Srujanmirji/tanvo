# TANVO Data Model

Postgres on Supabase. Every table has Row-Level Security enabled — see
[SECURITY.md](./SECURITY.md) for why that is not optional.

## Principles

1. **Money is never a float.** Store minor units (paise) as `bigint`, or
   `numeric(12,2)`. Never `float` or `real` — `0.1 + 0.2` is not `0.3`, and
   that error compounds across line items.
2. **Currency travels with every amount.** A bare number is a bug waiting for
   the first international client.
3. **Issued invoices are immutable.** Corrections happen through credit notes,
   not edits. See [INVOICING.md](./INVOICING.md).
4. **Money-changing events are appended, never updated.** The payments table
   is a log. An invoice's paid state is derived from it.
5. **Timestamps are `timestamptz`**, stored UTC, rendered in Asia/Kolkata.

## Tables

### `clients`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` pk | |
| `company_name` | `text` not null | |
| `contact_name` | `text` | |
| `email` | `text` | Validated on write |
| `phone_e164` | `text` | **Digits with country code, no `+`, spaces or dashes** — `919876543210` |
| `billing_address` | `jsonb` | Line 1/2, city, state, postal code, country |
| `gstin` | `text` | Nullable. Format-checked when present |
| `place_of_supply` | `text` | Indian state code. Decides CGST+SGST versus IGST |
| `notes` | `text` | |
| `created_at` / `updated_at` | `timestamptz` | |

`phone_e164` carries the format constraint because the WhatsApp share link is
built directly from it. A number stored as `98765 43210` produces a dead link
with no error — normalise on write, and store the country code as part of the
value rather than assuming +91.

### `projects`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` pk | |
| `client_id` | `uuid` fk → `clients` | |
| `name` | `text` not null | |
| `status` | `text` | `lead`, `active`, `on_hold`, `delivered`, `archived` |
| `starts_on` / `ends_on` | `date` | |
| `value_minor` / `currency` | `bigint` / `char(3)` | Agreed value, for pipeline reporting |
| `created_at` / `updated_at` | `timestamptz` | |

### `invoices`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` pk | |
| `client_id` | `uuid` fk → `clients` | |
| `project_id` | `uuid` fk → `projects` | Nullable |
| `number` | `text` unique | **Null while draft.** Assigned once, at issue |
| `status` | `text` | See the state machine in [INVOICING.md](./INVOICING.md) |
| `issue_date` / `due_date` | `date` | |
| `currency` | `char(3)` | `INR` |
| `subtotal_minor` | `bigint` | Server-computed from line items |
| `tax_minor` | `bigint` | Server-computed |
| `total_minor` | `bigint` | Server-computed |
| `amount_paid_minor` | `bigint` | Derived from `payments`, cached for querying |
| `notes` / `terms` | `text` | |
| `public_token_hash` | `text` | **Hash** of the public URL token, never the token |
| `pdf_path` | `text` | Supabase Storage path, written at issue |
| `razorpay_payment_link_id` | `text` | |
| `razorpay_payment_link_url` | `text` | |
| `issued_at` / `sent_at` / `paid_at` / `cancelled_at` | `timestamptz` | |
| `created_at` / `updated_at` | `timestamptz` | |

**No client name, address or GSTIN is stored as a foreign key alone.** At
issue, the client's billing details are snapshotted onto the invoice (a
`bill_to` `jsonb` column). An invoice is a legal record of what was billed to
whom at that date; if the client later moves office, historic invoices must
not silently change address.

### `invoice_line_items`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` pk | |
| `invoice_id` | `uuid` fk → `invoices` on delete cascade | |
| `position` | `int` | Display order |
| `description` | `text` not null | |
| `quantity` | `numeric(10,2)` | |
| `unit_price_minor` | `bigint` | |
| `tax_rate` | `numeric(5,2)` | Percent, e.g. `18.00` |
| `hsn_sac` | `text` | Nullable. Required on GST invoices |
| `amount_minor` | `bigint` | Server-computed |

Never accept a client-supplied total. Recompute every amount server-side from
quantity, unit price and tax rate, and reject the request if the submitted
total disagrees.

### `payments`

Append-only. Rows are inserted by the webhook handler, never edited.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` pk | |
| `invoice_id` | `uuid` fk → `invoices` | |
| `amount_minor` / `currency` | `bigint` / `char(3)` | |
| `method` | `text` | `upi`, `card`, `netbanking`, `wallet`, `manual` |
| `razorpay_payment_id` | `text` **unique** | The idempotency key |
| `razorpay_event_id` | `text` unique | Duplicate webhook deliveries collapse here |
| `status` | `text` | `captured`, `failed`, `refunded` |
| `raw_payload` | `jsonb` | The verified webhook body, kept for disputes |
| `received_at` | `timestamptz` | |

The unique constraint on `razorpay_payment_id` is the safety net that makes
webhook retries harmless. Razorpay will deliver the same event more than once;
without this, an invoice can be marked paid twice and the ledger drifts.

### `credit_notes`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` pk | |
| `invoice_id` | `uuid` fk → `invoices` | |
| `number` | `text` unique | Its own sequence, `CN-…` |
| `reason` | `text` not null | |
| `amount_minor` | `bigint` | |
| `issued_at` | `timestamptz` | |

### `invoice_events`

The audit trail. Who did what to which invoice, and when.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` pk | |
| `invoice_id` | `uuid` fk → `invoices` | |
| `actor` | `text` | User id, or `system` for webhook-driven events |
| `event` | `text` | `created`, `issued`, `shared_whatsapp`, `viewed`, `paid`, `cancelled` |
| `metadata` | `jsonb` | |
| `created_at` | `timestamptz` | |

`viewed` is written when the public invoice page is opened. It is how you know
a client has actually seen the invoice before chasing payment.

### `number_sequences`

| Column | Type | Notes |
|---|---|---|
| `key` | `text` pk | `invoice:2025-26`, `credit_note:2025-26` |
| `next_value` | `int` not null | |

Allocation happens inside the issuing transaction, using `SELECT … FOR UPDATE`
or an atomic increment. Two invoices issued in the same second must not
receive the same number, and the sequence must not skip. See
[INVOICING.md](./INVOICING.md#numbering).

## Row-Level Security

RLS is enabled on every table without exception. The anon key is public by
design; RLS is the only thing standing between it and the whole database.

Two roles today:

| Role | Access |
|---|---|
| `admin` | Full read and write across all tables |
| `anon` | **No table access at all** |

The public invoice page does **not** read tables through the anon key. It runs
server-side, resolves the token, and reads with the service role. That keeps
the public surface to exactly one row, fetched by code we control, rather than
a policy that has to be perfect.

When the client portal arrives, a third role joins:

| Role | Access |
|---|---|
| `client` | Read-only, restricted to rows whose `client_id` matches the claim on their JWT |

Write those policies as `USING (client_id = auth.jwt() ->> 'client_id')` on
every client-visible table, and test them with the anon key directly — not
only through the app.

## Indexes

- `invoices (status, due_date)` — the overdue list, the most frequent query
- `invoices (client_id)` — client detail pages
- `invoices (public_token_hash)` — every public invoice page load
- `payments (invoice_id)`
- `invoice_line_items (invoice_id, position)`

## Migrations

Every schema change is a checked-in SQL migration under
`backend/supabase/migrations/`, applied through the Supabase CLI. No schema
edits through the dashboard: an undocumented column is a column that will not
exist in production.
