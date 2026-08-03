import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, randomInt, shuffle, speak } from "@/lib/game-store";

export const Route = createFileRoute("/oraciones")({
  head: () => ({
    meta: [
      { title: "La Fábrica de Oraciones | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Ordena las palabras desordenadas para formar oraciones correctas y escúchalas en voz alta. Estructura de la oración para niños de 6 años.",
      },
      { property: "og:title", content: "La Fábrica de Oraciones" },
      {
        property: "og:description",
        content: "Arma la frase correcta con bloques de palabras y escúchala.",
      },
    ],
  }),
  component: OracionesPage,
});

const FRASES: { emoji: string; words: string[] }[] = [
  { emoji: "🐶", words: ["El", "perro", "corre", "en", "el", "parque"] },
  { emoji: "🍎", words: ["Ana", "come", "una", "manzana"] },
  { emoji: "☀️", words: ["El", "sol", "brilla", "en", "el", "cielo"] },
  { emoji: "📚", words: ["Mi", "hermana", "lee", "un", "libro"] },
  { emoji: "🐱", words: ["El", "gato", "duerme", "en", "la", "cama"] },
  { emoji: "🌧️", words: ["Hoy", "llueve", "mucho"] },
  { emoji: "🚌", words: ["Vamos", "a", "la", "escuela", "en", "bus"] },
  { emoji: "🎂", words: ["Mamá", "hace", "un", "pastel", "rico"] },
];

function OracionesPage() {
  const [frase, setFrase] = useState(() => FRASES[randomInt(0, FRASES.length - 1)]!);
  const [pool, setPool] = useState(() => shuffle(frase.words.map((w, i) => ({ w, i }))));
  const [built, setBuilt] = useState<{ w: string; i: number }[]>([]);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function nueva() {
    const next = FRASES[randomInt(0, FRASES.length - 1)]!;
    setFrase(next);
    setPool(shuffle(next.words.map((w, i) => ({ w, i }))));
    setBuilt([]);
  }

  function add(t: { w: string; i: number }) {
    if (status !== "idle") return;
    const next = [...built, t];
    setBuilt(next);
    setPool((p) => p.filter((x) => x.i !== t.i));
    speak(t.w);
    if (next.length === frase.words.length) {
      const ok = next.every((x, k) => x.w === frase.words[k]);
      if (ok) {
        setStatus("good");
        playSound("win");
        gameActions.award("oraciones", 3);
        setTimeout(() => speak(frase.words.join(" ")), 400);
        setTimeout(() => {
          setStatus("idle");
          nueva();
        }, 2600);
      } else {
        setStatus("bad");
        playSound("bad");
        setTimeout(() => {
          setStatus("idle");
          setBuilt([]);
          setPool(shuffle(frase.words.map((w, i) => ({ w, i }))));
        }, 1100);
      }
    }
  }

  return (
    <StationShell title="Fábrica de Oraciones" emoji="🏭">
      <Prompt>
        <span className="block text-6xl">{frase.emoji}</span>
        <span className="mt-2 block text-lg">Ordena las palabras para formar la oración</span>
      </Prompt>

      <div className="card-soft min-h-24 px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {built.length === 0 && (
            <span className="font-bold text-muted-foreground">Toca las palabras de abajo…</span>
          )}
          {built.map((t, k) => (
            <button
              key={`${t.i}-${k}`}
              type="button"
              onClick={() => {
                setBuilt((b) => b.filter((_, j) => j !== k));
                setPool((p) => [...p, t]);
              }}
              className="rounded-2xl bg-grass px-4 py-2 font-display text-xl text-grass-foreground toy-press"
            >
              {t.w}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {pool.map((t) => (
          <button
            key={t.i}
            type="button"
            onClick={() => add(t)}
            className="rounded-2xl bg-card px-4 py-3 font-display text-xl toy-press"
          >
            {t.w}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <BigButton tone="card" onClick={() => speak(frase.words.join(" "))}>
          🔊 Escuchar
        </BigButton>
        <BigButton tone="sun" onClick={nueva}>
          ➡️ Otra frase
        </BigButton>
      </div>

      <Feedback status={status} />
    </StationShell>
  );
}
