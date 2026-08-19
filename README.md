# Tanvo Tech — Enterprise Agency Platform

A modern digital agency platform featuring a **public marketing website**, a dedicated **Operations Admin OS**, a secure **Client Portal Workspace**, and **AI/Answer Engine Optimization (SEO/AEO/GEO)**.

Built with **React 19**, **Vite 8**, **Tailwind CSS v4**, and **React Router 7**.

---

## 🌐 Subdomain & Architecture Overview

The platform uses host-based subdomain routing to isolate public marketing traffic from client workspaces and administrative tooling:

| Domain / Host | Route Rendered | Purpose |
| :--- | :--- | :--- |
| **`tanvo.tech`** *(or `localhost:5173`)* | **Public Marketing Site** | High-performance agency marketing experience. Zero admin/portal clutter. |
| **`admin.tanvo.tech`** *(or `localhost:5173?app=admin`)* | **Operations Admin OS** | Agency CRM, proposals, invoicing, CMS, deliverables, unified inbox, and team workspace. |
| **`portal.tanvo.tech`** *(or `localhost:5173?app=portal`)* | **Client Portal Workspace** | Client project tracking, sprint updates, deliverables sign-offs, and invoice checkout. |

---

## 🚀 What Has Been Built & Delivered

### 1. 💼 Operations Admin OS (`admin.tanvo.tech`)
1. **Unified Multi-Channel 3-Pane Inbox (Email, WhatsApp, Instagram DMs)**:
   - **Left Pane**: Live conversation search, multi-channel filters (All, Email, WhatsApp, Instagram), status filters (Open, Pending, Resolved), unread-only toggle, and conversation preview cards with client/lead match badges.
   - **Middle Pane**: Thread history with channel-specific styling, **visually distinct internal team notes** (gold border + lock icon), channel-adaptive composer (plain text for WA/IG, subject + rich text for Email), and 1-click quick-insert template presets (`SPRINT_UPDATE`, `DELIVERABLE`, `INVOICE`, `WELCOME`).
   - **Right Pane**: Active contact context, linked Client / Lead / Project details, 1-click entity linker, and tag management.
   - **Connected Accounts Surface**: 3 configuration cards for Google Workspace (Email), WhatsApp Business Cloud API, and Instagram Graph API DMs showing *"Not connected yet"* status with API credential slots.
2. **Enterprise Invoicing, PDF Export & Receivables Ageing Engine**:
   - **Sequential Financial Year Numbering**: Collision-free series generator (e.g. `TNV/25-26/0001`, `TNV/25-26/0002`).
   - **Full 7-Stage Status Lifecycle**: `Draft` → `Sent / Issued` → `Viewed by Client` → `Partially Paid` → `Paid in Full` → `Overdue` → `Cancelled`.
   - **Locked Invoices & Credit Notes**: Issued invoices are locked against item modification; linked Credit Notes (`CN-TNV/25-26/0001`) allow accounting corrections and automatic balance adjustments.
   - **Recurring Retainers & SLA Schedules**: Retainer profiles with monthly, quarterly, or bi-weekly cadence and 1-click batch generation.
   - **Manual Payment Entry Modal**: Record partial or full payments with payment modes (UPI, Bank Wire, Card, Cash), transaction UTR reference #, and notes.
   - **Receivables Ageing Analysis**: Real-time KPI breakdown across `Current / Not Due`, `1–30 Days Overdue`, `31–60 Days Overdue`, `61–90 Days Overdue`, and `90+ Days Overdue`.
   - **Direct Downloadable Official PDF**: Generates and downloads a clean letterhead PDF document with SAC tax codes (`998311`, `998313`, `998314`, `998319`), 18% GST breakdown, corporate bank wire details, and dynamic UPI QR code.
3. **Pipeline Kanban Board**:
   - Drag-and-drop project stage management (`Upcoming`, `In Progress`, `Completed`), target dates, categories, and progress tracking.
