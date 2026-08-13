# Tanvo Tech

Marketing site and private content dashboard for Tanvo Tech — a digital
agency building web, mobile, AI, and automation work.

Built with React 19, Vite 8, Tailwind CSS v4, and React Router 7.

---

## Quick start

```bash
npm install
cp .env.example .env      # then fill it in
npm run admin:hash        # generates the two admin lines for .env
npm run dev
```

Open http://localhost:5173. The dashboard is at `/admin`.

## Scripts

| Command              | What it does                                             |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | Dev server with HMR                                       |
| `npm run build`      | Production build into `dist/`                             |
| `npm run preview`    | Serve the built output locally                            |
| `npm run lint`       | Oxlint over the source                                    |
| `npm run lint:fix`   | Oxlint with autofix                                       |
| `npm run admin:hash` | Generate the admin password hash + salt for `.env`        |
| `npm run images`     | Compress `public/images` to WebP + JPEG (run after adding art) |
| `npm run shots`      | Screenshot every breakpoint and fail on horizontal overflow |

`npm run shots` needs a dev server already running, and drives your
installed Chrome or Edge — no browser is downloaded. Output lands in
`.screenshots/` (gitignored). Pass a URL if you are not on the default
port: `npm run shots -- http://localhost:5174`.

## Environment

Every `VITE_*` variable is **compiled into the public bundle**. Never put a
real secret in one. See [.env.example](.env.example) for the full list; the
short version:

- `VITE_SITE_URL` — canonical origin, no trailing slash
- `VITE_CONTACT_*` — email, phone, location (blank values are hidden, not faked)
- `VITE_SOCIAL_*` — full profile URLs (blank ones are hidden)
- `VITE_CONTACT_ENDPOINT` — where the contact form POSTs JSON
- `VITE_ADMIN_SALT` / `VITE_ADMIN_PASSWORD_HASH` — from `npm run admin:hash`

---

## Project structure

```
src/
  admin/         Dashboard UI — gate, board, panels, dialogs
  components/    Public site sections and shared UI
  data/seed.js   Default content shipped with the build
  hooks/         Reveal, reduced motion, modal behaviour, auth
  lib/           Constants, content store, admin gate logic
  pages/         One component per route
```

### Page width

Every section wraps its content in `.container-page`, defined once in
[src/index.css](src/index.css):

```css
.container-page {
  max-width: 100rem;                        /* 1600px */
  margin-inline: auto;
  padding-inline: clamp(1.25rem, 3.5vw, 4.5rem);
}
```

Change those two values to retune the whole site's measure — the class
replaced a `max-w-7xl mx-auto px-6 md:px-12` string that was duplicated
across nine files.

The cap is deliberately generous (1600px, not Tailwind's 1280px
`max-w-7xl`) so the layout fills a 1920+ display instead of stranding
content in a narrow strip. Long-form text is constrained separately
(`max-w-2xl` on leads and prose), so line length stays readable no
matter how wide the container gets. Headings step up at `xl:`/`2xl:`
for the same reason.

### Global scale

Type, spacing and gaps all grow on large displays by stepping the root
font size, since Tailwind sizes in `rem`:

```css
@media (width >= 1536px) { html { font-size: 17px; } }
@media (width >= 1920px) { html { font-size: 18px; } }
@media (width >= 2400px) { html { font-size: 19px; } }
```

Two consequences worth remembering:

- `.container-page`'s `max-width` is in **px, not rem**, on purpose. In
  rem it scaled along with the root size and the container grew to
  1900px on a 1920px display, leaving a 10px margin.
- Don't stack a `2xl:` type step on top of this. The root scale is
  already doing that work; doing both broke the hero headline onto two
  lines.

### Intro screen

[src/components/Preloader.jsx](src/components/Preloader.jsx) shows an
animated logo build on first load. It is deliberately restrained:

- **once per browser session**, not on every route change
- **never blocks past 3.6s**, even if an asset stalls
- **skipped entirely** under `prefers-reduced-motion`
- dismissible with Escape, a click, or the Skip button
- page content is always in the DOM underneath, so crawlers and screen
  readers are unaffected

Tune `MIN_VISIBLE_MS` / `MAX_VISIBLE_MS` at the top of that file, and the
animation itself under `--- Intro overlay ---` in `index.css`.

### Styling — one rule worth knowing

[src/index.css](src/index.css) is organised into Tailwind v4's cascade
layers: base resets in `@layer base`, reusable classes in
`@layer components`, and only the `prefers-reduced-motion` overrides
left unlayered.

**Do not add plain, unlayered CSS to that file.** Unlayered rules beat
every layered rule regardless of specificity, so an innocent-looking
`* { margin: 0 }` outside a layer silently defeats `mx-auto`, `p-8`, and
every other Tailwind utility on the page. Put new base rules in
`@layer base` and new classes in `@layer components`, and utilities will
keep overriding them as intended.

### Content flow

