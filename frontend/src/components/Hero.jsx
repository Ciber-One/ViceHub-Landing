import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { HeroMockup } from "@/components/HeroMockup";
import { useWaitlist } from "@/context/WaitlistContext";
import { MEDIA } from "@/data/content";

const PROMISE_POINTS = ["AI guidance", "Map-ready planning", "Progress memory"];

export const Hero = () => {
  const { openWaitlist } = useWaitlist();
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.86]"
          style={{
            backgroundImage: `url(${MEDIA.gtaViceCityNeon})`,
            backgroundPosition: "center 48%",
            backgroundSize: "cover",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(9,5,12,0.97) 0%, rgba(9,5,12,0.72) 40%, rgba(9,5,12,0.14) 100%), linear-gradient(180deg, rgba(9,5,12,0.04) 0%, rgba(9,5,12,0.12) 52%, #09050C 98%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[58%] opacity-70"
          style={{
            background:
              "radial-gradient(circle at 70% 35%, rgba(244,107,180,0.18), transparent 34%), radial-gradient(circle at 78% 58%, rgba(54,183,216,0.16), transparent 38%)",
          }}
        />
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-40 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(255,107,74,0.22), transparent 60%)" }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[600px] rounded-full opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(54,183,216,0.24), transparent 60%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-tsec"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sunset animate-pulse" />
            Launching alongside GTA 6 - Nov 19, 2026
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mt-6 font-heading text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tighter leading-[1.05] text-tprimary"
          >
            Your GTA 6 <span className="text-sunset-grad">launch-day command center</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 max-w-xl text-base md:text-lg text-tsec leading-relaxed"
          >
            ViceHub brings AI guidance, planning tools, and progress tracking into one calm, premium companion for
            the first day in Vice City and every session after.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <button
              data-testid="hero-join-waitlist-btn"
              onClick={openWaitlist}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-sunset px-7 py-3.5 text-sm font-semibold text-vice-bg hover:bg-coral transition-colors duration-300"
            >
              Join the Waitlist
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              data-testid="hero-ai-companion-btn"
              onClick={() => scrollTo("#ai-companion")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-tprimary hover:bg-white/5 transition-colors duration-300"
            >
              Try AI Companion
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32 }}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-tsec/60"
          >
            {PROMISE_POINTS.map((point) => (
              <span key={point} className="inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-sunset/70" />
                {point}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38 }}
            className="mt-10"
          >
            <Countdown />
            <p className="mt-3 text-xs text-tsec/50 max-w-md">
              Concept previews shown. Features will become available after launch.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroMockup />
        </motion.div>
      </div>

      <button
        onClick={() => scrollTo("#features")}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-tsec/40 hover:text-tsec transition-colors"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </button>
    </section>
  );
};
