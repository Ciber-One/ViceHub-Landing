import { useState, useEffect } from "react";
import { LAUNCH_DATE } from "@/data/content";

const calc = () => {
  const diff = new Date(LAUNCH_DATE).getTime() - Date.now();
  const clamp = Math.max(diff, 0);
  return {
    days: Math.floor(clamp / 86400000),
    hours: Math.floor((clamp / 3600000) % 24),
    minutes: Math.floor((clamp / 60000) % 60),
    seconds: Math.floor((clamp / 1000) % 60),
  };
};

const Unit = ({ value, label }) => (
  <div className="flex flex-col items-center" data-testid={`countdown-${label.toLowerCase()}`}>
    <span className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold tabular-nums text-tprimary">
      {String(value).padStart(2, "0")}
    </span>
    <span className="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-tsec/70">{label}</span>
  </div>
);

export const Countdown = () => {
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      data-testid="launch-countdown"
      className="inline-flex items-center gap-4 sm:gap-6 rounded-2xl border border-white/10 bg-vice-bg2/60 px-5 sm:px-8 py-4 backdrop-blur-sm"
    >
      <Unit value={t.days} label="Days" />
      <span className="text-tsec/30 text-2xl -mt-3">:</span>
      <Unit value={t.hours} label="Hrs" />
      <span className="text-tsec/30 text-2xl -mt-3">:</span>
      <Unit value={t.minutes} label="Min" />
      <span className="text-tsec/30 text-2xl -mt-3">:</span>
      <Unit value={t.seconds} label="Sec" />
    </div>
  );
};
