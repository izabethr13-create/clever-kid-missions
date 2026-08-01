import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, randomInt, shuffle } from "@/lib/game-store";

export const Route = createFileRoute("/cocodrilo")({
  head: () => ({
    meta: [
      { title: "El Cocodrilo Hambriento — Mayor y menor | El Mundo de los Números" },
      {
        name: "description",
        content:
          "Compara números del 51 al 80 con mayor que y menor que, y practica conjuntos: unión y pertenencia.",
      },
      { property: "og:title", content: "El Cocodrilo Hambriento" },
      {
        property: "og:description",
        content: "Mayor que, menor que y conjuntos con un cocodrilo comelón.",
      },
    ],
  }),
  component: CocodriloPage,
});

function CocodriloPage() {
  const [tab, setTab] = useState<"comparar" | "conjuntos">("comparar");
  return (
    <StationShell title="El Cocodrilo Hambriento" emoji="🐊">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <BigButton tone={tab === "comparar" ? "primary" : "card"} onClick={() => setTab("comparar")}>
          🐊 Mayor / menor
        </BigButton>
        <BigButton tone={tab === "conjuntos" ? "primary" : "card"} onClick={() => setTab("conjuntos")}>
          ⭕ Conjuntos
        </BigButton>
      </div>
      {tab === "comparar" ? <Comparar /> : <Conjuntos />}
    </StationShell>
  );
}

function Comparar() {
  const [pair, setPair] = useState(() => {
    let a = randomInt(51, 80);
    let b = randomInt(51, 80);
    while (a === b) b = randomInt(51, 80);
    return { a, b };
  });
  const [choice, setChoice] = useState<">" | "<" | null>(null);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function pick(sym: ">" | "<") {
    const correct = pair.a > pair.b ? ">" : "<";
    setChoice(sym);
    if (sym === correct) {
      setStatus("good");
      playSound("win");
      gameActions.award("cocodrilo", 2);
      setTimeout(() => {
        setStatus("idle");
        setChoice(null);
        let a = randomInt(51, 80);
        let b = randomInt(51, 80);
        while (a === b) b = randomInt(51, 80);
        setPair({ a, b });
      }, 1300);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => {
        setStatus("idle");
        setChoice(null);
      }, 900);
    }
  }

  const eating = status === "good";

  return (
    <div>
      <Prompt>La boca del cocodrilo se come el número MAYOR</Prompt>
      <div className="card-soft flex items-center justify-between gap-2 px-3 py-8">
        <div
          className={`grid h-24 w-24 place-items-center rounded-3xl bg-sky font-display text-4xl text-sky-foreground ${
            eating && pair.a > pair.b ? "animate-wiggle" : ""
          }`}
        >
          {pair.a}
        </div>
        <div
          className={`text-6xl transition-transform ${
            choice === "<" ? "-scale-x-100" : ""
          } ${status === "bad" ? "animate-shake-x" : ""} ${eating ? "animate-wiggle" : ""}`}
        >
          🐊
        </div>
        <div
          className={`grid h-24 w-24 place-items-center rounded-3xl bg-sun font-display text-4xl text-sun-foreground ${
            eating && pair.b > pair.a ? "animate-wiggle" : ""
          }`}
        >
          {pair.b}
        </div>
      </div>
      <p className="mt-3 text-center font-bold text-muted-foreground">
        {choice ? `${pair.a} ${choice} ${pair.b}` : "Elige el signo correcto"}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <BigButton tone="grass" onClick={() => pick(">")} className="text-4xl">
          {">"} mayor que
        </BigButton>
        <BigButton tone="berry" onClick={() => pick("<")} className="text-4xl">
          {"<"} menor que
        </BigButton>
      </div>
      <Feedback status={status} />
    </div>
  );
}

const THINGS = ["🍎", "🍌", "🍇", "⚽", "🚗", "🐶", "🌟", "🎩"];

function makeSets() {
  const pool = shuffle(THINGS);
  const A = pool.slice(0, 3);
  const B = pool.slice(3, 6);
  const askUnion = Math.random() < 0.5;
  return { A, B, askUnion };
}

function Conjuntos() {
  const [q, setQ] = useState(makeSets);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const [selected, setSelected] = useState<string[]>([]);

  const member = q.A[randomInt(0, q.A.length - 1)]!;

  function resolve(ok: boolean) {
    if (ok) {
      setStatus("good");
      playSound("good");
      gameActions.award("cocodrilo", 3);
      setTimeout(() => {
        setStatus("idle");
        setSelected([]);
        setQ(makeSets());
      }, 1100);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <div>
      <Prompt>
        {q.askUnion
          ? "Unión: toca TODOS los elementos que están en el conjunto A o en el B"
          : "Pertenencia: toca el conjunto donde pertenece este elemento"}
      </Prompt>

      <div className="grid grid-cols-2 gap-3">
        {(["A", "B"] as const).map((k) => {
          const items = k === "A" ? q.A : q.B;
          return (
            <button
              key={k}
              type="button"
              onClick={() =>
                !q.askUnion && resolve(k === "A" ? q.A.includes(member) : q.B.includes(member))
              }
              className="card-soft flex flex-col items-center gap-2 border-4 border-primary/40 p-4 toy-press"
            >
              <span className="font-display text-xl">Conjunto {k}</span>
              <span className="flex flex-wrap justify-center gap-2 text-3xl">
                {items.map((it) => (
                  <span key={it}>{it}</span>
                ))}
              </span>
            </button>
          );
        })}
      </div>

      {q.askUnion ? (
        <>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {shuffle([...q.A, ...q.B, ...THINGS.filter((t) => ![...q.A, ...q.B].includes(t)).slice(0, 2)]).map(
              (t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))
                  }
                  className={`grid h-16 w-16 place-items-center rounded-2xl text-3xl toy-press ${
                    selected.includes(t) ? "bg-grass" : "bg-card"
                  }`}
                >
                  {t}
                </button>
              ),
            )}
          </div>
          <BigButton
            tone="grass"
            className="mt-5 w-full"
            onClick={() => {
              const union = [...new Set([...q.A, ...q.B])];
              resolve(
                selected.length === union.length && union.every((u) => selected.includes(u)),
              );
            }}
          >
            ✅ Listo (A ∪ B)
          </BigButton>
        </>
      ) : (
        <div className="card-soft mt-5 grid place-items-center py-6">
          <span className="text-6xl">{member}</span>
          <span className="mt-2 font-bold text-muted-foreground">¿A qué conjunto pertenece?</span>
        </div>
      )}

      <Feedback status={status} />
    </div>
  );
}
