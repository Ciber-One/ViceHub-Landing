import { Search, MapPin, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal, Overline } from "@/components/Reveal";
import { MEDIA } from "@/data/content";

const FILTERS = ["All", "Missions", "Vehicles", "Hidden", "Businesses"];
const MAP_TILES = Array.from({ length: 9 }, (_, index) => ({
  x: index % 3,
  y: Math.floor(index / 3),
}));

export const MapPreview = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(90deg, #09050C 0%, rgba(9,5,12,0.62) 44%, rgba(9,5,12,0.2) 100%), linear-gradient(180deg, #09050C 0%, rgba(9,5,12,0.06) 44%, #09050C 100%), url(${MEDIA.gtaGrassriversChase})`,
          backgroundPosition: "center 45%",
          backgroundSize: "cover",
        }}
      />
      <div className="pointer-events-none absolute left-[-12%] top-20 -z-10 h-[380px] w-[520px] rounded-full bg-ocean/10 blur-[120px]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <Overline>Interactive Map</Overline>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-tprimary">
            Explore Leonida right now.
          </h2>
          <p className="mt-4 text-base text-tsec md:text-lg">Pan, zoom, filter locations, and inspect the map in a full-screen live workspace.</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-12 rounded-3xl border border-white/10 overflow-hidden" data-testid="map-preview">
            <div className="map-water flex h-[420px] w-full items-center justify-center overflow-hidden sm:h-[520px]">
              <div className="relative grid aspect-square w-full max-w-[520px] grid-cols-3 grid-rows-3 shadow-[0_0_80px_rgba(244,107,180,0.12)]">
                {MAP_TILES.map((tile) => (
                  <img
                    key={`${tile.x}-${tile.y}`}
                    src={`/map-tiles/0/${tile.x}_${tile.y}.webp?v=20260715-2`}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ))}
                {[{ l: "48%", t: "28%", c: "text-ocean" }, { l: "70%", t: "53%", c: "text-coral" }, { l: "52%", t: "72%", c: "text-vicepink" }].map((marker, index) => (
                  <MapPin key={index} className={`absolute h-5 w-5 ${marker.c} drop-shadow`} style={{ left: marker.l, top: marker.t }} />
                ))}
              </div>
            </div>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(9,5,12,0.16), rgba(9,5,12,0.52))" }} />

            {/* top controls */}
            <div className="absolute top-5 left-5 right-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-vice-bg/70 backdrop-blur-md px-4 py-2 text-sm text-tsec/70" data-testid="map-search">
                <Search className="h-4 w-4" />
                Search locations...
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

            {/* center overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="rounded-2xl border border-white/10 bg-vice-bg/65 px-8 py-6 shadow-[0_22px_60px_-32px_rgba(0,0,0,0.85)] backdrop-blur-md">
                <h3 className="font-heading text-2xl md:text-3xl font-medium text-tprimary">Interactive Map</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-sunset">Live now</p>
                <Link
                  to="/map"
                  data-testid="map-preview-open-btn"
                  className="mt-3 inline-block rounded-full border border-sunset/35 bg-sunset/[0.14] px-4 py-1.5 text-xs font-semibold text-sunset transition-colors hover:bg-sunset hover:text-vice-bg"
                >
                  Enter Full-Screen Map
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