Content lives in [src/data/seed.js](src/data/seed.js) and is loaded into an
observable store ([src/lib/store.js](src/lib/store.js)) backed by
`localStorage`. Components read it through `useContent()`, which subscribes
via `useSyncExternalStore` — so an edit in the dashboard updates the public
page instantly, and stays in sync across browser tabs.

**`localStorage` is per-browser.** Your dashboard edits are visible to you,
not to visitors. To publish them:

1. Edit on the **Pipeline** and **Achievements** tabs
2. **Data → Export JSON**
3. Paste the `projects` and `achievements` arrays into `src/data/seed.js`
4. Commit and redeploy

If you outgrow that, swap `src/lib/store.js` for a real API — everything
reads through `useContent()`, so nothing else has to change.

### What is public vs private

| Status        | Shows on the public site        |
| ------------- | ------------------------------- |
| `completed`   | Yes, badged "Shipped"           |
| `in-progress` | Yes, badged "In build"          |
| `upcoming`    | **No** — internal pipeline only |

Achievements are always public.

---

## The admin route

`/admin` is gated by a password, `noindex`ed, disallowed in `robots.txt`,
and code-split so its bundle never loads for a normal visitor.

Set the password with:

```bash
npm run admin:hash
```

Paste the two printed lines into `.env` and restart the dev server. The
plaintext password is never stored anywhere. The gate uses PBKDF2-SHA256
at 210,000 iterations, holds a session in `sessionStorage` for 8 hours,
and locks out for 15 minutes after 5 failed attempts.

### ⚠️ Hardening the admin route

**This gate is obfuscation, not authentication.** The password hash and the
verification code both ship inside the JavaScript bundle. Someone who opens
devtools can read the hash or patch the check out entirely.

It genuinely does keep `/admin` away from casual visitors and out of search
results. It does **not** protect anything from a determined person.

Because the dashboard only edits content in your own browser, the current
blast radius is small. Before you put anything sensitive behind it — client
details, contracts, invoices — move auth in front of the file rather than
inside it:

- **Cloudflare Access** — free tier, email/SSO in front of the route
- **Vercel / Netlify password protection** — one setting, edge-enforced
- **HTTP Basic auth** at nginx or your reverse proxy
- **A backend session API** with an `httpOnly`, `Secure`, `SameSite` cookie —
  the only option that also lets multiple people share content edits

---

## Accessibility

The site targets WCAG 2.1 AA. What is implemented:

- Skip-to-content link as the first tab stop
- `prefers-reduced-motion` honoured in CSS **and** in JS (the particle
  canvas draws one static frame; the custom cursor does not render)
- Mobile drawer is a real dialog — focus trap, Escape, focus restore,
  scroll lock, and `inert` when closed so links leave the tab order
- Every form control has an associated `<label>`; errors are wired through
  `aria-invalid` and `aria-describedby`; status changes go to a live region
- The native cursor is only hidden once the custom cursor has mounted, so
  a JS failure never leaves a visitor with no pointer
- Visible focus rings throughout; decorative SVG marked `aria-hidden`

## Performance

- Images compressed 2.1 MB → ~185 kB of actual transfer (`npm run images`)
- `<picture>` serves WebP with a JPEG fallback; `width`/`height` set to
  prevent layout shift
- The particle canvas is DPR-correct, skips `sqrt` in the inner loop, and
  pauses completely when scrolled out of view or the tab is hidden
- The custom cursor parks its rAF loop when the pointer is at rest
- Admin and vendor code are split into separate chunks

## Deployment

`npm run build` outputs a static `dist/`. Because routing is client-side,
the host must rewrite unknown paths to `index.html`:

- **Vercel** — [vercel.json](vercel.json) is included (rewrites + security headers)
- **Netlify** — [public/_redirects](public/_redirects) is included
- **nginx** — `try_files $uri $uri/ /index.html;`

### Before you go live

- [ ] Set `VITE_SITE_URL`, and update the hostname in `public/robots.txt`
      and `public/sitemap.xml`
- [ ] Fill in real contact details and social URLs in `.env`
- [ ] Configure `VITE_CONTACT_ENDPOINT` so form submissions reach an inbox
- [ ] Set a strong admin password (`npm run admin:hash`)
- [ ] **Replace the sample content.** The seed data contains invented case
      studies (NovaTech, Aura, NeuralFlow, and others, all flagged
      `isSample`). The dashboard warns you while any remain — publishing
      fabricated client work is a real credibility and legal risk.
- [ ] Have a lawyer review `/privacy` and `/terms`; the shipped copy is a
      template describing current behaviour, not legal advice
- [ ] Re-run `npm run images` after adding any new artwork

## Known gaps

Honest list of what is not done:

- **No tests.** No unit, integration, or e2e coverage.
- **No TypeScript.** The store normalises untrusted input defensively, but
  there are no compile-time guarantees.
- **No CMS or backend.** Content edits are per-browser until exported.
- **No analytics or error reporting.** `ErrorBoundary` logs to the console;
  wire it to Sentry when you need real visibility.

Your editor may flag `@theme` in `src/index.css` as an unknown at-rule.
That is the VS Code CSS language service not knowing Tailwind v4 — the
build compiles it correctly.
