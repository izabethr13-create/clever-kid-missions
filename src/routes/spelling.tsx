import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, sayResult, shuffle, speak } from "@/lib/game-store";
import { Confetti } from "@/components/game/Confetti";

export const Route = createFileRoute("/spelling")({
  head: () => ({
    meta: [
      { title: "Spelling Bee for kids: listen and spell | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Spelling Bee game for young learners: listen to the word, tap the letters in order and spell it correctly.",
      },
      { property: "og:title", content: "Spelling Bee" },
      { property: "og:description", content: "Listen and spell words letter by letter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpellingPage,
});

const WORDS = [
  { word: "cat", emoji: "🐱" },
  { word: "dog", emoji: "🐶" },
  { word: "sun", emoji: "☀️" },
  { word: "hat", emoji: "🎩" },
  { word: "bed", emoji: "🛏️" },
  { word: "pig", emoji: "🐷" },
  { word: "cup", emoji: "🥤" },
  { word: "fish", emoji: "🐟" },
  { word: "cake", emoji: "🎂" },
  { word: "boat", emoji: "⛵" },
  { word: "tree", emoji: "🌳" },
  { word: "star", emoji: "⭐" },
  { word: "milk", emoji: "🥛" },
  { word: "book", emoji: "📖" },
  { word: "frog", emoji: "🐸" },
];

function SpellingPage() {
  const list = useMemo(() => shuffle(WORDS), []);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [good, setGood] = useState(false);

  const current = list[idx % list.length]!;
  const letters = useMemo(
    () => shuffle(current.word.split("")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current.word],
  );

  const reset = () => setTyped([]);

  const tap = (letter: string, i: number) => {
    const next = [...typed, letter];
    const target = current.word.slice(0, next.length);
    if (next.join("") !== target) {
      playSound("bad");
      sayResult(false);
      setTyped([]);
      return;
    }
    void i;
    setTyped(next);
    if (next.length === current.word.length) {
      playSound("good");
      sayResult(true);
      gameActions.award("spelling", 1);
      setGood(true);
      window.setTimeout(() => {
        setGood(false);
        setTyped([]);
        setIdx((v) => v + 1);
      }, 1400);
    }
  };

  return (
    <StationShell title="Spelling Bee" emoji="🐝">
      {good && <Confetti />}
      <div className="card-soft mb-5 px-5 py-6 text-center">
        <div className="text-7xl">{current.emoji}</div>
        <button
          onClick={() => speak(current.word, "en-US")}
          className="mt-4 rounded-2xl bg-sky px-6 py-3 font-display text-2xl text-sky-foreground toy-press"
        >
          🔊 Listen
        </button>
        <p className="mt-3 font-display text-lg text-muted-foreground">
          Listen and tap the letters in order
        </p>
      </div>

      <div className="mb-5 flex justify-center gap-2">
        {current.word.split("").map((_, i) => (
          <span
            key={i}
            className="grid h-16 w-14 place-items-center rounded-2xl bg-card font-display text-3xl uppercase tracking-widest toy-shadow"
          >
            {typed[i] ?? ""}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {letters.map((l, i) => (
          <button
            key={`${l}-${i}`}
            onClick={() => tap(l, i)}
            className="rounded-3xl bg-sun px-4 py-6 font-display text-4xl uppercase text-sun-foreground toy-press"
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-2xl bg-secondary px-5 py-3 font-display text-xl text-secondary-foreground toy-press"
        >
          ↺ Try again
        </button>
        <button
          onClick={() => {
            setTyped([]);
            setIdx((v) => v + 1);
          }}
          className="rounded-2xl bg-muted px-5 py-3 font-display text-xl toy-press"
        >
          ➡️ Next word
        </button>
      </div>
    </StationShell>
  );
}
