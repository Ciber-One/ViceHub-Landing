import { Reveal } from "@/components/Reveal";
import { WaitlistForm } from "@/components/WaitlistForm";
import { MEDIA } from "@/data/content";

export const Waitlist = () => {
  return (
    <section id="waitlist" className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-45"
        style={{
          backgroundImage: `url(${MEDIA.palm})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg, #0A0A0A 0%, rgba(10,10,10,0.45) 45%, rgba(10,10,10,0.75) 100%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[700px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(255,123,84,0.25), transparent 60%)" }} />

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
