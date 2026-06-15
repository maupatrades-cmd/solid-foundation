import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const NAVY = "#0a1f4d";
const NAVY_DEEP = "#061638";
const RED = "#e63946";
const RED_SOFT = "#ff5a6a";
const SCREEN = "#f4f6fb";
const INK = "#0b0f1a";
const WHITE = "#ffffff";

type Phase = "idle" | "mj-kick" | "mj-moonwalk" | "mj-lean" | "mj-point";

function CharacterBody(): ReactNode {
  return (
    <g>
      {/* LEGS */}
      <g className="mio-leg-left">
        <rect x="86" y="210" width="22" height="70" rx="10" fill={NAVY} />
        <rect x="86" y="268" width="22" height="14" rx="6" fill={RED} />
        <ellipse cx="97" cy="272" rx="6" ry="3" fill="rgba(255,255,255,0.25)" />
      </g>
      <g className="mio-leg-right">
        <rect x="132" y="210" width="22" height="70" rx="10" fill={NAVY} />
        <rect x="132" y="268" width="22" height="14" rx="6" fill={RED} />
        <ellipse cx="143" cy="272" rx="6" ry="3" fill="rgba(255,255,255,0.25)" />
      </g>

      {/* TORSO */}
      <g className="mio-torso">
        <rect x="82" y="148" width="76" height="72" rx="20" fill="url(#mj-jacket)" stroke={NAVY_DEEP} strokeWidth="1.5" />
        <path d="M120 148 L120 220" stroke={NAVY_DEEP} strokeWidth="1.5" opacity="0.4" />
        <path d="M120 148 L104 180 L120 168 L136 180 Z" fill={RED} opacity="0.9" />
        <rect x="82" y="204" width="76" height="8" rx="3" fill={RED} />
        <rect x="114" y="204" width="12" height="8" rx="2" fill="#c0c0c0" />
      </g>

      {/* ARMS */}
      <g className="mio-arm-left">
        <rect x="52" y="160" width="18" height="52" rx="9" fill={NAVY} />
        <g transform="translate(48, 206)">
          <rect x="0" y="0" width="26" height="20" rx="8" fill={WHITE} stroke="#e0e0e0" strokeWidth="0.5" />
          <rect x="3" y="3" width="20" height="14" rx="3" fill="#1da1f2" />
        </g>
      </g>
      <g className="mio-arm-right">
        <rect x="170" y="160" width="18" height="52" rx="9" fill={NAVY} />
        <g transform="translate(166, 206)">
          <rect x="0" y="0" width="26" height="20" rx="8" fill={WHITE} stroke="#e0e0e0" strokeWidth="0.5" />
          <rect x="3" y="3" width="20" height="14" rx="3" fill="#1877f2" />
        </g>
      </g>

      {/* HEAD */}
      <g className="mio-head-group">
        <circle cx="120" cy="90" r="88" fill="url(#mj-glow)" opacity="0.6" />
        <circle cx="120" cy="90" r="78" fill="url(#mj-head)" stroke={NAVY_DEEP} strokeWidth="1.5" />
        <g stroke={RED} strokeWidth="1" fill="none" opacity="0.9">
          <circle cx="120" cy="90" r="70" strokeDasharray="3 5" />
          <circle cx="120" cy="90" r="62" strokeDasharray="2 7" opacity="0.6" />
        </g>
        <circle cx="120" cy="92" r="38" fill="url(#mj-screen)" stroke={NAVY_DEEP} strokeWidth="2" />
        <g className="mio-face">
          <g className="mio-eyes" fill={INK}>
            <circle cx="108" cy="90" r="5.2" />
            <circle cx="132" cy="90" r="5.2" />
            <circle cx="109.6" cy="88.4" r="1.4" fill="#ffffff" />
            <circle cx="133.6" cy="88.4" r="1.4" fill="#ffffff" />
          </g>
          <path d="M108 104 Q120 112 132 104" stroke={INK} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </g>
        <g className="mio-antenna">
          <line x1="120" y1="12" x2="120" y2="0" stroke={NAVY_DEEP} strokeWidth="2" />
          <circle cx="120" cy="-4" r="4" fill={RED} />
          <circle cx="120" cy="-4" r="7" fill={RED_SOFT} opacity="0.35" className="mio-antenna-glow" />
        </g>
      </g>
    </g>
  );
}

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
  const [phase, setPhase] = useState<Phase>("idle");
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isHovered) {
      setPhase("idle");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    const seq: { p: Phase; ms: number }[] = [
      { p: "mj-kick", ms: 900 },
      { p: "mj-moonwalk", ms: 2000 },
      { p: "mj-lean", ms: 1800 },
      { p: "mj-point", ms: 1500 },
      { p: "idle", ms: 1000 },
    ];
    let i = 0;
    const tick = () => {
      setPhase(seq[i].p);
      timeoutRef.current = setTimeout(() => {
        i += 1;
        if (i < seq.length) tick();
        else setPhase("idle");
      }, seq[i].ms);
    };
    tick();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isHovered]);

  return (
    <div
      className={`mio-mascot ${className}`}
      style={{ width: size, height: size, ...style }}
      data-phase={phase}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="img"
      aria-label="Interactive Marketing iO mascot — hover to dance"
      {...rest}
    >
      <svg className="mio-svg" viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg">
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
          <radialGradient id="mj-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(230,57,70,0.55)" />
            <stop offset="100%" stopColor="rgba(230,57,70,0)" />
          </radialGradient>
          <linearGradient id="mj-jacket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#13327a" />
            <stop offset="100%" stopColor={NAVY} />
          </linearGradient>
        </defs>

        <ellipse className="mio-shadow" cx="120" cy="300" rx="52" ry="7" fill="rgba(6,22,56,0.28)" />

        {/* MOTION GHOSTS — only visible during moonwalk */}
        <g className="mio-ghost mio-ghost-1" opacity="0">
          <CharacterBody />
        </g>
        <g className="mio-ghost mio-ghost-2" opacity="0">
          <CharacterBody />
        </g>

        {/* MAIN CHARACTER */}
        <g className="mio-character">
          <CharacterBody />
        </g>
      </svg>

      <style>{`
        .mio-mascot { display: inline-block; position: relative; line-height: 0; cursor: pointer; }
        .mio-mascot svg { width: 100%; height: 100%; overflow: visible; }

        .mio-character {
          transform-origin: 120px 180px;
          animation: mio-doodle-breathe 2.8s ease-in-out infinite;
        }
        @keyframes mio-doodle-breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-4px) scale(1.02); }
        }

        .mio-shadow {
          transform-origin: 120px 300px;
          animation: mio-shadow 2.8s ease-in-out infinite;
        }
        @keyframes mio-shadow {
          0%, 100% { transform: scale(1); opacity: 0.28; }
          50%      { transform: scale(0.86); opacity: 0.18; }
        }

        .mio-eyes { transform-origin: 120px 90px; animation: mio-blink 4.2s ease-in-out infinite; }
        @keyframes mio-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95%           { transform: scaleY(0.1); }
        }

        .mio-antenna-glow {
          transform-origin: 120px -4px;
          animation: mio-antenna 1.6s ease-in-out infinite;
        }
        @keyframes mio-antenna {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50%      { transform: scale(1.6); opacity: 0.05; }
        }

        /* Limb origins */
        .mio-leg-left  { transform-origin: 97px 210px; }
        .mio-leg-right { transform-origin: 143px 210px; }
        .mio-arm-left  { transform-origin: 61px 160px; }
        .mio-arm-right { transform-origin: 179px 160px; }
        .mio-torso     { transform-origin: 120px 180px; }
        .mio-head-group{ transform-origin: 120px 90px; }

        /* ===== SNAPPY DOODLE CHOREOGRAPHY ===== */

        /* 1. KICK */
        [data-phase="mj-kick"] .mio-leg-right {
          animation: doodle-kick 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        [data-phase="mj-kick"] .mio-character {
          animation: doodle-lean-back 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        [data-phase="mj-kick"] .mio-arm-left {
          animation: doodle-kick-arm 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes doodle-kick {
          0%, 100% { transform: rotate(0deg); }
          30%, 70% { transform: rotate(-85deg) scale(1.1); }
        }
        @keyframes doodle-lean-back {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          30%, 70% { transform: translateY(-4px) rotate(-12deg) translateX(6px); }
        }
        @keyframes doodle-kick-arm {
          0%, 100% { transform: rotate(0deg); }
          30%, 70% { transform: rotate(35deg); }
        }

        /* 2. MOONWALK with ghost trails */
        [data-phase="mj-moonwalk"] .mio-character {
          animation: doodle-slide-back 2s linear;
        }
        [data-phase="mj-moonwalk"] .mio-ghost-1 {
          opacity: 0.25;
          animation: doodle-slide-back 2s linear 0.1s, ghost-fade 2s linear;
        }
        [data-phase="mj-moonwalk"] .mio-ghost-2 {
          opacity: 0.15;
          animation: doodle-slide-back 2s linear 0.2s, ghost-fade 2s linear;
        }
        [data-phase="mj-moonwalk"] .mio-leg-left,
        [data-phase="mj-moonwalk"] .mio-ghost-1 .mio-leg-left,
        [data-phase="mj-moonwalk"] .mio-ghost-2 .mio-leg-left {
          animation: doodle-walk-1 0.45s linear infinite;
        }
        [data-phase="mj-moonwalk"] .mio-leg-right,
        [data-phase="mj-moonwalk"] .mio-ghost-1 .mio-leg-right,
        [data-phase="mj-moonwalk"] .mio-ghost-2 .mio-leg-right {
          animation: doodle-walk-2 0.45s linear infinite;
        }
        @keyframes doodle-slide-back {
          0%   { transform: translateX(40px); }
          100% { transform: translateX(-50px); }
        }
        @keyframes ghost-fade {
          0%   { opacity: 0; }
          20%  { opacity: 0.3; }
          90%  { opacity: 0.2; }
          100% { opacity: 0; }
        }
        @keyframes doodle-walk-1 {
          0%, 100% { transform: rotate(25deg) translateY(-4px); }
          50%      { transform: rotate(-20deg) translateY(0); }
        }
        @keyframes doodle-walk-2 {
          0%, 100% { transform: rotate(-20deg) translateY(0); }
          50%      { transform: rotate(25deg) translateY(-4px); }
        }

        /* 3. ANTI-GRAVITY LEAN */
        [data-phase="mj-lean"] .mio-character {
          animation: doodle-lean 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-origin: 120px 282px;
        }
        @keyframes doodle-lean {
          0%, 100% { transform: rotate(0deg); }
          40%, 60% { transform: rotate(40deg); }
        }

        /* 4. POINT */
        [data-phase="mj-point"] .mio-arm-right {
          animation: doodle-point-arm 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        [data-phase="mj-point"] .mio-character {
          animation: doodle-point-body 1.5s cubic-bezier(0.25, 1, 0.5, 1);
        }
        [data-phase="mj-point"] .mio-head-group {
          animation: doodle-point-head 1.5s ease;
        }
        @keyframes doodle-point-arm {
          0%, 100% { transform: rotate(0deg); }
          20%, 80% { transform: rotate(-150deg) scale(1.1); }
        }
        @keyframes doodle-point-body {
          0%, 100% { transform: rotate(0deg); }
          20%, 80% { transform: rotate(12deg) translateY(-5px); }
        }
        @keyframes doodle-point-head {
          0%, 100% { transform: rotate(0deg); }
          20%, 80% { transform: rotate(14deg) translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

export default MoonwalkMascot;
