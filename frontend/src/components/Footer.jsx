import { Twitter, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const SOCIALS = [
  { icon: Twitter, label: "twitter" },
  { icon: Instagram, label: "instagram" },
  { icon: Youtube, label: "youtube" },
  { icon: MessageCircle, label: "discord" },
];

export const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 bg-vice-bg2/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <Logo className="h-20" />
            <p className="mt-4 max-w-xs text-sm text-tsec/60">
              An independent fan-made companion concept. Not affiliated with or endorsed by Rockstar Games.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-5">
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  data-testid={`footer-social-${s.label}`}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-tsec hover:text-tprimary hover:border-white/25 transition-colors"
                >
                  <s.icon className="h-4 w-4" strokeWidth={1.6} />
                </a>
              ))}
            </div>
            <div className="flex gap-6 text-sm text-tsec/60">
              <Link to="/blog" data-testid="footer-blog" className="hover:text-tprimary transition-colors">Blog</Link>
              <a href={`${process.env.REACT_APP_BACKEND_URL}/api/rss.xml`} target="_blank" rel="noreferrer" data-testid="footer-rss" className="hover:text-tprimary transition-colors">RSS</a>
              <a href="#" data-testid="footer-privacy" className="hover:text-tprimary transition-colors">Privacy</a>
              <a href="#" data-testid="footer-terms" className="hover:text-tprimary transition-colors">Terms</a>
              <a href="#" data-testid="footer-contact" className="hover:text-tprimary transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-tsec/40">
          <span>© 2026 ViceHub. All rights reserved.</span>
          <span>Concept previews shown. Features available after launch.</span>
        </div>
      </div>
    </footer>
  );
};
