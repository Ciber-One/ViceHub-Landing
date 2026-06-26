import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Reveal, Overline } from "@/components/Reveal";
import { PRODUCT_CARDS } from "@/data/content";
import { useWaitlist } from "@/context/WaitlistContext";

export const ProductPreview = () => {
  const [active, setActive] = useState(null);
  const { openWaitlist } = useWaitlist();

  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <Overline>The Platform</Overline>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-tprimary max-w-2xl">
            Don't just read about it. Step inside.
          </h2>
          <p className="mt-4 max-w-xl text-base md:text-lg text-tsec">
            Tap any preview to explore a concept of what ViceHub will feel like.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCT_CARDS.map((card, i) => (
            <Reveal key={card.id} delay={(i % 4) * 0.06}>
              <button
                data-testid={`product-card-${card.id}`}
                onClick={() => setActive(card)}
                className="group text-left w-full h-full rounded-2xl border border-white/5 bg-vice-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.7)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-sunset/90">{card.tag}</span>
                  <ArrowUpRight className="h-4 w-4 text-tsec/40 transition-colors group-hover:text-tprimary" />
                </div>
                <h3 className="mt-6 font-heading text-xl font-medium text-tprimary">{card.title}</h3>
                <p className="mt-2 text-sm text-tsec leading-relaxed">{card.desc}</p>
                <span className="mt-6 inline-block rounded-full border border-white/10 px-3 py-1 text-[11px] text-tsec/70">
                  Coming Soon
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 flex justify-center">
            <button
              data-testid="after-preview-join-waitlist-btn"
              onClick={openWaitlist}
              className="rounded-full bg-sunset px-7 py-3.5 text-sm font-semibold text-vice-bg hover:bg-coral transition-colors"
            >
              Join the Waitlist
            </button>
          </div>
        </Reveal>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          data-testid="product-preview-dialog"
          className="bg-vice-card border-white/10 text-tprimary max-w-lg"
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
              <div className="rounded-xl border border-white/5 bg-vice-bg2 p-5">
                <div className="flex items-center justify-between text-xs text-tsec/60">
                  <span>Concept preview</span>
                  <span className="rounded-full border border-white/10 px-2.5 py-0.5">Coming Soon</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="mt-4 h-1.5 rounded-full bg-gradient-to-r from-sunset to-coral"
                />
                <p className="mt-3 text-xs text-tsec/50">Placeholder data — final experience available after launch.</p>
              </div>
              <button
                data-testid="dialog-join-waitlist-btn"
                onClick={() => {
                  setActive(null);
                  openWaitlist();
                }}
                className="w-full rounded-full bg-sunset px-6 py-3 text-sm font-semibold text-vice-bg hover:bg-coral transition-colors"
              >
                Get it first — Join the Waitlist
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
