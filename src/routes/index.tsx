import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Avatar } from "@/components/game/Avatar";
import { DAILY_GOAL, useGame, gameActions, type StationId } from "@/lib/game-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "El Mundo de los Números — Juego de misiones para niños" },
      {
        name: "description",
        content:
          "Aventura matemática para niñas y niños de 6 años: direccionalidad, números del 51 al 80, fracciones, el reloj, mayor y menor, y conjuntos.",
      },
      { property: "og:title", content: "El Mundo de los Números" },
      {
        property: "og:description",
        content: "Mapa de aventuras con 5 estaciones de matemáticas para primer grado.",
      },
    ],
  }),
  component: MapPage,
});

const STATIONS: {
  id: StationId;
  to: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
}[] = [
  {
    id: "camino",
    to: "/camino",
    emoji: "🧭",
    title: "Camino Fantasma",
    subtitle: "Direccionalidad",
    color: "bg-sky text-sky-foreground",
  },
  {
    id: "cueva",
    to: "/cueva",
    emoji: "🔢",
    title: "Cueva de los Números",
    subtitle: "51 al 80, decenas y sumas",
    color: "bg-primary text-primary-foreground",
  },
  {
    id: "pizzeria",
    to: "/pizzeria",
    emoji: "🍕",
    title: "La Pizzería",
    subtitle: "Fracciones",
    color: "bg-sun text-sun-foreground",
  },
  {
    id: "torre",
    to: "/torre",
    emoji: "⏰",
    title: "La Torre del Tiempo",
    subtitle: "El reloj y el día",
    color: "bg-grass text-grass-foreground",
  },
  {
    id: "cocodrilo",
    to: "/cocodrilo",
    emoji: "🐊",
    title: "El Cocodrilo Hambriento",
    subtitle: "Mayor, menor y conjuntos",
    color: "bg-berry text-berry-foreground",
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

      <h1 className="mt-6 text-center font-display text-3xl">El Mundo de los Números</h1>
      <p className="mt-1 text-center text-sm font-bold text-muted-foreground">
        Toca una estación para jugar
      </p>

      <nav className="relative mx-auto mt-6 max-w-xl px-4">
        <div className="absolute inset-y-6 left-1/2 w-3 -translate-x-1/2 rounded-full bg-card/70" />
        <ul className="relative space-y-5">
          {STATIONS.map((s, i) => (
            <li key={s.id} className={i % 2 === 0 ? "pr-6 sm:pr-16" : "pl-6 sm:pl-16"}>
              <Link
                to={s.to}
                className={`flex items-center gap-4 rounded-4xl px-5 py-5 toy-press ${s.color}`}
              >
                <span className="text-4xl">{s.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl leading-tight">{s.title}</span>
                  <span className="block text-sm font-bold opacity-80">{s.subtitle}</span>
                </span>
                <span className="flex items-center gap-1 rounded-full bg-card/40 px-2 py-1 text-sm font-bold">
                  <Star className="h-4 w-4 fill-current" />
                  {game.starsByStation[s.id]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto mt-8 max-w-xl px-4">
        <Link
          to="/premios"
          className="block rounded-4xl bg-card px-5 py-4 text-center font-display text-xl toy-press"
        >
          🎁 Mis premios y mi avatar
        </Link>
      </div>
    </div>
  );
}
