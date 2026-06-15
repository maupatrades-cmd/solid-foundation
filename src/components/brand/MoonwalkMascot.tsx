import { useEffect, useState, type CSSProperties } from "react";

const NAVY = "#0a1f4d";
const NAVY_DEEP = "#061638";
const RED = "#e63946";
const RED_SOFT = "#ff5a6a";
const SCREEN = "#f4f6fb";
const INK = "#0b0f1a";
const GOLD = "#ffd34d";

type Phase = "spin" | "kick" | "handsup" | "point" | "turn" | "moonwalk";

const SEQ: { p: Phase; ms: number }[] = [
  { p: "spin",     ms: 1400 },
  { p: "kick",     ms: 1100 },
  { p: "handsup",  ms: 1200 },
  { p: "point",    ms: 1300 },
  { p: "turn",     ms: 1000 },
  { p: "moonwalk", ms: 2600 },
];

/**
 * Moonwalk Mascot — Michael Jackson tribute dance loop:
 * spin → kick → hands up → point → turn → moonwalk → repeat.
 * Standalone preview component, not wired into the CRM.
 */
export function MoonwalkMascot({
  size = 320,
  className = "",
  style,
  ...rest
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "style" | "className">) {
  const [phase, setPhase] = useState<Phase>("spin");

  useEffect(() => {
    let i = 0;
    let t: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      setPhase(SEQ[i].p);
      t = setTimeout(() => {
        i = (i + 1) % SEQ.length;
        tick();
      }, SEQ[i].ms);
    };
    tick();
    return () => { if (t) clearTimeout(t); };
  }, []);

  return (
    <div
      className={`mj-mascot ${className}`}
      style={{ width: size, height: size, ...style }}
      data-phase={phase}
      role="img"
      aria-label={`Moonwalk mascot — ${phase}`}
      {...rest}
    >
      <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="mj-head" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#13327a" />
            <stop offset="70%" stopColor={NAVY} />
            <stop offset="100%" stopColor={NAVY_DEEP} />
          </radialGradient>
          <radialGradient id="mj-screen" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor={SCREEN} />
          </radialGradient>
          <radialGradient id="mj-floor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,211,77,0.5)" />
            <stop offset="100%" stopColor="rgba(255,211,77,0)" />
          </radialGradient>
        </defs>

        {/* Stage glow */}
        <ellipse cx="120" cy="250" rx="100" ry="14" fill="url(#mj-floor)" className="mj-spotlight" />
        <ellipse className="mj-shadow" cx="120" cy="250" rx="55" ry="6" fill="rgba(6,22,56,0.32)" />

        {/* Dancer */}
        <g className="mj-dancer">
          {/* Legs */}
          <g className="mj-leg mj-leg-left">
            <rect x="100" y="190" width="14" height="50" rx="4" fill={NAVY} />
            <ellipse cx="107" cy="244" rx="14" ry="5" fill={INK} />
          </g>
          <g className="mj-leg mj-leg-right">
            <rect x="126" y="190" width="14" height="50" rx="4" fill={NAVY} />
            <ellipse cx="133" cy="244" rx="14" ry="5" fill={INK} />
          </g>

          {/* Body / jacket */}
          <g className="mj-body">
            <rect x="90" y="150" width="60" height="50" rx="10" fill={NAVY} stroke={NAVY_DEEP} strokeWidth="1.5" />
            <rect x="90" y="150" width="60" height="6" fill={RED} />
            {/* Sparkly glove side */}
            <circle cx="100" cy="170" r="2" fill={GOLD} />
            <circle cx="118" cy="178" r="1.6" fill={GOLD} />
            <circle cx="135" cy="166" r="1.8" fill={GOLD} />
          </g>

          {/* Arms */}
          <g className="mj-arm mj-arm-left">
            <rect x="72" y="158" width="22" height="9" rx="4" fill={NAVY} />
            <circle cx="72" cy="162" r="7" fill="#fff" stroke={GOLD} strokeWidth="1.5" />
            <circle cx="70" cy="160" r="1.2" fill={GOLD} />
            <circle cx="74" cy="164" r="1" fill={GOLD} />
          </g>
          <g className="mj-arm mj-arm-right">
            <rect x="146" y="158" width="22" height="9" rx="4" fill={NAVY} />
            <circle cx="168" cy="162" r="7" fill="#fff" stroke={GOLD} strokeWidth="1.5" />
            <circle cx="170" cy="160" r="1.2" fill={GOLD} />
            <circle cx="166" cy="164" r="1" fill={GOLD} />
          </g>

          {/* Head */}
          <g className="mj-head-group">
            <circle cx="120" cy="100" r="62" fill="url(#mj-head)" stroke={NAVY_DEEP} strokeWidth="1.5" />

            {/* Fedora */}
            <g className="mj-hat">
              <ellipse cx="120" cy="58" rx="58" ry="7" fill={INK} />
              <path d="M86 58 Q120 28 154 58 Z" fill={INK} />
              <rect x="86" y="55" width="68" height="5" fill={NAVY_DEEP} opacity="0.6" />
            </g>

            {/* Screen face */}
            <circle cx="120" cy="105" r="32" fill="url(#mj-screen)" stroke={NAVY_DEEP} strokeWidth="2" />
            <g fill={INK}>
              <circle cx="110" cy="103" r="4.2" />
              <circle cx="130" cy="103" r="4.2" />
            </g>
            <path d="M108 118 Q120 126 132 118" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        </g>

        {/* Sparkles */}
        <g className="mj-sparkles" fill={GOLD}>
          <circle cx="40"  cy="80"  r="2" />
          <circle cx="200" cy="70"  r="2.5" />
          <circle cx="30"  cy="170" r="1.8" />
          <circle cx="210" cy="180" r="2.2" />
          <circle cx="60"  cy="40"  r="1.6" />
          <circle cx="180" cy="50"  r="1.6" />
        </g>
      </svg>

      <style>{`
        .mj-mascot { display: inline-block; position: relative; line-height: 0; }
        .mj-mascot svg { width: 100%; height: 100%; overflow: visible; }

        .mj-sparkles circle { animation: mj-twinkle 1.6s ease-in-out infinite; }
        .mj-sparkles circle:nth-child(2) { animation-delay: .2s; }
        .mj-sparkles circle:nth-child(3) { animation-delay: .4s; }
        .mj-sparkles circle:nth-child(4) { animation-delay: .6s; }
        .mj-sparkles circle:nth-child(5) { animation-delay: .8s; }
        .mj-sparkles circle:nth-child(6) { animation-delay: 1s; }
        @keyframes mj-twinkle {
          0%, 100% { opacity: .2; transform: scale(.8); transform-origin: center; }
          50%      { opacity: 1;  transform: scale(1.4); }
        }

        .mj-spotlight { animation: mj-spot 2.4s ease-in-out infinite; transform-origin: 120px 250px; }
        @keyframes mj-spot {
          0%, 100% { opacity: .6; transform: scaleX(1); }
          50%      { opacity: 1;  transform: scaleX(1.1); }
        }

        .mj-dancer    { transform-origin: 120px 200px; }
        .mj-head-group{ transform-origin: 120px 100px; }
        .mj-body      { transform-origin: 120px 175px; }
        .mj-arm-left  { transform-origin: 90px 162px; }
        .mj-arm-right { transform-origin: 150px 162px; }
        .mj-leg-left  { transform-origin: 107px 190px; }
        .mj-leg-right { transform-origin: 133px 190px; }
        .mj-hat       { transform-origin: 120px 58px; }
        .mj-shadow    { transform-origin: 120px 250px; }

        /* ---------- SPIN ---------- */
        [data-phase="spin"] .mj-dancer { animation: mj-spin 1.4s ease-in-out 1; }
        [data-phase="spin"] .mj-hat    { animation: mj-hat-wobble 1.4s ease-in-out 1; }
        @keyframes mj-spin {
          0%   { transform: rotateY(0deg)    translateY(0); }
          50%  { transform: rotateY(540deg)  translateY(-10px); }
          100% { transform: rotateY(720deg)  translateY(0); }
        }
        @keyframes mj-hat-wobble {
          0%, 100% { transform: rotate(0); }
          40%      { transform: rotate(-10deg) translateY(-2px); }
          70%      { transform: rotate(8deg); }
        }

        /* ---------- KICK ---------- */
        [data-phase="kick"] .mj-leg-right { animation: mj-kick 1.1s ease-in-out 1; }
        [data-phase="kick"] .mj-arm-left  { animation: mj-arm-balance 1.1s ease-in-out 1; }
        [data-phase="kick"] .mj-dancer    { animation: mj-bounce 1.1s ease-in-out 1; }
        @keyframes mj-kick {
          0%, 100% { transform: rotate(0); }
          45%      { transform: rotate(-70deg) translate(6px, -8px); }
          70%      { transform: rotate(-50deg) translate(4px, -4px); }
        }
        @keyframes mj-arm-balance {
          0%, 100% { transform: rotate(0); }
          50%      { transform: rotate(-40deg) translateY(-4px); }
        }
        @keyframes mj-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }

        /* ---------- HANDS UP ---------- */
        [data-phase="handsup"] .mj-arm-left  { animation: mj-handsup-l 1.2s ease-out 1 forwards; }
        [data-phase="handsup"] .mj-arm-right { animation: mj-handsup-r 1.2s ease-out 1 forwards; }
        [data-phase="handsup"] .mj-dancer    { animation: mj-tiptoe 1.2s ease-in-out 1; }
        @keyframes mj-handsup-l {
          0%   { transform: rotate(0); }
          60%  { transform: rotate(-150deg) translate(20px, -10px); }
          100% { transform: rotate(-140deg) translate(18px, -8px); }
        }
        @keyframes mj-handsup-r {
          0%   { transform: rotate(0); }
          60%  { transform: rotate(150deg) translate(-20px, -10px); }
          100% { transform: rotate(140deg) translate(-18px, -8px); }
        }
        @keyframes mj-tiptoe {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px) scale(1.02); }
        }

        /* ---------- POINT (signature MJ point) ---------- */
        [data-phase="point"] .mj-arm-right { animation: mj-point 1.3s ease-out 1 forwards; }
        [data-phase="point"] .mj-arm-left  { animation: mj-arm-tuck 1.3s ease-out 1 forwards; }
        [data-phase="point"] .mj-head-group{ animation: mj-head-look 1.3s ease-out 1; }
        [data-phase="point"] .mj-body      { animation: mj-lean 1.3s ease-out 1; }
        @keyframes mj-point {
          0%   { transform: rotate(0); }
          50%  { transform: rotate(-60deg) translate(20px, -22px) scaleX(1.2); }
          100% { transform: rotate(-55deg) translate(22px, -24px) scaleX(1.25); }
        }
        @keyframes mj-arm-tuck {
          0%   { transform: rotate(0); }
          100% { transform: rotate(40deg) translate(-4px, 6px); }
        }
        @keyframes mj-head-look {
          0%, 100% { transform: rotate(0); }
          50%      { transform: rotate(8deg) translateY(-2px); }
        }
        @keyframes mj-lean {
          0%, 100% { transform: rotate(0); }
          50%      { transform: rotate(6deg); }
        }

        /* ---------- TURN ---------- */
        [data-phase="turn"] .mj-dancer { animation: mj-turn 1s ease-in-out 1; }
        @keyframes mj-turn {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }

        /* ---------- MOONWALK ---------- */
        [data-phase="moonwalk"] .mj-dancer    { animation: mj-glide 2.6s ease-in-out 1; }
        [data-phase="moonwalk"] .mj-leg-left  { animation: mj-step-l 0.65s ease-in-out 4; }
        [data-phase="moonwalk"] .mj-leg-right { animation: mj-step-r 0.65s ease-in-out 4; animation-delay: .325s; }
        [data-phase="moonwalk"] .mj-shadow    { animation: mj-shadow-slide 2.6s ease-in-out 1; }
        [data-phase="moonwalk"] .mj-arm-left  { animation: mj-arm-swing 0.65s ease-in-out 4; }
        [data-phase="moonwalk"] .mj-arm-right { animation: mj-arm-swing 0.65s ease-in-out 4; animation-delay: .325s; }
        @keyframes mj-glide {
          0%   { transform: translateX(60px) rotateY(180deg); }
          100% { transform: translateX(-60px) rotateY(180deg); }
        }
        @keyframes mj-shadow-slide {
          0%   { transform: translateX(60px); }
          100% { transform: translateX(-60px); }
        }
        @keyframes mj-step-l {
          0%   { transform: translate(0,0) rotate(0); }
          50%  { transform: translate(8px,-4px) rotate(8deg); }
          100% { transform: translate(0,0) rotate(0); }
        }
        @keyframes mj-step-r {
          0%   { transform: translate(0,0) rotate(0); }
          50%  { transform: translate(-8px,-4px) rotate(-8deg); }
          100% { transform: translate(0,0) rotate(0); }
        }
        @keyframes mj-arm-swing {
          0%, 100% { transform: rotate(0); }
          50%      { transform: rotate(15deg); }
        }
      `}</style>
    </div>
  );
}
