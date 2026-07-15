import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Bot, Building2, Car, Gem, LayoutDashboard, Map, Newspaper, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Reveal, Overline } from "@/components/Reveal";
import { MEDIA, PRODUCT_CARDS } from "@/data/content";
import { useWaitlist } from "@/context/WaitlistContext";

const cardIcons = {
  "ai-companion": Bot,
  "interactive-map": Map,
  "mission-guide": Target,
  "vehicle-explorer": Car,
  collectibles: Gem,
  dashboard: LayoutDashboard,
  "business-planner": Building2,
  "news-hub": Newspaper,
};

export const ProductPreview = () => {
  const [active, setActive] = useState(null);
  const { openWaitlist } = useWaitlist();
  const navigate = useNavigate();

  const openCard = (card) => {
    if (card.id === "ai-companion") {
      document.querySelector("#ai-companion")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (card.id === "interactive-map") {
      navigate("/map");
      return;
    }

    if (card.id === "news-hub") {
      navigate("/blog");
      return;
    }

    setActive(card);
  };

  const cardStatus = (id) => (id === "ai-companion" || id === "interactive-map" || id === "news-hub" ? "Live" : "Coming Soon");

  return (
    <section id="features" className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.42]"
        style={{
          backgroundImage: `linear-gradient(90deg, #09050C 0%, rgba(9,5,12,0.76) 34%, rgba(9,5,12,0.2) 100%), linear-gradient(180deg, #09050C 0%, rgba(9,5,12,0.08) 24%, rgba(9,5,12,0.06) 72%, #09050C 100%), url(${MEDIA.gtaViceCityAerial})`,
          backgroundPosition: "center 42%",
          backgroundSize: "cover",
        }}
      />
      <div className="pointer-events-none absolute right-[12%] top-24 -z-10 h-[360px] w-[360px] rounded-full bg-ocean/10 blur-[100px]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <Overline>The Platform</Overline>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-tprimary max-w-2xl">
            Start with what is live today.
          </h2>
          <p className="mt-4 max-w-xl text-base md:text-lg text-tsec">
            Ask the AI companion, explore the interactive map, or preview the next tools joining ViceHub.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCT_CARDS.map((card, i) => (
            <Reveal key={card.id} delay={(i % 4) * 0.06}>
              <button
                data-testid={`product-card-${card.id}`}
                onClick={() => openCard(card)}
                className={`group relative h-full w-full overflow-hidden rounded-2xl border p-6 text-left shadow-[0_18px_48px_-32px_rgba(0,0,0,0.84)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_62px_-26px_rgba(0,0,0,0.82)] ${
                  card.id === "ai-companion" || card.id === "interactive-map"
                    ? "border-sunset/25 bg-gradient-to-br from-sunset/[0.18] via-vice-card/[0.9] to-vice-card/[0.92]"
                    : "border-white/5 bg-vice-card/[0.86] hover:border-vicepink/25"
                }`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-sunset/90">{card.tag}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-tsec/60 transition-colors group-hover:border-sunset/30 group-hover:text-tprimary">
                    {(() => {
                      const Icon = cardIcons[card.id] || ArrowUpRight;
                      return <Icon className="h-4 w-4" strokeWidth={1.6} />;
                    })()}
                  </span>
                </div>
                <h3 className="mt-6 font-heading text-xl font-medium text-tprimary">{card.title}</h3>
                <p className="mt-2 text-sm text-tsec leading-relaxed">{card.desc}</p>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <span
                    className={`inline-block rounded-full border px-3 py-1 text-[11px] ${
                      cardStatus(card.id) === "Live"
                        ? "border-sunset/30 bg-sunset/[0.12] text-sunset"
                        : "border-white/10 bg-white/[0.025] text-tsec/70"
                    }`}
                  >
                    {cardStatus(card.id)}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-tsec/35 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sunset" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col items-center gap-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sunset">Available to explore now</p>
            <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                data-testid="after-preview-ai-btn"
                onClick={() => document.querySelector("#ai-companion")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sunset px-7 py-3.5 text-sm font-semibold text-vice-bg transition-colors hover:bg-coral"
              >
                <Bot className="h-4 w-4" /> Use AI Companion
              </button>
              <button
                data-testid="after-preview-map-btn"
                onClick={() => navigate("/map")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.035] px-7 py-3.5 text-sm font-semibold text-tprimary transition-colors hover:border-sunset/35 hover:bg-white/[0.06]"
              >
                <Map className="h-4 w-4 text-sunset" /> Open Live Map
              </button>
            </div>
            <button data-testid="after-preview-join-waitlist-btn" onClick={openWaitlist} className="text-xs font-semibold text-tsec/65 transition-colors hover:text-sunset">
              Join the waitlist for upcoming features
            </button>
          </div>
        </Reveal>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          data-testid="product-preview-dialog"
          className="overflow-hidden border-white/10 bg-vice-card/[0.96] text-tprimary shadow-[0_32px_90px_-32px_rgba(0,0,0,0.9)] backdrop-blur-xl max-w-lg"
        >
          {active && (
            <>
              <DialogHeader>
                <span className="text-[11px] uppercase tracking-[0.2em] text-sunset">{active.tag}</span>
                <DialogTitle className="font-heading text-2xl font-medium mt-1">{active.title}</DialogTitle>
                <DialogDescription className="text-tsec leading-relaxed pt-2">
                  {active.preview}
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-2xl border border-white/10 bg-vice-bg2/[0.74] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="flex items-center justify-between gap-4 text-xs text-tsec/60">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sunset" />
                    Concept preview
                  </span>
                  <span className="rounded-full border border-white/10 px-2.5 py-0.5">Coming Soon</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="mt-4 h-1.5 rounded-full bg-gradient-to-r from-sunset via-coral to-vicepink"
                />
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {["Preview", "Guided", "Synced"].map((label) => (
                    <span key={label} className="rounded-xl border border-white/5 bg-white/[0.035] px-2 py-2 text-[11px] text-tsec/60">
                      {label}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-tsec/50">Final experience becomes available after launch.</p>
              </div>
              <button
                data-testid="dialog-join-waitlist-btn"
                onClick={() => {
                  setActive(null);
                  openWaitlist();
                }}
                className="w-full rounded-full bg-sunset px-6 py-3 text-sm font-semibold text-vice-bg shadow-[0_18px_44px_-24px_rgba(255,107,74,0.9)] transition-colors hover:bg-coral"
              >
                Get it first - Join the Waitlist
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
