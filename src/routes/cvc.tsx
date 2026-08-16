import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { QuizGame, Tabs, type QuizItem } from "@/components/game/QuizGame";
import { gameActions, playSound, randomInt, shuffle, speak } from "@/lib/game-store";

export const Route = createFileRoute("/cvc")({
  head: () => ({
    meta: [
      { title: "CVC Words, Spelling & Reading — English | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "CVC word spelling bee, short word dictation and short sentence reading practice for young English learners.",
      },
      { property: "og:title", content: "CVC Words & Spelling" },
      { property: "og:description", content: "Spell CVC words, take dictations and read short sentences." },
    ],
  }),
  component: CvcPage,
});

const CVC: { w: string; e: string }[] = [
  { w: "cat", e: "🐱" }, { w: "dog", e: "🐶" }, { w: "pig", e: "🐷" }, { w: "hen", e: "🐔" },
  { w: "bus", e: "🚌" }, { w: "sun", e: "☀️" }, { w: "hat", e: "👒" }, { w: "bed", e: "🛏️" },
  { w: "cup", e: "🥤" }, { w: "box", e: "📦" }, { w: "fox", e: "🦊" }, { w: "pen", e: "🖊️" },
  { w: "map", e: "🗺️" }, { w: "bag", e: "🎒" }, { w: "net", e: "🥅" }, { w: "log", e: "🪵" },
  { w: "van", e: "🚐" }, { w: "jam", e: "🍓" }, { w: "web", e: "🕸️" }, { w: "mop", e: "🧹" },
];

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

function Spell({ dictation }: { dictation: boolean }) {
  const [i, setI] = useState(() => randomInt(0, CVC.length - 1));
  const [built, setBuilt] = useState("");
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const word = CVC[i]!;
  const tiles = useMemo(() => {
    const extra = shuffle(LETTERS.filter((l) => !word.w.includes(l))).slice(0, 3);
    return shuffle([...word.w.split(""), ...extra]);
  }, [word]);

  function tap(l: string) {
    if (status !== "idle") return;
    const next = built + l;
    speak(l, "en-US");
    if (!word.w.startsWith(next)) {
      setStatus("bad");
      playSound("bad");
      setBuilt("");
      setTimeout(() => setStatus("idle"), 900);
      return;
    }
    setBuilt(next);
    if (next === word.w) {
      setStatus("good");
      playSound("good");
      speak(word.w, "en-US");
      gameActions.award("cvc", 3);
      setTimeout(() => {
        setStatus("idle");
        setBuilt("");
        setI(randomInt(0, CVC.length - 1));
      }, 1300);
    }
  }

  return (
    <>
      <Prompt>
        {dictation ? (
          <span className="block text-6xl">👂</span>
        ) : (
          <span className="block text-6xl">{word.e}</span>
        )}
        <span className="mt-2 block text-xl">
          {dictation ? "Listen and spell the word" : "Spell the word"}
        </span>
      </Prompt>
      <div className="mb-4 grid">
        <BigButton tone="card" onClick={() => speak(word.w, "en-US")}>
          🔊 Listen
        </BigButton>
      </div>
      <div className="mb-4 flex justify-center gap-2">
        {word.w.split("").map((_, n) => (
          <span
            key={n}
            className="grid h-16 w-14 place-items-center rounded-2xl bg-card font-display text-3xl"
          >
            {built[n] ?? ""}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((l, n) => (
          <BigButton key={`${l}-${n}`} tone="sun" onClick={() => tap(l)}>
            {l}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </>
  );
}

const SENTENCES: QuizItem[] = [
  { q: "The cat is on the ___.", visual: "🐱🛏️", options: ["bed", "bus", "sun"], answer: "bed" },
  { q: "The dog has a ___.", visual: "🐶🎒", options: ["bag", "hen", "web"], answer: "bag" },
  { q: "The ___ is hot.", visual: "☀️", options: ["sun", "cup", "box"], answer: "sun" },
  { q: "I see a red ___.", visual: "🦊", options: ["fox", "pen", "map"], answer: "fox" },
  { q: "Which one is a sentence?", visual: "📝", options: ["I like my dog.", "dog my", "the"], answer: "I like my dog." },
  { q: "Which sentence starts correctly?", visual: "🔤", options: ["We can run.", "we can run.", "run We can"], answer: "We can run." },
  { q: "Every sentence ends with…", visual: "❕", options: ["a period .", "a letter", "nothing"], answer: "a period ." },
  { q: "The pig is in the ___.", visual: "🐷📦", options: ["box", "hat", "net"], answer: "box" },
];

function CvcPage() {
  const [tab, setTab] = useState<"spell" | "dictation" | "read">("spell");
  return (
    <StationShell title="CVC & Spelling" emoji="🐱">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "spell", label: "🔡" },
          { id: "dictation", label: "👂" },
          { id: "read", label: "📖" },
        ]}
      />
      {tab === "spell" ? (
        <Spell dictation={false} />
      ) : tab === "dictation" ? (
        <Spell dictation />
      ) : (
        <QuizGame station="cvc" items={SENTENCES} lang="en-US" columns={1} />
      )}
    </StationShell>
  );
}
