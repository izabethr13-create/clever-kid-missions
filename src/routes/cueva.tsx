import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, randomInt, shuffle } from "@/lib/game-store";

export const Route = createFileRoute("/cueva")({
  head: () => ({
    meta: [
      { title: "Cueva de los Números 51 al 80 | El Mundo de los Números" },
      {
        name: "description",
        content:
          "Cuenta y escribe números del 51 al 80, practica antes y después, secuencias, decenas y unidades, y sumas y restas.",
      },
      { property: "og:title", content: "Cueva de los Números" },
      {
        property: "og:description",
        content: "Cinco mini juegos de números del 51 al 80 para primer grado.",
      },
    ],
  }),
  component: CuevaPage,
});

type Mode = "menu" | "contar" | "vecinos" | "secuencia" | "bloques" | "operaciones";

const GAMES: { id: Mode; emoji: string; title: string }[] = [
  { id: "contar", emoji: "💎", title: "Contar y escribir" },
  { id: "vecinos", emoji: "↔️", title: "Antes y después" },
  { id: "secuencia", emoji: "🪜", title: "Secuencia numérica" },
  { id: "bloques", emoji: "🧱", title: "Decenas y unidades" },
  { id: "operaciones", emoji: "➕", title: "Sumas y restas" },
];

function CuevaPage() {
  const [mode, setMode] = useState<Mode>("menu");

  return (
    <StationShell title="Cueva de los Números" emoji="🔢">
      {mode === "menu" ? (
        <ul className="space-y-3">
          {GAMES.map((g) => (
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
          {mode === "contar" && <Contar />}
          {mode === "vecinos" && <Vecinos />}
          {mode === "secuencia" && <Secuencia />}
          {mode === "bloques" && <Bloques />}
          {mode === "operaciones" && <Operaciones />}
        </div>
      )}
    </StationShell>
  );
}

function useRound<T>(make: () => T) {
  const [item, setItem] = useState<T>(make);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  function resolve(ok: boolean, stars = 2, station: "cueva" = "cueva") {
    if (ok) {
      setStatus("good");
      playSound("good");
      gameActions.award(station, stars);
      setTimeout(() => {
        setStatus("idle");
        setItem(make());
      }, 1000);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }
  return { item, status, resolve };
}

function Contar() {
  const { item, status, resolve } = useRound(() => {
    const n = randomInt(51, 80);
    return { n, options: shuffle([n, n + 1, n - 1, n + 10].slice(0, 4)) };
  });

  return (
    <div>
      <Prompt>¿Cuántos cristales hay? Cuenta y escribe el número</Prompt>
      <div className="card-soft flex flex-wrap justify-center gap-1 p-4 text-xl">
        {Array.from({ length: item.n }).map((_, i) => (
          <span key={i}>{i < 50 ? "💎" : "🔷"}</span>
        ))}
      </div>
      <p className="mt-2 text-center text-sm font-bold text-muted-foreground">
        Pista: hay 5 filas de 10 cristales azules 💎 y luego los otros 🔷
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {item.options.map((o) => (
          <BigButton key={o} tone="primary" onClick={() => resolve(o === item.n)}>
            {o}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </div>
  );
}

function Vecinos() {
  const { item, status, resolve } = useRound(() => {
    const n = randomInt(52, 79);
    const ask: "antes" | "despues" = Math.random() < 0.5 ? "antes" : "despues";
    const correct = ask === "antes" ? n - 1 : n + 1;
    return { n, ask, correct, options: shuffle([correct, n, ask === "antes" ? n + 1 : n - 1]) };
  });

  return (
    <div>
      <Prompt>
        ¿Qué número va {item.ask === "antes" ? "ANTES" : "DESPUÉS"} del{" "}
        <span className="text-primary">{item.n}</span>?
      </Prompt>
      <div className="card-soft flex items-center justify-center gap-3 px-4 py-8 font-display text-4xl">
        {item.ask === "antes" ? <span className="text-muted-foreground">?</span> : <span>{item.n}</span>}
        <span className="text-2xl text-muted-foreground">→</span>
        {item.ask === "antes" ? <span>{item.n}</span> : <span className="text-muted-foreground">?</span>}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {item.options.map((o) => (
          <BigButton key={o} tone="sun" onClick={() => resolve(o === item.correct)}>
            {o}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </div>
  );
}

function Secuencia() {
  const { item, status, resolve } = useRound(() => {
    const start = randomInt(51, 74);
    const hole = randomInt(1, 4);
    const seq = [start, start + 1, start + 2, start + 3, start + 4, start + 5];
    const correct = seq[hole]!;
    return { seq, hole, correct, options: shuffle([correct, correct + 2, correct - 2]) };
  });

  return (
    <div>
      <Prompt>Completa la escalera de números</Prompt>
      <div className="card-soft flex flex-wrap items-end justify-center gap-2 p-4">
        {item.seq.map((n, i) => (
          <div
            key={i}
            className={`grid h-16 w-16 place-items-center rounded-2xl font-display text-2xl ${
              i === item.hole ? "border-4 border-dashed border-primary bg-muted" : "bg-secondary"
            }`}
          >
            {i === item.hole ? "?" : n}
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

function Bloques() {
  const [target, setTarget] = useState(() => randomInt(51, 80));
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const total = tens * 10 + ones;

  function check() {
    if (total === target) {
      setStatus("good");
      playSound("good");
      gameActions.award("cueva", 3);
      setTimeout(() => {
        setStatus("idle");
        setTarget(randomInt(51, 80));
        setTens(0);
        setOnes(0);
      }, 1200);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <div>
      <Prompt>
        Construye el número <span className="text-primary">{target}</span>
      </Prompt>
      <div className="card-soft p-4">
        <div className="flex min-h-28 flex-wrap items-end gap-2">
          {Array.from({ length: tens }).map((_, i) => (
            <div key={`t${i}`} className="animate-pop-in grid grid-cols-2 gap-[2px] rounded bg-primary/20 p-[2px]">
              {Array.from({ length: 10 }).map((__, j) => (
                <span key={j} className="h-3 w-3 rounded-[2px] bg-primary" />
              ))}
            </div>
          ))}
          {Array.from({ length: ones }).map((_, i) => (
            <span key={`o${i}`} className="animate-pop-in h-4 w-4 rounded-[3px] bg-sun" />
          ))}
        </div>
        <p className="mt-3 text-center font-display text-3xl">
          {tens} decenas + {ones} unidades = {total}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <BigButton tone="primary" onClick={() => setTens((t) => Math.min(8, t + 1))}>
          + 1 decena
        </BigButton>
        <BigButton tone="sun" onClick={() => setOnes((o) => Math.min(9, o + 1))}>
          + 1 unidad
        </BigButton>
        <BigButton
          tone="card"
          onClick={() => {
            setTens(0);
            setOnes(0);
          }}
        >
          🔄 Borrar
        </BigButton>
        <BigButton tone="grass" onClick={check}>
          ✅ Listo
        </BigButton>
      </div>
      <Feedback status={status} />
    </div>
  );
}

function Operaciones() {
  const { item, status, resolve } = useRound(() => {
    const suma = Math.random() < 0.5;
    const vertical = Math.random() < 0.5;
    const a = randomInt(51, 78);
    const b = suma ? randomInt(1, 80 - a) : randomInt(1, a - 50);
    const correct = suma ? a + b : a - b;
    return {
      a,
      b,
      suma,
      vertical,
      correct,
      options: shuffle([correct, correct + 1, correct - 1]),
    };
  });

  return (
    <div>
      <Prompt>Resuelve la operación</Prompt>
      <div className="card-soft grid place-items-center px-4 py-8 font-display text-4xl">
        {item.vertical ? (
          <div className="text-right leading-tight">
            <div>{item.a}</div>
            <div className="border-b-4 border-foreground pb-1">
              {item.suma ? "+" : "−"} {item.b}
            </div>
            <div className="pt-1 text-muted-foreground">?</div>
          </div>
        ) : (
          <div>
            {item.a} {item.suma ? "+" : "−"} {item.b} = <span className="text-muted-foreground">?</span>
          </div>
        )}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {item.options.map((o) => (
          <BigButton key={o} tone="berry" onClick={() => resolve(o === item.correct)}>
            {o}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </div>
  );
}
