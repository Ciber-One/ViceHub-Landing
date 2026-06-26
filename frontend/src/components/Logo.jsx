import { LOGO_URL } from "@/data/content";

export const Logo = ({ className = "h-10", withText = false }) => {
  if (withText) {
    return (
      <div className="flex items-center gap-2.5" data-testid="vicehub-logo">
        <div
          className="h-10 w-10 shrink-0"
          style={{
            backgroundImage: `url(${LOGO_URL})`,
            backgroundSize: "165%",
            backgroundPosition: "center 36%",
            backgroundRepeat: "no-repeat",
            mixBlendMode: "screen",
          }}
        />
        <span className="font-heading text-lg font-semibold tracking-tight leading-none">
          <span className="text-silver">VICE</span>
          <span className="text-gold">HUB</span>
        </span>
      </div>
    );
  }
  return (
    <img
      src={LOGO_URL}
      alt="ViceHub — Your GTA 6 AI Companion"
      data-testid="vicehub-logo"
      draggable={false}
      className={`${className} w-auto select-none object-contain`}
      style={{ mixBlendMode: "screen" }}
    />
  );
};
