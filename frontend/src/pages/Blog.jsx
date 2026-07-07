import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Loader2, Rss, Search } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { blogApi, imageUrl, API } from "@/lib/blogApi";
import { useSeo } from "@/hooks/useSeo";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const slugId = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const siteUrl = `${window.location.origin}/blog`;

  useSeo({
    title: "ViceHub Journal - GTA 6 News, Guides & Concepts",
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

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-vice-bg">
      <div className="grain" />
      <SiteHeader />

      <main className="relative max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[300px] w-[320px] -translate-x-1/2 rounded-full bg-sunset/10 blur-[120px] sm:h-[360px] sm:w-[720px]" />

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-tprimary">
              Field notes for the road to Vice City.
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg leading-8 text-tsec">
              A quieter, sharper journal for GTA 6 launch prep: release updates, map thinking, companion concepts, and
              the product decisions behind ViceHub.
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

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tsec/50" />
            <input
              data-testid="blog-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-full border border-white/10 bg-vice-bg2 pl-10 pr-4 py-2.5 text-sm text-tprimary placeholder:text-tsec/40 focus:outline-none focus:ring-1 focus:ring-sunset"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                data-testid={`category-filter-${slugId(c)}`}
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
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-sunset" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-tsec" data-testid="blog-empty">No articles found.</div>
        ) : (
          <div className="mt-12" data-testid="blog-grid">
            {featured && (
              <Link
                to={`/blog/${featured.slug}`}
                data-testid={`blog-featured-${featured.slug}`}
                className="group grid overflow-hidden rounded-2xl border border-white/10 bg-vice-card transition-all duration-300 hover:-translate-y-1 hover:border-sunset/30 lg:grid-cols-[1.05fr_0.95fr]"
              >
                <div className="relative min-h-[320px] overflow-hidden bg-vice-bg2">
                  {featured.cover_path ? (
                    <img
                      src={imageUrl(featured.cover_path)}
                      alt={featured.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-vice-card to-vice-bg2" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-vice-bg/80 via-transparent to-transparent" />
                </div>

                <div className="flex flex-col justify-between p-7 md:p-9">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-tsec/60">
                      {featured.category && (
                        <span className="rounded-full border border-sunset/30 bg-sunset/10 px-3 py-1 uppercase tracking-wide text-sunset">
                          {featured.category}
                        </span>
                      )}
                      <span>{fmtDate(featured.created_at)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {featured.reading_time} min read
                      </span>
                    </div>
                    <h2 className="mt-5 font-heading text-3xl md:text-4xl font-medium tracking-tight text-tprimary transition-colors group-hover:text-sunset">
                      {featured.title}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-tsec">{featured.excerpt}</p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sunset">
                    Read featured note <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {rest.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                  >
                    <Link
                      to={`/blog/${p.slug}`}
                      data-testid={`blog-card-${p.slug}`}
                      className="group block h-full overflow-hidden rounded-2xl border border-white/5 bg-vice-card transition-all duration-300 hover:-translate-y-1 hover:border-white/15"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-vice-bg2 relative">
                        {p.cover_path ? (
                          <img
                            src={imageUrl(p.cover_path)}
                            alt={p.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
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
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {p.reading_time} min read
                          </span>
                        </div>
                        <h2 className="mt-3 font-heading text-xl font-medium text-tprimary group-hover:text-sunset transition-colors line-clamp-2">
                          {p.title}
                        </h2>
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
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
