import { useState, useRef, useEffect } from "react";
import { ArrowRight, BrainCircuit, Loader2, MapPinned, Route, Send, ShieldCheck, Sparkles, Zap } from "lucide-react";
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
  { icon: Zap, label: "Fast route ideas", meta: "Session-aware" },
  { icon: ShieldCheck, label: "Fallback-safe replies", meta: "Stable preview" },
  { icon: Sparkles, label: "Launch-ready tone", meta: "Vice City style" },
];

const companionContext = [
  { icon: MapPinned, label: "Area", value: "Vice City" },
  { icon: Route, label: "Plan", value: "Explore first" },
  { icon: BrainCircuit, label: "Mode", value: "Calm guidance" },
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
      text: "Hey - I'm your live ViceHub companion. Ask me anything about planning your GTA 6 journey and I'll help you turn it into a clear next step.",
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
    <section id="ai-companion" className="relative overflow-hidden py-20 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.34] sm:opacity-[0.42]"
        style={{
          backgroundImage: `linear-gradient(90deg, #09050C 0%, rgba(9,5,12,0.78) 45%, rgba(9,5,12,0.34) 100%), linear-gradient(180deg, #09050C 0%, rgba(9,5,12,0.14) 42%, #09050C 100%), url(${MEDIA.gtaGrassriversChase})`,
          backgroundPosition: "center 48%",
          backgroundSize: "cover",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 sm:hidden" style={{ background: "linear-gradient(180deg, #09050C 0%, rgba(9,5,12,0.62) 34%, #09050C 100%)" }} />
      <div className="pointer-events-none absolute left-1/2 top-20 -z-10 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-sunset/10 blur-[120px] lg:left-[70%] lg:h-[520px] lg:w-[520px]" />
      <div className="pointer-events-none absolute bottom-10 left-[8%] -z-10 h-[320px] w-[420px] rounded-full bg-ocean/10 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8">
        <Reveal>
          <Overline>AI Companion - Live</Overline>
          <h2 className="mt-4 font-heading text-3xl font-medium tracking-tight text-tprimary md:text-4xl lg:text-5xl">
            A companion that actually gets your game.
          </h2>
          <p className="mt-4 max-w-md text-base text-tsec md:text-lg">
            Ask a question and get a live response. ViceHub turns scattered ideas into calm,
            useful guidance you can start exploring right now.
          </p>

          <div className="mt-7 grid max-w-lg gap-3 sm:grid-cols-3">
            {companionHighlights.map(({ icon: Icon, label, meta }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-vice-card/[0.58] px-4 py-3 shadow-[0_18px_42px_-32px_rgba(0,0,0,0.8)] backdrop-blur-md">
                <Icon className="h-4 w-4 text-sunset" strokeWidth={1.7} />
                <p className="mt-2 text-sm font-medium text-tprimary">{label}</p>
                <p className="mt-1 text-[11px] text-tsec/50">{meta}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid max-w-lg gap-2 rounded-3xl border border-white/10 bg-vice-bg/[0.58] p-3 backdrop-blur-md sm:grid-cols-3">
            {companionContext.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/[0.035] px-3 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <Icon className="h-4 w-4 text-coral" strokeWidth={1.6} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-tsec/45">{label}</span>
                  <span className="block truncate text-xs font-semibold text-tprimary">{value}</span>
                </span>
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
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-vice-card/[0.78] px-4 py-2 text-sm text-tsec shadow-[0_14px_34px_-30px_rgba(0,0,0,0.8)] backdrop-blur-sm transition-colors hover:border-sunset/40 hover:bg-white/[0.06] hover:text-tprimary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>{question}</span>
                <ArrowRight className="h-3.5 w-3.5 text-sunset/80 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-vice-card/[0.88] shadow-[0_34px_95px_-42px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:rounded-[1.75rem]">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-[0.72]"
              style={{ background: "linear-gradient(120deg, rgba(255,107,74,0.18), rgba(244,107,180,0.1), rgba(54,183,216,0.12))" }}
            />
            <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-vice-bg2/[0.76] px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-sunset/25 via-vicepink/20 to-ocean/20 shadow-[0_0_28px_rgba(255,107,74,0.18)]">
                  <Sparkles className="h-5 w-5 text-coral" strokeWidth={1.7} />
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border border-vice-bg bg-emerald-400" />
                </span>
                <div>
                  <div className="flex items-center gap-1.5 font-heading text-sm font-medium text-tprimary">
                    ViceHub AI <Sparkles className="h-3.5 w-3.5 text-sunset" />
                  </div>
                  <div className="text-[11px] text-tsec/60">Live AI companion</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-tsec backdrop-blur-md">
                <span className={`h-2 w-2 rounded-full ${busy ? "animate-pulse bg-sunset" : "bg-emerald-400"}`} />
                {statusLabel}
              </div>
            </div>

            <div className="relative grid grid-cols-3 border-b border-white/5 bg-vice-bg/[0.42] px-3 py-3 text-center sm:px-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-tsec/40">Memory</div>
                <div className="mt-1 font-heading text-sm text-tprimary">Session</div>
              </div>
              <div className="border-x border-white/5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-tsec/40">Tone</div>
                <div className="mt-1 font-heading text-sm text-tprimary">No spoilers</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-tsec/40">Speed</div>
                <div className="mt-1 font-heading text-sm text-tprimary">Fast</div>
              </div>
            </div>

            <div
              ref={scrollRef}
              data-testid="ai-chat-messages"
              className="relative h-[23rem] overflow-y-auto bg-gradient-to-b from-white/[0.025] to-transparent px-3 py-4 sm:h-[26rem] sm:px-5 sm:py-5"
            >
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-[0_12px_30px_rgba(0,0,0,0.22)] sm:max-w-[86%] ${
                      message.role === "user"
                        ? "rounded-br-sm bg-gradient-to-br from-coral to-sunset text-vice-bg"
                        : "rounded-bl-sm border border-white/10 bg-vice-bg2/[0.86] text-tprimary/90 backdrop-blur-sm"
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
              className="relative flex items-center gap-2 border-t border-white/5 bg-vice-bg2/[0.66] px-3 py-3 sm:gap-3 sm:px-4"
            >
              <input
                data-testid="ai-chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask the companion anything..."
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-tprimary placeholder:text-tsec/40 transition-colors focus:border-sunset/40 focus:bg-white/[0.065] focus:outline-none"
              />
              <button
                type="submit"
                data-testid="ai-chat-send-btn"
                aria-label="Send AI companion message"
                disabled={busy || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sunset text-vice-bg shadow-[0_14px_34px_-18px_rgba(255,107,74,0.9)] transition-colors hover:bg-coral disabled:cursor-not-allowed disabled:opacity-40"
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
