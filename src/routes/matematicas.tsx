import { createFileRoute } from "@tanstack/react-router";
import { RegionShell, type ModuleCard } from "@/components/game/RegionShell";

export const Route = createFileRoute("/matematicas")({
  head: () => ({
    meta: [
      { title: "Isla de las Matemáticas | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Matemáticas para niños: direccionalidad, conjuntos, números del 1 al 100, decenas, sumas y restas, fracciones, reloj, calendario, moneda, números romanos y mayas.",
      },
      { property: "og:title", content: "Isla de las Matemáticas" },
      {
        property: "og:description",
        content: "Diez estaciones de juego con números, fracciones, reloj, moneda y conteos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
    title: "M2 · Conjuntos y comparación",
    subtitle: "Pertenencia, unión, mayor y menor",
    color: "bg-berry text-berry-foreground",
  },
  {
    id: "cueva",
    to: "/cueva",
    emoji: "🔢",
    title: "M3 · Cueva de los Números",
    subtitle: "51 al 89, antes/después, decenas",
    color: "bg-primary text-primary-foreground",
  },
  {
    id: "numeros100",
    to: "/numeros100",
    emoji: "💯",
    title: "M4 · Camino del 1 al 100",
    subtitle: "Secuencias y conteos de 5, 10, 15 y 20",
    color: "bg-grass text-grass-foreground",
  },
  {
    id: "pizzeria",
    to: "/pizzeria",
    emoji: "🍕",
    title: "M5 · La Pizzería",
    subtitle: "Fracciones y sumas verticales",
    color: "bg-sun text-sun-foreground",
  },
  {
    id: "torre",
    to: "/torre",
    emoji: "⏰",
    title: "M6 · La Torre del Tiempo",
    subtitle: "Reloj y momentos del día",
    color: "bg-sky text-sky-foreground",
  },
  {
    id: "calendario",
    to: "/calendario",
    emoji: "📅",
    title: "M7 · Calendario",
    subtitle: "Semana, mes y año",
    color: "bg-grass text-grass-foreground",
  },
  {
    id: "moneda",
    to: "/moneda",
    emoji: "🪙",
    title: "M8 · Moneda y ahorro",
    subtitle: "El Quetzal y la alcancía",
    color: "bg-sun text-sun-foreground",
  },
  {
    id: "romanos",
    to: "/romanos",
    emoji: "🏛️",
    title: "M9 · Números romanos",
    subtitle: "De I a XX",
    color: "bg-berry text-berry-foreground",
  },
  {
    id: "mayas",
    to: "/mayas",
    emoji: "🗿",
    title: "M10 · Números mayas",
    subtitle: "Puntos, barras y el caracol",
    color: "bg-primary text-primary-foreground",
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
