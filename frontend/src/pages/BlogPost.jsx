import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clock, ArrowLeft, ExternalLink, Loader2, MapPinned } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { blogApi, imageUrl } from "@/lib/blogApi";
import { useSeo } from "@/hooks/useSeo";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const SITE_URL = "https://www.vicehub.live";

const extractSources = (markdown = "") => {
  const seen = new Set();
  const sources = [];
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)(?:\s+["'][^"']*["'])?\)/gi;
  let match;

  while ((match = pattern.exec(markdown)) !== null) {
    const [, label, sourceUrl] = match;
    if (seen.has(sourceUrl)) continue;
    seen.add(sourceUrl);
    sources.push({ label: label.trim(), url: sourceUrl });
  }

  return sources;
};

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setPost(null);
    setNotFound(false);
    blogApi.get(slug).then(setPost).catch(() => setNotFound(true));
  }, [slug]);

  const url = `${SITE_URL}/blog/${slug}`;
  const coverPath = post?.cover_path ? imageUrl(post.cover_path) : "/vicehub.png";
  const cover = coverPath?.startsWith("http") ? coverPath : `${SITE_URL}${coverPath}`;
  const sources = useMemo(() => extractSources(post?.content), [post?.content]);

  useSeo(
    post
      ? {
          title: `${post.meta_title || post.title} | ViceHub Journal`,
          description: post.meta_description || post.excerpt,
          image: cover,
          url,
          type: "article",
          jsonLd: {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                "@id": `${url}#article`,
                headline: post.title,
                description: post.meta_description || post.excerpt,
                image: [cover],
                datePublished: post.created_at,
                dateModified: post.updated_at || post.created_at,
                author: {
                  "@type": /vicehub|team|staff/i.test(post.author || "") ? "Organization" : "Person",
                  name: post.author || "ViceHub Team",
                },
                publisher: {
                  "@type": "Organization",
                  name: "ViceHub",
                  logo: { "@type": "ImageObject", url: `${SITE_URL}/vicehub.png` },
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
                articleSection: post.category || "Journal",
                keywords: post.tags?.join(", "),
                citation: sources.length ? sources.map((source) => source.url) : undefined,
                isPartOf: { "@type": "Blog", name: "ViceHub Journal", url: `${SITE_URL}/blog` },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "ViceHub", item: `${SITE_URL}/` },
                  { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/blog` },
                  { "@type": "ListItem", position: 3, name: post.title, item: url },
                ],
              },
            ],
          },
        }
      : { title: "ViceHub Journal" }
  );

  return (
    <div className="min-h-screen bg-vice-bg">
      <div className="grain" />
      <SiteHeader />

      {notFound ? (
        <div className="max-w-3xl mx-auto px-6 py-32 text-center" data-testid="post-not-found">
          <h1 className="font-heading text-3xl text-tprimary">Post not found</h1>
          <Link to="/blog" className="mt-4 inline-block text-sunset">← Back to the Journal</Link>
        </div>
      ) : !post ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-sunset" />
        </div>
      ) : (
        <article className="max-w-3xl mx-auto px-6 pt-12 pb-24" data-testid="blog-post">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-tsec hover:text-tprimary transition-colors">
            <ArrowLeft className="h-4 w-4" /> The Journal
          </Link>

          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags?.map((t) => (
              <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-sunset/90">
                {t}
              </span>
            ))}
          </div>

          <h1 className="mt-5 font-heading text-3xl md:text-5xl font-medium tracking-tight text-tprimary leading-tight">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-tsec/70">
            <span>{post.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.created_at}>Published {fmtDate(post.created_at)}</time>
            {post.updated_at && fmtDate(post.updated_at) !== fmtDate(post.created_at) && (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={post.updated_at}>Updated {fmtDate(post.updated_at)}</time>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {post.reading_time} min read
            </span>
          </div>

          {post.cover_path && (
            <img
              src={imageUrl(post.cover_path)}
              alt={post.title}
              className="mt-8 w-full rounded-2xl border border-white/10 object-cover"
            />
          )}

          <div className="prose-vice mt-10" data-testid="post-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          {sources.length > 0 && (
            <section className="mt-14 border-t border-white/10 pt-8" aria-labelledby="article-sources">
              <h2 id="article-sources" className="font-heading text-2xl font-medium text-tprimary">
                Sources and references
              </h2>
              <ul className="mt-4 space-y-2">
                {sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-sunset transition-colors hover:text-coral"
                    >
                      {source.label}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-16 rounded-2xl border border-white/10 bg-vice-card p-8 text-center">
            <h3 className="font-heading text-2xl font-medium text-tprimary">Explore Leonida while you read.</h3>
            <p className="mt-2 text-tsec">Open the live map, or join the waitlist for everything ViceHub is building next.</p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/map"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sunset px-7 py-3 text-sm font-semibold text-vice-bg transition-colors hover:bg-coral"
              >
                <MapPinned className="h-4 w-4" />
                Open Interactive Map
              </Link>
              <Link
                to="/#waitlist"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-3 text-sm font-semibold text-tprimary transition-colors hover:border-sunset/40"
              >
                Join the Waitlist
              </Link>
            </div>
          </div>
        </article>
      )}
      <Footer />
    </div>
  );
}
