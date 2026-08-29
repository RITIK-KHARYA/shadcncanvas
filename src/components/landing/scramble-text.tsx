import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#0123456789";

/**
 * Reveals `text` by briefly scrambling each character before it "resolves"
 * into place, left to right — the same idea as Skiper UI's hero headline.
 * No animation library required; respects prefers-reduced-motion.
 */
export function ScrambleText({
  text,
  className,
  as: Tag = "span",
  speed = 28,
  revealDelay = 22,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "div";
  /** ms between scramble frames */
  speed?: number;
  /** ms between each character locking in */
  revealDelay?: number;
}) {
  const [display, setDisplay] = useState(text);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setDisplay(text);
      return;
    }

    let cancelled = false;
    let lastTick = performance.now();
    const locked = new Array(text.length).fill(false);
    let lockCursor = 0;
    let lastLockAt = performance.now();

    const tick = (t: number) => {
      if (cancelled) return;

      if (t - lastLockAt > revealDelay && lockCursor < text.length) {
        locked[lockCursor] = true;
        lockCursor += 1;
        lastLockAt = t;
      }

      if (t - lastTick > speed) {
        lastTick = t;
        setDisplay(
          text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              if (locked[i]) return ch;
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join(""),
        );
      }

      if (lockCursor < text.length) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [text, speed, revealDelay]);

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
