import type { ReactNode } from "react";

/**
 * CSS-only infinite marquee (no JS scroll listeners, no extra deps).
 * Duplicates its children once so the loop is seamless, and pauses on hover.
 */
export function Marquee({
  children,
  durationSeconds = 26,
  className,
}: {
  children: ReactNode;
  durationSeconds?: number;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className ?? ""}`}
    >
      <div
        className="animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none flex w-max shrink-0 items-center gap-8"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        <div className="flex shrink-0 items-center gap-8">{children}</div>
        <div className="flex shrink-0 items-center gap-8" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
