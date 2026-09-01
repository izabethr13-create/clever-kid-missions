import { createFileRoute } from "@tanstack/react-router";
import { RegionShell, type ModuleCard } from "@/components/game/RegionShell";

export const Route = createFileRoute("/lenguaje")({
  head: () => ({
    meta: [
      { title: "Bosque del Lenguaje — Español | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Español para niños: aprestamiento y trazos, consonantes Ww y Xx, sílabas inversas, güe/güi, combinaciones pl, br, tr y formación de oraciones.",
      },
      { property: "og:title", content: "Bosque del Lenguaje" },
      {
        property: "og:description",
        content: "Trazos, consonantes, sílabas inversas y trabadas y la fábrica de oraciones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LenguajePage,
});

const MODULES: ModuleCard[] = [
  {
    id: "trazos",
    to: "/trazos",
    emoji: "✏️",
    title: "L1 · El Caminito Mágico",
    subtitle: "Aprestamiento y motricidad fina",
    color: "bg-sky text-sky-foreground",
  },
  {
    id: "consonantes",
    to: "/consonantes",
    emoji: "🏰",
    title: "L2 · Palacio de las Consonantes",
    subtitle: "Ww, Xx, güe/güi y sílabas trabadas",
    color: "bg-sun text-sun-foreground",
  },
  {
    id: "inversas",
    to: "/inversas",
    emoji: "🔡",
    title: "L3 · Sílabas inversas y mixtas",
    subtitle: "al, en, ar, os, uz, oy, ac",
    color: "bg-berry text-berry-foreground",
  },
  {
    id: "oraciones",
    to: "/oraciones",
    emoji: "🏭",
    title: "L4 · Fábrica de Oraciones",
    subtitle: "Ordena las palabras y escúchalas",
    color: "bg-grass text-grass-foreground",
  },
];

function LenguajePage() {
  return (
    <RegionShell
      title="Bosque del Lenguaje"
      emoji="🌳"
      intro="Toca un módulo para empezar la misión"
      modules={MODULES}
    />
  );
}
