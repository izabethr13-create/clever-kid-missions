import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { QuizGame, Tabs, type QuizItem } from "@/components/game/QuizGame";
import { gameActions, playSound, randomInt, shuffle } from "@/lib/game-store";

export const Route = createFileRoute("/moneda")({
  head: () => ({
    meta: [
      { title: "El Quetzal: monedas y billetes de Guatemala | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Juegos para reconocer monedas y billetes de Guatemala, contar quetzales y pagar en la tienda.",
      },
      { property: "og:title", content: "La moneda de Guatemala" },
      { property: "og:description", content: "Reconoce monedas, cuenta quetzales y paga la cuenta." },
    ],
  }),
  component: MonedaPage,
});

const CONOCE: QuizItem[] = [
  { q: "¿Cómo se llama la moneda de Guatemala?", visual: "💰", options: ["El Quetzal", "El peso", "El dólar"], answer: "El Quetzal" },
  { q: "¿Cuántos centavos tiene un quetzal?", visual: "🪙", options: ["100", "50", "10"], answer: "100" },
  { q: "¿Cuál NO es un billete de Guatemala?", visual: "💵", options: ["Q3", "Q20", "Q50"], answer: "Q3" },
  { q: "¿Qué vale más?", visual: "⚖️", options: ["Q50", "Q10", "Q5"], answer: "Q50" },
  { q: "¿Qué vale menos?", visual: "⚖️", options: ["25 centavos", "Q1", "Q5"], answer: "25 centavos" },
  { q: "Dos monedas de 50 centavos son…", visual: "🪙🪙", options: ["Q1", "Q2", "50 centavos"], answer: "Q1" },
  { q: "Cuatro monedas de 25 centavos son…", visual: "🪙", options: ["Q1", "Q4", "Q25"], answer: "Q1" },
  { q: "Dos billetes de Q10 son…", visual: "💵💵", options: ["Q20", "Q12", "Q100"], answer: "Q20" },
];

const COINS = [1, 5, 10, 20];

function makePay() {
  const price = randomInt(2, 40);
  return { price, options: shuffle([price, price + randomInt(1, 5), Math.max(1, price - randomInt(1, 5))]) };
}

function Pagar() {
  const [q, setQ] = useState(makePay);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function pick(v: number) {
    if (status !== "idle") return;
    if (v === q.price) {
      setStatus("good");
      playSound("good");
      gameActions.award("moneda", 3);
      setTimeout(() => {
        setStatus("idle");
        setQ(makePay());
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
        <span className="block text-6xl">🧸</span>
        <span className="mt-2 block">El juguete cuesta Q{q.price}. ¿Con cuánto pagas?</span>
      </Prompt>
      <div className="grid grid-cols-3 gap-3">
        {q.options.map((o) => (
          <BigButton key={o} tone="sun" onClick={() => pick(o)}>
            Q{o}
          </BigButton>
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-bold text-muted-foreground">
        Billetes: {COINS.map((c) => `Q${c}`).join(" · ")}
      </p>
      <Feedback status={status} />
    </>
  );
}

function MonedaPage() {
  const [tab, setTab] = useState<"conoce" | "pagar">("conoce");
  return (
    <StationShell title="El Quetzal" emoji="💰">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "conoce", label: "🪙 Conoce" },
          { id: "pagar", label: "🛒 Paga" },
        ]}
      />
      {tab === "conoce" ? <QuizGame station="moneda" items={CONOCE} /> : <Pagar />}
    </StationShell>
  );
}
