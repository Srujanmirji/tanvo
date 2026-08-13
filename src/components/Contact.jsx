import { useId, useRef, useState } from 'react';
import { AlertCircle, CheckCircle, Mail, MapPin, Phone, Send } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { CATEGORIES, SITE } from '../lib/constants';

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT ?? '';

const EMPTY = { name: '', email: '', service: CATEGORIES[0], message: '', company: '' };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = 'Please tell us your name.';
  }
  if (!values.email.trim()) {
    errors.email = 'We need an email address to reply to.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'That does not look like a valid email address.';
  }
  if (values.message.trim().length < 20) {
    errors.message = 'A little more detail helps us give a useful answer (20+ characters).';
  }
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [statusMessage, setStatusMessage] = useState('');
  const formRef = useRef(null);
  const fieldId = useId();

  const id = (name) => `${fieldId}-${name}`;
  const errorId = (name) => `${fieldId}-${name}-error`;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the user starts fixing it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Honeypot: real users never fill a hidden field.
    if (values.company) return;

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus('error');
      setStatusMessage('Please fix the highlighted fields and try again.');
      const first = formRef.current?.querySelector('[aria-invalid="true"]');
      first?.focus();
      return;
    }

    setStatus('sending');
    setStatusMessage('Sending your message…');

    // No endpoint configured: hand the message to the visitor's mail
    // client rather than pretending to send it. A lead reaching an inbox
    // by an ugly route beats a lead silently discarded.
    if (!ENDPOINT) {
      const subject = encodeURIComponent(`Project enquiry — ${values.service}`);
      const body = encodeURIComponent(
        `Name: ${values.name}\nEmail: ${values.email}\nService: ${values.service}\n\n${values.message}`,
      );
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
      setStatus('sent');
      setStatusMessage(
        'Your email client should now be open with the message ready to send.',
      );
      return;
    }

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          service: values.service,
          message: values.message.trim(),
        }),
      });

      if (!response.ok) throw new Error(`Server responded ${response.status}`);

      setValues(EMPTY);
      setStatus('sent');
      setStatusMessage('Message received. We will reply within one business day.');
    } catch {
      setStatus('error');
      setStatusMessage(
        `We could not send that. Please email us directly at ${SITE.email}.`,
      );
    }
  };

  const details = [
    SITE.email && { icon: Mail, label: 'Email us', value: SITE.email, href: `mailto:${SITE.email}` },
    SITE.phone && { icon: Phone, label: 'Call us', value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, '')}` },
    SITE.location && { icon: MapPin, label: 'Based in', value: SITE.location, href: null },
  ].filter(Boolean);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-padding relative"
    >
      <div className="glow-blob right-10 top-10 h-[300px] w-[300px] bg-blue-500/5" />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="reveal flex flex-col justify-between lg:col-span-5">
            <div>
              <SectionHeading
                id="contact-heading"
                eyebrow="Get in touch"
                title="Let's Build"
                accent="Something Grand"
                align="left"
              />
              <p className="mb-8 text-sm leading-relaxed text-slate-400 md:text-base">
                Tell us what you are trying to build. We will come back with an honest
                architecture recommendation — including whether you need us at all.
              </p>
            </div>

            {details.length > 0 && (
              <ul className="flex flex-col gap-6">
                {details.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-slate-900 text-cyan-400">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">{label}</span>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm font-medium text-white hover:text-cyan-400 md:text-base"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-white md:text-base">
                          {value}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="reveal lg:col-span-7">
            <div className="glass-card relative overflow-hidden p-8 md:p-10">
              {/* Single live region for every status change. */}
              <div aria-live="polite" aria-atomic="true" className="sr-only">
                {statusMessage}
              </div>

              {status === 'sent' ? (
                <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400 bg-cyan-500/10 text-cyan-400">
                    <CheckCircle size={36} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-heading text-2xl font-bold text-white">
                      Message on its way
                    </h3>
                    <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-400">
                      {statusMessage}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setStatusMessage('');
                    }}
                    className="btn-secondary mt-2 px-6 py-2.5 text-xs"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                  <div>
                    <label
                      htmlFor={id('name')}
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
                    >
                      Your name
                    </label>
                    <input
                      id={id('name')}
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="e.g. Jordan Patel"
                      className="field-input"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? errorId('name') : undefined}
                    />
                    {errors.name && (
                      <p id={errorId('name')} className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                        <AlertCircle size={13} aria-hidden="true" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={id('email')}
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
                    >
                      Your email
                    </label>
                    <input
                      id={id('email')}
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="e.g. jordan@company.com"
                      className="field-input"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? errorId('email') : undefined}
                    />
                    {errors.email && (
                      <p id={errorId('email')} className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                        <AlertCircle size={13} aria-hidden="true" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={id('service')}
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
                    >
                      What do you need?
                    </label>
                    <select
                      id={id('service')}
                      name="service"
                      value={values.service}
                      onChange={handleChange}
                      className="field-input cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="Tech Support">Tech support / other</option>
                      <option value="Not sure">Not sure yet</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={id('message')}
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
                    >
                      Tell us about your project
                    </label>
                    <textarea
                      id={id('message')}
                      name="message"
                      rows={4}
                      value={values.message}
                      onChange={handleChange}
                      placeholder="Goals, timeline, and anything already built…"
                      className="field-input resize-y"
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? errorId('message') : undefined}
                    />
                    {errors.message && (
                      <p id={errorId('message')} className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                        <AlertCircle size={13} aria-hidden="true" /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Honeypot — hidden from users, irresistible to bots. */}
                  <div aria-hidden="true" className="absolute left-[-9999px] top-0">
                    <label htmlFor={id('company')}>Company (leave blank)</label>
                    <input
                      id={id('company')}
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.company}
                      onChange={handleChange}
                    />
                  </div>

                  {status === 'error' && statusMessage && (
                    <p className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {statusMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-primary mt-2 w-full py-4"
                  >
                    {status === 'sending' ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        Send project brief <Send size={16} aria-hidden="true" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] leading-relaxed text-slate-600">
                    We use your details only to reply to this enquiry. See our{' '}
                    <a href="/privacy" className="underline hover:text-slate-400">
                      privacy policy
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
