import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Reveal, Overline } from "@/components/Reveal";
import { SUGGESTED_QUESTIONS, MEDIA } from "@/data/content";
import { streamCompanion } from "@/lib/api";

const sessionId = `vh-${Math.random().toString(36).slice(2, 10)}`;

export const AICompanion = () => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey — I'm your ViceHub companion. Ask me anything about your GTA 6 journey, and I'll show you how I'll help once we launch.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const q = (text || "").trim();
    if (!q || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }, { role: "ai", text: "" }]);
    setBusy(true);
    try {
      await streamCompanion(q, sessionId, (delta) => {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "ai", text: copy[copy.length - 1].text + delta };
          return copy;
        });
      });
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "ai",
          text: "The companion is resting for a moment. Please try again shortly.",
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <Overline>AI Companion</Overline>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-tprimary">
            A companion that actually gets your game.
          </h2>
          <p className="mt-4 max-w-md text-base md:text-lg text-tsec">
            Ask a question and watch it respond. This is a live concept of the conversational
            experience coming to ViceHub.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                data-testid={`suggested-question-${q.slice(0, 10).replace(/\s/g, "-").toLowerCase()}`}
                disabled={busy}
                onClick={() => send(q)}
                className="rounded-full border border-white/10 bg-vice-card px-4 py-2 text-sm text-tsec hover:text-tprimary hover:border-sunset/40 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-white/10 bg-vice-card overflow-hidden shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3 border-b border-white/5 bg-vice-bg2/70 px-5 py-4">
              <span
                className="h-9 w-9 rounded-full bg-cover bg-center ring-1 ring-white/10"
                style={{ backgroundImage: `url(${MEDIA.aiSphere})` }}
              />
              <div>
                <div className="flex items-center gap-1.5 font-heading text-sm font-medium text-tprimary">
                  ViceHub AI <Sparkles className="h-3.5 w-3.5 text-sunset" />
                </div>
                <div className="text-[11px] text-tsec/60">Concept preview</div>
              </div>
            </div>

            <div ref={scrollRef} data-testid="ai-chat-messages" className="h-80 overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-sunset text-vice-bg rounded-br-sm"
                        : "bg-vice-bg2 text-tprimary/90 rounded-bl-sm border border-white/5"
                    }`}
                  >
                    {m.text || (busy && i === messages.length - 1 ? <Loader2 className="h-4 w-4 animate-spin text-sunset" /> : "")}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-white/5 bg-vice-bg2/40 px-4 py-3"
            >
              <input
                data-testid="ai-chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the companion anything…"
                className="flex-1 bg-transparent text-sm text-tprimary placeholder:text-tsec/40 focus:outline-none"
              />
              <button
                type="submit"
                data-testid="ai-chat-send-btn"
                disabled={busy || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sunset text-vice-bg disabled:opacity-40 hover:bg-coral transition-colors"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
