import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Loader2, Search, Rss } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { blogApi, imageUrl, API } from "@/lib/blogApi";
import { useSeo } from "@/hooks/useSeo";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const siteUrl = `${window.location.origin}/blog`;

  useSeo({
    title: "ViceHub Journal — GTA 6 News, Guides & Concepts",
    description:
      "The ViceHub Journal: GTA 6 release date, map, characters, vehicles and companion concepts as we build toward launch.",
    url: siteUrl,
    image: `${window.location.origin}/og-default.jpg`,
  });

  useEffect(() => {
    blogApi.list().then(setPosts).catch(() => setPosts([]));
  }, []);

  const categories = useMemo(() => {
    if (!posts) return ["All"];
    return ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];
  }, [posts]);

  const filtered = useMemo(() => {
    if (!posts) return [];
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const catOk = category === "All" || p.category === category;
      if (!catOk) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.excerpt} ${(p.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [posts, category, query]);

  return (
    <div className="min-h-screen bg-vice-bg">
      <div className="grain" />
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-sunset">The Journal</span>
            <h1 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-tprimary">
              ViceHub Journal
            </h1>
            <p className="mt-4 text-base md:text-lg text-tsec">
              GTA 6 anticipation, companion concepts, and everything we're building toward launch.
            </p>
          </div>
          <a
            href={`${API}/rss.xml`}
            target="_blank"
            rel="noreferrer"
            data-testid="rss-link"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-tsec hover:text-tprimary hover:border-sunset/40 transition-colors shrink-0"
          >
            <Rss className="h-4 w-4" /> RSS Feed
          </a>
        </div>

        {/* search + categories */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tsec/50" />
            <input
              data-testid="blog-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-full border border-white/10 bg-vice-bg2 pl-10 pr-4 py-2.5 text-sm text-tprimary placeholder:text-tsec/40 focus:outline-none focus:ring-1 focus:ring-sunset"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                data-testid={`category-filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  category === c
                    ? "border-sunset/50 bg-sunset/15 text-sunset"
                    : "border-white/10 text-tsec/70 hover:text-tprimary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {posts === null ? (
          <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-sunset" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-tsec" data-testid="blog-empty">No articles found.</div>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7" data-testid="blog-grid">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
              >
                <Link
                  to={`/blog/${p.slug}`}
                  data-testid={`blog-card-${p.slug}`}
                  className="group block h-full rounded-2xl border border-white/5 bg-vice-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/15"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-vice-bg2 relative">
                    {p.cover_path ? (
                      <img src={imageUrl(p.cover_path)} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-vice-card to-vice-bg2" />
                    )}
                    {p.category && (
                      <span className="absolute top-3 left-3 rounded-full bg-vice-bg/80 backdrop-blur-sm border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-sunset">
                        {p.category}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-tsec/60">
                      <span>{fmtDate(p.created_at)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.reading_time} min read</span>
                    </div>
                    <h2 className="mt-3 font-heading text-xl font-medium text-tprimary group-hover:text-sunset transition-colors line-clamp-2">{p.title}</h2>
                    <p className="mt-2 text-sm text-tsec line-clamp-2">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm text-sunset">
                      Read <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
