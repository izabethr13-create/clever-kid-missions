import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Cloud, Check } from "lucide-react";
import { StationShell } from "@/components/game/StationShell";
import { Confetti } from "@/components/game/Confetti";
import {
  cloudLoad,
  cloudSave,
  gameActions,
  makeCloudCode,
  playSound,
  speak,
  useGame,
} from "@/lib/game-store";

export const Route = createFileRoute("/progreso")({
  head: () => ({
    meta: [
      { title: "Mi progreso — estrellas por isla | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Mira cuántas estrellas ganaste en cada isla, tu porcentaje completado y guarda tu avance en la nube con un código.",
      },
      { property: "og:title", content: "Mi progreso" },
      {
        property: "og:description",
        content: "Estrellas por isla, porcentaje completado y guardado en la nube.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgresoPage,
});

const ISLANDS: { id: string; name: string; emoji: string; color: string; goal: number; stations: string[] }[] = [
  {
    id: "mate",
    name: "Matemáticas",
    emoji: "🏝️",
    color: "bg-sky text-sky-foreground",
    goal: 100,
    stations: ["camino", "cueva", "pizzeria", "torre", "cocodrilo", "numeros100", "romanos", "mayas", "calendario", "moneda"],
  },
  {
    id: "leng",
    name: "Lenguaje",
    emoji: "🌳",
    color: "bg-grass text-grass-foreground",
    goal: 40,
    stations: ["trazos", "consonantes", "inversas", "oraciones"],
  },
  {
    id: "lect",
    name: "Lectura",
    emoji: "📖",
    color: "bg-berry text-berry-foreground",
    goal: 40,
    stations: ["evaluacion", "tecnicas", "lecturas"],
  },
  {
    id: "cien",
    name: "Ciencia",
    emoji: "🔬",
    color: "bg-primary text-primary-foreground",
    goal: 70,
    stations: ["huerto", "jardin", "cadena", "energia", "reserva", "universo", "guatemala"],
  },
  {
    id: "eng",
    name: "English",
    emoji: "🦁",
    color: "bg-sun text-sun-foreground",
    goal: 90,
    stations: ["phonics", "vowels", "cvc", "vocabulario", "zoo", "places", "spelling", "restaurant", "commands"],
  },
];

function ProgresoPage() {
  const game = useGame();
  const [party, setParty] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const rows = ISLANDS.map((i) => {
    const stars = i.stations.reduce((n, s) => n + (game.starsByStation[s] || 0), 0);
    const pct = Math.min(100, Math.round((stars / i.goal) * 100));
    return { ...i, stars, pct };
  });
  const total = rows.reduce((n, r) => n + r.stars, 0);
  const totalPct = Math.min(
    100,
    Math.round((total / ISLANDS.reduce((n, i) => n + i.goal, 0)) * 100),
  );

  useEffect(() => {
    setParty(true);
    playSound("win");
    const t = setTimeout(() => setParty(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const code = game.cloudCode;

  return (
    <StationShell title="Mi progreso" emoji="📊">
      {party && <Confetti />}

      <div className="card-soft px-6 py-6 text-center">
        <p className="font-display text-2xl">
          {game.name ? `¡Muy bien, ${game.name}!` : "¡Muy bien!"}
        </p>
        <p className="mt-2 font-display text-6xl text-primary">{total} ⭐</p>
        <p className="mt-1 text-lg font-bold text-muted-foreground">
          {totalPct}% del archipiélago completado
        </p>
        <button
          type="button"
          onClick={() => {
            playSound("win");
            setParty(true);
            speak(`Llevas ${total} estrellas. ${totalPct} por ciento completado.`);
            setTimeout(() => setParty(false), 2200);
          }}
          className="toy-press mt-4 rounded-3xl bg-grass px-6 py-3 font-display text-xl text-grass-foreground"
        >
          🔊 Escuchar mi progreso
        </button>
      </div>

      <ul className="mt-6 space-y-4">
        {rows.map((r) => (
          <li key={r.id} className="card-soft px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{r.emoji}</span>
              <span className="flex-1 font-display text-2xl">{r.name}</span>
              <span className="flex items-center gap-1 font-display text-xl">
                <Star className="h-5 w-5 fill-current text-sun" />
                {r.stars}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${r.color}`}
                  style={{ width: `${r.pct}%` }}
                />
              </div>
              <span className="w-14 text-right font-display text-lg">{r.pct}%</span>
            </div>
          </li>
        ))}
      </ul>

      {/* Guardado en la nube */}
      <section className="card-soft mt-8 px-5 py-5">
        <h2 className="flex items-center gap-2 font-display text-2xl">
          <Cloud className="h-7 w-7 text-primary" /> Guardar en la nube
        </h2>
        <p className="mt-2 text-base font-bold leading-relaxed text-muted-foreground">
          Con un código guardas tus estrellas, tu nivel de cada isla y la ropa de tu personaje.
          Escribe el mismo código en otro teléfono para recuperarlos.
        </p>

        {code ? (
          <div className="mt-4 space-y-3">
            <p className="text-center font-display text-4xl tracking-widest">{code}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  const ok = await cloudSave();
                  setBusy(false);
                  setMsg(ok ? "¡Guardado! ✅" : "No se pudo guardar 😕");
                  if (ok) playSound("good");
                }}
                className="toy-press rounded-3xl bg-primary px-6 py-4 font-display text-xl text-primary-foreground"
              >
                Guardar ahora
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  const ok = await cloudLoad(code);
                  setBusy(false);
                  setMsg(ok ? "¡Progreso recuperado! ✅" : "No encontramos ese código 😕");
                  if (ok) playSound("win");
                }}
                className="toy-press rounded-3xl bg-sun px-6 py-4 font-display text-xl text-sun-foreground"
              >
                Recuperar
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={() => {
                const c = makeCloudCode();
                gameActions.setCloudCode(c);
                void cloudSave();
                playSound("win");
                setMsg("Tu código es " + c);
              }}
              className="toy-press w-full rounded-3xl bg-primary px-6 py-4 font-display text-2xl text-primary-foreground"
            >
              Crear mi código ✨
            </button>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-bold text-muted-foreground" htmlFor="codigo">
            ¿Ya tienes un código? Escríbelo aquí
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="codigo"
              defaultValue=""
              placeholder="ABC123"
              className="w-full rounded-2xl bg-muted px-4 py-3 font-display text-2xl uppercase tracking-widest outline-none focus:ring-4 focus:ring-ring"
              onChange={(e) => (e.currentTarget.value = e.currentTarget.value.toUpperCase())}
            />
            <button
              type="button"
              onClick={async (e) => {
                const input = (e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement | null);
                const v = input?.value ?? "";
                if (!v) return;
                setBusy(true);
                const ok = await cloudLoad(v);
                setBusy(false);
                setMsg(ok ? "¡Progreso recuperado! ✅" : "No encontramos ese código 😕");
                if (ok) playSound("win");
              }}
              className="toy-press shrink-0 rounded-2xl bg-grass px-5 py-3 font-display text-xl text-grass-foreground"
            >
              <Check className="h-6 w-6" />
            </button>
          </div>
        </div>

        {msg && <p className="mt-3 text-center font-display text-xl">{msg}</p>}
      </section>

      <div className="mt-8 text-center">
        <Link
          to="/premios"
          className="toy-press inline-block rounded-3xl bg-berry px-6 py-4 font-display text-2xl text-berry-foreground"
        >
          🎁 Ir a mis premios
        </Link>
      </div>
    </StationShell>
  );
}
