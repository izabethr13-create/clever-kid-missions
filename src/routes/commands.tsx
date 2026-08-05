import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, randomInt, shuffle, speak } from "@/lib/game-store";

export const Route = createFileRoute("/commands")({
  head: () => ({
    meta: [
      { title: "Science & Commands in English | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Observe patterns in nature and listen and follow simple English commands like clap your hands, jump and touch your nose.",
      },
      { property: "og:title", content: "Science & Commands in English" },
      {
        property: "og:description",
        content: "Observing nature patterns and following commands in English.",
      },
    ],
  }),
  component: CommandsPage,
});

type Mode = "menu" | "nature" | "commands";

const COMMANDS: { text: string; emoji: string }[] = [
  { text: "Clap your hands", emoji: "👏" },
  { text: "Jump", emoji: "🦘" },
  { text: "Touch your nose", emoji: "👃" },
  { text: "Sit down", emoji: "🪑" },
  { text: "Stand up", emoji: "🧍" },
  { text: "Open your book", emoji: "📖" },
  { text: "Close your eyes", emoji: "🙈" },
  { text: "Raise your hand", emoji: "✋" },
  { text: "Turn around", emoji: "🔄" },
  { text: "Be quiet", emoji: "🤫" },
];

const PATTERNS: { q: string; visual: string[]; options: string[]; correct: string }[] = [
  {
    q: "The peacock feathers repeat a pattern. What comes next?",
    visual: ["🪶", "🟢", "🪶", "🟢", "❓"],
    options: ["🪶", "🟢", "🌸"],
    correct: "🪶",
  },
  {
    q: "Look at the flower pattern. What comes next?",
    visual: ["🌸", "🌿", "🌸", "🌿", "❓"],
    options: ["🌸", "🌿", "🐝"],
    correct: "🌸",
  },
  {
    q: "Butterflies and leaves. What comes next?",
    visual: ["🦋", "🦋", "🍃", "🦋", "🦋", "❓"],
    options: ["🍃", "🦋", "🌞"],
    correct: "🍃",
  },
  {
    q: "Shells on the beach. What comes next?",
    visual: ["🐚", "⭐", "⭐", "🐚", "⭐", "❓"],
    options: ["⭐", "🐚", "🐠"],
    correct: "⭐",
  },
];

function CommandsPage() {
  const [mode, setMode] = useState<Mode>("menu");
  return (
    <StationShell title="Science & Commands" emoji="🔬">
      {mode === "menu" ? (
        <ul className="space-y-3">
          <li>
            <BigButton tone="card" className="w-full text-left" onClick={() => setMode("nature")}>
              <span className="mr-3">🦚</span>Observing nature · patterns
            </BigButton>
          </li>
          <li>
            <BigButton tone="card" className="w-full text-left" onClick={() => setMode("commands")}>
              <span className="mr-3">🎧</span>Listen and follow commands
            </BigButton>
          </li>
        </ul>
      ) : (
        <div>
          <button
            onClick={() => setMode("menu")}
            className="mb-4 rounded-2xl bg-secondary px-4 py-2 font-display text-lg text-secondary-foreground toy-press"
          >
            ← Other games
          </button>
          {mode === "nature" ? <Patterns /> : <Listen />}
        </div>
      )}
    </StationShell>
  );
}

function useRound<T>(make: () => T, stars: number) {
  const [item, setItem] = useState<T>(make);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  function resolve(ok: boolean) {
    if (ok) {
      setStatus("good");
      playSound("good");
      gameActions.award("commands", stars);
      setTimeout(() => {
        setStatus("idle");
        setItem(make());
      }, 1100);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }
  return { item, status, resolve };
}

function Patterns() {
  const { item, status, resolve } = useRound(() => {
    const p = PATTERNS[randomInt(0, PATTERNS.length - 1)]!;
    return { ...p, options: shuffle([...p.options]) };
  }, 3);

  return (
    <div>
      <Prompt>{item.q}</Prompt>
      <div className="card-soft flex flex-wrap items-center justify-center gap-2 px-4 py-10 text-5xl">
        {item.visual.map((v, i) => (
          <span key={i} className={v === "❓" ? "opacity-50" : ""}>
            {v}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {item.options.map((o) => (
          <BigButton key={o} tone="grass" onClick={() => resolve(o === item.correct)}>
            {o}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </div>
  );
}

function Listen() {
  const { item, status, resolve } = useRound(() => {
    const target = COMMANDS[randomInt(0, COMMANDS.length - 1)]!;
    const others = shuffle(COMMANDS.filter((c) => c.text !== target.text)).slice(0, 2);
    return { target, options: shuffle([target, ...others]) };
  }, 2);

  return (
    <div>
      <Prompt>Listen and tap the right action</Prompt>
      <div className="card-soft grid place-items-center px-4 py-10">
        <button
          type="button"
          onClick={() => speak(item.target.text, "en-US")}
          className="grid h-28 w-28 place-items-center rounded-full bg-primary text-6xl text-primary-foreground toy-press"
          aria-label="Play command"
        >
          🔊
        </button>
        <p className="mt-3 text-sm font-bold text-muted-foreground">Tap to hear the command</p>
      </div>
      <div className="mt-4 grid gap-3">
        {item.options.map((o) => (
          <BigButton key={o.text} tone="sun" onClick={() => resolve(o.text === item.target.text)}>
            <span className="mr-2">{o.emoji}</span>
            {o.text}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </div>
  );
}
