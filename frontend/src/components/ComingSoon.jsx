import * as Icons from "lucide-react";
import { Reveal, Overline } from "@/components/Reveal";
import { COMING_SOON } from "@/data/content";
import { useWaitlist } from "@/context/WaitlistContext";

export const ComingSoon = () => {
  const { openWaitlist } = useWaitlist();
  return (
    <section className="relative py-24 md:py-32 bg-vice-bg2/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <Overline>The Roadmap of Features</Overline>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-tprimary max-w-2xl">
            An entire ecosystem, on the way.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {COMING_SOON.map((c, i) => {
            const Icon = Icons[c.icon] || Icons.Sparkles;
            return (
              <Reveal key={c.title} delay={(i % 5) * 0.04}>
                <div
                  data-testid={`coming-soon-${c.title.replace(/\s/g, "-").toLowerCase()}`}
                  className="group h-full rounded-2xl border border-white/5 bg-vice-card p-5 transition-all duration-300 hover:border-white/15 hover:-translate-y-1"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 group-hover:bg-sunset/15 transition-colors">
                    <Icon className="h-5 w-5 text-tsec group-hover:text-sunset transition-colors" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-medium text-tprimary">{c.title}</h3>
                  <p className="mt-1 text-xs text-tsec/70">{c.sub}</p>
                  <span className="mt-3 inline-block text-[10px] uppercase tracking-widest text-sunset/70">Coming Soon</span>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 flex justify-center">
            <button
              data-testid="after-coming-soon-join-waitlist-btn"
              onClick={openWaitlist}
              className="rounded-full bg-sunset px-7 py-3.5 text-sm font-semibold text-vice-bg hover:bg-coral transition-colors"
            >
              Join the Waitlist
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
