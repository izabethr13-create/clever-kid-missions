import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StationShell } from "@/components/game/StationShell";
import { Confetti } from "@/components/game/Confetti";
import { gameActions, playSound, speak } from "@/lib/game-store";

export const Route = createFileRoute("/jardin")({
  head: () => ({
    meta: [
      { title: "Huerto virtual — siembra, riega y cosecha | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Juego de huerto para niños: elige una semilla, siémbrala, riégala, dale sol y cosecha tomates, zanahorias, maíz y girasoles.",
      },
      { property: "og:title", content: "Huerto virtual" },
      { property: "og:description", content: "Siembra, riega, cuida el sol y cosecha tus plantas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JardinPage,
});

type Seed = { id: string; name: string; seed: string; fruit: string; dias: number };

const SEEDS: Seed[] = [
  { id: "tomate", name: "Tomate", seed: "🌰", fruit: "🍅", dias: 3 },
  { id: "zanahoria", name: "Zanahoria", seed: "🌰", fruit: "🥕", dias: 3 },
  { id: "maiz", name: "Maíz", seed: "🌰", fruit: "🌽", dias: 3 },
  { id: "girasol", name: "Girasol", seed: "🌰", fruit: "🌻", dias: 3 },
  { id: "fresa", name: "Fresa", seed: "🌰", fruit: "🍓", dias: 3 },
  { id: "sandia", name: "Sandía", seed: "🌰", fruit: "🍉", dias: 3 },
];

type Plot = {
  seed: Seed | null;
  agua: number;
  sol: number;
  listo: boolean;
};

const EMPTY: Plot = { seed: null, agua: 0, sol: 0, listo: false };

function plantEmoji(p: Plot) {
  if (!p.seed) return "🟫";
  if (p.listo) return p.seed.fruit;
  const cuidados = p.agua + p.sol;
  if (cuidados === 0) return "🌰";
  if (cuidados === 1) return "🌱";
  if (cuidados === 2) return "🌿";
  return "🪴";
}

function JardinPage() {
  const [plots, setPlots] = useState<Plot[]>(() => [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]);
  const [seed, setSeed] = useState<Seed>(SEEDS[0]!);
  const [tool, setTool] = useState<"semilla" | "agua" | "sol" | "cosecha">("semilla");
  const [cosecha, setCosecha] = useState<string[]>([]);
  const [party, setParty] = useState(false);

  const update = (i: number, fn: (p: Plot) => Plot) =>
    setPlots((prev) => prev.map((p, j) => (i === j ? fn(p) : p)));

  const tocar = (i: number) => {
    const p = plots[i]!;
    if (tool === "semilla") {
      if (p.seed) {
        speak("Aquí ya hay una planta");
        return;
      }
      update(i, () => ({ seed, agua: 0, sol: 0, listo: false }));
      playSound("good");
      speak(`Sembraste ${seed.name}. Ahora riégala.`);
      return;
    }
    if (!p.seed) {
      speak("Primero siembra una semilla");
      return;
    }
    if (tool === "agua") {
      if (p.agua >= 2) {
        speak("Ya tiene suficiente agua");
        return;
      }
      const next = { ...p, agua: p.agua + 1 };
      next.listo = next.agua >= 2 && next.sol >= 2;
      update(i, () => next);
      playSound("good");
      speak("¡Agua! La planta crece");
      return;
    }
    if (tool === "sol") {
      if (p.sol >= 2) {
        speak("Ya tiene suficiente sol");
        return;
      }
      const next = { ...p, sol: p.sol + 1 };
      next.listo = next.agua >= 2 && next.sol >= 2;
      update(i, () => next);
      playSound("good");
      speak("¡Sol! La planta crece");
      return;
    }
    if (tool === "cosecha") {
      if (!p.listo) {
        speak("Todavía no está lista. Dale agua y sol.");
        return;
      }
      setCosecha((c) => [...c, p.seed!.fruit]);
      update(i, () => EMPTY);
      gameActions.award("jardin", 1);
      playSound("win");
      speak(`¡Cosechaste ${p.seed!.name}! Bien hecho`);
      setParty(true);
      setTimeout(() => setParty(false), 1800);
    }
  };

  const tools: { id: typeof tool; label: string; emoji: string; color: string }[] = [
    { id: "semilla", label: "Sembrar", emoji: "🌰", color: "bg-sun text-sun-foreground" },
    { id: "agua", label: "Regar", emoji: "💧", color: "bg-sky text-sky-foreground" },
    { id: "sol", label: "Sol", emoji: "☀️", color: "bg-sun text-sun-foreground" },
    { id: "cosecha", label: "Cosechar", emoji: "🧺", color: "bg-grass text-grass-foreground" },
  ];

  return (
    <StationShell title="Huerto virtual" emoji="🌻">
      {party && <Confetti />}

      <div className="card-soft px-5 py-4 text-center font-display text-2xl leading-relaxed">
        1) Elige una semilla · 2) Siémbrala · 3) Riégala 2 veces y dale sol 2 veces · 4) ¡Cosecha!
      </div>

      <h2 className="mt-6 font-display text-2xl">Semillas</h2>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {SEEDS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSeed(s);
              setTool("semilla");
              speak(`Semilla de ${s.name}`);
            }}
            className={`toy-press rounded-3xl px-3 py-4 font-display text-lg ${
              seed.id === s.id
                ? "bg-primary text-primary-foreground ring-4 ring-ring"
                : "bg-card text-card-foreground"
            }`}
          >
            <span className="block text-4xl">{s.fruit}</span>
            {s.name}
          </button>
        ))}
      </div>

      <h2 className="mt-6 font-display text-2xl">Herramientas</h2>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {tools.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTool(t.id)}
            className={`toy-press rounded-3xl px-2 py-4 font-display text-base ${
              tool === t.id ? `${t.color} ring-4 ring-ring` : "bg-card text-card-foreground"
            }`}
          >
            <span className="block text-3xl">{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      <h2 className="mt-6 font-display text-2xl">Mi huerto</h2>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {plots.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => tocar(i)}
            aria-label={`Parcela ${i + 1}`}
            className="toy-press grid aspect-square place-items-center rounded-3xl bg-[color-mix(in_oklab,var(--grass)_25%,var(--card))]"
          >
            <span className="text-6xl">{plantEmoji(p)}</span>
            {p.seed && !p.listo && (
              <span className="text-xl">
                {"💧".repeat(p.agua)}
                {"☀️".repeat(p.sol)}
              </span>
            )}
            {p.listo && <span className="font-display text-base">¡Lista!</span>}
          </button>
        ))}
      </div>

      <div className="card-soft mt-6 px-5 py-4">
        <p className="font-display text-2xl">🧺 Mi canasta</p>
        <p className="mt-2 min-h-12 text-4xl">{cosecha.join(" ") || "Vacía todavía"}</p>
      </div>
    </StationShell>
  );
}
