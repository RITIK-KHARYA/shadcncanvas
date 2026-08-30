import { motion } from "framer-motion";

import { features, flow } from "./content";

export function Features() {
  return (
    <section id="features" className="relative z-10 mx-auto w-full max-w-4xl px-6 py-24 sm:px-8">
      <div className="text-center">
        <span className="lp-mono-label">What&apos;s inside</span>
        <h2 className="lp-tracking-tight mx-auto mt-4 max-w-xl text-3xl font-semibold text-balance sm:text-4xl">
          Everything you need to build a shadcn/ui UI, visually
        </h2>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 260, damping: 30, delay: i * 0.05 }}
            className="lp-glass rounded-2xl p-8 text-left"
          >
            <div className="mb-5 inline-flex size-10 items-center justify-center rounded-xl border border-[var(--lp-line)]">
              <f.icon className="size-5" />
            </div>
            <h3 className="text-sm font-medium">{f.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--lp-muted)]">{f.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <span className="lp-mono-label">Builder flow</span>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-3">
          {flow.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 260, damping: 30, delay: i * 0.06 }}
              className="flex items-center gap-2"
            >
              <span className="lp-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                <span className="lp-dotmatrix text-xs tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </span>
              {i < flow.length - 1 && (
                <span className="text-[var(--lp-faint)]" aria-hidden="true">
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
