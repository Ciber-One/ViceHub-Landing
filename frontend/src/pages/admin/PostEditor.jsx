import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Loader2, Upload, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { blogApi, imageUrl, formatApiError } from "@/lib/blogApi";

const Field = ({ label, children, hint }) => (
  <div>
    <label className="block text-xs uppercase tracking-wide text-tsec/70 mb-1.5">{label}</label>
    {children}
    {hint && <p className="mt-1 text-[11px] text-tsec/40">{hint}</p>}
  </div>
);

const inputCls =
  "w-full rounded-lg border border-white/10 bg-vice-bg2 px-3.5 py-2.5 text-sm text-tprimary placeholder:text-tsec/40 focus:outline-none focus:ring-1 focus:ring-sunset";

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", cover_path: null,
    tags: "", category: "News", meta_title: "", meta_description: "", author: "ViceHub Team", published: true,
  });
  const [tab, setTab] = useState("write");
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!editing) return;
    blogApi.adminGet(id)
      .then((p) => setForm({
        title: p.title || "", slug: p.slug || "", excerpt: p.excerpt || "",
        content: p.content || "", cover_path: p.cover_path || null,
        tags: (p.tags || []).join(", "), category: p.category || "News", meta_title: p.meta_title || "",
        meta_description: p.meta_description || "", author: p.author || "ViceHub Team",
        published: p.published,
      }))
      .catch(() => toast.error("Could not load post"))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { path } = await blogApi.uploadImage(file);
      set("cover_path", path);
      toast.success("Cover uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editing) await blogApi.update(id, payload);
      else await blogApi.create(payload);
      toast.success("Saved");
      navigate("/admin");
    } catch (e2) {
      toast.error(formatApiError(e2.response?.data?.detail) || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-vice-bg flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-sunset" /></div>;
  }

  return (
    <div className="min-h-screen bg-vice-bg">
      <div className="grain" />
      <header className="border-b border-white/5 glass sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-tsec hover:text-tprimary">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <button
            data-testid="save-post-btn"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center rounded-full bg-sunset px-6 py-2.5 text-sm font-semibold text-vice-bg hover:bg-coral transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        {/* main column */}
        <div className="lg:col-span-2 space-y-5">
          <Field label="Title">
            <input data-testid="post-title-input" className={inputCls + " text-lg"} value={form.title}
              onChange={(e) => set("title", e.target.value)} placeholder="Your headline" />
          </Field>

          <div className="flex items-center gap-2 border-b border-white/5">
            <button onClick={() => setTab("write")} className={`flex items-center gap-1.5 px-3 py-2 text-sm ${tab === "write" ? "text-sunset border-b-2 border-sunset" : "text-tsec/70"}`}>
              <Pencil className="h-3.5 w-3.5" /> Write
            </button>
            <button data-testid="preview-tab" onClick={() => setTab("preview")} className={`flex items-center gap-1.5 px-3 py-2 text-sm ${tab === "preview" ? "text-sunset border-b-2 border-sunset" : "text-tsec/70"}`}>
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
          </div>

          {tab === "write" ? (
            <Field
              label="Article"
              hint="Add trustworthy source links in Markdown. They will also appear in the article's Sources and references section."
            >
              <textarea data-testid="post-content-input" className={inputCls + " min-h-[460px] font-mono leading-relaxed"} value={form.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder={"Write in Markdown...\n\n## A heading\n\nSome **bold** text, a [source](https://example.com), and a list:\n\n- point one\n- point two"} />
            </Field>
          ) : (
            <div className="prose-vice rounded-lg border border-white/10 bg-vice-bg2 p-6 min-h-[460px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || "_Nothing to preview yet._"}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* sidebar */}
        <aside className="space-y-5">
          <Field label="Cover image">
            <div className="rounded-lg border border-white/10 bg-vice-bg2 overflow-hidden">
              {form.cover_path ? (
                <img src={imageUrl(form.cover_path)} alt="cover" className="w-full aspect-[16/10] object-cover" />
              ) : (
                <div className="w-full aspect-[16/10] flex items-center justify-center text-tsec/40 text-xs">No cover</div>
              )}
            </div>
            <label className="mt-2 inline-flex items-center gap-2 cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-sm text-tsec hover:text-tprimary">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {form.cover_path ? "Replace" : "Upload"}
              <input data-testid="cover-upload-input" type="file" accept="image/*" className="hidden" onChange={onUpload} />
            </label>
          </Field>

          <Field label="Slug" hint="Auto-generated from title if left blank">
            <input data-testid="post-slug-input" className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="my-post-url" />
          </Field>

          <Field label="Excerpt" hint="Short summary for cards & search">
            <textarea className={inputCls + " min-h-[70px]"} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          </Field>

          <Field label="Category">
            <input data-testid="post-category-input" className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="News" list="vh-categories" />
            <datalist id="vh-categories">
              <option value="News" />
              <option value="Guides" />
              <option value="Product" />
              <option value="Updates" />
            </datalist>
          </Field>

          <Field label="Tags" hint="Comma separated">
            <input className={inputCls} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="GTA 6, News" />
          </Field>

          <Field label="Author">
            <input className={inputCls} value={form.author} onChange={(e) => set("author", e.target.value)} />
          </Field>

          <div className="pt-2 border-t border-white/5">
            <p className="text-xs uppercase tracking-wide text-tsec/70 mb-2 mt-3">SEO</p>
            <Field label="Meta title" hint="Defaults to title">
              <input className={inputCls} value={form.meta_title} onChange={(e) => set("meta_title", e.target.value)} />
            </Field>
            <div className="mt-3">
              <Field label="Meta description">
                <textarea className={inputCls + " min-h-[70px]"} value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} />
              </Field>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input data-testid="published-toggle" type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="accent-sunset h-4 w-4" />
            <span className="text-sm text-tsec">Published (visible publicly)</span>
          </label>
        </aside>
      </main>
    </div>
  );
}
