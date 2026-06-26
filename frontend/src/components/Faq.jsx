import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, Overline } from "@/components/Reveal";
import { FAQS } from "@/data/content";

export const Faq = () => {
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center">
          <Overline>Questions</Overline>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-tprimary">
            Everything you might ask.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-10 w-full" data-testid="faq-accordion">
            {FAQS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/8">
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
