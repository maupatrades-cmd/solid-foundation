import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import mascotAsset from "@/assets/mascot-mj-dance.json.asset.json";

let cachedData: unknown | null = null;

function useMascotData() {
  const [data, setData] = useState<unknown | null>(cachedData);
  useEffect(() => {
    if (cachedData) {
      console.log("[Mascot] using cached data");
      return;
    }
    let cancelled = false;
    console.log("[Mascot] fetching", mascotAsset.url);
    fetch(mascotAsset.url)
      .then((r) => r.json())
      .then((json) => {
        console.log("[Mascot] loaded, layers:", (json as { layers?: unknown[] }).layers?.length);
        cachedData = json;
        if (!cancelled) setData(json);
      })
      .catch((e) => console.error("[Mascot] fetch failed", e));
    return () => {
      cancelled = true;
    };
  }, []);
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
        <div style={{ width: 400, height: 400, maxWidth: "85vw", maxHeight: "85vw" }}>
          {data ? <Lottie animationData={data} loop autoplay /> : null}
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={className}
      data-mascot="loop"
      style={{ width: size, height: size, pointerEvents: "none", background: "rgba(255,0,0,0.2)", border: "2px dashed red" }}
    >
      {data ? <Lottie animationData={data} loop autoplay /> : <span style={{color:'red',fontSize:10}}>NODATA</span>}
    </div>
  );
}
