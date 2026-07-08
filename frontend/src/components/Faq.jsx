import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, Overline } from "@/components/Reveal";
import { FAQS, MEDIA } from "@/data/content";

export const Faq = () => {
  return (
    <section id="faq" className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(9,5,12,0.88) 0%, rgba(9,5,12,0.46) 50%, rgba(9,5,12,0.72) 100%), linear-gradient(180deg, #09050C 0%, rgba(9,5,12,0.1) 48%, #09050C 100%), url(${MEDIA.gtaPortGellhornNight})`,
          backgroundPosition: "center 46%",
          backgroundSize: "cover",
        }}
      />
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center">
          <Overline>Questions</Overline>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-tprimary">
            Everything you might ask.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion
            type="single"
            collapsible
            className="mt-10 w-full rounded-3xl border border-white/10 bg-vice-card/[0.68] px-5 py-2 shadow-[0_24px_70px_-36px_rgba(0,0,0,0.86)] backdrop-blur-md sm:px-7"
            data-testid="faq-accordion"
          >
            {FAQS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                <AccordionTrigger
                  data-testid={`faq-trigger-${i}`}
                  className="text-left font-heading text-base md:text-lg font-medium text-tprimary hover:text-sunset hover:no-underline"
                >
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-tsec text-sm md:text-base leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
};
