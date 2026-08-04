import Link from "next/link";
import { ArrowRight, BrainCircuit, ShieldCheck, Workflow, FileStack, TrendingUp } from "lucide-react";

const pages = [
  ["/dashboard", "Dashboard", "Monitor platform activity, control posture, and compliance KPIs.", "Live metrics"],
  ["/regulation-feed", "Regulation Feed", "Track incoming circulars, metadata, and extraction readiness.", "Ingestion"],
  ["/clause-intelligence", "Clause Intelligence", "Inspect extracted clauses, obligations, and machine logic.", "Analysis"],
  ["/obligations", "Obligations", "Review structured compliance obligations across circulars.", "Tracking"],
  ["/obligation-cards", "Obligation Cards", "Open the operational obligation card workspace.", "Operations"],
  ["/workflow-engine", "Workflow Engine", "Manage obligation execution through workflow stages.", "Execution"],
  ["/evidence-vault", "Evidence Vault", "Upload, verify, and review supporting evidence.", "Evidence"],
  ["/risk", "Risk Intelligence", "Analyze department exposure and high-priority risk posture.", "Risk"],
] as const;

const spotlight = [
  {
    title: "Circular ingestion",
    description: "Bring SEBI circulars into a structured monitoring pipeline.",
    icon: FileStack,
  },
  {
    title: "Clause intelligence",
    description: "Convert dense legal language into obligation primitives.",
    icon: BrainCircuit,
  },
  {
    title: "Workflow execution",
    description: "Route obligations into accountable operating workflows.",
    icon: Workflow,
  },
  {
    title: "Risk oversight",
    description: "Surface weak points before inspection or operational failure.",
    icon: TrendingUp,
  },
];

export default function HomePage() {
  return (
    <main className="space-y-10">
      <section className="glass-panel relative overflow-hidden rounded-[28px] border border-white/10 px-6 py-8 lg:px-8 lg:py-10">
        <div className="absolute inset-y-0 right-0 hidden w-[32%] bg-gradient-to-l from-cyan-500/10 via-transparent to-transparent xl:block" />

        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_360px] xl:items-end">
          <div className="max-w-4xl">
            <p className="section-label">AI-native regulatory operating system</p>
            <h1 className="page-title mt-4">RegOS SEBI</h1>
            <p className="page-subtitle">
              Continuous compliance twin for circular ingestion, obligation tracking, workflow
              execution, evidence verification, and risk intelligence across SEBI-regulated
              operations.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="panel-chip-accent rounded-full px-3 py-1.5 text-xs font-medium">
                Circular intelligence
              </span>
              <span className="panel-chip rounded-full px-3 py-1.5 text-xs font-medium">
                Obligation workflows
              </span>
              <span className="panel-chip rounded-full px-3 py-1.5 text-xs font-medium">
                Evidence vault
              </span>
              <span className="panel-chip rounded-full px-3 py-1.5 text-xs font-medium">
                Risk intelligence
              </span>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
                  Workspace status
                </p>
                <p className="mt-2 text-lg font-semibold text-white">Compliance twin online</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
                <ShieldCheck size={20} className="text-cyan-300" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Mode</p>
                <p className="mt-1 text-sm text-zinc-200">Monitoring + execution</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Coverage</p>
                <p className="mt-1 text-sm text-zinc-200">
                  Circulars, obligations, evidence, workflows, risk
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {spotlight.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="glass-card rounded-2xl p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
                <Icon size={18} className="text-cyan-300" />
              </div>
              <p className="mt-4 text-base font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
            </div>
          );
        })}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label">Modules</p>
            <h2 className="section-title mt-2">Explore the workspace</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-500">
            Navigate across live prototype modules to inspect intake pipelines, machine-readable
            obligations, workflow execution, evidence posture, and risk exposure.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pages.map(([href, title, description, tag], index) => (
            <Link
              key={href}
              href={href}
              className="glass-card group rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-cyan-200">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
                </div>

                <div className="soft-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xs font-semibold text-zinc-500">
                  {index + 1}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="panel-chip rounded-full px-2.5 py-1 text-[11px] font-medium">
                  {tag}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300">
                  Open
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}