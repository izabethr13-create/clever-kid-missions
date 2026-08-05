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
          "Aventura educativa para niñas y niños de 6 años: Isla de las Matemáticas, Bosque del Lenguaje y Phonics Safari con misiones diarias, estrellas y premios.",
      },
      { property: "og:title", content: "Isla del Aprendizaje — Juego de misiones para niños" },
      {
        property: "og:description",
        content:
          "Tres regiones de juego: matemáticas, español e inglés, con avatar, estrellas y premios.",
      },
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
    to: "/matematicas",
    emoji: "🏝️",
    title: "Isla de las Matemáticas",
    subtitle: "Números, fracciones, reloj y conjuntos",
    color: "bg-sky text-sky-foreground",
    stations: ["camino", "cueva", "pizzeria", "torre", "cocodrilo"],
  },
  {
    to: "/lenguaje",
    emoji: "🌳",
    title: "Isla del Lenguaje",
    subtitle: "Trazos, consonantes y oraciones",
    color: "bg-grass text-grass-foreground",
    stations: ["trazos", "consonantes", "oraciones"],
  },
  {
    to: "/ciencia",
    emoji: "🌱",
    title: "Isla de la Ciencia",
    subtitle: "Huerto, energía, naturaleza y animales",
    color: "bg-primary text-primary-foreground",
    stations: ["huerto", "energia", "reserva"],
  },
  {
    to: "/english",
    emoji: "🦁",
    title: "Isla Language Arts",
    subtitle: "Phonics, restaurant, spelling & science",
    color: "bg-berry text-berry-foreground",
    stations: ["phonics", "vocabulario", "restaurant", "commands"],
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
            const stars = r.stations.reduce((n, s) => n + game.starsByStation[s], 0);
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
