import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Avatar } from "@/components/game/Avatar";
import { DAILY_GOAL, useGame, gameActions, type StationId } from "@/lib/game-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Isla del Aprendizaje — Matemáticas, Español e Inglés para niños" },
      {
        name: "description",
        content:
          "Aventura educativa para niños con misiones diarias, estrellas y premios.",
      },
      { property: "og:title", content: "Isla del Aprendizaje — Juego de misiones" },
    ],
  }),
  component: MapPage,
});

const REGIONS: {
  to: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  stations: StationId[];
}[] = [
  {
    to: "/trazado",
    emoji: "✍️",
    title: "Trazado de Letras",
    subtitle: "Práctica de trazo digital e interactivo",
    color: "bg-amber-400 text-amber-950",
    stations: ["trazado" as StationId],
  },
  {
    to: "/comunicacion_lenguaje",
    emoji: "🗣️",
    title: "Comunicación y Lenguaje",
    subtitle: "Consonantes, diéresis y oraciones",
    color: "bg-grass text-grass-foreground",
    stations: ["comunicacion_lenguaje" as StationId],
  },
  {
    to: "/lectura",
    emoji: "📖",
    title: "Comprensión Lectora",
    subtitle: "Lectura rápida y cuentos cortos",
    color: "bg-teal-400 text-teal-950",
    stations: ["lectura" as StationId],
  },
  {
    to: "/matematicas_espanol",
    emoji: "🔢",
    title: "Matemáticas (Español)",
    subtitle: "Números romanos, mayas y sumas",
    color: "bg-sky text-sky-foreground",
    stations: ["matemáticas_espanol" as StationId],
  },
  {
    to: "/ciencia_ciudadania",
    emoji: "🌱",
    title: "Ciencia y Ciudadanía",
    subtitle: "Cuerpos celestes y civismo",
    color: "bg-primary text-primary-foreground",
    stations: ["ciencia_ciudadania" as StationId],
  },
  {
    to: "/conversation",
    emoji: "💬",
    title: "English Conversation",
    subtitle: "Animals, zoo routines and travel",
    color: "bg-blue-400 text-blue-950",
    stations: ["conversation" as StationId],
  },
  {
    to: "/grammar",
    emoji: "📝",
    title: "English Grammar",
    subtitle: "Zookeeper routines and descriptions",
    color: "bg-indigo-400 text-indigo-950",
    stations: ["grammar" as StationId],
  },
  {
    to: "/phonics",
    emoji: "🔊",
    title: "Phonics & Vowels",
    subtitle: "Long and short vowel sounds",
    color: "bg-berry text-berry-foreground",
    stations: ["phonics" as StationId],
  },
  {
    to: "/numbers",
    emoji: "⏰",
    title: "Numbers & Time",
    subtitle: "Clocks and sequence counting",
    color: "bg-purple-400 text-purple-950",
    stations: ["numbers" as StationId],
  },
  {
    to: "/science",
    emoji: "🔬",
    title: "Science in English",
    subtitle: "Caterpillar metamorphosis and nature",
    color: "bg-rose-400 text-rose-950",
    stations: ["science" as StationId],
  },
  {
    to: "/vocabulary",
    emoji: "🎨",
    title: "Vocabulary Building",
    subtitle: "Animals, places and object names",
    color: "bg-pink-400 text-pink-950",
    stations: ["vocabulary" as StationId],
  },
  {
    to: "/math",
    emoji: "➕",
    title: "Math (English)",
    subtitle: "Tens, ones and basic math",
    color: "bg-cyan-400 text-cyan-950",
    stations: ["math" as StationId],
  },
  {
    to: "/pre_reading",
    emoji: "🔤",
    title: "Pre-Reading CVC",
    subtitle: "Short CVC word lists and phonics",
    color: "bg-fuchsia-400 text-fuchsia-950",
    stations: ["pre_reading" as StationId],
  },
  {
    to: "/spelling",
    emoji: "🐝",
    title: "Spelling Bee",
    subtitle: "Interactive spelling practice",
    color: "bg-orange-400 text-orange-950",
    stations: ["spelling" as StationId],
  },
];

function MapPage() {
  const game = useGame();
  const pct = Math.round((game.missionsToday / DAILY_GOAL) * 100);

  return (
    <div className="min-h-screen pb-16">
      <header className="mx-auto max-w-3xl px-4 pt-6">
        <div className="card-soft flex items-center gap-4 px-5 py-4">
          <div className="animate-float-soft">
            <Avatar size={72} />
          </div>
          <div className="min-w-0 flex-1">
            <input
              value={game.name}
              onChange={(e) => gameActions.setName(e.target.value)}
              placeholder="Escribe tu nombre"
              aria-label="Tu nombre"
              className="w-full rounded-xl bg-muted px-3 py-1 font-display text-lg outline-none focus:ring-4 focus:ring-ring"
            />
            <div className="mt-2 flex items-center gap-2">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-grass transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-muted-foreground">
                {game.missionsToday} de {DAILY_GOAL} hoy
              </span>
            </div>
          </div>
          <Link
            to="/premios"
            className="flex shrink-0 flex-col items-center rounded-2xl bg-sun px-3 py-2 font-display text-lg text-sun-foreground toy-press"
          >
            <Star className="h-5 w-5 fill-current" />
            {game.stars}
          </Link>
        </div>
      </header>

      <h1 className="mt-6 text-center font-display text-3xl">Isla del Aprendizaje</h1>
      <p className="mt-1 text-center text-sm font-bold text-muted-foreground">
        Elige una isla del archipiélago para jugar
      </p>

      <nav className="relative mx-auto mt-6 max-w-xl px-4">
        <div className="absolute inset-y-6 left-1/2 w-3 -translate-x-1/2 rounded-full bg-card/70" />
        <ul className="relative space-y-5">
          {REGIONS.map((r, i) => {
            const stars = r.stations.reduce((n, s) => n + (game.starsByStation[s] || 0), 0);
            return (
              <li key={r.to} className={i % 2 === 0 ? "pr-6 sm:pr-16" : "pl-6 sm:pl-16"}>
                <Link
                  to={r.to}
                  className={`flex items-center gap-4 rounded-4xl px-5 py-6 toy-press ${r.color}`}
                >
                  <span className="text-4xl">{r.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl leading-tight">{r.title}</span>
                    <span className="block text-sm font-bold opacity-80">{r.subtitle}</span>
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-card/40 px-2 py-1 text-sm font-bold">
                    <Star className="h-4 w-4 fill-current" />
                    {stars}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mx-auto mt-8 max-w-xl space-y-3 px-4">
        <Link
          to="/premios"
          className="block rounded-4xl bg-card px-5 py-4 text-center font-display text-xl toy-press"
        >
          🎁 Mis premios y mi avatar
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => gameActions.toggleMusic()}
            aria-pressed={game.music}
            className={`rounded-4xl px-4 py-4 font-display text-lg toy-press ${
              game.music ? "bg-grass text-grass-foreground" : "bg-card text-card-foreground"
            }`}
          >
            {game.music ? "🎵 Música: sí" : "🔇 Música: no"}
          </button>
          <button
            type="button"
            onClick={() => gameActions.toggleVoice()}
            aria-pressed={game.voice}
            className={`rounded-4xl px-4 py-4 font-display text-lg toy-press ${
              game.voice ? "bg-sky text-sky-foreground" : "bg-card text-card-foreground"
            }`}
          >
            {game.voice ? "🗣️ Voz: sí" : "🤫 Voz: no"}
          </button>
        </div>
      </div>
    </div>
  );
}
