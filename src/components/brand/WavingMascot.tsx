import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mascot } from "./Mascot";

const PHASES: { text: string; bold: boolean }[] = [
  { text: "Tired of hiding? Same here.", bold: false },
  { text: "Sign in. Be seen.", bold: true },
];

/**
 * Mascot flies in from the left, lands above the auth card, then a typed
 * speech bubble walks through two lines. Used on the Sign In page.
 */
export function WavingMascot() {
  const [landed, setLanded] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [bubblePhase, setBubblePhase] = useState(0);

  useEffect(() => {
    if (!landed) return;
    const CHAR_MS = 70;
    const HOLD_MS = 1100;
    const START_MS = 250;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const typeOut = (text: string, onDone: () => void) => {
      let i = 0;
      setBubbleText("");
      const step = () => {
        i += 1;
        setBubbleText(text.slice(0, i));
        if (i < text.length) timer = setTimeout(step, CHAR_MS);
        else timer = setTimeout(onDone, HOLD_MS);
      };
      timer = setTimeout(step, START_MS);
    };

    const runPhase = (n: number) => {
      if (n >= PHASES.length) return;
      setBubblePhase(n + 1);
      typeOut(PHASES[n].text, () => {
        if (n + 1 < PHASES.length) runPhase(n + 1);
      });
    };

    runPhase(0);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [landed]);

  return (
    <>
      <motion.div
        initial={{ x: "-120vw", rotate: -720, opacity: 0 }}
        animate={{ x: 0, rotate: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.9, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => setLanded(true)}
        style={{
          position: "absolute",
          top: "-55px",
          left: "50%",
          marginLeft: "-60px",
          width: 120,
          height: 120,
          zIndex: 30,
          pointerEvents: "none",
          background: "transparent",
        }}
      >
        <Mascot mode="loop" size={120} />
      </motion.div>

      {landed && (
        <>
          {/* Desktop bubble */}
          <motion.div
            className="hidden sm:block"
            initial={{ opacity: 0, scale: 0.6, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "-38px",
              left: "calc(50% + 62px)",
              width: 172,
              background: "#ffffff",
              borderRadius: 14,
              padding: "10px 13px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
              zIndex: 35,
              pointerEvents: "none",
              border: "1px solid #E3E3E3",
            }}
            role="status"
            aria-live="polite"
          >
            <div
              style={{
                color: "#0A0A0F",
                fontWeight: bubblePhase === 2 ? 700 : 400,
                fontSize: bubblePhase === 2 ? 15 : 13,
                lineHeight: 1.35,
                minHeight: 32,
              }}
            >
              {bubbleText}
              <span className="mio-bubble-caret" aria-hidden="true">|</span>
            </div>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 28,
                left: -12,
                width: 0,
                height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderRight: "13px solid #ffffff",
                filter: "drop-shadow(-3px 2px 2px rgba(0,0,0,0.06))",
              }}
            />
            <style>{`@keyframes mio-bubble-caret-blink{0%,49%{opacity:1}50%,100%{opacity:0}}.mio-bubble-caret{display:inline-block;margin-left:2px;color:#0A0A0F;animation:mio-bubble-caret-blink .85s steps(1) infinite}`}</style>
          </motion.div>

          {/* Mobile bubble */}
          <motion.div
            className="block sm:hidden"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              marginTop: 70,
              marginLeft: 12,
              marginRight: 12,
              background: "#ffffff",
              borderRadius: 14,
              padding: "10px 14px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
              zIndex: 35,
              pointerEvents: "none",
              border: "1px solid #E3E3E3",
            }}
            role="status"
            aria-live="polite"
          >
            <div
              style={{
                color: "#0A0A0F",
                fontWeight: bubblePhase === 2 ? 700 : 400,
                fontSize: bubblePhase === 2 ? 15 : 13,
                lineHeight: 1.35,
              }}
            >
              {bubbleText}
              <span className="mio-bubble-caret" aria-hidden="true">|</span>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
