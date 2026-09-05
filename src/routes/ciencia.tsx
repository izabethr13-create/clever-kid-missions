import { createFileRoute } from "@tanstack/react-router";
import { RegionShell, type ModuleCard } from "@/components/game/RegionShell";

export const Route = createFileRoute("/ciencia")({
  head: () => ({
    meta: [
      { title: "Isla de la Ciencia y Ciudadanía | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Ciencia para niños: huerto, energía y reciclaje, cuidado animal, el universo y los astros, y civismo de Guatemala con símbolos patrios.",
      },
      { property: "og:title", content: "Isla de la Ciencia y Ciudadanía" },
      {
        property: "og:description",
        content: "Huerto, energía, animales, universo y Guatemala en cinco misiones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CienciaPage,
});

const MODULES: ModuleCard[] = [
  {
    id: "huerto",
    to: "/huerto",
    emoji: "🌱",
    title: "C1 · El Huerto",
    subtitle: "Siembra, frutas y verduras",
    color: "bg-grass text-grass-foreground",
  },
  {
    id: "jardin",
    to: "/jardin",
    emoji: "🌻",
    title: "C1b · Mi jardín",
    subtitle: "Semillas, riego, sol y cosecha",
    color: "bg-sun text-sun-foreground",
  },
  {
    id: "cadena",
    to: "/cadena",
    emoji: "🍃",
    title: "C1c · Cadena alimenticia",
    subtitle: "Ordena quién come a quién",
    color: "bg-grass text-grass-foreground",
  },
  {

    id: "energia",
    to: "/energia",
    emoji: "⚡",
    title: "C2 · Energía y reciclaje",
    subtitle: "Seres vivos, basura y energía",
    color: "bg-sun text-sun-foreground",
  },
  {
    id: "reserva",
    to: "/reserva",
    emoji: "🐾",
    title: "C3 · Reserva animal",
    subtitle: "Hábitats y cadenas alimenticias",
    color: "bg-primary text-primary-foreground",
  },
  {
    id: "universo",
    to: "/universo",
    emoji: "🪐",
    title: "C4 · El Universo",
    subtitle: "Astros, clima, recursos y minerales",
    color: "bg-sky text-sky-foreground",
  },
  {
    id: "guatemala",
    to: "/guatemala",
    emoji: "🇬🇹",
    title: "C5 · Guatemala",
    subtitle: "Civismo, mapa, símbolos y tradiciones",
    color: "bg-berry text-berry-foreground",
  },
];

function CienciaPage() {
  return (
    <RegionShell
      title="Isla de la Ciencia y Ciudadanía"
      emoji="🔬"
      intro="Toca un módulo para empezar la misión"
      modules={MODULES}
    />
  );
}
