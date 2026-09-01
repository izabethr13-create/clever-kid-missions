import { createFileRoute } from "@tanstack/react-router";
import { RegionShell, type ModuleCard } from "@/components/game/RegionShell";

export const Route = createFileRoute("/lectura")({
  head: () => ({
    meta: [
      { title: "Isla de la Lectura — Evaluaciones y comprensión lectora | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Evaluaciones de lectura cortas para niños, cuentos con preguntas, rimas, trabalenguas y técnicas para comprender mejor lo que leen.",
      },
      { property: "og:title", content: "Isla de la Lectura" },
      {
        property: "og:description",
        content: "Lecturas cortas, preguntas de comprensión y técnicas divertidas para leer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LecturaPage,
});

const MODULES: ModuleCard[] = [
  {
    id: "evaluacion",
    to: "/evaluacion",
    emoji: "📚",
    title: "Evaluaciones de lectura",
    subtitle: "Cuentos cortos con preguntas",
    color: "bg-berry text-berry-foreground",
  },
  {
    id: "tecnicas",
    to: "/tecnicas",
    emoji: "🧠",
    title: "Técnicas para leer",
    subtitle: "Rimas, trabalenguas y comprensión",
    color: "bg-sun text-sun-foreground",
  },
];

function LecturaPage() {
  return (
    <RegionShell
      title="Isla de la Lectura"
      emoji="📖"
      intro="Lee, escucha y responde a tu ritmo"
      modules={MODULES}
    />
  );
}
