import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { TracePad } from "@/components/game/TracePad";
import { gameActions, playSound, randomInt, shuffle, speak } from "@/lib/game-store";

export const Route = createFileRoute("/phonics")({
  head: () => ({
    meta: [
      { title: "Phonics & Letter Recognition — English for kids | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Learn letter sounds Dd, Kk, Qq, Uu, Vv, Ww, Xx, Yy and Zz with native audio, uppercase and lowercase recognition, tracing and listening games.",
      },
      { property: "og:title", content: "Phonics & Letter Recognition" },
      {
        property: "og:description",
        content: "Letter sounds, tracing and listening quizzes for Dd to Zz.",
      },
    ],
  }),
  component: PhonicsPage,
});

const LETTERS: { letter: string; sound: string; words: { w: string; e: string }[] }[] = [
  {
    letter: "D",
    sound: "duh",
    words: [
      { w: "Dress", e: "👗" },
      { w: "Dog", e: "🐶" },
      { w: "Doll", e: "🪆" },
      { w: "Dinosaur", e: "🦕" },
      { w: "Duck", e: "🦆" },
      { w: "Doctor", e: "👩‍⚕️" },
      { w: "Dance", e: "💃" },
      { w: "Dinner", e: "🍽️" },
      { w: "Dolphin", e: "🐬" },
    ],
  },
  {
    letter: "K",
    sound: "kuh",
    words: [
      { w: "Key", e: "🔑" },
      { w: "Kite", e: "🪁" },
      { w: "Kangaroo", e: "🦘" },
      { w: "Kids", e: "🧒" },
      { w: "King", e: "🤴" },
      { w: "Kiwi", e: "🥝" },
      { w: "Kitten", e: "🐈" },
      { w: "Koala", e: "🐨" },
    ],
  },
  {
    letter: "Q",
    sound: "kwuh",
    words: [
      { w: "Queen", e: "👸" },
      { w: "Quilt", e: "🛏️" },
      { w: "Quiet", e: "🤫" },
      { w: "Quick", e: "🏃" },
    ],
  },
  {
    letter: "U",
    sound: "uh",
    words: [
      { w: "Under", e: "⬇️" },
      { w: "Umbrella", e: "☂️" },
      { w: "Underwear", e: "🩲" },
      { w: "Up", e: "⬆️" },
      { w: "Unicorn", e: "🦄" },
      { w: "Uniform", e: "👮" },
      { w: "Upstairs", e: "🪜" },
      { w: "Upset", e: "😢" },
    ],
  },
  {
    letter: "V",
    sound: "vuh",
    words: [
      { w: "Violin", e: "🎻" },
      { w: "Van", e: "🚐" },
      { w: "Vest", e: "🦺" },
      { w: "Vegetables", e: "🥦" },
      { w: "Vet", e: "🐾" },
      { w: "Volcano", e: "🌋" },
      { w: "Vacuum", e: "🧹" },
    ],
  },
  {
    letter: "W",
    sound: "wuh",
    words: [
      { w: "Watermelon", e: "🍉" },
      { w: "Window", e: "🪟" },
      { w: "Waiter", e: "🤵" },
      { w: "Water", e: "💧" },
      { w: "Watch", e: "⌚" },
      { w: "Wolf", e: "🐺" },
      { w: "Whale", e: "🐳" },
      { w: "Woodpecker", e: "🦤" },
      { w: "Web", e: "🕸️" },
      { w: "Wheel", e: "🛞" },
    ],
  },
  {
    letter: "X",
    sound: "ks",
    words: [
      { w: "X-ray", e: "🩻" },
      { w: "Box", e: "📦" },
      { w: "Fox", e: "🦊" },
      { w: "Xylophone", e: "🎹" },
      { w: "Six", e: "6️⃣" },
      { w: "Ax", e: "🪓" },
      { w: "Ox", e: "🐂" },
    ],
  },
  {
    letter: "Y",
    sound: "yuh",
    words: [
      { w: "Yo-yo", e: "🪀" },
      { w: "Yarn", e: "🧶" },
      { w: "Yogurt", e: "🥛" },
      { w: "Yellow", e: "💛" },
      { w: "Yummy", e: "😋" },
      { w: "Yell", e: "📢" },
      { w: "Yes", e: "👍" },
      { w: "Yoga", e: "🧘" },
    ],
  },
  {
    letter: "Z",
    sound: "zuh",
    words: [
      { w: "Zero", e: "0️⃣" },
      { w: "Zebra", e: "🦓" },
      { w: "Zucchini", e: "🥒" },
      { w: "Zig-Zag", e: "〽️" },
      { w: "Zoo", e: "🦁" },
      { w: "Zipper", e: "🤐" },
    ],
  },
];

