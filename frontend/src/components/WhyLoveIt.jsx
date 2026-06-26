import { Reveal, Overline } from "@/components/Reveal";
import { WHY_CARDS } from "@/data/content";

export const WhyLoveIt = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <Overline>Why You'll Love It</Overline>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-tprimary max-w-2xl">
            Built for the way you actually play.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 0.06} className={c.span || ""}>
              <div className="h-full rounded-2xl border border-white/5 bg-vice-card p-7 transition-all duration-300 hover:border-white/15 hover:-translate-y-1">
                <h3 className="font-heading text-xl font-medium text-tprimary">{c.title}</h3>
                <p className="mt-3 text-sm md:text-base text-tsec leading-relaxed">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
