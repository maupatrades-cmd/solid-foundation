import { useState, type CSSProperties, type ReactNode } from "react";

const NAVY = "#0a1f4d";
const NAVY_DEEP = "#061638";
const RED = "#e63946";
const WHITE = "#ffffff";

function Humanoid(): ReactNode {
  return (
    <g className="hm-figure">
      {/* Head (the "i" dot) */}
      <g className="hm-head">
        <circle cx="100" cy="40" r="22" fill={NAVY} stroke={NAVY_DEEP} strokeWidth="2" />
        <circle cx="100" cy="40" r="22" fill="none" stroke={RED} strokeWidth="1" strokeDasharray="2 4" opacity="0.7" />
        {/* face */}
        <circle cx="92" cy="38" r="2.4" fill={WHITE} />
        <circle cx="108" cy="38" r="2.4" fill={WHITE} />
        <path d="M92 48 Q100 53 108 48" stroke={WHITE} strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* antenna spark */}
        <circle cx="100" cy="14" r="3" fill={RED} className="hm-spark" />
      </g>

      {/* Torso */}
      <rect className="hm-torso" x="86" y="66" width="28" height="50" rx="10" fill={NAVY} stroke={NAVY_DEEP} strokeWidth="1.5" />
      <rect x="86" y="106" width="28" height="6" rx="2" fill={RED} />

      {/* Arms */}
      <g className="hm-arm-left">
        <rect x="64" y="72" width="22" height="8" rx="4" fill={NAVY} />
        <circle cx="64" cy="76" r="5" fill={RED} />
      </g>
      <g className="hm-arm-right">
        <rect x="114" y="72" width="22" height="8" rx="4" fill={NAVY} />
        <circle cx="136" cy="76" r="5" fill={RED} />
      </g>

      {/* Legs */}
      <g className="hm-leg-left">
        <rect x="88" y="116" width="9" height="44" rx="4" fill={NAVY} />
        <rect x="86" y="158" width="13" height="6" rx="2" fill={RED} />
      </g>
      <g className="hm-leg-right">
        <rect x="103" y="116" width="9" height="44" rx="4" fill={NAVY} />
        <rect x="101" y="158" width="13" height="6" rx="2" fill={RED} />
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
  const [active, setActive] = useState(false);

  return (
    <div
      className={`hm-mascot ${className}`}
      style={{ width: size, height: size, ...style }}
      data-active={active}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      role="img"
      aria-label="Humanoid Marketing iO mascot — hover to bounce"
      {...rest}
    >
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <ellipse className="hm-shadow" cx="100" cy="175" rx="36" ry="5" fill="rgba(6,22,56,0.25)" />

        {/* Ghost trails */}
        <g className="hm-ghost hm-ghost-1"><Humanoid /></g>
        <g className="hm-ghost hm-ghost-2"><Humanoid /></g>

        {/* Main figure */}
        <g className="hm-main"><Humanoid /></g>
      </svg>

      <style>{`
        .hm-mascot { display: inline-block; position: relative; line-height: 0; cursor: pointer; }
        .hm-mascot svg { width: 100%; height: 100%; overflow: visible; }

        .hm-figure { transform-origin: 100px 110px; }
        .hm-head { transform-origin: 100px 40px; }
        .hm-torso { transform-origin: 100px 90px; }
        .hm-arm-left { transform-origin: 86px 76px; }
        .hm-arm-right { transform-origin: 114px 76px; }
        .hm-leg-left { transform-origin: 92px 116px; }
        .hm-leg-right { transform-origin: 107px 116px; }

        .hm-main { animation: hm-breathe 2.4s ease-in-out infinite; transform-origin: 100px 110px; }
        @keyframes hm-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .hm-spark { animation: hm-spark 1.4s ease-in-out infinite; transform-origin: 100px 14px; }
        @keyframes hm-spark {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }

        .hm-ghost { opacity: 0; }

        /* ===== HOVER: SPRING + GHOST TRAIL ===== */
        [data-active="true"] .hm-main {
          animation: spring-motion 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
        }
        [data-active="true"] .hm-arm-left {
          animation: arm-swing-l 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
        }
        [data-active="true"] .hm-arm-right {
          animation: arm-swing-r 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
        }
        [data-active="true"] .hm-leg-left {
          animation: leg-kick-l 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
        }
        [data-active="true"] .hm-leg-right {
          animation: leg-kick-r 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
        }
        [data-active="true"] .hm-head {
          animation: head-bob 0.9s ease-in-out infinite;
        }
        [data-active="true"] .hm-ghost-1 {
          animation: ghost-trail 0.9s ease-out infinite;
          animation-delay: 0.1s;
        }
        [data-active="true"] .hm-ghost-2 {
          animation: ghost-trail 0.9s ease-out infinite;
          animation-delay: 0.2s;
        }

        @keyframes spring-motion {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-22px) rotate(-8deg); }
        }
        @keyframes head-bob {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg) translateY(-2px); }
        }
        @keyframes arm-swing-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-45deg); }
        }
        @keyframes arm-swing-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(45deg); }
        }
        @keyframes leg-kick-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(20deg); }
        }
        @keyframes leg-kick-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-20deg); }
        }
        @keyframes ghost-trail {
          0% { opacity: 0; transform: translate(15px, 0); }
          40% { opacity: 0.35; }
          100% { opacity: 0; transform: translate(-15px, -22px); }
        }

        .hm-shadow { transform-origin: 100px 175px; animation: hm-shadow 0.9s ease-in-out infinite; }
        [data-active="false"] .hm-shadow { animation: none; opacity: 0.25; }
        @keyframes hm-shadow {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(0.65); opacity: 0.12; }
        }
      `}</style>
    </div>
  );
}

export default MoonwalkMascot;
