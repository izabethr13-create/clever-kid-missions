import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { TracePad } from "@/components/game/TracePad";
import { gameActions, playSound, randomInt, shuffle, speak } from "@/lib/game-store";

export const Route = createFileRoute("/consonantes")({
  head: () => ({
    meta: [
      { title: "El Palacio de las Consonantes | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Traza las consonantes b, g, y, f, h, j, z, ll, ch, q, k y completa palabras con sílabas trabadas: bla, bra, cla, cra, dra, fra, gra, tra.",
      },
      { property: "og:title", content: "El Palacio de las Consonantes" },
      {
        property: "og:description",
        content: "Trazo de letras y juego de sílabas trabadas con imágenes.",
      },
    ],
  }),
  component: ConsonantesPage,
});

const LETRAS = ["b", "g", "y", "f", "h", "j", "z", "ll", "ch", "q", "k"];

const PALABRAS: { emoji: string; word: string; missing: string; options: string[] }[] = [
  { emoji: "🧙‍♀️", word: "bruja", missing: "bru", options: ["bru", "blu", "dru"] },
  { emoji: "🌳", word: "árbol", missing: "bol", options: ["bol", "brol", "blol"] },
  { emoji: "🚂", word: "tren", missing: "tre", options: ["tre", "dre", "cre"] },
  { emoji: "🐊", word: "cocodrilo", missing: "dri", options: ["dri", "tri", "bri"] },
  { emoji: "🍓", word: "fresa", missing: "fre", options: ["fre", "cre", "gre"] },
  { emoji: "🐸", word: "rana", missing: "ra", options: ["ra", "rra", "la"] },
  { emoji: "☁️", word: "nublado", missing: "bla", options: ["bla", "bra", "pla"] },
  { emoji: "🏫", word: "clase", missing: "cla", options: ["cla", "cra", "gla"] },
  { emoji: "✏️", word: "crayón", missing: "cra", options: ["cra", "cla", "tra"] },
  { emoji: "🎩", word: "grande", missing: "gra", options: ["gra", "gla", "dra"] },
];

function ConsonantesPage() {
  const [tab, setTab] = useState<"trazar" | "silabas">("trazar");
  return (
    <StationShell title="Palacio de las Consonantes" emoji="🏰">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <BigButton tone={tab === "trazar" ? "primary" : "card"} onClick={() => setTab("trazar")}>
          ✍️ Trazar
        </BigButton>
        <BigButton tone={tab === "silabas" ? "primary" : "card"} onClick={() => setTab("silabas")}>
          🧩 Sílabas
        </BigButton>
      </div>
      {tab === "trazar" ? <Trazar /> : <Silabas />}
    </StationShell>
  );
}

function Trazar() {
  const [letra, setLetra] = useState("b");
  const [key, setKey] = useState(0);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  // El camino guía es el contorno de la letra dibujada como texto grande.
  const paths = ["M 60 250 L 240 250"]; // línea base de apoyo

  function complete() {
    setStatus("good");
    playSound("good");
    speak(`Letra ${letra}`);
    gameActions.award("consonantes", 2);
    setTimeout(() => {
      setStatus("idle");
      setKey((k) => k + 1);
    }, 1100);
  }

  return (
    <>
      <Prompt>
        Traza la letra{" "}
        <button
          type="button"
          onClick={() => speak(`Letra ${letra}`)}
          className="text-primary underline decoration-dotted"
        >
          {letra} 🔊
        </button>
      </Prompt>

      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 grid place-items-center font-display text-[9rem] leading-none text-muted-foreground/25"
        >
          {letra}
        </span>
        <TracePad key={`${letra}-${key}`} paths={paths} onComplete={complete} />
      </div>

      <p className="mt-3 text-center text-sm font-bold text-muted-foreground">
        Escribe la letra encima y pasa el dedo por la línea verde para terminar
      </p>

      <ul className="mt-4 flex flex-wrap justify-center gap-2">
        {LETRAS.map((l) => (
          <li key={l}>
            <button
              type="button"
              onClick={() => {
                setLetra(l);
                setKey((k) => k + 1);
                speak(`Letra ${l}`);
              }}
              className={`grid h-14 w-14 place-items-center rounded-2xl font-display text-2xl toy-press ${
                letra === l ? "bg-primary text-primary-foreground" : "bg-card"
              }`}
            >
              {l}
            </button>
          </li>
        ))}
      </ul>

      <Feedback status={status} />
    </>
  );
}

function Silabas() {
  const [q, setQ] = useState(() => PALABRAS[randomInt(0, PALABRAS.length - 1)]!);
  const [opts, setOpts] = useState(() => shuffle(q.options));
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function pick(o: string) {
    if (status !== "idle") return;
    if (o === q.missing) {
      setStatus("good");
      playSound("good");
      speak(q.word);
      gameActions.award("consonantes", 3);
      setTimeout(() => {
        const next = PALABRAS[randomInt(0, PALABRAS.length - 1)]!;
        setQ(next);
        setOpts(shuffle(next.options));
        setStatus("idle");
      }, 1300);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  const hueco = q.word.replace(q.missing, "___");

  return (
    <>
      <Prompt>
        <span className="block text-6xl">{q.emoji}</span>
        <span className="mt-2 block">{hueco}</span>
      </Prompt>
      <div className="grid grid-cols-3 gap-3">
        {opts.map((o) => (
          <BigButton key={o} tone="sun" onClick={() => pick(o)}>
            {o}
          </BigButton>
        ))}
      </div>
      <div className="mt-4 grid">
        <BigButton tone="card" onClick={() => speak(q.word)}>
          🔊 Escuchar palabra
        </BigButton>
      </div>
      <Feedback status={status} />
    </>
  );
}
