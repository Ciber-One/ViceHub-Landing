import { LOGO_LIGHT_URL, LOGO_MARK_URL } from "@/data/content";

export const Logo = ({ className = "h-10", withText = false }) => {
  if (withText) {
    return (
      <div className="flex items-center gap-2" data-testid="vicehub-logo">
        <img
          src={LOGO_MARK_URL}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="h-8 w-10 shrink-0 object-contain"
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
      src={LOGO_LIGHT_URL}
      alt="ViceHub - Your GTA 6 AI Companion"
      data-testid="vicehub-logo"
      draggable={false}
      className={`${className} w-auto select-none object-contain`}
    />
  );
};
