import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clock, ArrowLeft, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { blogApi, imageUrl } from "@/lib/blogApi";
import { useSeo } from "@/hooks/useSeo";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setPost(null);
    setNotFound(false);
    blogApi.get(slug).then(setPost).catch(() => setNotFound(true));
  }, [slug]);

  const url = `${window.location.origin}/blog/${slug}`;
  const cover = post?.cover_path ? imageUrl(post.cover_path) : `${window.location.origin}/og-default.jpg`;

  useSeo(
    post
      ? {
          title: `${post.meta_title || post.title} — ViceHub Journal`,
          description: post.meta_description || post.excerpt,
          image: cover,
          url,
          type: "article",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.meta_description || post.excerpt,
            image: cover,
            datePublished: post.created_at,
            dateModified: post.updated_at,
            author: { "@type": "Organization", name: post.author || "ViceHub" },
            publisher: { "@type": "Organization", name: "ViceHub" },
            mainEntityOfPage: url,
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

          <div className="mt-5 flex items-center gap-3 text-sm text-tsec/70">
            <span>{post.author}</span>
            <span>·</span>
            <span>{fmtDate(post.created_at)}</span>
            <span>·</span>
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

          <div className="mt-16 rounded-2xl border border-white/10 bg-vice-card p-8 text-center">
            <h3 className="font-heading text-2xl font-medium text-tprimary">Be ready before everyone else.</h3>
            <p className="mt-2 text-tsec">Join the waitlist for the ultimate GTA 6 companion.</p>
            <Link
              to="/#waitlist"
              className="mt-5 inline-block rounded-full bg-sunset px-7 py-3 text-sm font-semibold text-vice-bg hover:bg-coral transition-colors"
            >
              Join the Waitlist
            </Link>
          </div>
        </article>
      )}
      <Footer />
    </div>
  );
}
