import { createFileRoute } from "@tanstack/react-router";
import { RegionShell, type ModuleCard } from "@/components/game/RegionShell";

export const Route = createFileRoute("/matematicas")({
  head: () => ({
    meta: [
      { title: "Isla de las Matemáticas | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Módulos de matemáticas: direccionalidad y conjuntos, números del 50 al 89, fracciones y operaciones, reloj y comparación de números.",
      },
      { property: "og:title", content: "Isla de las Matemáticas" },
      {
        property: "og:description",
        content: "Cuatro estaciones de juego con números, fracciones, reloj y conjuntos.",
      },
    ],
  }),
  component: MatematicasPage,
});

const MODULES: ModuleCard[] = [
  {
    id: "camino",
    to: "/camino",
    emoji: "🧭",
    title: "M1 · Camino Fantasma",
    subtitle: "Direccionalidad",
    color: "bg-sky text-sky-foreground",
  },
  {
    id: "cocodrilo",
    to: "/cocodrilo",
    emoji: "⭕",
    title: "M1b · Conjuntos y comparación",
    subtitle: "Pertenencia, unión, mayor y menor",
    color: "bg-berry text-berry-foreground",
  },
  {
    id: "cueva",
    to: "/cueva",
    emoji: "🔢",
    title: "M2 · Cueva de los Números",
    subtitle: "50 al 89, antes/después, decenas",
    color: "bg-primary text-primary-foreground",
  },
  {
    id: "pizzeria",
    to: "/pizzeria",
    emoji: "🍕",
    title: "M3 · La Pizzería",
    subtitle: "Fracciones y caja registradora",
    color: "bg-sun text-sun-foreground",
  },
  {
    id: "torre",
    to: "/torre",
    emoji: "⏰",
    title: "M4 · La Torre del Tiempo",
    subtitle: "Reloj y momentos del día",
    color: "bg-grass text-grass-foreground",
  },
];

function MatematicasPage() {
  return (
    <RegionShell
      title="Isla de las Matemáticas"
      emoji="🏝️"
      intro="Toca un módulo para empezar la misión"
      modules={MODULES}
    />
  );
}
