import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MoonwalkMascot } from "@/components/brand/MoonwalkMascot";

export const Route = createFileRoute("/mascot-preview")({
  component: MascotPreviewPage,
  head: () => ({
    meta: [
      { title: "Moonwalk Mascot Preview" },
      { name: "description", content: "Standalone preview of the moonwalk dancing mascot." },
    ],
  }),
});

function MascotPreviewPage() {
  const [size, setSize] = useState(320);
  const [bg, setBg] = useState("#0a0a14");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: bg,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: 32,
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
        🕺 Moonwalk Mascot
      </h1>
      <p style={{ opacity: 0.7, marginTop: -16, fontSize: 14 }}>
        idle → kick → moonwalk → spin → point · loops forever
      </p>

      <div
        style={{
          padding: 48,
          borderRadius: 24,
          background: "linear-gradient(160deg,#10162c,#05080f)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <MoonwalkMascot size={size} />
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
          Size
          <input
            type="range"
            min={160}
            max={520}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
          <span style={{ width: 40 }}>{size}px</span>
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
          Background
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
        </label>
      </div>
    </main>
  );
}
