import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { useSeo } from "@/hooks/useSeo";

const PAGE_COPY = {
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    description:
      "How ViceHub handles waitlist emails, admin content, and product communication while the companion is in pre-launch.",
    updated: "July 6, 2026",
    sections: [
      {
        title: "Information We Collect",
        body:
          "ViceHub collects the email address you submit to join the waitlist, along with basic technical metadata used to operate, secure, and improve the site.",
      },
      {
        title: "How We Use It",
        body:
          "We use your email to confirm your waitlist signup, send early-access or launch updates, and understand interest in ViceHub features. We do not sell your personal information.",
      },
      {
        title: "Service Providers",
        body:
          "ViceHub uses trusted infrastructure and communication providers such as hosting, database, storage, analytics, and email services to run the product.",
      },
      {
        title: "Your Choices",
        body:
          "You can unsubscribe from launch emails at any time. For privacy or deletion requests, contact us and include the email address used for signup.",
      },
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms & Conditions",
    description:
      "The terms for using ViceHub as an independent fan-made GTA 6 companion concept and pre-launch website.",
    updated: "July 6, 2026",
    sections: [
      {
        title: "Independent Fan Concept",
        body:
          "ViceHub is an independent fan-made companion concept. It is not affiliated with, endorsed by, sponsored by, or connected to Rockstar Games or Take-Two Interactive.",
      },
      {
        title: "Pre-Launch Information",
        body:
          "Feature previews are concepts and may change before launch. ViceHub does not claim access to unreleased GTA 6 game data, missions, prices, vehicles, or private information.",
      },
      {
        title: "Acceptable Use",
        body:
          "Use ViceHub respectfully and lawfully. Do not attempt to disrupt the site, misuse forms, scrape protected areas, or interfere with admin systems.",
      },
      {
        title: "No Warranty",
        body:
          "ViceHub is provided as-is during pre-launch. We aim for reliability and polish, but availability, content, and features can change as the product develops.",
      },
    ],
  },
};

export default function Legal({ type }) {
  const page = PAGE_COPY[type] || PAGE_COPY.privacy;
  const url = `${window.location.origin}/${type}`;

  useSeo({
    title: `${page.title} - ViceHub`,
    description: page.description,
    url,
  });

  return (
    <div className="min-h-screen bg-vice-bg">
      <div className="grain" />
      <SiteHeader />

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-tsec/70 transition-colors hover:text-tprimary">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <div className="mt-10">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sunset">{page.eyebrow}</span>
          <h1 className="mt-4 font-heading text-4xl md:text-6xl font-medium tracking-tighter text-tprimary">
            {page.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg leading-8 text-tsec">{page.description}</p>
          <p className="mt-4 text-xs text-tsec/45">Last updated: {page.updated}</p>
        </div>

        <div className="mt-12 space-y-5">
          {page.sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-white/5 bg-vice-card p-6 md:p-7">
              <h2 className="font-heading text-xl font-medium tracking-tight text-tprimary">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-tsec/75">{section.body}</p>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
