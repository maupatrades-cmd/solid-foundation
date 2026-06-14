import { useEffect, useRef, useState } from "react";
import lottie, { type AnimationItem } from "lottie-web";
import mascotAsset from "@/assets/mascot-mj-dance.json.asset.json";

let cachedData: object | null = null;

function useMascotData() {
  const [data, setData] = useState<object | null>(cachedData);
  useEffect(() => {
    if (cachedData) {
      if (!data) setData(cachedData);
      return;
    }
    let cancelled = false;
    fetch(mascotAsset.url)
      .then((r) => r.json())
      .then((json) => {
        cachedData = json;
        if (!cancelled) setData(json);
      })
      .catch((e) => console.error("[Mascot] fetch failed", e));
    return () => {
      cancelled = true;
    };
  }, [data]);
  return data;
}

/**
 * Marketing iO dancing mascot.
 *   mode="overlay"  — full-screen dismissable celebration (auto-closes after one loop)
 *   mode="loop"     — transparent decorative loop
 */
export function Mascot({
  mode = "loop",
  size = 180,
  className,
  onDismiss,
}: {
  mode?: "loop" | "overlay";
  size?: number;
  className?: string;
  onDismiss?: () => void;
}) {
  const data = useMascotData();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (mode !== "overlay" || !onDismiss) return;
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [mode, onDismiss]);

  useEffect(() => {
    if (mode !== "overlay" || !onDismiss) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, onDismiss]);

  useEffect(() => {
    if (!data || !containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: data,
    });
    animRef.current = anim;
    return () => {
      anim.destroy();
      animRef.current = null;
    };
  }, [data]);

  if (mode === "overlay") {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Marketing iO mascot celebration"
        onClick={onDismiss}
        className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer"
        style={{ background: "rgba(10,10,46,0.85)", backdropFilter: "blur(4px)" }}
      >
        <div
          ref={containerRef}
          style={{ width: 400, height: 400, maxWidth: "85vw", maxHeight: "85vw" }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      data-mascot="loop"
      style={{ width: size, height: size, pointerEvents: "none" }}
    />
  );
}
