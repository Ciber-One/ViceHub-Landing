import { Search, MapPin, Plus, Minus } from "lucide-react";
import { Reveal, Overline } from "@/components/Reveal";
import { MEDIA } from "@/data/content";

const FILTERS = ["All", "Missions", "Vehicles", "Hidden", "Businesses"];

export const MapPreview = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <Overline>Interactive Map</Overline>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-tprimary">
            The whole city, in your pocket.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-12 rounded-3xl border border-white/10 overflow-hidden" data-testid="map-preview">
            <img src={MEDIA.map} alt="Map concept" loading="lazy" className="h-[420px] sm:h-[520px] w-full object-cover" style={{ filter: "blur(2px) saturate(0.9)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,10,0.35), rgba(10,10,10,0.7))" }} />

            {/* top controls */}
            <div className="absolute top-5 left-5 right-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-vice-bg/70 backdrop-blur-md px-4 py-2 text-sm text-tsec/70" data-testid="map-search">
                <Search className="h-4 w-4" />
                Search locations…
              </div>
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f, i) => (
                  <span
                    key={f}
                    data-testid={`map-filter-${f.toLowerCase()}`}
                    className={`rounded-full border px-3 py-1.5 text-xs backdrop-blur-md ${
                      i === 0 ? "border-sunset/50 bg-sunset/15 text-sunset" : "border-white/10 bg-vice-bg/60 text-tsec/70"
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* zoom controls */}
            <div className="absolute right-5 bottom-5 flex flex-col rounded-xl border border-white/10 bg-vice-bg/70 backdrop-blur-md overflow-hidden">
              <span className="p-2.5 text-tsec/70 border-b border-white/10"><Plus className="h-4 w-4" /></span>
              <span className="p-2.5 text-tsec/70"><Minus className="h-4 w-4" /></span>
            </div>

            {/* markers */}
            {[
              { l: "26%", t: "40%", c: "text-sunset" },
              { l: "48%", t: "30%", c: "text-ocean" },
              { l: "63%", t: "55%", c: "text-coral" },
              { l: "38%", t: "62%", c: "text-vicepink" },
            ].map((m, i) => (
              <MapPin key={i} className={`absolute h-6 w-6 ${m.c} animate-pulse-marker drop-shadow`} style={{ left: m.l, top: m.t }} />
            ))}

            {/* center overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="rounded-2xl border border-white/10 bg-vice-bg/60 backdrop-blur-md px-8 py-6">
                <h3 className="font-heading text-2xl md:text-3xl font-medium text-tprimary">Interactive Map</h3>
                <span className="mt-3 inline-block rounded-full border border-white/15 px-4 py-1.5 text-xs text-tsec">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
