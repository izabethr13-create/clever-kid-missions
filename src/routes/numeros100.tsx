import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { Tabs } from "@/components/game/QuizGame";
import { gameActions, playSound, randomInt, shuffle, speak } from "@/lib/game-store";

export const Route = createFileRoute("/numeros100")({
  head: () => ({
    meta: [
      { title: "Números del 51 al 100 y conteos | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Contar, leer y escribir números del 51 al 100, secuencia numérica del 1 al 100 y conteos de 5 en 5, 10 en 10, 15 en 15 y 20 en 20.",
      },
      { property: "og:title", content: "Números del 51 al 100" },
      {
        property: "og:description",
        content: "Secuencias, conteos salteados y sumas verticales y horizontales.",
      },
    ],
  }),
  component: Numeros100Page,
});

type Tab = "tabla" | "secuencia" | "saltos" | "sumas";

function Numeros100Page() {
  const [tab, setTab] = useState<Tab>("tabla");
  return (
    <StationShell title="Números hasta 100" emoji="💯">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "tabla", label: "🔢" },
          { id: "secuencia", label: "🚂" },
          { id: "saltos", label: "🦘" },
          { id: "sumas", label: "➕" },
        ]}
      />
      {tab === "tabla" ? (
        <Tabla />
      ) : tab === "secuencia" ? (
        <Secuencia />
      ) : tab === "saltos" ? (
        <Saltos />
      ) : (
        <Sumas />
      )}
    </StationShell>
  );
}

function Tabla() {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <>
      <Prompt>Toca un número para escucharlo 🔊</Prompt>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => {
              setSel(n);
              speak(String(n), "es-ES");
              gameActions.award("numeros100", 0);
            }}
            className={`grid h-12 place-items-center rounded-2xl font-display text-lg toy-press ${
              sel === n
                ? "bg-primary text-primary-foreground"
                : n > 50
                  ? "bg-sun text-sun-foreground"
                  : "bg-card"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-bold text-muted-foreground">
        Los números amarillos son del 51 al 100
      </p>
    </>
  );
}

function makeSeq() {
  const start = randomInt(1, 92);
  const nums = [start, start + 1, start + 2, start + 3];
  const hide = randomInt(0, 3);
  const answer = nums[hide]!;
  const opts = shuffle([answer, answer + randomInt(1, 3), Math.max(1, answer - randomInt(1, 3))]);
  return { nums, hide, answer, opts: Array.from(new Set(opts)) };
}

function Secuencia() {
  const [q, setQ] = useState(makeSeq);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function pick(n: number) {
    if (status !== "idle") return;
    if (n === q.answer) {
      setStatus("good");
      playSound("good");
      gameActions.award("numeros100", 2);
      setTimeout(() => {
        setStatus("idle");
        setQ(makeSeq());
      }, 1200);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <>
      <Prompt>🚂 ¿Qué número falta en el vagón?</Prompt>
      <ul className="mb-5 flex justify-center gap-2">
        {q.nums.map((n, i) => (
          <li
            key={n}
            className={`grid h-20 w-20 place-items-center rounded-3xl font-display text-3xl ${
              i === q.hide ? "bg-muted text-muted-foreground" : "bg-sky text-sky-foreground"
            }`}
          >
            {i === q.hide ? "?" : n}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-3 gap-3">
        {q.opts.map((o) => (
          <BigButton key={o} tone="sun" onClick={() => pick(o)}>
            {o}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </>
  );
}

const STEPS = [5, 10, 15, 20] as const;

function Saltos() {
  const [step, setStep] = useState<number>(5);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const [pos, setPos] = useState(1);
  const chain = Array.from({ length: 5 }, (_, i) => step * (pos + i));
  const answer = step * (pos + 5);
  const opts = shuffle([answer, answer + step, Math.max(step, answer - step)]);

  function pick(n: number) {
    if (status !== "idle") return;
    if (n === answer) {
      setStatus("good");
      playSound("good");
      speak(String(answer), "es-ES");
      gameActions.award("numeros100", 2);
      setTimeout(() => {
        setStatus("idle");
        setPos((p) => (step * (p + 6) > 100 ? 1 : p + 1));
      }, 1200);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <>
      <div className="mb-4 grid grid-cols-4 gap-2">
        {STEPS.map((s) => (
          <BigButton
            key={s}
            tone={step === s ? "primary" : "card"}
            onClick={() => {
              setStep(s);
              setPos(1);
            }}
            className="!text-lg"
          >
            {s} en {s}
          </BigButton>
        ))}
      </div>
      <Prompt>🦘 Cuenta de {step} en {step}. ¿Qué sigue?</Prompt>
      <ul className="mb-5 flex flex-wrap justify-center gap-2">
        {chain.map((n) => (
          <li
            key={n}
            className="grid h-16 w-16 place-items-center rounded-2xl bg-grass font-display text-2xl text-grass-foreground"
          >
            {n}
          </li>
        ))}
        <li className="grid h-16 w-16 place-items-center rounded-2xl bg-muted font-display text-2xl">
          ?
        </li>
      </ul>
      <div className="grid grid-cols-3 gap-3">
        {opts.map((o) => (
          <BigButton key={o} tone="sun" onClick={() => pick(o)}>
            {o}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </>
  );
}

function makeSum() {
  const vertical = Math.random() < 0.5;
  const a = randomInt(10, 60);
  const b = randomInt(5, 39);
  const answer = a + b;
  return { a, b, answer, vertical, opts: shuffle([answer, answer + randomInt(1, 9), Math.max(1, answer - randomInt(1, 9))]) };
}

function Sumas() {
  const [q, setQ] = useState(makeSum);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function pick(n: number) {
    if (status !== "idle") return;
    if (n === q.answer) {
      setStatus("good");
      playSound("good");
      gameActions.award("numeros100", 3);
      setTimeout(() => {
        setStatus("idle");
        setQ(makeSum());
      }, 1200);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <>
      <Prompt>
        {q.vertical ? (
          <span className="mx-auto block w-32 text-right font-display text-4xl">
            <span className="block">{q.a}</span>
            <span className="block border-b-4 border-foreground pb-1">+ {q.b}</span>
            <span className="block pt-1">?</span>
          </span>
        ) : (
          <span className="font-display text-4xl">
            {q.a} + {q.b} = ?
          </span>
        )}
      </Prompt>
      <div className="grid grid-cols-3 gap-3">
        {q.opts.map((o) => (
          <BigButton key={o} tone="sun" onClick={() => pick(o)}>
            {o}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </>
  );
}
