import { Reveal, Overline } from "@/components/Reveal";
import { MEDIA, WHY_CARDS } from "@/data/content";

export const WhyLoveIt = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.38]"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(9,5,12,0.92) 0%, rgba(9,5,12,0.56) 48%, rgba(9,5,12,0.34) 100%), linear-gradient(180deg, #09050C 0%, rgba(9,5,12,0.08) 48%, #09050C 100%), url(${MEDIA.gtaViceCityStreet})`,
          backgroundPosition: "center 46%",
          backgroundSize: "cover",
        }}
      />
      <div className="pointer-events-none absolute right-[-12%] top-1/3 -z-10 h-[420px] w-[560px] rounded-full bg-vicepink/10 blur-[130px]" />
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
              <div className="h-full rounded-2xl border border-white/5 bg-vice-card/[0.82] p-7 shadow-[0_18px_46px_-34px_rgba(0,0,0,0.82)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-vicepink/25">
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
