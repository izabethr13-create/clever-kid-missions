import { createFileRoute } from "@tanstack/react-router";
import { RegionShell, type ModuleCard } from "@/components/game/RegionShell";

export const Route = createFileRoute("/english")({
  head: () => ({
    meta: [
      { title: "Phonics Safari — English for kids | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "English phonics and vocabulary games for kids: letters Dd, Kk, Qq, Uu, Vv, Ww, Xx, Yy, Zz, listening, matching and spelling.",
      },
      { property: "og:title", content: "Phonics Safari" },
      {
        property: "og:description",
        content: "Letter sounds, tracing, listening and spelling mini-games in English.",
      },
    ],
  }),
  component: EnglishPage,
});

const MODULES: ModuleCard[] = [
  {
    id: "phonics",
    to: "/phonics",
    emoji: "🔤",
    title: "E1 · Phonics & Letters",
    subtitle: "Dd, Kk, Qq, Uu, Vv, Ww, Xx, Yy, Zz",
    color: "bg-sun text-sun-foreground",
  },
  {
    id: "vocabulario",
    to: "/vocabulario",
    emoji: "🎒",
    title: "E2 · Vocabulary & Spelling",
    subtitle: "Match, listen and spell",
    color: "bg-sky text-sky-foreground",
  },
];

function EnglishPage() {
  return (
    <RegionShell
      title="Phonics Safari"
      emoji="🦁"
      intro="Tap a module to start your mission"
      modules={MODULES}
    />
  );
}
