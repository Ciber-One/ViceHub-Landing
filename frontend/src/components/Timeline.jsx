import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Reveal, Overline } from "@/components/Reveal";
import { TIMELINE } from "@/data/content";

export const Timeline = () => {
  return (
    <section id="roadmap" className="relative py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center">
          <Overline>The Journey</Overline>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-tprimary">
            From today to launch and beyond.
          </h2>
        </Reveal>

        <div className="relative mt-14 pl-2">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />
          <div className="space-y-8">
            {TIMELINE.map((node, i) => (
              <Reveal key={node.label} delay={i * 0.08}>
                <div className="relative flex items-start gap-5" data-testid={`timeline-node-${i}`}>
                  <span
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                      node.state === "active"
                        ? "border-sunset bg-sunset/20"
                        : node.state === "done"
                        ? "border-ocean/60 bg-ocean/15"
                        : "border-white/15 bg-vice-card"
                    }`}
                  >
                    {node.state === "done" ? (
                      <Check className="h-4 w-4 text-ocean" />
                    ) : (
                      <span className={`h-2.5 w-2.5 rounded-full ${node.state === "active" ? "bg-sunset animate-pulse" : "bg-white/30"}`} />
                    )}
                    {node.state === "active" && (
                      <motion.span
                        className="absolute inset-0 rounded-full border border-sunset"
                        animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </span>
                  <div className="pt-0.5">
                    <h3 className={`font-heading text-lg md:text-xl font-medium ${node.state === "active" ? "text-sunset" : "text-tprimary"}`}>
                      {node.label}
                    </h3>
                    <p className="mt-1 text-sm text-tsec">{node.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
