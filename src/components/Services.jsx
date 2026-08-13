import { ArrowUpRight, Cpu, Globe, ShieldAlert, Smartphone, TrendingUp, Workflow } from 'lucide-react';
import SectionHeading from './SectionHeading';

const SERVICES = [
  {
    icon: Globe,
    title: 'Web Development',
    desc: 'Bespoke high-performance websites and SaaS platforms. Deep MERN experience (MongoDB, Express, React, Node) with modular architecture and fast first paint.',
    tags: ['React / Next.js', 'MERN stack', 'Node.js APIs', 'E-commerce'],
  },
  {
    icon: Smartphone,
    title: 'App Development',
    desc: 'Cross-platform mobile experiences for iOS and Android — responsive, offline-tolerant, and wired into native device capabilities where it counts.',
    tags: ['React Native', 'Flutter', 'iOS / Android', 'UI/UX design'],
  },
  {
    icon: Cpu,
    title: 'AI Solutions',
    desc: 'Practical AI inside your existing systems: LLM integrations, conversational agents, semantic search over your own documents, and decision automation.',
    tags: ['Claude / OpenAI', 'Vector DBs', 'RAG systems', 'Predictive ML'],
  },
  {
    icon: Workflow,
    title: 'Digital Automations',
    desc: 'Remove the repetitive work. Connect databases, sync CRMs, schedule extraction jobs, and trigger reliable webhook chains between the tools you already pay for.',
    tags: ['Zapier / Make', 'Custom scripts', 'API integration', 'Slack bots'],
  },
  {
    icon: TrendingUp,
    title: 'Digital Marketing',
    desc: 'Data-driven reach. Technical SEO, programmatic search ads, brand positioning, and measurable performance tracking rather than vanity metrics.',
    tags: ['Technical SEO', 'Google Ads', 'CRO', 'Content strategy'],
  },
  {
    icon: ShieldAlert,
    title: 'All-in-One Tech Support',
    desc: 'Hosting, cloud deployment, security audits, and refactoring. We keep your platform secure, fast, and ready for the traffic you are about to get.',
    tags: ['AWS / Vercel', 'Security audits', 'Performance', 'DB tuning'],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section-padding relative bg-slate-950/40"
    >
      <div className="glow-blob left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 bg-blue-500/5" />

      <div className="container-page relative z-10">
        <SectionHeading
          id="services-heading"
          eyebrow="Our expertise"
          title="End-to-End"
          accent="Digital Services"
          lead="State-of-the-art software tailored to operational efficiency, real scaling, and user experiences people actually finish."
          className="reveal mb-16"
        />

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, desc, tags }, index) => (
            <li
              key={title}
              className="reveal glass-card group flex flex-col justify-between p-8"
              style={{ transitionDelay: `${Math.min(index, 5) * 70}ms` }}
            >
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 text-cyan-400 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={22} aria-hidden="true" />
                </div>

                <h3 className="mb-4 flex items-center justify-between font-heading text-xl font-bold text-white">
                  {title}
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="text-cyan-400 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                </h3>

                <p className="mb-6 text-sm leading-relaxed text-slate-400">{desc}</p>
              </div>

              <ul className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-white/5 bg-slate-900 px-2.5 py-1 text-xs text-slate-400"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
