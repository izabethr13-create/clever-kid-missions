import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StationShell } from "@/components/game/StationShell";
import { QuizGame, Tabs, type QuizItem } from "@/components/game/QuizGame";

export const Route = createFileRoute("/inversas")({
  head: () => ({
    meta: [
      { title: "Sílabas inversas y mixtas | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Juegos de lectura para sílabas inversas (al, el, in, os, ar) y sílabas mixtas, con voz y palabras ilustradas.",
      },
      { property: "og:title", content: "Sílabas inversas y mixtas" },
      { property: "og:description", content: "Completa palabras con sílabas inversas y mixtas." },
    ],
  }),
  component: InversasPage,
});

const INVERSAS: QuizItem[] = [
  { q: "__mario (mueble de la ropa)", visual: "🚪", options: ["ar", "ra", "al"], answer: "ar" },
  { q: "__bol (crece en el bosque)", visual: "🌳", options: ["ár", "ra", "or"], answer: "ár" },
  { q: "__to (lo contrario de bajo)", visual: "🗼", options: ["al", "la", "el"], answer: "al" },
  { q: "__sa (comemos sobre ella)", visual: "🍽️", options: ["me", "em", "am"], answer: "me" },
  { q: "i__la (tierra rodeada de mar)", visual: "🏝️", options: ["s", "z", "c"], answer: "s" },
  { q: "__fombra (está en el piso)", visual: "🧶", options: ["al", "el", "ol"], answer: "al" },
  { q: "e__fante (animal muy grande)", visual: "🐘", options: ["le", "el", "la"], answer: "le" },
  { q: "__bol de fútbol", visual: "⚽", options: ["fút", "fut", "ful"], answer: "fút" },
  { q: "__mendra (fruto seco)", visual: "🌰", options: ["al", "el", "il"], answer: "al" },
  { q: "__so (animal del bosque)", visual: "🐻", options: ["o", "u", "e"], answer: "o" },
];

const MIXTAS: QuizItem[] = [
  { q: "ca__ta (la lleva el cartero)", visual: "✉️", options: ["r", "l", "s"], answer: "r" },
  { q: "pue__ta (se abre y se cierra)", visual: "🚪", options: ["r", "l", "n"], answer: "r" },
  { q: "ca__po (lleno de plantas)", visual: "🌾", options: ["m", "n", "r"], answer: "m" },
  { q: "ta__bor (instrumento)", visual: "🥁", options: ["m", "n", "l"], answer: "m" },
  { q: "so__brero (para el sol)", visual: "👒", options: ["m", "n", "r"], answer: "m" },
  { q: "pi__güino (vive en el hielo)", visual: "🐧", options: ["n", "m", "l"], answer: "n" },
  { q: "co__cha del mar", visual: "🐚", options: ["n", "m", "r"], answer: "n" },
  { q: "ma__zana roja", visual: "🍎", options: ["n", "m", "l"], answer: "n" },
];

const LEER: QuizItem[] = [
  { q: "¿Qué palabra empieza con sílaba inversa?", visual: "📖", options: ["árbol", "casa", "mesa"], answer: "árbol" },
  { q: "¿Cuál es una sílaba inversa?", visual: "🔤", options: ["al", "la", "ma"], answer: "al" },
  { q: "¿Cuál es una sílaba directa?", visual: "🔤", options: ["pa", "ap", "er"], answer: "pa" },
  { q: "¿Cuál es una sílaba mixta?", visual: "🔤", options: ["car", "ca", "ar"], answer: "car" },
  { q: "En 'isla', la primera sílaba es…", visual: "🏝️", options: ["is", "si", "la"], answer: "is" },
  { q: "En 'campo', la primera sílaba es…", visual: "🌾", options: ["cam", "ca", "po"], answer: "cam" },
];

function InversasPage() {
  const [tab, setTab] = useState<"inversas" | "mixtas" | "leer">("inversas");
  return (
    <StationShell title="Sílabas inversas y mixtas" emoji="🔡">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "inversas", label: "🔄" },
          { id: "mixtas", label: "🧩" },
          { id: "leer", label: "📖" },
        ]}
      />
      {tab === "inversas" ? (
        <QuizGame station="inversas" items={INVERSAS} columns={3} />
      ) : tab === "mixtas" ? (
        <QuizGame station="inversas" items={MIXTAS} columns={3} />
      ) : (
        <QuizGame station="inversas" items={LEER} columns={3} />
      )}
    </StationShell>
  );
}
