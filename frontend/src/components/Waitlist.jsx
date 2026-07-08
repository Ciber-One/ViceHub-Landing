import { Reveal } from "@/components/Reveal";
import { WaitlistForm } from "@/components/WaitlistForm";
import { MEDIA } from "@/data/content";

export const Waitlist = () => {
  return (
    <section id="waitlist" className="relative overflow-hidden py-20 md:py-32">
      <div
        className="absolute inset-0 -z-10 opacity-[0.62] sm:opacity-[0.72]"
        style={{
          backgroundImage: `url(${MEDIA.gtaMountKalaga})`,
          backgroundSize: "cover",
          backgroundPosition: "center 48%",
        }}
      />
      <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg, #09050C 0%, rgba(9,5,12,0.34) 42%, rgba(9,5,12,0.9) 100%), linear-gradient(90deg, rgba(9,5,12,0.84) 0%, rgba(9,5,12,0.44) 50%, rgba(9,5,12,0.84) 100%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[700px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(244,107,180,0.26), transparent 60%)" }} />

      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-tprimary">
            Be Ready Before <span className="text-sunset-grad">Everyone Else.</span>
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-base md:text-lg text-tsec">
            Join the waitlist and be among the first players to experience ViceHub when GTA 6 launches.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 max-w-xl mx-auto">
            <WaitlistForm source="final-cta" testid="final-waitlist" />
            <p className="mt-4 text-xs text-tsec/50">
              No spam. We'll only email you about early access and launch. Unsubscribe anytime.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
