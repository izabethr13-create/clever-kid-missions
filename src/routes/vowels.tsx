import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { QuizGame, Tabs, type QuizItem } from "@/components/game/QuizGame";
import { gameActions, playSound, randomInt, shuffle, speak } from "@/lib/game-store";

export const Route = createFileRoute("/vowels")({
  head: () => ({
    meta: [
      { title: "Long Vowel Sound Words — English phonics | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Long vowel sound words for kids: cake, rain, see, pie, boat, music and more. Listen, sort by vowel and practice reading.",
      },
      { property: "og:title", content: "Long Vowels Sound Words" },
      { property: "og:description", content: "Sort words by their long vowel sound: A, E, I, O, U." },
    ],
  }),
  component: VowelsPage,
});

const GROUPS: { vowel: string; emoji: string; words: { w: string; e: string }[] }[] = [
  {
    vowel: "A",
    emoji: "🎂",
    words: [
      { w: "Cake", e: "🎂" },
      { w: "Rain", e: "🌧️" },
      { w: "Plane", e: "✈️" },
      { w: "Game", e: "🎮" },
      { w: "Day", e: "🌞" },
    ],
  },
  {
    vowel: "E",
    emoji: "👀",
    words: [
      { w: "See", e: "👀" },
      { w: "She", e: "👧" },
      { w: "Read", e: "📖" },
      { w: "Hero", e: "🦸" },
      { w: "He", e: "👦" },
    ],
  },
  {
    vowel: "I",
    emoji: "🥧",
    words: [
      { w: "Pie", e: "🥧" },
      { w: "Fries", e: "🍟" },
      { w: "Night", e: "🌙" },
      { w: "Light", e: "💡" },
      { w: "Like", e: "👍" },
    ],
  },
  {
    vowel: "O",
    emoji: "⛵",
    words: [
      { w: "Boat", e: "⛵" },
      { w: "Toe", e: "🦶" },
      { w: "Pony", e: "🐴" },
      { w: "Home", e: "🏠" },
      { w: "Broke", e: "💔" },
    ],
  },
  {
    vowel: "U",
    emoji: "🎵",
    words: [
      { w: "Music", e: "🎵" },
      { w: "Mute", e: "🔇" },
      { w: "Human", e: "🧑" },
      { w: "Cube", e: "🧊" },
      { w: "Universe", e: "🌌" },
    ],
  },
];

function Words() {
  const [vowel, setVowel] = useState("A");
  const group = GROUPS.find((g) => g.vowel === vowel)!;
  return (
    <>
      <Prompt>
        <button type="button" onClick={() => speak(`Long ${group.vowel}`, "en-US")}>
          Long {group.vowel} {group.emoji} 🔊
        </button>
      </Prompt>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {group.words.map((w) => (
          <li key={w.w}>
            <button
              type="button"
              onClick={() => {
                speak(w.w, "en-US");
                gameActions.award("vowels", 0);
              }}
              className="flex w-full flex-col items-center rounded-3xl bg-card px-2 py-4 toy-press"
            >
              <span className="text-4xl">{w.e}</span>
              <span className="mt-1 font-display text-lg">{w.w}</span>
            </button>
          </li>
        ))}
      </ul>
      <ul className="mt-4 flex flex-wrap justify-center gap-2">
        {GROUPS.map((g) => (
          <li key={g.vowel}>
            <button
              type="button"
              onClick={() => {
                setVowel(g.vowel);
                speak(`Long ${g.vowel}`, "en-US");
              }}
              className={`grid h-14 w-14 place-items-center rounded-2xl font-display text-2xl toy-press ${
                vowel === g.vowel ? "bg-primary text-primary-foreground" : "bg-card"
              }`}
            >
              {g.vowel}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function makeSort() {
  const g = GROUPS[randomInt(0, GROUPS.length - 1)]!;
  const word = g.words[randomInt(0, g.words.length - 1)]!;
  return { word, answer: g.vowel };
}

function Sort() {
  const [q, setQ] = useState(makeSort);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function pick(v: string) {
    if (status !== "idle") return;
    if (v === q.answer) {
      setStatus("good");
      playSound("good");
      speak("Great job!", "en-US");
      gameActions.award("vowels", 3);
      setTimeout(() => {
        setStatus("idle");
        setQ(makeSort());
      }, 1300);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <>
      <Prompt>
        <span className="block text-6xl">{q.word.e}</span>
        <span className="mt-2 block">{q.word.w}</span>
        <span className="mt-2 block text-xl">Which long vowel sound?</span>
      </Prompt>
      <div className="mb-4 grid">
        <BigButton tone="card" onClick={() => speak(q.word.w, "en-US")}>
          🔊 Listen
        </BigButton>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {GROUPS.map((g) => (
          <BigButton key={g.vowel} tone="sun" onClick={() => pick(g.vowel)}>
            {g.vowel}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </>
  );
}

const LISTEN: QuizItem[] = shuffle(
  GROUPS.flatMap((g) =>
    g.words.map((w) => {
      const others = shuffle(
        GROUPS.flatMap((o) => o.words).filter((o) => o.w !== w.w),
      ).slice(0, 2);
      return {
        q: "Listen and choose the word",
        visual: w.e,
        options: [w.w, ...others.map((o) => o.w)],
        answer: w.w,
        say: w.w,
      } satisfies QuizItem;
    }),
  ),
);

function VowelsPage() {
  const [tab, setTab] = useState<"words" | "sort" | "listen">("words");
  return (
    <StationShell title="Long Vowels" emoji="🅰️">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "words", label: "📚" },
          { id: "sort", label: "🧺" },
          { id: "listen", label: "👂" },
        ]}
      />
      {tab === "words" ? <Words /> : tab === "sort" ? <Sort /> : (
        <QuizGame station="vowels" items={LISTEN} lang="en-US" columns={3} />
      )}
    </StationShell>
  );
}
