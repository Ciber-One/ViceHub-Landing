import { Mail, MessageCircle, Send } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { useSeo } from "@/hooks/useSeo";

const CONTACT_EMAIL = "getportale@gmail.com";

export default function Contact() {
  useSeo({
    title: "Contact ViceHub",
    description: "Contact ViceHub for support, partnerships, press, and launch-related questions.",
    url: `${window.location.origin}/contact`,
  });

  return (
    <div className="min-h-screen bg-vice-bg">
      <div className="grain" />
      <SiteHeader />

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sunset">Contact</span>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="font-heading text-4xl md:text-6xl font-medium tracking-tighter text-tprimary">
              Talk to ViceHub.
            </h1>
            <p className="mt-5 max-w-2xl text-base md:text-lg leading-8 text-tsec">
              Questions, press, partnerships, feedback, or early-access issues can start here. Keep it short and useful,
              and the right person can pick it up quickly.
            </p>
          </div>

          <a
            href={`mailto:${CONTACT_EMAIL}?subject=ViceHub%20Contact`}
            data-testid="contact-email-cta"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sunset px-7 py-3.5 text-sm font-semibold text-vice-bg transition-colors hover:bg-coral"
          >
            <Send className="h-4 w-4" /> Email {CONTACT_EMAIL}
          </a>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-white/5 bg-vice-card p-7">
            <Mail className="h-5 w-5 text-sunset" />
            <h2 className="mt-5 font-heading text-2xl font-medium tracking-tight text-tprimary">General contact</h2>
            <p className="mt-3 text-sm leading-7 text-tsec/75">
              For launch updates, collaborations, privacy requests, or site questions, email us directly.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-5 inline-block text-sm font-semibold text-sunset hover:text-coral">
              {CONTACT_EMAIL}
            </a>
          </section>

          <section className="rounded-2xl border border-white/5 bg-vice-card p-7">
            <MessageCircle className="h-5 w-5 text-sunset" />
            <h2 className="mt-5 font-heading text-2xl font-medium tracking-tight text-tprimary">Community</h2>
            <p className="mt-3 text-sm leading-7 text-tsec/75">
              Social channels are being prepared for launch. Footer links are structured now so they can be swapped to
              official handles as soon as they are finalized.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
