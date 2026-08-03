import { createFileRoute } from "@tanstack/react-router";
import { RegionShell, type ModuleCard } from "@/components/game/RegionShell";

export const Route = createFileRoute("/lenguaje")({
  head: () => ({
    meta: [
      { title: "Bosque del Lenguaje — Español | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Español para niños: aprestamiento y trazos, consonantes b, g, y, f, h, j, z, ll, ch, q, k, sílabas trabadas y formación de oraciones.",
      },
      { property: "og:title", content: "Bosque del Lenguaje" },
      {
        property: "og:description",
        content: "Trazos, consonantes, sílabas trabadas y la fábrica de oraciones.",
      },
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
    subtitle: "Letras y sílabas trabadas",
    color: "bg-sun text-sun-foreground",
  },
  {
    id: "oraciones",
    to: "/oraciones",
    emoji: "🏭",
    title: "L3 · Fábrica de Oraciones",
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