function PhonicsPage() {
  const [tab, setTab] = useState<"sounds" | "trace" | "listen">("sounds");
  return (
    <StationShell title="Phonics & Letters" emoji="🔤">
      <div className="mb-4 grid grid-cols-3 gap-2">
        <BigButton tone={tab === "sounds" ? "primary" : "card"} onClick={() => setTab("sounds")}>
          🔊
        </BigButton>
        <BigButton tone={tab === "trace" ? "primary" : "card"} onClick={() => setTab("trace")}>
          ✍️
        </BigButton>
        <BigButton tone={tab === "listen" ? "primary" : "card"} onClick={() => setTab("listen")}>
          👂
        </BigButton>
      </div>
      {tab === "sounds" ? <Sounds /> : tab === "trace" ? <Trace /> : <Listen />}
    </StationShell>
  );
}

function LetterPicker({ value, onPick }: { value: string; onPick: (l: string) => void }) {
  return (
    <ul className="mt-4 flex flex-wrap justify-center gap-2">
      {LETTERS.map((l) => (
        <li key={l.letter}>
          <button
            type="button"
            onClick={() => onPick(l.letter)}
            className={`grid h-14 w-14 place-items-center rounded-2xl font-display text-xl toy-press ${
              value === l.letter ? "bg-primary text-primary-foreground" : "bg-card"
            }`}
          >
            {l.letter}
            {l.letter.toLowerCase()}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Sounds() {
  const [letter, setLetter] = useState("D");
  const data = LETTERS.find((l) => l.letter === letter)!;
  return (
    <>
      <Prompt>
        <button type="button" onClick={() => speak(`${data.letter}. ${data.sound}`, "en-US")}>
          {data.letter}
          {data.letter.toLowerCase()} 🔊
        </button>
      </Prompt>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {data.words.map((w) => (
          <li key={w.w}>
            <button
              type="button"
              onClick={() => {
                speak(w.w, "en-US");
                gameActions.award("phonics", 0);
              }}
              className="flex w-full flex-col items-center rounded-3xl bg-card px-2 py-4 toy-press"
            >
              <span className="text-4xl">{w.e}</span>
              <span className="mt-1 font-display text-lg">{w.w}</span>
            </button>
          </li>
        ))}
      </ul>
      <LetterPicker value={letter} onPick={(l) => setLetter(l)} />
    </>
  );
}

function Trace() {
  const [letter, setLetter] = useState("D");
  const [key, setKey] = useState(0);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function complete() {
    setStatus("good");
    playSound("good");
    speak(`${letter}`, "en-US");
    gameActions.award("phonics", 2);
    setTimeout(() => {
      setStatus("idle");
      setKey((k) => k + 1);
    }, 1100);
  }

  return (
    <>
      <Prompt>Trace the letter {letter}</Prompt>
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 grid place-items-center font-display text-[8rem] leading-none text-muted-foreground/25"
        >
          {letter}
          {letter.toLowerCase()}
        </span>
        <TracePad key={`${letter}-${key}`} paths={["M 60 250 L 240 250"]} onComplete={complete} />
      </div>
      <p className="mt-3 text-center text-sm font-bold text-muted-foreground">
        Write the letter, then slide your finger along the line
      </p>
      <LetterPicker
        value={letter}
        onPick={(l) => {
          setLetter(l);
          setKey((k) => k + 1);
          speak(l, "en-US");
        }}
      />
      <Feedback status={status} />
    </>
  );
}

function makeQuestion() {
  const target = LETTERS[randomInt(0, LETTERS.length - 1)]!;
  const word = target.words[randomInt(0, target.words.length - 1)]!;
  const others = shuffle(LETTERS.filter((l) => l.letter !== target.letter)).slice(0, 2);
  return {
    word,
    answer: target.letter,
    options: shuffle([target.letter, ...others.map((o) => o.letter)]),
  };
}

function Listen() {
  const [q, setQ] = useState(makeQuestion);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function pick(l: string) {
    if (status !== "idle") return;
    if (l === q.answer) {
      setStatus("good");
      playSound("good");
      speak("Great job!", "en-US");
      gameActions.award("phonics", 3);
      setTimeout(() => {
        setStatus("idle");
        setQ(makeQuestion());
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
        <span className="mt-2 block text-xl">Which letter does it start with?</span>
      </Prompt>
      <div className="mb-5 grid">
        <BigButton tone="card" onClick={() => speak(q.word.w, "en-US")}>
          🔊 Listen: {q.word.w}
        </BigButton>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {q.options.map((o) => (
          <BigButton key={o} tone="sun" onClick={() => pick(o)}>
            {o}
            {o.toLowerCase()}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </>
  );
}
