import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, randomInt, shuffle } from "@/lib/game-store";

export const Route = createFileRoute("/energia")({
  head: () => ({
    meta: [
      { title: "Valle de la Energía y la Naturaleza | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Clasifica naturaleza animada e inanimada, resuelve retos de reciclaje y ahorro de agua, y descubre la energía de calor, luz y sonido.",
      },
      { property: "og:title", content: "El Valle de la Energía y Naturaleza" },
      {
        property: "og:description",
        content: "Seres vivos, cuidado del medio ambiente y tipos de energía para niños.",
      },
    ],
  }),
  component: EnergiaPage,
});

type Mode = "menu" | "naturaleza" | "ambiente" | "energia";

const VIVOS = ["🐶", "🌳", "🐦", "🐠", "🦋", "🌻", "🧒", "🐢"];
const NO_VIVOS = ["🪨", "🚗", "🪑", "☂️", "🔑", "📚", "🥄", "🧱"];

const RETOS: { q: string; options: string[]; correct: number }[] = [
  {
    q: "Terminaste de lavarte los dientes. ¿Qué haces con el agua?",
    options: ["Cerrar la llave 🚰", "Dejarla abierta 💦"],
    correct: 0,
  },
  {
    q: "Tienes una botella de plástico vacía. ¿Dónde va?",
    options: ["Al suelo 🗑️", "Al contenedor de reciclaje ♻️"],
    correct: 1,
  },
  {
    q: "Sales del cuarto de día. ¿Qué haces con la luz?",
    options: ["Apagarla 💡", "Dejarla encendida 🔆"],
    correct: 0,
  },
  {
    q: "Vas de paseo al parque y comes fruta. ¿Dónde tiras la cáscara?",
    options: ["En el basurero 🗑️", "En el pasto 🌿"],
    correct: 0,
  },
  {
    q: "¿Qué ayuda más al planeta?",
    options: ["Sembrar un árbol 🌳", "Cortar un árbol 🪓"],
    correct: 0,
  },
];

const ENERGIA: { emoji: string; tipo: "calor" | "luz" | "sonido" }[] = [
  { emoji: "🔥", tipo: "calor" },
  { emoji: "☀️", tipo: "luz" },
  { emoji: "🥁", tipo: "sonido" },
  { emoji: "💡", tipo: "luz" },
  { emoji: "🕯️", tipo: "luz" },
  { emoji: "📻", tipo: "sonido" },
  { emoji: "🎺", tipo: "sonido" },
  { emoji: "♨️", tipo: "calor" },
  { emoji: "🔦", tipo: "luz" },
  { emoji: "🧯", tipo: "calor" },
];

function EnergiaPage() {
  const [mode, setMode] = useState<Mode>("menu");
  const games: { id: Mode; emoji: string; title: string }[] = [
    { id: "naturaleza", emoji: "🌿", title: "Naturaleza animada e inanimada" },
    { id: "ambiente", emoji: "♻️", title: "Cuido el medio ambiente" },
    { id: "energia", emoji: "⚡", title: "Calor, luz y sonido" },
  ];

  return (
    <StationShell title="Valle de la Energía" emoji="💡">
      {mode === "menu" ? (
        <ul className="space-y-3">
          {games.map((g) => (
            <li key={g.id}>
              <BigButton tone="card" className="w-full text-left" onClick={() => setMode(g.id)}>
                <span className="mr-3">{g.emoji}</span>
                {g.title}
              </BigButton>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <button
            onClick={() => setMode("menu")}
            className="mb-4 rounded-2xl bg-secondary px-4 py-2 font-display text-lg text-secondary-foreground toy-press"
          >
            ← Otros juegos
          </button>
          {mode === "naturaleza" && <Naturaleza />}
          {mode === "ambiente" && <Ambiente />}
          {mode === "energia" && <Energias />}
        </div>
      )}
    </StationShell>
  );
}

function useSimpleRound<T>(make: () => T, stars: number) {
  const [item, setItem] = useState<T>(make);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  function resolve(ok: boolean) {
    if (ok) {
      setStatus("good");
      playSound("good");
      gameActions.award("energia", stars);
      setTimeout(() => {
        setStatus("idle");
        setItem(make());
      }, 1100);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }
  return { item, status, resolve };
}

function Naturaleza() {
  const { item, status, resolve } = useSimpleRound(() => {
    const vivo = Math.random() < 0.5;
    const list = vivo ? VIVOS : NO_VIVOS;
    return { emoji: list[randomInt(0, list.length - 1)]!, vivo };
  }, 2);

  return (
    <div>
      <Prompt>¿A qué contenedor pertenece?</Prompt>
      <div className="card-soft grid place-items-center px-4 py-12">
        <span className="animate-float-soft text-8xl">{item.emoji}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <BigButton tone="grass" onClick={() => resolve(item.vivo)}>
          🌿 Animada
          <span className="block text-base opacity-80">tiene vida</span>
        </BigButton>
        <BigButton tone="primary" onClick={() => resolve(!item.vivo)}>
          🪨 Inanimada
          <span className="block text-base opacity-80">sin vida</span>
        </BigButton>
      </div>
      <Feedback status={status} />
    </div>
  );
}

function Ambiente() {
  const { item, status, resolve } = useSimpleRound(() => {
    const reto = RETOS[randomInt(0, RETOS.length - 1)]!;
    const good = reto.options[reto.correct]!;
    return { q: reto.q, good, options: shuffle([...reto.options]) };
  }, 3);

  return (
    <div>
      <Prompt>{item.q}</Prompt>
      <div className="grid gap-3">
        {item.options.map((o) => (
          <BigButton key={o} tone="grass" onClick={() => resolve(o === item.good)}>
            {o}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </div>
  );
}

function Energias() {
  const { item, status, resolve } = useSimpleRound(
    () => ENERGIA[randomInt(0, ENERGIA.length - 1)]!,
    2,
  );

  return (
    <div>
      <Prompt>¿Qué energía produce?</Prompt>
      <div className="card-soft grid place-items-center px-4 py-12">
        <span className="animate-pop-in text-8xl">{item.emoji}</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <BigButton tone="berry" onClick={() => resolve(item.tipo === "calor")}>
          🔥 Calor
        </BigButton>
        <BigButton tone="sun" onClick={() => resolve(item.tipo === "luz")}>
          💡 Luz
        </BigButton>
        <BigButton tone="primary" onClick={() => resolve(item.tipo === "sonido")}>
          🔊 Sonido
        </BigButton>
      </div>
      <Feedback status={status} />
    </div>
  );
}
