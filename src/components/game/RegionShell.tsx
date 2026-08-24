import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Star } from "lucide-react";
import { useGame, type StationId } from "@/lib/game-store";

export type ModuleCard = {
  id: StationId | string;
  to: string;
  emoji: string;
  title: string;
  subtitle: string;
  color?: string;
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

export interface RegionShellProps {
  title?: string;
  emoji?: string;
  intro?: string;
  modules?: ModuleCard[];
}

export function RegionShell({
  title = "Isla del Aprendizaje",
  emoji = "🏝️",
  intro = "Elige una isla para jugar",
  modules,
}: RegionShellProps) {
  const game = useGame();
  const list = modules || ISLA_MODULES;

  return (
    <div className="min-h-screen pb-16 bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            to="/"
            aria-label="Volver al mapa"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground toy-press"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="min-w-0 flex-1 truncate font-display text-xl flex items-center">
            <span className="mr-1">{emoji}</span>
            <span className="truncate">{title}</span>
          </h1>
          {game && (
            <span className="flex shrink-0 items-center gap-1 rounded-2xl bg-sun px-3 py-2 font-display text-lg text-sun-foreground">
              <Star className="h-5 w-5 fill-current" />
              {game.stars}
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-6">
        <p className="text-center text-sm font-bold text-muted-foreground">{intro}</p>
        <ul className="mt-5 space-y-4">
          {list.map((module, index) => (
            <li
              key={module.id}
              className={index % 2 === 0 ? "pr-4 sm:pr-12" : "pl-4 sm:pl-12"}
            >
              <Link
                to={module.to as any}
                className={`flex items-center gap-4 rounded-4xl px-5 py-5 toy-press ${
                  module.color || "bg-card text-card-foreground border"
                }`}
              >
                <span className="text-4xl">{module.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl leading-tight">
                    {module.title}
                  </span>
                  <span className="block text-sm font-bold opacity-80">
                    {module.subtitle}
                  </span>
                </span>
                {game?.starsByStation?.[module.id as StationId] !== undefined && (
                  <span className="flex items-center gap-1 rounded-full bg-card/40 px-2 py-1 text-sm font-bold">
                    <Star className="h-4 w-4 fill-current" />
                    {game.starsByStation[module.id as StationId]}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
export default RegionShell;
