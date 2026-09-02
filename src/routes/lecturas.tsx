import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Volume2, BookOpen, MoveHorizontal, RotateCcw } from "lucide-react";
import { StationShell, Feedback } from "@/components/game/StationShell";
import { speak, gameActions, shuffle } from "@/lib/game-store";

export const Route = createFileRoute("/lecturas")({
  head: () => ({
    meta: [
      { title: "Lecturas interactivas — Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Cuentos cortos con letra grande y espaciada, lectura en voz alta y juegos de arrastrar palabras para ordenar oraciones.",
      },
      { property: "og:title", content: "Lecturas interactivas" },
      { property: "og:description", content: "Lee, escucha y arrastra palabras para aprender a leer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LecturasPage,
});

type Story = {
  title: string;
  emoji: string;
  pages: string[]; // una oración por página
};

const STORIES: Story[] = [
  {
    title: "El sol y la luna",
    emoji: "🌞",
    pages: [
      "El sol sale por la mañana.",
      "La luna brilla en la noche.",
      "Las estrellas son pequeñas luces.",
      "El cielo es azul y bonito.",
    ],
  },
  {
    title: "Mi perrito Lolo",
    emoji: "🐶",
    pages: [
      "Lolo es un perro café.",
      "Lolo corre en el parque.",
      "Le gusta comer galletas.",
      "Por la noche duerme conmigo.",
    ],
  },
  {
    title: "La mariposa",
    emoji: "🦋",
    pages: [
      "La mariposa tiene alas de colores.",
      "Vuela de flor en flor.",
      "Las flores le dan dulce néctar.",
      "La mariposa es mi amiga.",
    ],
  },
];

// Oraciones para el juego de arrastrar y ordenar
const DRAG_SENTENCES = [
  "El gato bebe leche",
  "La niña lee un libro",
  "El pájaro canta bonito",
  "Mi mamá me abraza",
  "El pez nada en el mar",
  "La rana salta alto",
];

/* ================= Lector con palabras grandes ================= */

function StoryReader({ story, onDone }: { story: Story; onDone: () => void }) {
  const [page, setPage] = useState(0);
  const text = story.pages[page]!;
  const words = text.replace(/[.,!?]/g, "").split(" ");

  return (
    <div className="space-y-6">
      <div className="card-soft px-5 py-6 text-center">
        <div className="text-6xl">{story.emoji}</div>
        <h2 className="mt-2 font-display text-2xl">{story.title}</h2>
        <p className="mt-1 text-sm font-bold text-muted-foreground">
          Página {page + 1} de {story.pages.length}
        </p>
      </div>

      <button
        type="button"
        onClick={() => speak(text)}
        className="toy-press mx-auto flex items-center gap-2 rounded-3xl bg-grass px-6 py-4 font-display text-2xl text-grass-foreground"
      >
        <Volume2 className="h-7 w-7" /> Escuchar la oración
      </button>

      {/* Texto con espaciado grande: cada palabra se puede tocar para escucharla */}
      <div className="card-soft px-6 py-8">
        <p
          className="text-center font-display text-3xl text-card-foreground"
          style={{ lineHeight: 2.4, letterSpacing: "0.08em", wordSpacing: "0.5em" }}
        >
          {words.map((w, i) => (
            <button
              key={i}
              type="button"
              onClick={() => speak(w)}
              className="toy-press mx-1 rounded-2xl bg-secondary/60 px-3 py-1 hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-primary"
              aria-label={`Escuchar la palabra ${w}`}
            >
              {w}
            </button>
          ))}
          <span className="mx-1">{text.trim().endsWith(".") ? "." : ""}</span>
        </p>
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => {
            const p = page - 1;
            setPage(p);
            speak(story.pages[p]!);
          }}
          className="toy-press rounded-3xl bg-card px-6 py-4 font-display text-xl text-card-foreground disabled:opacity-40"
        >
          ⬅️ Anterior
        </button>
        {page < story.pages.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              const p = page + 1;
              setPage(p);
              speak(story.pages[p]!);
            }}
            className="toy-press rounded-3xl bg-primary px-6 py-4 font-display text-xl text-primary-foreground"
          >
            Siguiente ➡️
          </button>
        ) : (
          <button
            type="button"
            onClick={onDone}
            className="toy-press rounded-3xl bg-sun px-6 py-4 font-display text-xl text-sun-foreground"
          >
            ¡Terminé! ⭐
          </button>
        )}
      </div>
    </div>
  );
}

/* ============ Juego: arrastrar palabras para ordenar ============ */

