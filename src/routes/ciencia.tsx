import { createFileRoute } from "@tanstack/react-router";
import { RegionShell, type ModuleCard } from "@/components/game/RegionShell";

export const Route = createFileRoute("/ciencia")({
  head: () => ({
    meta: [
      { title: "Isla de la Ciencia — Huerto, energía y animales | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Ciencia y ciudadanía para niños: huerto virtual con frutas y verduras, naturaleza animada e inanimada, energía de calor, luz y sonido, cadenas alimenticias y hábitats.",
      },
      { property: "og:title", content: "Isla de la Ciencia" },
      {
        property: "og:description",
        content: "Siembra, clasifica, recicla y cuida a los animales en tres estaciones de ciencia.",
      },
    ],
  }),
  component: CienciaPage,
});

const MODULES: ModuleCard[] = [
  {
    id: "huerto",
    to: "/huerto",
    emoji: "🌱",
    title: "C1 · El Huerto Virtual",
    subtitle: "Sembrar, regar, cosechar y clasificar",
    color: "bg-grass text-grass-foreground",
  },
  {
    id: "energia",
    to: "/energia",
    emoji: "💡",
    title: "C2 · Valle de la Energía",
    subtitle: "Seres vivos, reciclaje, calor, luz y sonido",
    color: "bg-sun text-sun-foreground",
  },
  {
    id: "reserva",
    to: "/reserva",
    emoji: "🦁",
    title: "C3 · La Reserva Salvaje",
    subtitle: "Cadenas alimenticias, hábitats y cuidado animal",
    color: "bg-sky text-sky-foreground",
  },
];

function CienciaPage() {
  return (
    <RegionShell
      title="Isla de la Ciencia"
      emoji="🌍"
      intro="Toca un módulo para empezar la misión"
      modules={MODULES}
    />
  );
}
