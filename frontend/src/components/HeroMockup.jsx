import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, MapPin, Navigation, Star, Crosshair, Map as MapIcon, ListChecks, Car, Users } from "lucide-react";
import { MEDIA } from "@/data/content";

const NAV = [
  { label: "Map", icon: MapIcon },
  { label: "Missions", icon: ListChecks },
  { label: "Garage", icon: Car },
  { label: "Crew", icon: Users },
];

export const HeroMockup = () => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 20 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      className="relative w-full"
      style={{ perspective: 1200 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-testid="hero-mockup"
    >
      <div className="absolute -inset-10 -z-10 opacity-60 blur-3xl"
        style={{ background: "radial-gradient(60% 50% at 50% 40%, rgba(255,123,84,0.18), rgba(43,122,154,0.10) 50%, transparent 75%)" }} />

      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative rounded-2xl border border-white/10 bg-vice-card/80 backdrop-blur-xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* top bar */}
        <div className="flex items-center gap-2 px-4 h-10 border-b border-white/5 bg-vice-bg2/60">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-tsec/60">vicehub — vice city</span>
        </div>

        <div className="grid grid-cols-12 gap-px bg-white/5">
          {/* sidebar */}
          <div className="hidden sm:flex col-span-3 flex-col gap-2 bg-vice-bg2/80 p-4">
            <span className="text-[9px] uppercase tracking-[0.2em] text-tsec/40 mb-1">Vice City · Leonida</span>
            {NAV.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                  i === 0 ? "bg-sunset/15 text-sunset" : "text-tsec/70"
                }`}
              >
                <s.icon className="h-3.5 w-3.5" strokeWidth={1.6} /> {s.label}
              </div>
            ))}
            <div className="mt-auto rounded-xl border border-white/5 p-3">
              <div className="flex items-center justify-between text-[11px] text-tsec/70">
                <span>Story Progress</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-sunset to-coral" />
              </div>
              <div className="mt-1 text-[10px] text-tsec/50">64% — concept</div>
            </div>
          </div>

          {/* main map */}
          <div className="col-span-12 sm:col-span-9 relative bg-vice-bg2">
            <img
              src={MEDIA.viceMap}
              alt="Vice City map concept"
              loading="lazy"
              className="h-48 sm:h-72 w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,10,0.15), rgba(10,10,10,0.85))" }} />

            {/* top HUD: location + wanted + cash */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              <span className="rounded-md bg-vice-bg/70 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-tprimary">
                VICE CITY
              </span>
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex gap-0.5 rounded-md bg-vice-bg/70 backdrop-blur-md border border-white/10 px-2 py-1">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <Star
                      key={n}
                      className={`h-3 w-3 ${n < 3 ? "text-sunset" : "text-tsec/25"}`}
                      fill={n < 3 ? "#FF7B54" : "transparent"}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <span className="rounded-md bg-vice-bg/70 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300/90 tabular-nums">
                  $ 48,250
                </span>
              </div>
            </div>

            {/* mission objective chip */}
            <div className="absolute top-14 left-3 flex items-center gap-2 rounded-lg bg-vice-bg/70 backdrop-blur-md border border-white/10 px-3 py-1.5">
              <Crosshair className="h-3.5 w-3.5 text-coral" strokeWidth={1.6} />
              <span className="text-[11px] text-tprimary/90">Objective: Meet Lucia at the Marina</span>
            </div>

            {/* markers */}
            <div className="absolute left-[24%] top-[44%] flex flex-col items-center">
              <MapPin className="h-5 w-5 text-sunset drop-shadow animate-pulse-marker" fill="#FF7B54" />
              <span className="mt-0.5 rounded bg-vice-bg/80 px-1.5 py-0.5 text-[8px] text-tprimary/80">Objective</span>
            </div>
            <div className="absolute left-[60%] top-[33%] flex flex-col items-center">
              <MapPin className="h-5 w-5 text-vicepink drop-shadow animate-pulse-marker" fill="#E08E9B" />
              <span className="mt-0.5 rounded bg-vice-bg/80 px-1.5 py-0.5 text-[8px] text-tprimary/80">Lucia</span>
            </div>
            <div className="absolute left-[74%] top-[55%]">
              <Crosshair className="h-4 w-4 text-ocean drop-shadow" />
            </div>
            <div className="absolute left-[44%] top-[64%]">
              <Navigation className="h-4 w-4 text-coral drop-shadow rotate-12" fill="#FF9F89" />
            </div>

            {/* AI companion bubble */}
            <motion.div
              style={{ transform: "translateZ(50px)" }}
              className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-72 rounded-xl border border-white/10 bg-vice-bg/90 backdrop-blur-md p-3"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sunset/20">
                  <Sparkles className="h-3.5 w-3.5 text-sunset" />
                </span>
                <span className="text-[11px] uppercase tracking-widest text-tsec/60">AI Companion</span>
              </div>
              <p className="mt-2 text-xs text-tprimary/90 leading-relaxed">
                "Lucia's at the marina — take the coastal road to dodge the heat and you'll arrive clean."
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
