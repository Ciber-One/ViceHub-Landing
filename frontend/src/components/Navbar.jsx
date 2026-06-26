import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useWaitlist } from "@/context/WaitlistContext";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];
export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openWaitlist } = useWaitlist();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4">
      <nav
        data-testid="main-nav"
        className={`w-full max-w-6xl rounded-2xl border transition-all duration-500 ${
          scrolled
            ? "glass border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          <button onClick={() => go("body")} data-testid="nav-logo-btn" className="cursor-pointer">
            <Logo withText />
          </button>

          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <button
                key={l.href}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                onClick={() => go(l.href)}
                className="text-sm text-tsec hover:text-tprimary transition-colors duration-300"
              >
                {l.label}
              </button>
            ))}
            <button
              data-testid="nav-link-blog"
              onClick={() => navigate("/blog")}
              className="text-sm text-tsec hover:text-tprimary transition-colors duration-300"
            >
              Blog
            </button>
            <button
              data-testid="nav-join-waitlist-btn"
              onClick={openWaitlist}
              className="rounded-full bg-sunset px-5 py-2 text-sm font-semibold text-vice-bg hover:bg-coral transition-colors duration-300"
            >
              Join Waitlist
            </button>
          </div>

          <button
            className="md:hidden text-tprimary"
            data-testid="mobile-menu-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 px-4 py-4 flex flex-col gap-1" data-testid="mobile-menu">
            {LINKS.map((l) => (
              <button
                key={l.href}
                data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                onClick={() => go(l.href)}
                className="text-left py-3 px-2 rounded-lg text-tsec hover:text-tprimary hover:bg-white/5 transition-colors"
              >
                {l.label}
              </button>
            ))}
            <button
              data-testid="mobile-nav-link-blog"
              onClick={() => { setMobileOpen(false); navigate("/blog"); }}
              className="text-left py-3 px-2 rounded-lg text-tsec hover:text-tprimary hover:bg-white/5 transition-colors"
            >
              Blog
            </button>
            <button
              data-testid="mobile-join-waitlist-btn"
              onClick={() => {
                setMobileOpen(false);
                openWaitlist();
              }}
              className="mt-2 rounded-full bg-sunset px-5 py-3 text-sm font-semibold text-vice-bg"
            >
              Join Waitlist
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};
