import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/blogApi";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await login(email, password);
      navigate("/admin");
    } catch (e2) {
      setErr(formatApiError(e2.response?.data?.detail) || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-vice-bg flex items-center justify-center px-6">
      <div className="grain" />
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-vice-card p-8">
        <div className="flex justify-center"><Logo className="h-16" /></div>
        <h1 className="mt-6 font-heading text-2xl font-medium text-tprimary text-center">Admin Sign In</h1>
        <form onSubmit={submit} className="mt-6 space-y-4" data-testid="admin-login-form">
          <input
            data-testid="admin-email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-white/10 bg-vice-bg2 px-4 py-3 text-sm text-tprimary placeholder:text-tsec/40 focus:outline-none focus:ring-1 focus:ring-sunset"
          />
          <input
            data-testid="admin-password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-white/10 bg-vice-bg2 px-4 py-3 text-sm text-tprimary placeholder:text-tsec/40 focus:outline-none focus:ring-1 focus:ring-sunset"
          />
          {err && <p data-testid="admin-login-error" className="text-xs text-coral">{err}</p>}
          <button
            data-testid="admin-login-submit"
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-sunset px-6 py-3 text-sm font-semibold text-vice-bg hover:bg-coral transition-colors disabled:opacity-60 flex items-center justify-center"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
