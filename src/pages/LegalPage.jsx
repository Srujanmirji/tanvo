import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo';
import Logo from '../components/Logo';
import { SITE } from '../lib/constants';

/**
 * Privacy and Terms share a layout. The copy below is a starting
 * template covering what this site actually does (a contact form and
 * localStorage) — have a lawyer review it before you rely on it, and
 * update it if you add analytics, cookies, or third-party embeds.
 */

const UPDATED = 'August 2026';

function PrivacyBody() {
  return (
    <>
      <h2>What we collect</h2>
      <p>
        When you submit the contact form we receive the name, email address, service
        category, and project description you type into it. That is the only personal
        information this website collects.
      </p>

      <h2>Why we collect it</h2>
      <p>
        Solely to reply to your enquiry and discuss the work you asked about. We do not
        sell it, rent it, or add it to a marketing list without you asking us to.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Enquiry correspondence is retained for as long as we have an active or
        prospective working relationship, and deleted on request at any time.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        This site sets no advertising or tracking cookies. It uses your browser&rsquo;s
        local storage to remember content shown on the page and, for staff, an
        administrative session. That data never leaves your device.
      </p>

      <h2>Third parties</h2>
      <p>
        Fonts are served by Google Fonts, which receives your IP address as part of
        delivering them. If a form delivery service is configured, your submission passes
        through it on the way to our inbox.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us what we hold about you, ask for it to be corrected, or ask for it
        to be erased. Email {SITE.email} and we will action it.
      </p>
    </>
  );
}

function TermsBody() {
  return (
    <>
      <h2>Using this site</h2>
      <p>
        This website is provided for information about our services. You may browse and
        share it freely. You may not scrape it at volume, republish its content as your
        own, or attempt to gain unauthorised access to any part of it.
      </p>

      <h2>No offer or guarantee</h2>
      <p>
        Descriptions of services, technologies, and past work are illustrative. Nothing
        here constitutes a binding offer, a fixed price, or a warranty of a particular
        outcome. Engagements are governed by a separate signed agreement.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Tanvo Tech name, logo, copy, and design of this site belong to us. Client
        names and marks shown in case studies remain the property of their owners and
        appear with permission.
      </p>

      <h2>Liability</h2>
      <p>
        We take care to keep this site accurate, but provide it &ldquo;as is&rdquo;. To
        the extent permitted by law we are not liable for losses arising from reliance on
        information published here.
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms can go to {SITE.email}.</p>
    </>
  );
}

export default function LegalPage({ variant }) {
  const isPrivacy = variant === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';

  return (
    <>
      <Seo
        title={title}
        description={`${title} for ${SITE.name}.`}
        path={isPrivacy ? '/privacy' : '/terms'}
      />

      <div className="site-ambience flex min-h-dvh flex-col">
        <header className="border-b border-white/5">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
            <Link to="/" aria-label="Tanvo Tech — home">
              <Logo className="h-8 w-8" showText />
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-400"
            >
              <ArrowLeft size={15} aria-hidden="true" /> Back to site
            </Link>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Legal
          </p>
          <h1 className="mb-2 font-heading text-4xl font-extrabold text-white">{title}</h1>
          <p className="mb-12 text-sm text-slate-500">Last updated {UPDATED}</p>

          <div className="legal-prose flex flex-col gap-6 text-sm leading-relaxed text-slate-400">
            {isPrivacy ? <PrivacyBody /> : <TermsBody />}
          </div>

          <p className="mt-16 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-relaxed text-amber-200/80">
            <strong className="font-semibold">Template notice —</strong> this text
            reflects how the site currently behaves, but it has not been reviewed by a
            lawyer. Have counsel check it before relying on it, and revisit it whenever
            you add analytics, cookies, or third-party embeds.
          </p>
        </main>

        <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} {SITE.name}
        </footer>
      </div>
    </>
  );
}
