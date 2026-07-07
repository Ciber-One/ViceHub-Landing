import { ArrowUpRight, Instagram, Mail, MessageCircle, Rss, Twitter, Youtube } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { API } from "@/lib/blogApi";

const SOCIALS = [
  { icon: Twitter, label: "X / Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Youtube, label: "YouTube" },
  { icon: MessageCircle, label: "Discord" },
];

const FOOTER_SECTIONS = [
  {
    title: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Journal", to: "/blog" },
      { label: "RSS Feed", href: `${API}/rss.xml`, external: true, icon: Rss },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

const testId = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const Footer = () => {
  const year = new Date().getFullYear();
  const [socialNotice, setSocialNotice] = useState("");
  const socialNoticeTimeout = useRef(null);

  const showSocialNotice = (label) => {
    setSocialNotice(`${label} is coming soon.`);
    window.clearTimeout(socialNoticeTimeout.current);
    socialNoticeTimeout.current = window.setTimeout(() => setSocialNotice(""), 3000);
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-vice-bg2/40">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,123,84,0.5), transparent)" }}
      />
      <div className="absolute right-0 top-[-35%] h-[280px] w-[280px] rounded-full bg-sunset/10 blur-[120px] sm:right-[-20%] sm:top-[-45%] sm:h-[420px] sm:w-[520px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div className="max-w-md">
            <Link to="/" data-testid="footer-logo-link" className="inline-flex">
              <Logo className="h-20" />
            </Link>
            <p className="mt-5 text-sm leading-7 text-tsec/70">
              An independent fan-made companion concept. Not affiliated with or endorsed by Rockstar Games.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/#waitlist"
                data-testid="footer-waitlist"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sunset px-5 py-2.5 text-sm font-semibold text-vice-bg transition-colors hover:bg-coral"
              >
                Join Waitlist <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                data-testid="footer-contact-cta"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-tprimary transition-colors hover:border-sunset/40 hover:bg-white/5"
              >
                <Mail className="h-4 w-4" /> Contact
              </Link>
            </div>
          </div>

          <div className="grid gap-9 sm:grid-cols-3">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-tsec/45">{section.title}</h2>
                <div className="mt-4 flex flex-col gap-3">
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    const className = "inline-flex items-center gap-2 text-sm text-tsec/70 transition-colors hover:text-tprimary";

                    if (link.href) {
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noreferrer" : undefined}
                          data-testid={`footer-${testId(link.label)}`}
                          className={className}
                        >
                          {Icon && <Icon className="h-3.5 w-3.5" />} {link.label}
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={link.label}
                        to={link.to}
                        data-testid={`footer-${testId(link.label)}`}
                        className={className}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-tsec/45">Social</h2>
              <div className="mt-4 flex gap-2">
                {SOCIALS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => showSocialNotice(s.label)}
                    data-testid={`footer-social-${testId(s.label)}`}
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-tsec/70 transition-colors hover:border-sunset/40 hover:bg-white/5 hover:text-tprimary"
                  >
                    <s.icon className="h-4 w-4" strokeWidth={1.6} />
                  </button>
                ))}
              </div>
              <div aria-live="polite" className="mt-3 min-h-5 text-xs font-medium text-sunset" data-testid="footer-social-notice">
                {socialNotice}
              </div>
              <p className="mt-4 text-xs leading-6 text-tsec/45">
                Follow launch updates, article drops, and early-access announcements.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/5 pt-6 text-xs text-tsec/45 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {year} ViceHub. All rights reserved.</span>
          <span>Concept previews shown. Features become available after launch.</span>
        </div>
      </div>
    </footer>
  );
};
