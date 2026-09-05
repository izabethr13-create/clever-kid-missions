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
    <div
      className="min-h-screen pb-20"
      style={{
        background:
          "radial-gradient(circle at 20% 10%, #7fd8f7 0%, #35b7e8 45%, #1d8fc9 100%)",
      }}
    >
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

      <h1
        className="mt-6 text-center font-display text-4xl tracking-wide text-white"
        style={{ textShadow: "0 4px 0 rgba(0,0,0,.25)" }}
      >
        Isla del Aprendizaje
      </h1>
      <p className="mt-1 text-center text-sm font-bold text-white/90">
        Camina por las islas y toca una piedra para jugar
      </p>

      <nav className="relative mx-auto mt-8 max-w-md px-4">
        <ul className="relative space-y-2">
          {REGIONS.map((r, i) => {
            const stars = r.stations.reduce((n, s) => n + (game.starsByStation[s] || 0), 0);
            const left = i % 2 === 0;
            return (
              <li key={r.to} className="relative">
                {/* isla verde */}
                <div
                  className={`relative flex ${left ? "justify-start" : "justify-end"}`}
                  style={{ marginTop: i === 0 ? 0 : "-0.5rem" }}
                >
                  <div
                    className="relative w-[88%] px-3 py-5"
                    style={{
                      background: "linear-gradient(180deg,#8ede4a 0%,#63c62f 60%,#3f9c1f 100%)",
                      borderRadius: "48% 52% 46% 54% / 60% 55% 45% 40%",
                      boxShadow: "0 14px 0 rgba(0,0,0,.18), inset 0 -10px 0 rgba(0,0,0,.08)",
                    }}
                  >
                    <span
                      className={`pointer-events-none absolute -top-3 text-4xl ${
                        left ? "right-4" : "left-4"
                      }`}
                    >
                      🌴
                    </span>
                    <Link
                      to={r.to}
                      className="toy-press mx-auto flex w-full max-w-[19rem] items-center gap-3 rounded-[2rem] px-4 py-4"
                      style={{
                        background: "linear-gradient(180deg,#f3efe4 0%,#ded7c4 100%)",
                        boxShadow: "0 8px 0 rgba(120,110,90,.55)",
                      }}
                    >
                      <span
                        className="grid h-14 w-14 shrink-0 place-items-center rounded-full font-display text-3xl text-white"
                        style={{
                          background: "linear-gradient(180deg,#7ec8f2,#3aa0dd)",
                          boxShadow: "inset 0 -4px 0 rgba(0,0,0,.15)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block font-display text-xl leading-tight text-[#4a3f2a]">
                          {r.emoji} {r.title}
                        </span>
                        <span className="block text-xs font-bold text-[#6b5f45]">{r.subtitle}</span>
                        <span className="mt-1 flex items-center gap-1 text-[#a8791f]">
                          {[0, 1, 2].map((s) => (
                            <Star
                              key={s}
                              className={`h-4 w-4 ${
                                stars > s * 15 ? "fill-current" : "opacity-30"
                              }`}
                            />
                          ))}
                          <span className="ml-1 font-display text-sm">{stars}</span>
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Link
            to="/progreso"
            className="toy-press rounded-3xl bg-card px-4 py-4 text-center font-display text-lg text-card-foreground"
          >
            📊 Mi progreso
          </Link>
          <Link
            to="/premios"
            className="toy-press rounded-3xl bg-sun px-4 py-4 text-center font-display text-lg text-sun-foreground"
          >
            🎁 Mis premios
          </Link>
        </div>
      </nav>
    </div>
  );
}

