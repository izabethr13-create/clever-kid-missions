import { createFileRoute } from "@tanstack/react-router";
import { RegionShell, type ModuleCard } from "@/components/game/RegionShell";

export const Route = createFileRoute("/english")({
  head: () => ({
    meta: [
      { title: "Phonics Safari — English for kids | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "English for kids: zoo animals, places and weather, phonics, long and short vowels, CVC words, spelling bee, restaurant dialogues and simple commands.",
      },
      { property: "og:title", content: "Phonics Safari" },
      {
        property: "og:description",
        content: "Zoo, places, phonics, vowels, CVC words and spelling games.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnglishPage,
});

const MODULES: ModuleCard[] = [
  {
    id: "zoo",
    to: "/zoo",
    emoji: "🦒",
    title: "E1 · Zoo Animals",
    subtitle: "Animals, actions and zookeeper time",
    color: "bg-sun text-sun-foreground",
  },
  {
    id: "places",
    to: "/places",
    emoji: "⛰️",
    title: "E2 · Places & Weather",
    subtitle: "Wants, outdoor activities, transportation",
    color: "bg-sky text-sky-foreground",
  },
  {
    id: "phonics",
    to: "/phonics",
    emoji: "🔊",
    title: "E3 · Phonics & Letters",
    subtitle: "Dd–Zz sounds and tracing",
    color: "bg-berry text-berry-foreground",
  },
  {
    id: "vowels",
    to: "/vowels",
    emoji: "🅰️",
    title: "E4 · Long Vowels",
    subtitle: "Cake, See, Pie, Boat, Music",
    color: "bg-grass text-grass-foreground",
  },
  {
    id: "cvc",
    to: "/cvc",
    emoji: "🐱",
    title: "E5 · CVC Words",
    subtitle: "Cat, dog, sun and short vowels",
    color: "bg-primary text-primary-foreground",
  },
  {
    id: "spelling",
    to: "/spelling",
    emoji: "🐝",
    title: "E6 · Spelling Bee",
    subtitle: "Listen and spell the word",
    color: "bg-sun text-sun-foreground",
  },
  {
    id: "vocabulario",
    to: "/vocabulario",
    emoji: "🎨",
    title: "E7 · Vocabulary Bank",
    subtitle: "Food, clothes and adjectives",
    color: "bg-berry text-berry-foreground",
  },
  {
    id: "restaurant",
    to: "/restaurant",
    emoji: "🍔",
    title: "E8 · Restaurant Talk",
    subtitle: "May I have some…?",
    color: "bg-grass text-grass-foreground",
  },
  {
    id: "commands",
    to: "/commands",
    emoji: "🙌",
    title: "E9 · Commands & Listening",
    subtitle: "Stand up, sit down, point to…",
    color: "bg-sky text-sky-foreground",
  },
];

function EnglishPage() {
  return (
    <RegionShell
      title="Phonics Safari"
      emoji="🦁"
      intro="Tap a module and start your English mission"
      modules={MODULES}
    />
  );
}
