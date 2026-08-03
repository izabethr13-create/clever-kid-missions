import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { TracePad } from "@/components/game/TracePad";
import { gameActions, playSound, speak } from "@/lib/game-store";

export const Route = createFileRoute("/trazos")({
  head: () => ({
    meta: [
      { title: "El Caminito Mágico — Aprestamiento y trazos | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Motricidad fina para niños: sigue con el dedo trazos rectos, curvos, en zigzag y en espiral sin salirte del camino.",
      },
      { property: "og:title", content: "El Caminito Mágico" },
      {
        property: "og:description",
        content: "Trazos rectos, curvos, zigzag y espirales para practicar la escritura.",
      },
    ],
  }),
  component: TrazosPage,
});

const TRAZOS: { label: string; emoji: string; paths: string[] }[] = [
  { label: "Línea recta", emoji: "➖", paths: ["M 40 150 L 260 150"] },
  { label: "Línea de montañas", emoji: "⛰️", paths: ["M 40 200 L 100 90 L 160 200 L 220 90 L 262 170"] },
  { label: "Olas del mar", emoji: "🌊", paths: ["M 40 150 C 80 60, 120 240, 160 150 S 240 60, 262 150"] },
  { label: "Bucles", emoji: "➰", paths: ["M 40 180 c 20 -90 60 -90 80 0 c 20 -90 60 -90 80 0 c 15 -70 45 -70 62 -20"] },
  { label: "Espiral", emoji: "🌀", paths: ["M 150 150 m 0 0 c 0 -18 26 -18 26 0 c 0 34 -52 34 -52 0 c 0 -52 78 -52 78 0 c 0 70 -104 70 -104 0 c 0 -88 130 -88 130 0"] },
  { label: "Círculo", emoji: "⭕", paths: ["M 150 40 a 110 110 0 1 1 -1 0"] },
];

function TrazosPage() {
  const [i, setI] = useState(0);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const [key, setKey] = useState(0);
  const t = TRAZOS[i]!;

  function complete() {
    setStatus("good");
    playSound("good");
    speak("¡Muy bien!");
    gameActions.award("trazos", 2);
    setTimeout(() => {
      setStatus("idle");
      setI((n) => (n + 1) % TRAZOS.length);
      setKey((k) => k + 1);
    }, 1200);
  }

  return (
    <StationShell title="El Caminito Mágico" emoji="✏️">
      <Prompt>
        <span className="mr-2">{t.emoji}</span> Sigue el camino: {t.label}
      </Prompt>
      <TracePad key={`${i}-${key}`} paths={t.paths} onComplete={complete} />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <BigButton tone="card" onClick={() => setKey((k) => k + 1)}>
          🔁 Borrar
        </BigButton>
        <BigButton
          tone="sun"
          onClick={() => {
            setI((n) => (n + 1) % TRAZOS.length);
            setKey((k) => k + 1);
          }}
        >
          ➡️ Otro trazo
        </BigButton>
      </div>
      <Feedback status={status} />
    </StationShell>
  );
}
