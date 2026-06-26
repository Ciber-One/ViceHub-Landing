import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ExternalLink, LogOut, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { blogApi } from "@/lib/blogApi";

const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);

  const load = () => blogApi.adminList().then(setPosts).catch(() => setPosts([]));
  useEffect(() => { load(); }, []);

  const del = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await blogApi.remove(id);
    load();
  };

  return (
    <div className="min-h-screen bg-vice-bg">
      <div className="grain" />
      <header className="border-b border-white/5 glass">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/"><Logo withText /></Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-tsec/70 hidden sm:block">{admin?.email}</span>
            <button
              data-testid="admin-logout-btn"
              onClick={() => { logout(); navigate("/admin/login"); }}
              className="inline-flex items-center gap-1.5 text-sm text-tsec hover:text-tprimary"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-medium text-tprimary">Posts</h1>
          <Link
            to="/admin/new"
            data-testid="new-post-btn"
            className="inline-flex items-center gap-2 rounded-full bg-sunset px-5 py-2.5 text-sm font-semibold text-vice-bg hover:bg-coral transition-colors"
          >
            <Plus className="h-4 w-4" /> New Post
          </Link>
        </div>

        {posts === null ? (
          <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-sunset" /></div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center text-tsec">No posts yet. Create your first one.</div>
        ) : (
          <div className="mt-8 rounded-2xl border border-white/5 bg-vice-card overflow-hidden" data-testid="admin-posts-list">
            {posts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-4 border-b border-white/5 last:border-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-tprimary truncate">{p.title}</h3>
                    <span className={`text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 ${p.published ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-tsec/70"}`}>
                      {p.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-tsec/60 mt-0.5">/{p.slug} · {fmtDate(p.created_at)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="p-2 text-tsec/70 hover:text-tprimary" title="View">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <Link to={`/admin/edit/${p.id}`} data-testid={`edit-post-${p.slug}`} className="p-2 text-tsec/70 hover:text-tprimary" title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button data-testid={`delete-post-${p.slug}`} onClick={() => del(p.id, p.title)} className="p-2 text-tsec/70 hover:text-coral" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
