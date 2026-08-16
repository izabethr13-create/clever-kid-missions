import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StationShell } from "@/components/game/StationShell";
import { QuizGame, Tabs, type QuizItem } from "@/components/game/QuizGame";

export const Route = createFileRoute("/romanos")({
  head: () => ({
    meta: [
      { title: "Números romanos del I al XX | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Juego para aprender los números romanos del I al XX: leer, escribir y comparar romanos con números arábigos.",
      },
      { property: "og:title", content: "Números romanos I–XX" },
      { property: "og:description", content: "Lee y escribe números romanos jugando." },
    ],
  }),
  component: RomanosPage,
});

const ROMAN = [
  "I","II","III","IV","V","VI","VII","VIII","IX","X",
  "XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX",
];

function wrong(n: number, count: number) {
  const out: string[] = [];
  let d = 1;
  while (out.length < count) {
    const a = n + d;
    const b = n - d;
    if (a <= 20) out.push(ROMAN[a - 1]!);
    if (out.length < count && b >= 1) out.push(ROMAN[b - 1]!);
    d++;
  }
  return out;
}

const LEER: QuizItem[] = ROMAN.map((r, i) => ({
  q: `¿Qué número es ${r}?`,
  visual: r,
  options: [String(i + 1), String(i + 2 > 20 ? i - 1 : i + 2), String(i === 0 ? 5 : i)],
  answer: String(i + 1),
  say: `¿Qué número es ${r}?`,
}));

const ESCRIBIR: QuizItem[] = ROMAN.map((r, i) => ({
  q: `¿Cómo se escribe el ${i + 1} en romano?`,
  visual: "🏛️",
  options: [r, ...wrong(i + 1, 2)],
  answer: r,
  say: `¿Cómo se escribe el ${i + 1} en números romanos?`,
}));

function RomanosPage() {
  const [tab, setTab] = useState<"leer" | "escribir">("leer");
  return (
    <StationShell title="Números romanos" emoji="🏛️">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "leer", label: "👀 Leer" },
          { id: "escribir", label: "✍️ Escribir" },
        ]}
      />
      {tab === "leer" ? (
        <QuizGame station="romanos" items={LEER} columns={3} />
      ) : (
        <QuizGame station="romanos" items={ESCRIBIR} columns={3} />
      )}
    </StationShell>
  );
}
