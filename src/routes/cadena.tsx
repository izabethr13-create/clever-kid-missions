import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, shuffle, speak } from "@/lib/game-store";

export const Route = createFileRoute("/cadena")({
  head: () => ({
    meta: [
      { title: "Cadena alimenticia — Isla de la Ciencia | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Juego para ordenar cadenas alimenticias: sol, plantas, animales que comen plantas y animales que cazan.",
      },
      { property: "og:title", content: "Cadena alimenticia" },
      {
        property: "og:description",
        content: "Ordena quién se come a quién y aprende cómo pasa la energía en la naturaleza.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CadenaPage,
});

type Chain = { label: string; steps: { emoji: string; name: string }[] };

const CHAINS: Chain[] = [
  {
    label: "En el jardín",
    steps: [
      { emoji: "☀️", name: "el sol" },
      { emoji: "🌿", name: "la hoja" },
      { emoji: "🐛", name: "la oruga" },
      { emoji: "🐦", name: "el pájaro" },
    ],
  },
  {
    label: "En el campo",
    steps: [
      { emoji: "☀️", name: "el sol" },
      { emoji: "🌾", name: "el trigo" },
      { emoji: "🐭", name: "el ratón" },
      { emoji: "🦉", name: "el búho" },
    ],
  },
  {
    label: "En el mar",
    steps: [
      { emoji: "☀️", name: "el sol" },
      { emoji: "🌱", name: "las algas" },
      { emoji: "🐟", name: "el pez" },
      { emoji: "🦈", name: "el tiburón" },
    ],
  },
  {
    label: "En la selva",
    steps: [
      { emoji: "☀️", name: "el sol" },
      { emoji: "🍃", name: "las plantas" },
      { emoji: "🐒", name: "el mono" },
      { emoji: "🐆", name: "el jaguar" },
    ],
  },
];

function CadenaPage() {
  const [idx, setIdx] = useState(0);
  const chain = CHAINS[idx % CHAINS.length]!;
  const [done, setDone] = useState<number>(0);
  const [options, setOptions] = useState(() => shuffle([...chain.steps]));
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function pick(name: string) {
    const expected = chain.steps[done]!;
    if (name === expected.name) {
      playSound("good");
      speak(expected.name);
      const next = done + 1;
      setDone(next);
      if (next === chain.steps.length) {
        setStatus("good");
        gameActions.award("cadena", 3);
        speak("¡Bien hecho! Así pasa la energía");
        setTimeout(() => {
          const n = idx + 1;
          setIdx(n);
          setDone(0);
          setOptions(shuffle([...CHAINS[n % CHAINS.length]!.steps]));
          setStatus("idle");
        }, 1600);
      }
    } else {
      setStatus("bad");
      playSound("bad");
      speak("Inténtalo de nuevo");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <StationShell title="Cadena alimenticia" emoji="🍃">
      <Prompt>{chain.label}: toca en orden quién da energía a quién</Prompt>

      <div className="card-soft flex flex-wrap items-center justify-center gap-2 px-4 py-8">
        {chain.steps.map((s, i) => (
          <span key={s.name} className="flex items-center gap-2">
            <span
              className={`grid h-20 w-20 place-items-center rounded-3xl text-5xl ${
                i < done ? "bg-grass/30 animate-pop-in" : "bg-muted"
              }`}
            >
              {i < done ? s.emoji : "❔"}
            </span>
            {i < chain.steps.length - 1 && <span className="text-2xl">➡️</span>}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        {options.map((o) => (
          <BigButton key={o.name} tone="card" className="w-full py-5" onClick={() => pick(o.name)}>
            <span className="mr-3 text-4xl">{o.emoji}</span>
            <span className="text-xl">{o.name}</span>
          </BigButton>
        ))}
      </div>

      <button
        type="button"
        onClick={() => speak(`Ordena la cadena: ${chain.steps.map((s) => s.name).join(", ")}`)}
        className="toy-press mx-auto mt-5 block rounded-3xl bg-grass px-6 py-3 font-display text-xl text-grass-foreground"
      >
        🔊 Escuchar
      </button>

      <Feedback status={status} />
    </StationShell>
  );
}
