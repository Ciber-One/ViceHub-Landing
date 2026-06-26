import { useState } from "react";
import { Loader2, Check, ArrowRight } from "lucide-react";
import { joinWaitlist } from "@/lib/api";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const WaitlistForm = ({ source = "landing", testid = "waitlist" }) => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!emailRe.test(email)) {
      setState("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setState("loading");
    try {
      const res = await joinWaitlist(email, source);
      setState("done");
      setMessage(res.already_joined ? "You're already on the list — see you at launch." : "You're in. Check your inbox for confirmation.");
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (state === "done") {
    return (
      <div data-testid={`${testid}-success`} className="flex items-center gap-3 rounded-full border border-sunset/30 bg-sunset/10 px-6 py-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sunset text-vice-bg">
          <Check className="h-4 w-4" />
        </span>
        <p className="text-sm text-tprimary">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full" data-testid={`${testid}-form`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          data-testid={`${testid}-email-input`}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="you@email.com"
          className="flex-1 rounded-full border border-white/10 bg-vice-bg2 px-5 py-3.5 text-sm text-tprimary placeholder:text-tsec/40 focus:outline-none focus:ring-1 focus:ring-sunset focus:border-sunset transition"
        />
        <button
          type="submit"
          data-testid={`${testid}-submit-btn`}
          disabled={state === "loading"}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-sunset px-7 py-3.5 text-sm font-semibold text-vice-bg hover:bg-coral transition-colors disabled:opacity-60"
        >
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : (
            <>Join the Waitlist <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
          )}
        </button>
      </div>
      {state === "error" && (
        <p data-testid={`${testid}-error`} className="mt-2 text-xs text-coral">{message}</p>
      )}
    </form>
  );
};
