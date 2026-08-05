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
    id: "restaurant",
    to: "/restaurant",
    emoji: "🍽️",
    title: "E2 · Restaurant & Conversation",
    subtitle: "Eating out, our things and questions",
    color: "bg-berry text-berry-foreground",
  },
  {
    id: "vocabulario",
    to: "/vocabulario",
    emoji: "🎒",
    title: "E3 · Vocabulary & Spelling",
    subtitle: "Match, listen and spell",
    color: "bg-sky text-sky-foreground",
  },
  {
    id: "commands",
    to: "/commands",
    emoji: "🔬",
    title: "E4 · Science & Commands",
    subtitle: "Patterns in nature and listening commands",
    color: "bg-grass text-grass-foreground",
  },
];

function EnglishPage() {
  return (
    <RegionShell
      title="Isla Language Arts"
      emoji="🦁"
      intro="Tap a module to start your mission"
      modules={MODULES}
    />
  );
}
