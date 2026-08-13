import { Code2, Cpu, PencilRuler, Rocket } from 'lucide-react';
import SectionHeading from './SectionHeading';

/**
 * Deliverables live in the data, not in `idx === 0 &&` branches in the
 * markup — adding a fifth stage is now a data edit, not a JSX edit.
 */
const STEPS = [
  {
    icon: PencilRuler,
    title: 'Architecting & strategy',
    desc: 'We analyse your direction and map the technical blueprint. Foundations get chosen for the load they will actually carry, not for what is fashionable.',
    deliverables: [
      'Architecture diagrams & state modelling',
      'UI/UX style guide and wireframes in Figma',
      'Database schema and stack recommendation',
    ],
  },
  {
    icon: Cpu,
    title: 'AI & automation integration',
    desc: 'We wire in automated pipelines, custom model integrations, and API bridges. Repetitive operations become autonomous routines your team stops thinking about.',
    deliverables: [
      'Embedding pipelines & retrieval tuning',
      'Webhook and cloud-function triggers',
      'External system API specifications',
    ],
  },
  {
    icon: Code2,
    title: 'Full-stack development',
    desc: 'Clean, modular, reviewed code. Interface work is built to be fast and accessible first, then made beautiful — never the other way around.',
    deliverables: [
      'Modular React front-end',
      'Accessible interaction and routing layer',
      'API integration and data-layer wiring',
    ],
  },
  {
    icon: Rocket,
    title: 'Deployment & optimisation',
    desc: 'We launch on managed cloud infrastructure, audit for real-world performance, configure caching, and verify the security posture before handover.',
    deliverables: [
      'Cloud provisioning & TLS setup',
      'Lighthouse performance & SEO audit',
      'Vulnerability scan and load testing',
    ],
  },
];

export default function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="section-padding relative"
    >
      <div className="glow-blob left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 bg-cyan-500/5" />

      <div className="container-page relative z-10">
        <SectionHeading
          id="process-heading"
          eyebrow="Our methodology"
          title="How We Build"
          accent="Tanvo Projects"
          lead="A transparent workflow that takes a product from conceptual blueprint to production scale — with you seeing every stage."
          className="reveal mb-20"
        />

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 bottom-0 hidden w-0.5 -translate-x-1/2 bg-gradient-to-b from-cyan-400/20 via-blue-500/20 to-transparent lg:block"
          />

          <ol className="flex flex-col gap-16 lg:gap-24">
            {STEPS.map(({ icon: Icon, title, desc, deliverables }, index) => {
              const isEven = index % 2 === 0;
              return (
                <li
                  key={title}
                  className={`reveal flex w-full flex-col items-center justify-between gap-8 lg:gap-16 ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div
                    className={`w-full lg:w-[45%] ${isEven ? 'lg:text-right' : 'lg:text-left'}`}
                  >
                    <div className="mb-6 inline-flex rounded-2xl border border-cyan-500/10 bg-cyan-950/20 p-3 text-cyan-400">
                      <Icon size={26} aria-hidden="true" />
                    </div>
                    <h3 className="mb-4 font-heading text-2xl font-bold text-white">
                      <span className="text-cyan-400">{index + 1}.</span> {title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-400 md:text-base">
                      {desc}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className="z-10 hidden h-12 w-12 items-center justify-center rounded-full border-2 border-cyan-400/30 bg-slate-950 font-heading font-bold text-cyan-400 shadow-[0_0_15px_rgb(0_242_254/0.1)] lg:flex"
                  >
                    {index + 1}
                  </div>

                  <div className="glass-card flex w-full flex-col gap-4 border border-white/5 bg-slate-900/10 p-8 text-left lg:w-[45%]">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Stage {index + 1}
                    </span>
                    <h4 className="font-heading text-lg font-bold text-white">
                      Key deliverables
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-400 md:text-sm">
                      {deliverables.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span aria-hidden="true" className="text-cyan-400">
                            •
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
