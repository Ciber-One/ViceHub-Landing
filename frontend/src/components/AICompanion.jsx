import { useState, useRef, useEffect } from "react";
import { ArrowRight, Loader2, Send, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Reveal, Overline } from "@/components/Reveal";
import { SUGGESTED_QUESTIONS, MEDIA } from "@/data/content";
import { streamCompanion } from "@/lib/api";

const sessionId = `vh-${Math.random().toString(36).slice(2, 10)}`;

const conceptReplies = [
  {
    match: ["where", "go", "next", "explore"],
    text: "Once GTA 6 launches, I will help you choose your next move based on your current goals, nearby opportunities, and the kind of session you want to play. Think of it as a calm route planner for a very loud city.",
  },
  {
    match: ["money", "earn", "cash", "faster"],
    text: "ViceHub will turn money-making into a clear plan instead of guesswork. You will be able to compare routes, activities, and priorities so every session feels more intentional.",
  },
  {
    match: ["vehicle", "car", "ride", "playstyle"],
    text: "The Vehicle Explorer will help you find rides that match how you play, whether you care about speed, handling, style, or getting across the city cleanly. It is built to feel like a premium garage, not a spreadsheet.",
  },
  {
    match: ["mission", "objective", "complete"],
    text: "When missions are live, ViceHub will keep your objectives, context, and next steps organized without spoiling the fun. You get momentum, not noise.",
  },
];

const companionHighlights = [
  { icon: Zap, label: "Fast route ideas" },
  { icon: ShieldCheck, label: "Fallback-safe replies" },
  { icon: Sparkles, label: "Launch-ready tone" },
];

const fallbackReply = (question) => {
  const q = question.toLowerCase();
  return (
    conceptReplies.find((reply) => reply.match.some((word) => q.includes(word)))?.text ||
    "ViceHub will turn that kind of question into a clear, stylish game plan once GTA 6 is live. For now, this preview shows the tone: quick answers, less searching, and more time in the city."
  );
};

const typeFallbackReply = (text, onDelta) =>
  new Promise((resolve) => {
    const words = text.split(" ");
    let i = 0;
    const tick = () => {
      if (i >= words.length) {
        resolve();
        return;
      }
      onDelta(`${i === 0 ? "" : " "}${words[i]}`);
      i += 1;
      window.setTimeout(tick, 24);
    };
    tick();
  });

export const AICompanion = () => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey - I'm your ViceHub companion. Ask me anything about your GTA 6 journey, and I'll show you how I'll help once we launch.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [replyMode, setReplyMode] = useState("ready");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const appendToLastAiMessage = (delta) => {
    setMessages((current) => {
      const copy = [...current];
      copy[copy.length - 1] = { role: "ai", text: copy[copy.length - 1].text + delta };
      return copy;
    });
  };

  const send = async (text) => {
    const q = (text || "").trim();
    if (!q || busy) return;

    setInput("");
    setMessages((current) => [...current, { role: "user", text: q }, { role: "ai", text: "" }]);
    setBusy(true);
    setReplyMode("thinking");

    try {
      await streamCompanion(q, sessionId, (delta) => {
        setReplyMode("live");
        appendToLastAiMessage(delta);
      });
    } catch {
      setReplyMode("preview");
      await typeFallbackReply(fallbackReply(q), appendToLastAiMessage);
    } finally {
      setBusy(false);
      setReplyMode((mode) => (mode === "thinking" ? "ready" : mode));
    }
  };

  const statusLabel = busy
    ? replyMode === "preview"
      ? "Preview fallback"
      : "Thinking"
    : replyMode === "live"
      ? "Live response ready"
      : replyMode === "preview"
        ? "Preview fallback ready"
        : "Ready";

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-20 -z-10 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-sunset/10 blur-[120px] lg:left-[70%] lg:h-[520px] lg:w-[520px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <Overline>AI Companion</Overline>
          <h2 className="mt-4 font-heading text-3xl font-medium tracking-tight text-tprimary md:text-4xl lg:text-5xl">
            A companion that actually gets your game.
          </h2>
          <p className="mt-4 max-w-md text-base text-tsec md:text-lg">
            Ask a question and watch the experience respond. This interactive concept previews
            the calm, useful guidance ViceHub is building for launch.
          </p>

          <div className="mt-7 grid max-w-lg gap-3 sm:grid-cols-3">
            {companionHighlights.map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <Icon className="h-4 w-4 text-sunset" />
                <p className="mt-2 text-sm font-medium text-tprimary">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                data-testid={`suggested-question-${question.slice(0, 10).replace(/\s/g, "-").toLowerCase()}`}
                disabled={busy}
                onClick={() => send(question)}
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-vice-card px-4 py-2 text-sm text-tsec transition-colors hover:border-sunset/40 hover:text-tprimary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>{question}</span>
                <ArrowRight className="h-3.5 w-3.5 text-sunset/80 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-vice-card shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-vice-bg2/70 px-5 py-4">
              <div className="flex items-center gap-3">
                <span
                  className="h-10 w-10 rounded-full bg-cover bg-center ring-1 ring-white/10"
                  style={{ backgroundImage: `url(${MEDIA.aiSphere})` }}
                />
                <div>
                  <div className="flex items-center gap-1.5 font-heading text-sm font-medium text-tprimary">
                    ViceHub AI <Sparkles className="h-3.5 w-3.5 text-sunset" />
                  </div>
                  <div className="text-[11px] text-tsec/60">Companion preview</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-tsec">
                <span className={`h-2 w-2 rounded-full ${busy ? "animate-pulse bg-sunset" : "bg-emerald-400"}`} />
                {statusLabel}
              </div>
            </div>

            <div
              ref={scrollRef}
              data-testid="ai-chat-messages"
              className="h-[26rem] overflow-y-auto bg-gradient-to-b from-white/[0.02] to-transparent px-4 py-5 sm:px-5"
            >
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-[0_12px_30px_rgba(0,0,0,0.22)] ${
                      message.role === "user"
                        ? "rounded-br-sm bg-sunset text-vice-bg"
                        : "rounded-bl-sm border border-white/8 bg-vice-bg2 text-tprimary/90"
                    }`}
                  >
                    {message.text || (busy && index === messages.length - 1 ? (
                      <span className="inline-flex items-center gap-2 text-tsec">
                        <Loader2 className="h-4 w-4 animate-spin text-sunset" />
                        Thinking through your route...
                      </span>
                    ) : "")}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                send(input);
              }}
              className="flex items-center gap-3 border-t border-white/5 bg-vice-bg2/50 px-4 py-3"
            >
              <input
                data-testid="ai-chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask the companion anything..."
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-tprimary placeholder:text-tsec/40 transition-colors focus:border-sunset/40 focus:outline-none"
              />
              <button
                type="submit"
                data-testid="ai-chat-send-btn"
                aria-label="Send AI companion message"
                disabled={busy || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sunset text-vice-bg transition-colors hover:bg-coral disabled:cursor-not-allowed disabled:opacity-40"
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
