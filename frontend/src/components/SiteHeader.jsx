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
        <nav className="flex items-center gap-6">
          <Link to="/" data-testid="header-home-link" className="text-sm text-tsec hover:text-tprimary transition-colors">
            Home
          </Link>
          <Link to="/blog" data-testid="header-blog-link" className="text-sm text-tsec hover:text-tprimary transition-colors">
            Blog
          </Link>
          <button
            data-testid="header-waitlist-btn"
            onClick={() => navigate("/#waitlist")}
            className="rounded-full bg-sunset px-5 py-2 text-sm font-semibold text-vice-bg hover:bg-coral transition-colors"
          >
            Join Waitlist
          </button>
        </nav>
      </div>
    </header>
  );
};
