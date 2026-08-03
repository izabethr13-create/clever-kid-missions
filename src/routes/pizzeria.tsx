import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, randomInt, shuffle } from "@/lib/game-store";

export const Route = createFileRoute("/pizzeria")({
  head: () => ({
    meta: [
      { title: "La Pizzería de las Fracciones | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Juego de fracciones para niños: entero, un medio, un cuarto y un octavo sirviendo pizzas a los clientes.",
      },
      { property: "og:title", content: "La Pizzería de las Fracciones" },
      {
        property: "og:description",
        content: "Aprende entero, 1/2, 1/4 y 1/8 partiendo pizzas.",
      },
    ],
  }),
  component: PizzeriaPage,
});

const ORDERS = [
  { parts: 1, want: 1, label: "un entero", tex: "1" },
  { parts: 2, want: 1, label: "un medio", tex: "1/2" },
  { parts: 4, want: 1, label: "un cuarto", tex: "1/4" },
  { parts: 8, want: 1, label: "un octavo", tex: "1/8" },
  { parts: 4, want: 2, label: "dos cuartos", tex: "2/4" },
  { parts: 8, want: 4, label: "cuatro octavos", tex: "4/8" },
];

function Pizza({
  parts,
  selected,
  onToggle,
  size = 240,
}: {
  parts: number;
  selected: number[];
  onToggle: (i: number) => void;
  size?: number;
}) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <circle cx={r} cy={r} r={r - 4} fill="#e9b872" stroke="#c98d3f" strokeWidth={8} />
      <circle cx={r} cy={r} r={r - 20} fill="#e35d4a" />
      {Array.from({ length: parts }).map((_, i) => {
        const a0 = (i / parts) * Math.PI * 2 - Math.PI / 2;
        const a1 = ((i + 1) / parts) * Math.PI * 2 - Math.PI / 2;
        const x0 = r + (r - 8) * Math.cos(a0);
        const y0 = r + (r - 8) * Math.sin(a0);
        const x1 = r + (r - 8) * Math.cos(a1);
        const y1 = r + (r - 8) * Math.sin(a1);
        const large = 1 / parts > 0.5 ? 1 : 0;
        const d =
          parts === 1
            ? `M ${r} ${r} m ${-(r - 8)} 0 a ${r - 8} ${r - 8} 0 1 0 ${(r - 8) * 2} 0 a ${r - 8} ${r - 8} 0 1 0 ${-(r - 8) * 2} 0`
            : `M ${r} ${r} L ${x0} ${y0} A ${r - 8} ${r - 8} 0 ${large} 1 ${x1} ${y1} Z`;
        const on = selected.includes(i);
        return (
          <path
            key={i}
            d={d}
            onClick={() => onToggle(i)}
            className="cursor-pointer transition-opacity"
            fill={on ? "#f7c948" : "transparent"}
            fillOpacity={on ? 0.85 : 0}
            stroke="#8a4b1f"
            strokeWidth={parts === 1 ? 0 : 4}
          />
        );
      })}
      {Array.from({ length: 6 }).map((_, i) => (
        <circle
          key={`p${i}`}
          cx={r + (r - 50) * Math.cos((i / 6) * Math.PI * 2)}
          cy={r + (r - 50) * Math.sin((i / 6) * Math.PI * 2)}
          r={10}
          fill="#b8332a"
          pointerEvents="none"
        />
      ))}
    </svg>
  );
}

function PizzeriaPage() {
  const [tab, setTab] = useState<"pizza" | "caja">("pizza");
  return (
    <StationShell title="La Pizzería" emoji="🍕">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <BigButton tone={tab === "pizza" ? "primary" : "card"} onClick={() => setTab("pizza")}>
          🍕 Fracciones
        </BigButton>
        <BigButton tone={tab === "caja" ? "primary" : "card"} onClick={() => setTab("caja")}>
          🧾 Caja
        </BigButton>
      </div>
      {tab === "pizza" ? <PizzaGame /> : <CajaGame />}
    </StationShell>
  );
}

function CajaGame() {
  const [op, setOp] = useState(() => makeOp());
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const choices = shuffle([op.res, op.res + randomInt(1, 3), Math.max(0, op.res - randomInt(1, 3))]);

  function pick(n: number) {
    if (status !== "idle") return;
    if (n === op.res) {
      setStatus("good");
      playSound("good");
      gameActions.award("pizzeria", 3);
      setTimeout(() => {
        setStatus("idle");
        setOp(makeOp());
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
        <span className="block text-lg">Cobra la cuenta 🧾</span>
        {op.vertical ? (
          <span className="mt-2 inline-block text-right font-display text-4xl leading-tight">
            <span className="block">{op.a}</span>
            <span className="block border-b-4 border-foreground pb-1">
              {op.sign} {op.b}
            </span>
            <span className="block pt-1">?</span>
          </span>
        ) : (
          <span className="mt-2 block font-display text-4xl">
            {op.a} {op.sign} {op.b} = ?
          </span>
        )}
      </Prompt>
      <div className="grid grid-cols-3 gap-3">
        {choices.map((c, i) => (
          <BigButton key={`${c}-${i}`} tone="sun" onClick={() => pick(c)}>
            {c}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </>
  );
}

function makeOp() {
  const vertical = Math.random() < 0.5;
  const sum = Math.random() < 0.5;
  if (sum) {
    const a = randomInt(20, 60);
    const b = randomInt(1, 20);
    return { a, b, sign: "+", res: a + b, vertical };
  }
  const a = randomInt(30, 80);
  const b = randomInt(1, 20);
  return { a, b, sign: "−", res: a - b, vertical };
}

function PizzaGame() {
  const [order, setOrder] = useState(() => ORDERS[randomInt(0, ORDERS.length - 1)]!);
  const [cut, setCut] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const [client] = useState(() => shuffle(["🧒", "👵", "🦊", "🐼", "👦"])[0]!);

  function toggle(i: number) {
    if (!cut && order.parts > 1) return;
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  }

  function deliver() {
    const ok = selected.length === order.want && (order.parts === 1 || cut);
    if (ok) {
      setStatus("good");
      playSound("good");
      gameActions.award("pizzeria", 3);
      setTimeout(() => {
        setStatus("idle");
        setOrder(ORDERS[randomInt(0, ORDERS.length - 1)]!);
        setCut(false);
        setSelected([]);
      }, 1200);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <StationShell title="La Pizzería" emoji="🍕">
      <Prompt>
        <span className="mr-2 text-3xl">{client}</span> Quiero{" "}
        <span className="text-berry">{order.label}</span> de pizza ({order.tex})
      </Prompt>

      <div className="card-soft px-4 py-5">
        <Pizza parts={cut || order.parts === 1 ? order.parts : 1} selected={selected} onToggle={toggle} />
        <p className="mt-3 text-center font-bold text-muted-foreground">
          {order.parts === 1
            ? "Toca la pizza entera y entrégala"
            : cut
              ? `Toca ${order.want} ${order.want === 1 ? "pedazo" : "pedazos"} y entrégalos`
              : "Primero parte la pizza"}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <BigButton
          tone="card"
          disabled={order.parts === 1 || cut}
          onClick={() => setCut(true)}
        >
          🔪 Partir en {order.parts}
        </BigButton>
        <BigButton tone="grass" onClick={deliver}>
          📦 Entregar
        </BigButton>
      </div>

      <Feedback status={status} />
    </StationShell>
  );
}