4. **7-Stage CRM Leads Funnel**:
   - Full lead stages (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Negotiation`, `Won`, `Lost`) with lost deal reason capture.
   - **1-Click Convert to Client**: Instantly provisions a client profile, generates an access code (`COMPANY-2026`), and creates an active project workspace.
5. **Interactive Proposal & Quote Builder**:
   - Auto-pulls deliverables from the Services catalog.
   - Dual-currency calculations (INR / USD) with line-item discounts, 18% GST calculation, and 0% Export LUT tax exemptions.
6. **Clients & Accounts Directory**:
   - GSTIN, PAN, billing addresses, currency preferences, payment terms (Net 15/30), and portal access codes.
   - Direct 1-click **"Open Client Workspace"** deep-linking directly into that client's live view.
7. **Deliverables Review Queue**:
   - Cross-project deliverable tracker with live approval statuses (`pending`, `approved`, `needs-revision`).
8. **Services & Case Studies CMS**:
   - Full CRUD for service packages (SAC codes, pricing, deliverables checklist) and portfolio case studies (Problem, Solution, Outcome, metrics, client testimonials).
9. **Requests & Support Tickets**:
   - Two-way messaging between the agency team and clients with status workflows (`open`, `in-progress`, `resolved`).
10. **Data Management & Clean State Purge**:
    - **Export Full Store JSON** timestamped backups.
    - **Import Store JSON** data restoration.
    - **1-Click "Remove Sample Records"**: Purges all mock data across 15+ tables so you can start using the system immediately for real client projects.

---

### 2. 🛡️ Client Portal Workspace (`portal.tanvo.tech`)
1. **Access Code Login & Magic Deep-Linking**:
   - Clients can log in using their unique code (`NEURAL-2026`) or arrive via direct link (`portal.tanvo.tech?code=NEURAL-2026`).
2. **Live Project Milestones & Roadmap**:
   - Real-time sprint progress, completion percentages, target delivery dates, and status badges.
3. **Sprint Updates & Changelog Stream**:
   - Chronological engineering notes on staging deployments, API integrations, and security patches.
4. **Deliverables Review & 1-Click Sign-Off**:
   - Clients can **Approve Deliverable** or **Request Revisions** with inline feedback notes.
5. **Dual-Currency Invoicing & Payment Settlement**:
   - **INR Invoices**: Live dynamic UPI QR code generator (`upi://pay?pa=tanvotech@hdfcbank...`) for Google Pay / PhonePe + Razorpay checkout.
   - **USD / International Invoices**: 256-bit encrypted card checkout + ACH / SWIFT bank wire details.
6. **Support & Scope Addition Wizard**:
   - Categorized request submission directly routed to the admin team.

---

### 3. 📲 Outbound Communications Dispatcher
- **Dual-Channel Outbound Dispatch**:
  - **🟢 Direct WhatsApp Delivery**: 1-click opens WhatsApp with formatted markdown (bold text, bullet points, staging link, and portal access URL).
  - **🔵 Direct Email Delivery**: 1-click opens default mail client with pre-filled subject and structured body.
- **Built-in Notification Presets**:
  - 🚀 *Sprint & Staging Deployment Update*
  - 📋 *Deliverable Ready for Sign-Off*
  - 💳 *Invoice Due & Payment Link*
  - 🤝 *Welcome & Client Portal Credentials*
  - ✍️ *Custom Announcement*
- **Dispatch Audit History**:
  - Timestamped log of every communication dispatched, recipient phone/email, channel badge, and delivery status.

---

### 4. 🔍 SEO, AEO & GEO Optimization
1. **Traditional SEO**:
   - Dynamic canonical URLs, Open Graph tags (`og:title`, `og:image`, `og:url`), and Twitter Cards.
   - Web App Manifest (`public/manifest.json`) and XML Sitemap (`public/sitemap.xml`) with Google Image extensions.
2. **Answer Engine Optimization (AEO)**:
   - Schema.org JSON-LD graph (`Organization`, `WebSite`, `ProfessionalService`, `FAQPage`, `BreadcrumbList`) enabling **Perplexity**, **ChatGPT Search**, **Google Gemini / AI Overviews**, and **Claude** to quote and cite Tanvo Tech directly.
3. **Generative Engine Optimization (GEO)**:
   - **[`public/llms.txt`](public/llms.txt)**: Industry-standard markdown index for LLMs detailing core capabilities, engineering stack, and proof metrics.
   - **[`public/llms-full.txt`](public/llms-full.txt)**: Deep technical dossier with legal tax SAC codes, SLA warranties, IP ownership transfer guarantee, and pricing benchmarks.
   - **[`public/robots.txt`](public/robots.txt)**: Explicit permissions for AI crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, etc.).

---

### 5. 🔀 Smart Routing & Platform-Wide Logo
- **Seamless 404 Elimination**:
  - Any mistyped URL automatically redirects straight back to the Homepage (`/`).
  - Visiting `tanvo.tech/admin` smart-redirects to `https://admin.tanvo.tech`.
  - Visiting `tanvo.tech/portal` smart-redirects to `https://portal.tanvo.tech`.
- **Platform-Wide SVG Logo**:
  - Uses [`public/tanvo-logo.svg`](public/tanvo-logo.svg) across all headers, footers, hero centerpieces, portal dashboards, admin gates, and browser favicons.

---

## 🛠️ Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (never commit real secrets)
cp .env.example .env

# 3. Start local development server
npm run dev
```

### Local Testing URLs:
- **Public Marketing Site**: `http://localhost:5173`
- **Operations Admin OS**: `http://localhost:5173/?app=admin` (or `http://admin.localhost:5173`)
- **Client Portal Workspace**: `http://localhost:5173/?app=portal` (or `http://portal.localhost:5173`)

### Admin Credentials:
- **Password**: `admin123` (or click **"⚡ 1-Click Dev Instant Unlock"** on login).

---

## 📦 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server with Vite HMR |
| `npm run build` | Compiles production bundle into `dist/` |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs Oxlint across all files (0 warnings, 0 errors) |
| `npm run lint:fix` | Automatically fixes linter warnings |
| `npm run admin:hash` | Generates a new PBKDF2 hash & salt for admin authentication |

---

## 📄 License & Ownership
Copyright © 2026 Tanvo Tech Private Limited. All rights reserved.
