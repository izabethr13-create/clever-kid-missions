import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Avatar } from "@/components/game/Avatar";
import { DAILY_GOAL, useGame, gameActions } from "@/lib/game-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Isla del Aprendizaje — Matemáticas, Español, Ciencia e Inglés" },
      {
        name: "description",
        content:
          "Aventura educativa para niños de 6 años con misiones diarias, estrellas y premios. Matemáticas, lenguaje, lectura, ciencia y English.",
      },
      { property: "og:title", content: "Isla del Aprendizaje — Juego de misiones" },
      {
        property: "og:description",
        content: "Cinco islas de juegos con voz, música y actividades adaptadas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  stations: string[];
}[] = [
  {
    to: "/matematicas",
    emoji: "🏝️",
    title: "Isla de las Matemáticas",
    subtitle: "Números 1-100, romanos, mayas, reloj y moneda",
    color: "bg-sky text-sky-foreground",
    stations: [
      "camino",
      "cueva",
      "pizzeria",
      "torre",
      "cocodrilo",
      "numeros100",
      "romanos",
      "mayas",
      "calendario",
      "moneda",
    ],
  },
  {
    to: "/lenguaje",
    emoji: "🌳",
    title: "Bosque del Lenguaje",
    subtitle: "Trazos, consonantes, inversas, güe/güi y oraciones",
    color: "bg-grass text-grass-foreground",
    stations: ["trazos", "consonantes", "inversas", "oraciones"],
  },
  {
    to: "/lectura",
    emoji: "📖",
    title: "Isla de la Lectura",
    subtitle: "Evaluaciones cortas y técnicas de comprensión",
    color: "bg-berry text-berry-foreground",
    stations: ["evaluacion", "tecnicas"],
  },
  {
    to: "/ciencia",
    emoji: "🔬",
    title: "Isla de la Ciencia y Ciudadanía",
    subtitle: "Huerto, energía, animales, universo y Guatemala",
    color: "bg-primary text-primary-foreground",
    stations: ["huerto", "energia", "reserva", "universo", "guatemala"],
  },
  {
    to: "/english",
    emoji: "🦁",
    title: "Phonics Safari (English)",
    subtitle: "Zoo, places, phonics, CVC, vowels y Spelling Bee",
    color: "bg-sun text-sun-foreground",
    stations: [
      "phonics",
      "vowels",
      "cvc",
      "vocabulario",
      "zoo",
      "places",
      "spelling",
      "restaurant",
      "commands",
    ],
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

      <h1 className="mt-6 text-center font-display text-3xl tracking-wide">
        Isla del Aprendizaje
      </h1>
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
                  <span className="text-5xl">{r.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-2xl leading-tight tracking-wide">
                      {r.title}
                    </span>
                    <span className="block text-sm font-bold opacity-80">{r.subtitle}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 font-display text-xl">
                    <Star className="h-5 w-5 fill-current" />
                    {stars}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
