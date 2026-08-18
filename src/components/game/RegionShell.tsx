import { RegionShell, type ModuleCard } from "@/components/game/RegionShell";

export const ISLA_MODULES: ModuleCard[] = [
  {
    id: "trazado" as any,
    to: "/game/trazado",
    emoji: "✍️",
    title: "Trazado de Letras",
    subtitle: "Práctica de trazo digital e interactivo",
    color: "bg-amber-400 text-amber-950",
  },
  {
    id: "comunicacion_lenguaje" as any,
    to: "/game/comunicacion_lenguaje",
    emoji: "🗣️",
    title: "Comunicación y Lenguaje",
    subtitle: "Consonantes, diéresis y oraciones",
    color: "bg-emerald-400 text-emerald-950",
  },
  {
    id: "lectura" as any,
    to: "/game/lectura",
    emoji: "📖",
    title: "Comprensión Lectora",
    subtitle: "Lectura rápida y cuentos cortos",
    color: "bg-teal-400 text-teal-950",
  },
  {
    id: "matemáticas_espanol" as any,
    to: "/game/matematicas_espanol",
    emoji: "🔢",
    title: "Matemáticas (Español)",
    subtitle: "Números romanos, mayas y sumas",
    color: "bg-sky-400 text-sky-950",
  },
  {
    id: "ciencia_ciudadania" as any,
    to: "/game/ciencia_ciudadania",
    emoji: "🌱",
    title: "Ciencia y Ciudadanía",
    subtitle: "Cuerpos celestes y civismo",
    color: "bg-green-500 text-white",
  },
  {
    id: "conversation" as any,
    to: "/game/conversation",
    emoji: "💬",
    title: "English Conversation",
    subtitle: "Animals, zoo routines and travel",
    color: "bg-blue-400 text-blue-950",
  },
  {
    id: "grammar" as any,
    to: "/game/grammar",
    emoji: "📝",
    title: "English Grammar",
    subtitle: "Zookeeper routines and descriptions",
    color: "bg-indigo-400 text-indigo-950",
  },
  {
    id: "phonics" as any,
    to: "/game/phonics",
    emoji: "🔊",
    title: "Phonics & Vowels",
    subtitle: "Long and short vowel sounds",
    color: "bg-purple-400 text-purple-950",
  },
  {
    id: "numbers" as any,
    to: "/game/numbers",
    emoji: "⏰",
    title: "Numbers & Time",
    subtitle: "Clocks and sequence counting",
    color: "bg-violet-400 text-violet-950",
  },
  {
    id: "science" as any,
    to: "/game/science",
    emoji: "🔬",
    title: "Science in English",
    subtitle: "Caterpillar metamorphosis and nature",
    color: "bg-rose-400 text-rose-950",
  },
  {
    id: "vocabulary" as any,
    to: "/game/vocabulary",
    emoji: "🎨",
    title: "Vocabulary Building",
    subtitle: "Animals, places and object names",
    color: "bg-pink-400 text-pink-950",
  },
  {
    id: "math" as any,
    to: "/game/math",
    emoji: "➕",
    title: "Math (English)",
    subtitle: "Tens, ones and basic math",
    color: "bg-cyan-400 text-cyan-950",
  },
  {
    id: "pre_reading" as any,
    to: "/game/pre_reading",
    emoji: "🔤",
    title: "Pre-Reading CVC",
    subtitle: "Short CVC word lists and phonics",
    color: "bg-fuchsia-400 text-fuchsia-950",
  },
  {
    id: "spelling" as any,
    to: "/game/spelling",
    emoji: "🐝",
    title: "Spelling Bee",
    subtitle: "Interactive spelling practice",
    color: "bg-orange-400 text-orange-950",
  },
];

export function IndexPage() {
  return (
    <RegionShell
      title="Isla del Aprendizaje"
      emoji="🏝️"
      intro="Elige una isla del archipiélago para jugar"
      modules={ISLA_MODULES}
    />
  );
}
