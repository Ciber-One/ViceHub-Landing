import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useWaitlist } from "@/context/WaitlistContext";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "AI Companion", href: "#ai-companion" },
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

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const go = (href) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        data-testid="main-nav"
        className={`w-full max-w-6xl rounded-[1.15rem] border transition-all duration-500 sm:rounded-2xl ${
          scrolled || mobileOpen
            ? "glass border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
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
              data-testid="nav-link-map"
              onClick={() => navigate("/map")}
              className="inline-flex items-center gap-2 text-sm text-tsec transition-colors duration-300 hover:text-tprimary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sunset" />
              Live Map
            </button>
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
          <div
            className="fixed inset-x-3 top-[4.75rem] z-[60] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[1.35rem] border border-white/10 bg-[#080706]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:inset-x-4 sm:top-[5.75rem] sm:max-h-[calc(100vh-7rem)] sm:rounded-3xl md:hidden"
            data-testid="mobile-menu"
          >
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-sunset/60 to-transparent" />
            <div className="mb-4 border-b border-white/10 pb-4">
              <p className="text-xs uppercase tracking-[0.26em] text-tmuted">Navigate</p>
              <p className="mt-2 text-sm text-tsec">Open a live feature or explore the platform.</p>
            </div>
            <div className="flex flex-col gap-2">
              {LINKS.map((l) => (
                <button
                  key={l.href}
                  data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                  onClick={() => go(l.href)}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-4 text-left text-base font-semibold text-tprimary transition-colors hover:border-white/10 hover:bg-white/[0.06]"
                >
                  {l.label}
                </button>
              ))}
              <button
                data-testid="mobile-nav-link-map"
                onClick={() => { setMobileOpen(false); navigate("/map"); }}
                className="flex items-center justify-between rounded-2xl border border-sunset/20 bg-sunset/[0.08] px-4 py-4 text-left text-base font-semibold text-tprimary transition-colors hover:border-sunset/35 hover:bg-sunset/[0.12]"
              >
                Live Map
                <span className="text-[10px] uppercase tracking-[0.18em] text-sunset">Open</span>
              </button>
              <button
                data-testid="mobile-nav-link-blog"
                onClick={() => { setMobileOpen(false); navigate("/blog"); }}
                className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-4 text-left text-base font-semibold text-tprimary transition-colors hover:border-white/10 hover:bg-white/[0.06]"
              >
                Blog
              </button>
              <button
                data-testid="mobile-join-waitlist-btn"
                onClick={() => {
                  setMobileOpen(false);
                  openWaitlist();
                }}
                className="mt-3 rounded-full bg-sunset px-5 py-4 text-base font-semibold text-vice-bg transition-colors hover:bg-coral"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
