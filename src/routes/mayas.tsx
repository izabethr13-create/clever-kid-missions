import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StationShell } from "@/components/game/StationShell";
import { QuizGame, Tabs, type QuizItem } from "@/components/game/QuizGame";

export const Route = createFileRoute("/mayas")({
  head: () => ({
    meta: [
      { title: "Números mayas: puntos, barras y caracol | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Aprende los números mayas del 0 al 19 con puntos, barras y el caracol, con apoyo de voz y letras grandes.",
      },
      { property: "og:title", content: "Números mayas" },
      { property: "og:description", content: "Puntos, barras y caracol: cuenta como los mayas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MayasPage,
});

function mayaGlyph(n: number) {
  if (n === 0) return "🐚";
  const bars = Math.floor(n / 5);
  const dots = n % 5;
  const rows: string[] = [];
  if (dots > 0) rows.push("•".repeat(dots));
  for (let i = 0; i < bars; i++) rows.push("▬");
  return rows.join("\n");
}

const NUMS = Array.from({ length: 20 }, (_, i) => i);

const LEER: QuizItem[] = NUMS.map((n) => ({
  q: "¿Qué número maya es este?",
  visual: mayaGlyph(n),
  options: [String(n), String((n + 3) % 20), String((n + 7) % 20)],
  answer: String(n),
  say: "¿Qué número maya es este? Cuenta los puntos y las barras.",
}));

const ESCRIBIR: QuizItem[] = NUMS.map((n) => ({
  q: `¿Cómo escriben los mayas el ${n}?`,
  visual: "🗿",
  options: [mayaGlyph(n), mayaGlyph((n + 2) % 20), mayaGlyph((n + 6) % 20)],
  answer: mayaGlyph(n),
  say: `¿Cómo escriben los mayas el ${n}?`,
}));

const REGLAS: QuizItem[] = [
  {
    q: "¿Cuánto vale un punto?",
    visual: "•",
    options: ["1", "5", "0"],
    answer: "1",
    say: "¿Cuánto vale un punto en los números mayas?",
  },
  {
    q: "¿Cuánto vale una barra?",
    visual: "▬",
    options: ["5", "1", "10"],
    answer: "5",
    say: "¿Cuánto vale una barra en los números mayas?",
  },
  {
    q: "¿Qué número es el caracol?",
    visual: "🐚",
    options: ["0", "1", "20"],
    answer: "0",
    say: "¿Qué número representa el caracol?",
  },
  {
    q: "Una barra y dos puntos, ¿cuánto es?",
    visual: "••\n▬",
    options: ["7", "5", "12"],
    answer: "7",
    say: "Una barra y dos puntos, ¿cuánto es?",
  },
  {
    q: "Tres barras, ¿cuánto es?",
    visual: "▬\n▬\n▬",
    options: ["15", "8", "3"],
    answer: "15",
    say: "Tres barras, ¿cuánto es?",
  },
];

function MayasPage() {
  const [tab, setTab] = useState<"reglas" | "leer" | "escribir">("reglas");
  return (
    <StationShell title="Números mayas" emoji="🗿">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "reglas", label: "🐚 Reglas" },
          { id: "leer", label: "👀 Leer" },
          { id: "escribir", label: "✍️ Escribir" },
        ]}
      />
      {tab === "reglas" && <QuizGame station="mayas" items={REGLAS} columns={3} />}
      {tab === "leer" && <QuizGame station="mayas" items={LEER} columns={3} />}
      {tab === "escribir" && <QuizGame station="mayas" items={ESCRIBIR} columns={3} />}
    </StationShell>
  );
}
