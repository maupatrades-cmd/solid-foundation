import { useEffect, useState, type CSSProperties } from "react";

const NAVY = "#0a1f4d";
const NAVY_DEEP = "#061638";
const RED = "#e63946";
const RED_SOFT = "#ff5a6a";
const SCREEN = "#f4f6fb";
const INK = "#0b0f1a";
const WHITE = "#ffffff";

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
  const [phase, setPhase] = useState<
    "idle" | "mj-kick" | "mj-moonwalk" | "mj-side-glide" | "mj-lean" | "mj-point"
  >("idle");

  useEffect(() => {
    const seq = [
      { p: "idle" as const, ms: 1000 },
      { p: "mj-kick" as const, ms: 1000 },
      { p: "mj-moonwalk" as const, ms: 2400 },
      { p: "mj-side-glide" as const, ms: 2000 },
      { p: "mj-lean" as const, ms: 2000 },
      { p: "mj-point" as const, ms: 1500 },
    ];
    let i = 0;
    let t: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      setPhase(seq[i].p);
      t = setTimeout(() => {
        i = (i + 1) % seq.length;
        tick();
      }, seq[i].ms);
    };
    tick();
    return () => {
      if (t) clearTimeout(t);
    };
  }, []);

  return (
    <div
      className={`mio-mascot ${className}`}
      style={{ width: size, height: size, ...style }}
      data-phase={phase}
      role="img"
      aria-label="Marketing iO mascot dancing"
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

        {/* Shadow */}
        <ellipse className="mio-shadow" cx="120" cy="300" rx="52" ry="7" fill="rgba(6,22,56,0.28)" />

        {/* ===== FULL CHARACTER GROUP ===== */}
        <g className="mio-character">
          {/* ----- LEGS ----- */}
          {/* Left Leg */}
          <g className="mio-leg-left">
            <rect x="86" y="210" width="22" height="70" rx="10" fill={NAVY} />
            <rect x="86" y="268" width="22" height="14" rx="6" fill={RED} />
            {/* MJ Loafer shine */}
            <ellipse cx="97" cy="272" rx="6" ry="3" fill="rgba(255,255,255,0.25)" />
          </g>
          {/* Right Leg */}
          <g className="mio-leg-right">
            <rect x="132" y="210" width="22" height="70" rx="10" fill={NAVY} />
            <rect x="132" y="268" width="22" height="14" rx="6" fill={RED} />
            <ellipse cx="143" cy="272" rx="6" ry="3" fill="rgba(255,255,255,0.25)" />
          </g>

          {/* ----- TORSO (Body) ----- */}
          <g className="mio-torso">
            <rect x="82" y="148" width="76" height="72" rx="20" fill="url(#mj-jacket)" stroke={NAVY_DEEP} strokeWidth="1.5" />
            {/* MJ-style V-neck / jacket accent */}
            <path d="M120 148 L120 220" stroke={NAVY_DEEP} strokeWidth="1.5" opacity="0.4" />
            <path d="M120 148 L104 180 L120 168 L136 180 Z" fill={RED} opacity="0.9" />
            {/* Red belt */}
            <rect x="82" y="204" width="76" height="8" rx="3" fill={RED} />
            {/* Silver buckle */}
            <rect x="114" y="204" width="12" height="8" rx="2" fill="#c0c0c0" />
          </g>

          {/* ----- ARMS ----- */}
          {/* Left Arm */}
          <g className="mio-arm-left">
            <rect x="52" y="160" width="18" height="52" rx="9" fill={NAVY} />
            {/* MJ White Glove Left */}
            <g transform="translate(48, 206)">
              <rect x="0" y="0" width="26" height="20" rx="8" fill={WHITE} stroke="#e0e0e0" strokeWidth="0.5" />
              <circle cx="6" cy="14" r="3" fill={WHITE} />
              <circle cx="13" cy="16" r="3" fill={WHITE} />
              <circle cx="20" cy="14" r="3" fill={WHITE} />
              {/* Twitter badge on glove */}
              <rect x="3" y="3" width="20" height="14" rx="3" fill="#1da1f2" />
              <path
                d="M6 12 q3 1 5 -1 q-2 0 -3 -2 q1 0 1.5 0 q-2 -1 -2 -3 q0.8 0.8 1.5 0.8 q-1.5 -1 -1 -4 q2 3 6 3.5 q-0.5 -3 2.5 -3.5 q2 0 3 1.5 q0.8 0 2 -0.5 q-0.5 1.5 -1.5 2 q1.5 0 2 -0.5 q-0.5 1.5 -2 2 q0 4 -3.5 6.5 q-3.5 2.5 -10 -2"
                fill="#fff"
                transform="scale(0.65) translate(2 1)"
              />
            </g>
          </g>

          {/* Right Arm */}
          <g className="mio-arm-right">
            <rect x="170" y="160" width="18" height="52" rx="9" fill={NAVY} />
            {/* MJ White Glove Right */}
            <g transform="translate(166, 206)">
              <rect x="0" y="0" width="26" height="20" rx="8" fill={WHITE} stroke="#e0e0e0" strokeWidth="0.5" />
              <circle cx="6" cy="14" r="3" fill={WHITE} />
              <circle cx="13" cy="16" r="3" fill={WHITE} />
              <circle cx="20" cy="14" r="3" fill={WHITE} />
              {/* Facebook badge on glove */}
              <rect x="3" y="3" width="20" height="14" rx="3" fill="#1877f2" />
              <path
                d="M12 14 v-4 h1.2 l0.3 -1.8 H12 V6.8 c0 -0.6 0.15 -1 1 -1 H13.8 V4.2 c-0.25 0 -0.9 -0.05 -1.6 -0.05 c-1.6 0 -2.7 1 -2.7 2.7 v1.2 H8.5 v1.8 h1.7 V14 z"
                fill="#fff"
                transform="scale(0.85) translate(1.5 1)"
              />
            </g>
          </g>

          {/* ----- HEAD GROUP ----- */}
          <g className="mio-head-group">
            {/* Glow */}
            <circle cx="120" cy="90" r="88" fill="url(#mj-glow)" opacity="0.6" />
            {/* Head sphere */}
            <circle cx="120" cy="90" r="78" fill="url(#mj-head)" stroke={NAVY_DEEP} strokeWidth="1.5" />

            {/* Circuit lines */}
            <g stroke={RED} strokeWidth="1" fill="none" opacity="0.95">
              <circle cx="120" cy="90" r="70" strokeDasharray="3 5" />
              <circle cx="120" cy="90" r="62" strokeDasharray="2 7" opacity="0.6" />
              <path d="M120 20 L120 28 L128 28" />
              <path d="M120 160 L120 152 L112 152" />
              <path d="M50 90 L58 90 L58 82" />
              <path d="M190 90 L182 90 L182 98" />
              <path d="M70 40 L78 48 L86 48" />
              <path d="M170 40 L162 48 L154 48" />
              <path d="M70 140 L78 132 L86 132" />
              <path d="M170 140 L162 132 L154 132" />
            </g>

            {/* Red data dots */}
            <g fill={RED}>
              {[
                [120, 20], [128, 28], [112, 152], [58, 82], [182, 98],
                [86, 48], [154, 48], [86, 132], [154, 132],
                [78, 70], [162, 70], [78, 110], [162, 110],
                [104, 24], [136, 24], [104, 156], [136, 156],
                [62, 58], [178, 58], [62, 122], [178, 122],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.6} />
              ))}
            </g>

            {/* Pulse dots */}
            <g className="mio-pulse-dots" fill={RED_SOFT}>
              <circle cx="92" cy="36" r="2" />
              <circle cx="148" cy="38" r="2" />
              <circle cx="60" cy="100" r="2" />
              <circle cx="180" cy="80" r="2" />
              <circle cx="100" cy="150" r="2" />
              <circle cx="146" cy="148" r="2" />
            </g>

            {/* Screen face */}
            <g>
              <circle cx="120" cy="92" r="38" fill="url(#mj-screen)" stroke={NAVY_DEEP} strokeWidth="2" />
              <circle cx="120" cy="92" r="34" fill="none" stroke="rgba(10,31,77,0.12)" strokeWidth="1" />
            </g>

            {/* Face features */}
            <g className="mio-face">
              <g className="mio-eyes" fill={INK}>
                <circle cx="108" cy="90" r="5.2" />
                <circle cx="132" cy="90" r="5.2" />
                <circle cx="109.6" cy="88.4" r="1.4" fill="#ffffff" />
                <circle cx="133.6" cy="88.4" r="1.4" fill="#ffffff" />
              </g>
              <path
                d="M108 104 Q120 112 132 104"
                stroke={INK}
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Antenna */}
            <g className="mio-antenna">
              <line x1="120" y1="12" x2="120" y2="0" stroke={NAVY_DEEP} strokeWidth="2" />
              <circle cx="120" cy="-4" r="4" fill={RED} />
              <circle cx="120" cy="-4" r="7" fill={RED} opacity="0.25" className="mio-antenna-glow" />
            </g>
          </g>
        </g>
      </svg>

      <style>{`
        .mio-mascot { display: inline-block; position: relative; line-height: 0; }
        .mio-mascot svg { width: 100%; height: 100%; overflow: visible; }

        /* Gentle idle bob on the whole character */
        .mio-character {
          transform-origin: 120px 180px;
          animation: mio-bob 2.8s ease-in-out infinite;
        }
        @keyframes mio-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-4px); }
        }

        .mio-shadow {
          transform-origin: 120px 300px;
          animation: mio-shadow 2.8s ease-in-out infinite;
        }
        @keyframes mio-shadow {
          0%, 100% { transform: scale(1); opacity: 0.28; }
          50%      { transform: scale(0.86); opacity: 0.18; }
        }

        .mio-head-group {
          transform-origin: 120px 90px;
        }

        .mio-eyes {
          transform-origin: 120px 90px;
          animation: mio-blink 4.2s ease-in-out infinite;
        }
        @keyframes mio-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95%           { transform: scaleY(0.1); }
        }

        .mio-antenna-glow {
          transform-origin: 120px -4px;
          animation: mio-antenna 1.6s ease-in-out infinite;
        }
        @keyframes mio-antenna {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50%      { transform: scale(1.6); opacity: 0.05; }
        }

        .mio-pulse-dots circle { animation: mio-flicker 2.4s ease-in-out infinite; }
        .mio-pulse-dots circle:nth-child(2) { animation-delay: 0.3s; }
        .mio-pulse-dots circle:nth-child(3) { animation-delay: 0.6s; }
        .mio-pulse-dots circle:nth-child(4) { animation-delay: 0.9s; }
        .mio-pulse-dots circle:nth-child(5) { animation-delay: 1.2s; }
        .mio-pulse-dots circle:nth-child(6) { animation-delay: 1.5s; }
        @keyframes mio-flicker {
          0%, 100% { opacity: 0.2; }
          50%      { opacity: 1; }
        }

        /* Limb origins for transforms */
        .mio-leg-left  { transform-origin: 97px 210px; }
        .mio-leg-right { transform-origin: 143px 210px; }
        .mio-arm-left  { transform-origin: 61px 160px; }
        .mio-arm-right { transform-origin: 179px 160px; }
        .mio-torso     { transform-origin: 120px 180px; }

        /* ============ MICHAEL JACKSON CHOREOGRAPHY ============ */

        /* 1. KICK */
        [data-phase="mj-kick"] .mio-leg-right {
          animation: mj-kick-leg 0.8s ease-out;
        }
        [data-phase="mj-kick"] .mio-character {
          animation: mj-kick-body 0.8s ease-out;
        }
        [data-phase="mj-kick"] .mio-arm-left {
          animation: mj-kick-arm 0.8s ease-out;
        }
        @keyframes mj-kick-leg {
          0%, 100% { transform: rotate(0deg); }
          40%, 60% { transform: rotate(-55deg) scale(1.05); }
        }
        @keyframes mj-kick-body {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-4deg); }
        }
        @keyframes mj-kick-arm {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(25deg); }
        }

        /* 2. MOONWALK */
        [data-phase="mj-moonwalk"] .mio-character {
          animation: mj-slide-back 2.4s linear;
        }
        [data-phase="mj-moonwalk"] .mio-leg-left {
          animation: mj-moonwalk-cycle-1 0.6s linear infinite;
        }
        [data-phase="mj-moonwalk"] .mio-leg-right {
          animation: mj-moonwalk-cycle-2 0.6s linear infinite;
        }
        [data-phase="mj-moonwalk"] .mio-arm-left {
          animation: mj-moonwalk-arm-1 0.6s linear infinite;
        }
        [data-phase="mj-moonwalk"] .mio-arm-right {
          animation: mj-moonwalk-arm-2 0.6s linear infinite;
        }
        @keyframes mj-slide-back {
          0% { transform: translateX(30px); }
          100% { transform: translateX(-40px); }
        }
        @keyframes mj-moonwalk-cycle-1 {
          0%, 100% { transform: rotate(18deg) translateY(-3px); }
          50% { transform: rotate(-18deg) translateY(0); }
        }
        @keyframes mj-moonwalk-cycle-2 {
          0%, 100% { transform: rotate(-18deg) translateY(0); }
          50% { transform: rotate(18deg) translateY(-3px); }
        }
        @keyframes mj-moonwalk-arm-1 {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes mj-moonwalk-arm-2 {
          0%, 100% { transform: rotate(10deg); }
          50% { transform: rotate(-10deg); }
        }

        /* 3. SIDE-GLIDE (smooth sideways slide with side-stepping legs) */
        [data-phase="mj-side-glide"] .mio-character {
          animation: mj-side-dance 2s ease-in-out;
        }
        [data-phase="mj-side-glide"] .mio-leg-left,
        [data-phase="mj-side-glide"] .mio-leg-right {
          animation: mj-side-step 0.5s ease-in-out infinite alternate;
        }
        [data-phase="mj-side-glide"] .mio-arm-left {
          animation: mj-side-arm 0.5s ease-in-out infinite alternate;
        }
        [data-phase="mj-side-glide"] .mio-arm-right {
          animation: mj-side-arm-r 0.5s ease-in-out infinite alternate;
        }
        @keyframes mj-side-dance {
          0%   { transform: translateX(-25px); }
          50%  { transform: translateX(30px); }
          100% { transform: translateX(0); }
        }
        @keyframes mj-side-step {
          0%   { transform: rotate(-12deg); }
          100% { transform: rotate(12deg); }
        }
        @keyframes mj-side-arm {
          0%   { transform: rotate(-18deg); }
          100% { transform: rotate(18deg); }
        }
        @keyframes mj-side-arm-r {
          0%   { transform: rotate(18deg); }
          100% { transform: rotate(-18deg); }
        }

        /* 4. ANTI-GRAVITY LEAN (the iconic stiff forward tilt) */
        [data-phase="mj-lean"] .mio-character {
          animation: mj-anti-gravity 2s ease-in-out;
          transform-origin: 120px 282px;
        }
        [data-phase="mj-lean"] .mio-leg-left,
        [data-phase="mj-lean"] .mio-leg-right {
          animation: mj-lean-feet 2s ease-in-out;
        }
        @keyframes mj-anti-gravity {
          0%, 100% { transform: rotate(0deg); }
          35%, 65% { transform: rotate(38deg); }
        }
        @keyframes mj-lean-feet {
          0%, 100% { transform: rotate(0deg); }
          35%, 65% { transform: rotate(-12deg); }
        }

        /* 4. POINT (iconic MJ pose) */
        [data-phase="mj-point"] .mio-arm-right {
          animation: mj-point-up 1.5s ease;
        }
        [data-phase="mj-point"] .mio-character {
          animation: mj-point-body 1.5s ease;
        }
        [data-phase="mj-point"] .mio-leg-right {
          animation: mj-toe-stand 1.5s ease;
        }
        [data-phase="mj-point"] .mio-head-group {
          animation: mj-point-head 1.5s ease;
        }
        @keyframes mj-point-up {
          0%, 100% { transform: rotate(0deg); }
          15%, 85% { transform: rotate(-130deg) translateY(-10px); }
        }
        @keyframes mj-point-body {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          15%, 85% { transform: translateY(-8px) rotate(8deg); }
        }
        @keyframes mj-toe-stand {
          0%, 100% { transform: rotate(0deg); }
          15%, 85% { transform: rotate(-30deg) translateY(-6px); }
        }
        @keyframes mj-point-head {
          0%, 100% { transform: rotate(0deg); }
          15%, 85% { transform: rotate(12deg) translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

export default MoonwalkMascot;
