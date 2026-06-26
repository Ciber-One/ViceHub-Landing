import { WaitlistProvider } from "@/context/WaitlistContext";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductPreview } from "@/components/ProductPreview";
import { AICompanion } from "@/components/AICompanion";
import { MapPreview } from "@/components/MapPreview";
import { WhyLoveIt } from "@/components/WhyLoveIt";
import { ComingSoon } from "@/components/ComingSoon";
import { Timeline } from "@/components/Timeline";
import { Waitlist } from "@/components/Waitlist";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { WaitlistDialog } from "@/components/WaitlistDialog";

export default function Landing() {
  return (
    <WaitlistProvider>
      <div className="grain" />
      <Navbar />
      <main>
        <Hero />
        <ProductPreview />
        <AICompanion />
        <MapPreview />
        <WhyLoveIt />
        <ComingSoon />
        <Timeline />
        <Waitlist />
        <Faq />
      </main>
      <Footer />
      <WaitlistDialog />
    </WaitlistProvider>
  );
}
