import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StationShell } from "@/components/game/StationShell";
import { QuizGame, Tabs, type QuizItem } from "@/components/game/QuizGame";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "El calendario: días, meses y estaciones | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Aprende los días de la semana, los meses del año y las estaciones con juegos de preguntas y voz.",
      },
      { property: "og:title", content: "El calendario" },
      { property: "og:description", content: "Días de la semana, meses del año y estaciones." },
    ],
  }),
  component: CalendarioPage,
});

const DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const MESES = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
];

const DIAS_Q: QuizItem[] = DIAS.map((d, i) => ({
  q: `¿Qué día viene después del ${d}?`,
  visual: "📅",
  options: [DIAS[(i + 1) % 7]!, DIAS[(i + 3) % 7]!, DIAS[(i + 5) % 7]!],
  answer: DIAS[(i + 1) % 7]!,
})).concat(
  DIAS.map((d, i) => ({
    q: `¿Qué día viene antes del ${d}?`,
    visual: "🗓️",
    options: [DIAS[(i + 6) % 7]!, DIAS[(i + 2) % 7]!, DIAS[(i + 4) % 7]!],
    answer: DIAS[(i + 6) % 7]!,
  })),
);

const MESES_Q: QuizItem[] = MESES.map((m, i) => ({
  q: `¿Qué mes viene después de ${m}?`,
  visual: "📆",
  options: [MESES[(i + 1) % 12]!, MESES[(i + 5) % 12]!, MESES[(i + 8) % 12]!],
  answer: MESES[(i + 1) % 12]!,
})).concat([
  { q: "¿Cuántos meses tiene el año?", visual: "🎂", options: ["12", "7", "30"], answer: "12" },
  { q: "¿Cuál es el primer mes del año?", visual: "🎊", options: ["enero", "diciembre", "junio"], answer: "enero" },
  { q: "¿Cuál es el último mes del año?", visual: "🎄", options: ["diciembre", "enero", "agosto"], answer: "diciembre" },
  { q: "¿Cuántos días tiene una semana?", visual: "7️⃣", options: ["7", "12", "5"], answer: "7" },
]);

const ESTACIONES: QuizItem[] = [
  { q: "Llueve mucho y todo está verde…", visual: "🌧️", options: ["Invierno (lluvia)", "Verano"], answer: "Invierno (lluvia)" },
  { q: "Hace calor y el sol brilla fuerte…", visual: "☀️", options: ["Verano", "Invierno (lluvia)"], answer: "Verano" },
  { q: "¿En qué mes celebramos la Independencia de Guatemala?", visual: "🇬🇹", options: ["septiembre", "marzo", "julio"], answer: "septiembre" },
  { q: "¿En qué mes es la Navidad?", visual: "🎅", options: ["diciembre", "abril", "mayo"], answer: "diciembre" },
  { q: "¿Qué días no vamos a la escuela?", visual: "🏖️", options: ["sábado y domingo", "lunes y martes"], answer: "sábado y domingo" },
  { q: "¿Cuántos días tiene un año?", visual: "🌍", options: ["365", "100", "50"], answer: "365" },
];

function CalendarioPage() {
  const [tab, setTab] = useState<"dias" | "meses" | "estaciones">("dias");
  return (
    <StationShell title="El Calendario" emoji="📅">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "dias", label: "📅" },
          { id: "meses", label: "📆" },
          { id: "estaciones", label: "☀️" },
        ]}
      />
      {tab === "dias" ? (
        <QuizGame station="calendario" items={DIAS_Q} />
      ) : tab === "meses" ? (
        <QuizGame station="calendario" items={MESES_Q} />
      ) : (
        <QuizGame station="calendario" items={ESTACIONES} />
      )}
    </StationShell>
  );
}
