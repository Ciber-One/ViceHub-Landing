import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";

export const SiteHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" data-testid="header-logo-link">
          <Logo withText />
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6">
          <Link to="/" data-testid="header-home-link" className="hidden text-sm text-tsec transition-colors hover:text-tprimary sm:inline">
            Home
          </Link>
          <Link to="/blog" data-testid="header-blog-link" className="text-sm text-tsec transition-colors hover:text-tprimary">
            Blog
          </Link>
          <Link to="/media" data-testid="header-media-link" className="hidden text-sm text-tsec transition-colors hover:text-tprimary sm:inline">
            Media
          </Link>
          <button
            data-testid="header-waitlist-btn"
            onClick={() => navigate("/#waitlist")}
            className="rounded-full bg-sunset px-4 py-2 text-xs font-semibold text-vice-bg transition-colors hover:bg-coral sm:px-5 sm:text-sm"
          >
            Join Waitlist
          </button>
        </nav>
      </div>
    </header>
  );
};
