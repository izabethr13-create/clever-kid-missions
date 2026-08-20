import React from "react";

export type ModuleCard = {
  id: string;
  to: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
};

export const ISLA_MODULES: ModuleCard[] = [
  {
    id: "cruzada",
    to: "/game/cruzada",
    emoji: "✍️",
    title: "Trazada de letras",
    subtitle: "Práctica de trazo digital e interactivo",
    color: "bg-amber-400 text-amber-950",
  },
  {
    id: "comunicacion_lenguaje",
    to: "/game/comunicacion_lenguaje",
    emoji: "🗣️",
    title: "Comunicación y lenguaje",
    subtitle: "Consonantes, diéresis y oraciones",
    color: "bg-emerald-400 text-emerald-950",
  },
  {
    id: "lectura",
    to: "/game/lectura",
    emoji: "📖",
    title: "Comprensión Lectora",
    subtitle: "Lectura rápida y cuentos cortos",
    color: "bg-teal-400 text-teal-950",
  },
  {
    id: "matematicas_espanol",
    to: "/game/matematicas_espanol",
    emoji: "🔢",
    title: "Matemáticas (Español)",
    subtitle: "Números romanos, mayas y sumas",
    color: "bg-sky-400 text-sky-950",
  },
  {
    id: "ciencia_ciudadania",
    to: "/game/ciencia_ciudadania",
    emoji: "🌱",
    title: "Ciencia y Ciudadanía",
    subtitle: "Cuerpos celestes y civismo",
    color: "bg-green-500 text-white",
  },
  {
    id: "conversation",
    to: "/game/conversation",
    emoji: "💬",
    title: "English Conversation",
    subtitle: "Animals, zoo routines and travel",
    color: "bg-blue-400 text-blue-950",
  },
  {
    id: "grammar",
    to: "/game/grammar",
    emoji: "📝",
    title: "English Grammar",
    subtitle: "Zookeeper routines and descriptions",
    color: "bg-indigo-400 text-indigo-950",
  },
  {
    id: "phonics",
    to: "/game/phonics",
    emoji: "🔤",
    title: "Phonics & Vowels",
    subtitle: "Long and short vowel sounds",
    color: "bg-purple-400 text-purple-950",
  },
  {
    id: "numbers",
    to: "/game/numbers",
    emoji: "⏰",
    title: "Numbers & Time",
    subtitle: "Clocks and sequence counting",
    color: "bg-violet-400 text-violet-950",
  },
  {
    id: "science",
    to: "/game/science",
    emoji: "🔬",
    title: "Science in English",
    subtitle: "Caterpillar metamorphosis and nature",
    color: "bg-rose-400 text-rose-950",
  },
  {
    id: "vocabulary",
    to: "/game/vocabulary",
    emoji: "🎨",
    title: "Vocabulary Building",
    subtitle: "Animals, places and object names",
    color: "bg-pink-400 text-pink-950",
  },
  {
    id: "math",
    to: "/game/math",
    emoji: "➕",
    title: "Math (English)",
    subtitle: "Time, money and basic math",
    color: "bg-cyan-400 text-cyan-950",
  },
  {
    id: "pre_reading",
    to: "/game/pre_reading",
    emoji: "📚",
    title: "Pre-Reading CVC",
    subtitle: "Short CVC word lists and phonics",
    color: "bg-fuchsia-400 text-fuchsia-950",
  },
  {
    id: "spelling",
    to: "/game/spelling",
    emoji: "🐝",
    title: "Spelling Bee",
    subtitle: "Interactive spelling practice",
    color: "bg-orange-400 text-orange-950",
  },
];

export function RegionShell({ title, emoji, intro, modules }: { title?: string; emoji?: string; intro?: string; modules?: ModuleCard[] }) {
  const list = modules || ISLA_MODULES;
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{emoji || "🏝️"} {title || "Isla del Aprendizaje"}</h1>
      <p className="text-gray-600 mb-6">{intro || "Elige una isla del archipiélago para jugar"}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((mod) => (
          <a key={mod.id} href={mod.to} className={`p-4 rounded-xl shadow transition hover:scale-105 ${mod.color}`}>
            <div className="text-2xl mb-1">{mod.emoji}</div>
            <div className="font-bold text-lg">{mod.title}</div>
            <div className="text-sm opacity-90">{mod.subtitle}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default RegionShell;
