import { motion } from "framer-motion";
import { Bot, ChevronDown, Map as MapIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Countdown } from "@/components/Countdown";
import { HeroMockup } from "@/components/HeroMockup";
import { useWaitlist } from "@/context/WaitlistContext";
import { MEDIA } from "@/data/content";

const PROMISE_POINTS = ["Live AI guidance", "Interactive map", "Progress memory"];

export const Hero = () => {
  const { openWaitlist } = useWaitlist();
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-28">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.72] sm:opacity-[0.82]"
          style={{
            backgroundImage: `url(${MEDIA.gtaViceCityAerial})`,
            backgroundPosition: "60% center",
            backgroundSize: "cover",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(9,5,12,0.98) 0%, rgba(9,5,12,0.78) 48%, rgba(9,5,12,0.42) 100%), linear-gradient(180deg, rgba(9,5,12,0.46) 0%, rgba(9,5,12,0.2) 46%, #09050C 98%)",
          }}
        />
        <div
          className="absolute inset-0 sm:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(9,5,12,0.74) 0%, rgba(9,5,12,0.28) 34%, rgba(9,5,12,0.7) 70%, #09050C 100%)",
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

      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-vice-bg/[0.42] px-4 py-1.5 text-xs text-tsec backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sunset animate-pulse" />
            Launching alongside GTA 6 - Nov 19, 2026
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mt-5 font-heading text-[2.65rem] font-medium leading-[1.02] tracking-tighter text-tprimary sm:mt-6 sm:text-5xl lg:text-6xl"
          >
            Your GTA 6 <span className="text-sunset-grad">launch-day command center</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-tsec sm:mt-6 md:text-lg"
          >
            Start with the live AI companion and interactive Leonida map today, then grow into one calm, premium
            command center for every session in Vice City.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap"
          >
            <button
              data-testid="hero-ai-companion-btn"
              onClick={() => scrollTo("#ai-companion")}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-sunset px-7 py-3.5 text-sm font-semibold text-vice-bg transition-colors duration-300 hover:bg-coral"
            >
              <Bot className="h-4 w-4" />
              Ask AI Now
            </button>
            <Link
              to="/map"
              data-testid="hero-interactive-map-btn"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-vice-bg/[0.28] px-7 py-3.5 text-sm font-semibold text-tprimary backdrop-blur-md transition-colors duration-300 hover:bg-white/5"
            >
              <MapIcon className="h-4 w-4 text-sunset" />
              Explore Live Map
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 text-xs text-tsec/65"
          >
            Want every future tool?{" "}
            <button data-testid="hero-join-waitlist-btn" onClick={openWaitlist} className="font-semibold text-sunset hover:text-coral">
              Join the waitlist
            </button>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32 }}
            className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-tsec/65 sm:mt-8"
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
            className="mt-8 sm:mt-10"
          >
            <Countdown />
            <p className="mt-3 text-xs text-tsec/50 max-w-md">
              AI Companion and Interactive Map are live now. More ViceHub tools arrive as the platform grows.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hidden lg:block">
            <HeroMockup />
          </div>
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
