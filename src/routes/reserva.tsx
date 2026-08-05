import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, randomInt, shuffle } from "@/lib/game-store";

export const Route = createFileRoute("/reserva")({
  head: () => ({
    meta: [
      { title: "La Reserva Salvaje — Animales y hábitats | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Arma cadenas alimenticias, coloca a cada animal salvaje en su hábitat y aprende sobre especies en peligro y los derechos de los animales.",
      },
      { property: "og:title", content: "La Reserva Salvaje" },
      {
        property: "og:description",
        content: "Cadenas alimenticias, hábitats y misiones de cuidado animal.",
      },
    ],
  }),
  component: ReservaPage,
});

type Mode = "menu" | "cadena" | "habitat" | "cuidado";

const CADENAS: [string, string, string][] = [
  ["🌿", "🐇", "🦊"],
  ["🌾", "🐁", "🦉"],
  ["🌱", "🦌", "🐺"],
  ["🍃", "🐛", "🐦"],
  ["🌊", "🐟", "🦈"],
];

const HABITATS: { emoji: string; habitat: "selva" | "oceano" | "desierto" }[] = [
  { emoji: "🦁", habitat: "selva" },
  { emoji: "🐒", habitat: "selva" },
  { emoji: "🦜", habitat: "selva" },
  { emoji: "🐆", habitat: "selva" },
  { emoji: "🐬", habitat: "oceano" },
  { emoji: "🐙", habitat: "oceano" },
  { emoji: "🐳", habitat: "oceano" },
  { emoji: "🦈", habitat: "oceano" },
  { emoji: "🐪", habitat: "desierto" },
  { emoji: "🦂", habitat: "desierto" },
  { emoji: "🦎", habitat: "desierto" },
  { emoji: "🐍", habitat: "desierto" },
];

const CUIDADO: { q: string; options: string[]; correct: number }[] = [
  {
    q: "🐢 La tortuga marina está en peligro de extinción. ¿Cómo la ayudamos?",
    options: ["No tirar plástico al mar 🌊", "Llevarla a casa 🏠"],
    correct: 0,
  },
  {
    q: "🐼 Ves un panda en la reserva. ¿Qué haces?",
    options: ["Observarlo en silencio 🤫", "Gritarle y darle dulces 🍬"],
    correct: 0,
  },
  {
    q: "🐶 Todos los animales tienen derecho a...",
    options: ["Agua, comida y cariño ❤️", "Estar solos y con hambre 😢"],
    correct: 0,
  },
  {
    q: "🦜 Un guacamayo vive en la selva. ¿Está bien tenerlo en una jaula pequeña?",
    options: ["No, debe volar libre 🕊️", "Sí, es más bonito 🪤"],
    correct: 0,
  },
  {
    q: "🐘 ¿Qué protege a los elefantes en peligro?",
    options: ["Las reservas naturales 🏞️", "La caza 🚫"],
    correct: 0,
  },
];

function ReservaPage() {
  const [mode, setMode] = useState<Mode>("menu");
  const games: { id: Mode; emoji: string; title: string }[] = [
    { id: "cadena", emoji: "🔗", title: "Cadena alimenticia" },
    { id: "habitat", emoji: "🏞️", title: "¿Dónde vivo?" },
    { id: "cuidado", emoji: "❤️", title: "Cuido a los animales" },
  ];

  return (
    <StationShell title="La Reserva Salvaje" emoji="🦁">
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
          {mode === "cadena" && <Cadena />}
          {mode === "habitat" && <Habitat />}
          {mode === "cuidado" && <Cuidado />}
        </div>
      )}
    </StationShell>
  );
}

function useRound<T>(make: () => T, stars: number) {
  const [item, setItem] = useState<T>(make);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  function resolve(ok: boolean) {
    if (ok) {
      setStatus("good");
      playSound("good");
      gameActions.award("reserva", stars);
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

function Cadena() {
  const { item, status, resolve } = useRound(() => {
    const chain = CADENAS[randomInt(0, CADENAS.length - 1)]!;
    const hole = randomInt(0, 2);
    const others = shuffle(CADENAS.flat().filter((e) => !chain.includes(e))).slice(0, 2);
    return { chain, hole, correct: chain[hole]!, options: shuffle([chain[hole]!, ...others]) };
  }, 3);

  const labels = ["Planta", "Herbívoro", "Carnívoro"];

  return (
    <div>
      <Prompt>Completa la cadena alimenticia</Prompt>
      <div className="card-soft flex items-center justify-center gap-2 px-3 py-8">
        {item.chain.map((e, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="grid place-items-center">
              <span
                className={`grid h-20 w-20 place-items-center rounded-3xl text-4xl ${
                  i === item.hole ? "border-4 border-dashed border-primary bg-muted" : "bg-secondary"
                }`}
              >
                {i === item.hole ? "?" : e}
              </span>
              <span className="mt-1 text-xs font-bold text-muted-foreground">{labels[i]}</span>
            </div>
            {i < 2 && <span className="text-2xl text-muted-foreground">→</span>}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {item.options.map((o) => (
          <BigButton key={o} tone="grass" onClick={() => resolve(o === item.correct)}>
            {o}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </div>
  );
}

function Habitat() {
  const { item, status, resolve } = useRound(
    () => HABITATS[randomInt(0, HABITATS.length - 1)]!,
    2,
  );

  return (
    <div>
      <Prompt>¿Dónde vive este animal?</Prompt>
      <div className="card-soft grid place-items-center px-4 py-12">
        <span className="animate-float-soft text-8xl">{item.emoji}</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <BigButton tone="grass" onClick={() => resolve(item.habitat === "selva")}>
          🌴 Selva
        </BigButton>
        <BigButton tone="primary" onClick={() => resolve(item.habitat === "oceano")}>
          🌊 Océano
        </BigButton>
        <BigButton tone="sun" onClick={() => resolve(item.habitat === "desierto")}>
          🏜️ Desierto
        </BigButton>
      </div>
      <Feedback status={status} />
    </div>
  );
}

function Cuidado() {
  const { item, status, resolve } = useRound(() => {
    const r = CUIDADO[randomInt(0, CUIDADO.length - 1)]!;
    const good = r.options[r.correct]!;
    return { q: r.q, good, options: shuffle([...r.options]) };
  }, 3);

  return (
    <div>
      <Prompt>{item.q}</Prompt>
      <div className="grid gap-3">
        {item.options.map((o) => (
          <BigButton key={o} tone="berry" onClick={() => resolve(o === item.good)}>
            {o}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </div>
  );
}