function DragSentenceGame() {
  const [idx, setIdx] = useState(0);
  const sentence = DRAG_SENTENCES[idx % DRAG_SENTENCES.length]!;
  const correct = useMemo(() => sentence.split(" "), [sentence]);
  const [pool, setPool] = useState<string[]>(() => shuffle(sentence.split(" ")));
  const [placed, setPlaced] = useState<(string | null)[]>(() => sentence.split(" ").map(() => null));
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const [dragWord, setDragWord] = useState<string | null>(null);
  const dragRef = useRef<string | null>(null);

  const reset = (nextIdx?: number) => {
    const s = DRAG_SENTENCES[(nextIdx ?? idx) % DRAG_SENTENCES.length]!;
    setPool(shuffle(s.split(" ")));
    setPlaced(s.split(" ").map(() => null));
    setStatus("idle");
    setDragWord(null);
    if (nextIdx !== undefined) setIdx(nextIdx);
  };

  const placeWord = (word: string, slot: number) => {
    if (status === "good") return;
    setPlaced((prev) => {
      if (prev[slot] !== null) return prev;
      const next = [...prev];
      next[slot] = word;
      // quitar del pool
      setPool((p) => {
        const i = p.indexOf(word);
        return [...p.slice(0, i), ...p.slice(i + 1)];
      });
      // ¿terminó?
      if (next.every((w) => w !== null)) {
        const ok = next.join(" ") === correct.join(" ");
        setStatus(ok ? "good" : "bad");
        if (ok) gameActions.award("lecturas", 1);
        else {
          // devuelve las palabras después de un momento
          setTimeout(() => reset(), 1400);
        }
      }
      return next;
    });
    setDragWord(null);
  };

  return (
    <div className="space-y-6">
      <div className="card-soft px-5 py-4 text-center">
        <p className="font-display text-2xl">
          <MoveHorizontal className="mr-2 inline h-6 w-6" />
          Arrastra las palabras en orden
        </p>
        <button
          type="button"
          onClick={() => speak(sentence)}
          className="toy-press mt-3 inline-flex items-center gap-2 rounded-3xl bg-grass px-5 py-3 font-display text-xl text-grass-foreground"
        >
          <Volume2 className="h-6 w-6" /> Escuchar
        </button>
      </div>

      {/* Casillas donde soltar */}
      <div className="flex flex-wrap justify-center gap-3">
        {placed.map((w, i) => (
          <div
            key={i}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const word = e.dataTransfer.getData("text/plain") || dragRef.current;
              if (word) placeWord(word, i);
            }}
            onClick={() => dragWord && placeWord(dragWord, i)}
            className={`grid min-h-20 min-w-28 place-items-center rounded-3xl border-4 border-dashed px-4 font-display text-2xl ${
              w
                ? "border-grass bg-grass/20 text-card-foreground"
                : "border-muted-foreground/40 bg-card text-muted-foreground"
            }`}
            aria-label={w ? `Palabra colocada: ${w}` : `Espacio vacío ${i + 1}`}
          >
            {w ?? "❔"}
          </div>
        ))}
      </div>

      {/* Palabras para arrastrar */}
      <div className="flex flex-wrap justify-center gap-3">
        {pool.map((w, i) => (
          <button
            key={`${w}-${i}`}
            type="button"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", w);
              dragRef.current = w;
            }}
            onClick={() => setDragWord(dragWord === w ? null : w)}
            className={`toy-press cursor-grab rounded-3xl px-6 py-4 font-display text-2xl ${
              dragWord === w
                ? "bg-sun text-sun-foreground ring-4 ring-primary"
                : "bg-primary text-primary-foreground"
            }`}
            aria-label={`Palabra ${w}`}
          >
            {w}
          </button>
        ))}
      </div>

      <p className="text-center text-sm font-bold text-muted-foreground">
        Arrastra cada palabra a una casilla… o toca la palabra y luego la casilla 👆
      </p>

      <Feedback status={status} />

      {status === "good" && (
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset(idx + 1)}
            className="toy-press rounded-3xl bg-grass px-6 py-4 font-display text-2xl text-grass-foreground"
          >
            Otra oración ➡️
          </button>
        </div>
      )}
      {status === "idle" && pool.length > 0 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="toy-press inline-flex items-center gap-2 rounded-3xl bg-card px-5 py-3 font-display text-lg text-card-foreground"
          >
            <RotateCcw className="h-5 w-5" /> Reiniciar
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= Página principal ================= */

function LecturasPage() {
  const [mode, setMode] = useState<"menu" | "read" | "drag">("menu");
  const [storyIdx, setStoryIdx] = useState(0);

  return (
    <StationShell title="Lecturas interactivas" emoji="📖">
      {mode === "menu" && (
        <div className="space-y-6">
          <div className="card-soft px-5 py-5 text-center font-display text-2xl">
            Elige un cuento para leer 📚 o juega a ordenar palabras 🧩
          </div>

          <div className="grid gap-4">
            {STORIES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => {
                  setStoryIdx(i);
                  setMode("read");
                }}
                className="toy-press card-soft flex items-center gap-4 px-5 py-5 text-left"
              >
                <span className="text-5xl">{s.emoji}</span>
                <span>
                  <span className="block font-display text-2xl">{s.title}</span>
                  <span className="text-sm font-bold text-muted-foreground">
                    {s.pages.length} páginas · letra grande · con voz
                  </span>
                </span>
                <BookOpen className="ml-auto h-7 w-7 text-primary" />
              </button>
            ))}

            <button
              type="button"
              onClick={() => setMode("drag")}
              className="toy-press card-soft flex items-center gap-4 px-5 py-5 text-left"
            >
              <span className="text-5xl">🧩</span>
              <span>
                <span className="block font-display text-2xl">Arrastra y ordena</span>
                <span className="text-sm font-bold text-muted-foreground">
                  Forma oraciones arrastrando las palabras
                </span>
              </span>
              <MoveHorizontal className="ml-auto h-7 w-7 text-primary" />
            </button>
          </div>
        </div>
      )}

      {mode === "read" && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setMode("menu")}
            className="toy-press rounded-3xl bg-card px-5 py-3 font-display text-lg text-card-foreground"
          >
            ⬅️ Elegir otro cuento
          </button>
          <StoryReader
            story={STORIES[storyIdx]!}
            onDone={() => {
              gameActions.award("lecturas", 2);
              speak("¡Muy bien! Terminaste el cuento");
              setMode("menu");
            }}
          />
        </div>
      )}

      {mode === "drag" && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setMode("menu")}
            className="toy-press rounded-3xl bg-card px-5 py-3 font-display text-lg text-card-foreground"
          >
            ⬅️ Volver
          </button>
          <DragSentenceGame />
        </div>
      )}
    </StationShell>
  );
}
