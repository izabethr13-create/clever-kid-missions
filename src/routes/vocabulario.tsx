import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, randomInt, shuffle, speak } from "@/lib/game-store";

export const Route = createFileRoute("/vocabulario")({
  head: () => ({
    meta: [
      { title: "Vocabulary Bank & Spelling Games | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "English vocabulary mini-games for kids: match pictures with words, listening dictation and spelling with letter tiles. Food, objects, clothes and adjectives.",
      },
      { property: "og:title", content: "Vocabulary Bank & Spelling Games" },
      {
        property: "og:description",
        content: "Matching, listening and spelling games with the vocabulary bank.",
      },
    ],
  }),
  component: VocabPage,
});

type Word = { w: string; e: string };

const BANK: { name: string; emoji: string; words: Word[] }[] = [
  {
    name: "Food & Drinks",
    emoji: "🍕",
    words: [
      { w: "Menu", e: "📋" },
      { w: "Napkin", e: "🧻" },
      { w: "Water", e: "💧" },
      { w: "Straw", e: "🥤" },
      { w: "Pizza", e: "🍕" },
      { w: "Spaghetti", e: "🍝" },
      { w: "Ice cream", e: "🍦" },
      { w: "Cake", e: "🍰" },
      { w: "Vegetables", e: "🥦" },
      { w: "Main dish", e: "🍛" },
      { w: "Dessert", e: "🍮" },
      { w: "Drinks", e: "🧃" },
      { w: "Salad", e: "🥗" },
      { w: "Fruits", e: "🍇" },
      { w: "Milk", e: "🥛" },
      { w: "Chicken", e: "🍗" },
      { w: "Juice", e: "🧃" },
      { w: "Eat", e: "😋" },
    ],
  },
  {
    name: "Objects & Clothes",
    emoji: "🎒",
    words: [
      { w: "Cell phone", e: "📱" },
      { w: "Tablet", e: "💻" },
      { w: "Laptop", e: "🖥️" },
      { w: "Backpack", e: "🎒" },
      { w: "Necktie", e: "👔" },
      { w: "Ring", e: "💍" },
      { w: "Necklace", e: "📿" },
      { w: "Hat", e: "🎩" },
    ],
  },
  {
    name: "Adjectives & Places",
    emoji: "🏠",
    words: [
      { w: "Patterns", e: "🔷" },
      { w: "Big", e: "🐘" },
      { w: "Biggest", e: "🦖" },
      { w: "Small", e: "🐜" },
      { w: "Hungry", e: "🍽️" },
      { w: "Restaurant", e: "🏬" },
      { w: "Daughter", e: "👧" },
    ],
  },
];

function pool(cat: number): Word[] {
  return BANK[cat]!.words;
}

function VocabPage() {
  const [cat, setCat] = useState(0);
  const [tab, setTab] = useState<"match" | "listen" | "spell">("match");

  return (
    <StationShell title="Vocabulary & Spelling" emoji="🎒">
      <div className="mb-3 grid grid-cols-3 gap-2">
        {BANK.map((c, i) => (
          <BigButton key={c.name} tone={cat === i ? "primary" : "card"} onClick={() => setCat(i)}>
            {c.emoji}
          </BigButton>
        ))}
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        <BigButton tone={tab === "match" ? "grass" : "card"} onClick={() => setTab("match")}>
          🖼️
        </BigButton>
        <BigButton tone={tab === "listen" ? "grass" : "card"} onClick={() => setTab("listen")}>
          👂
        </BigButton>
        <BigButton tone={tab === "spell" ? "grass" : "card"} onClick={() => setTab("spell")}>
          🔡
        </BigButton>
      </div>
      {tab === "match" ? (
        <Match key={`m${cat}`} cat={cat} />
      ) : tab === "listen" ? (
        <ListenGame key={`l${cat}`} cat={cat} />
      ) : (
        <Spell key={`s${cat}`} cat={cat} />
      )}
    </StationShell>
  );
}

function question(cat: number) {
  const words = pool(cat);
  const answer = words[randomInt(0, words.length - 1)]!;
  const others = shuffle(words.filter((w) => w.w !== answer.w)).slice(0, 2);
  return { answer, options: shuffle([answer, ...others]) };
}

function Match({ cat }: { cat: number }) {
  const [q, setQ] = useState(() => question(cat));
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function pick(w: Word) {
    if (status !== "idle") return;
    if (w.w === q.answer.w) {
      setStatus("good");
      playSound("good");
      speak(q.answer.w, "en-US");
      gameActions.award("vocabulario", 3);
      setTimeout(() => {
        setStatus("idle");
        setQ(question(cat));
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
        <span className="block text-7xl">{q.answer.e}</span>
        <span className="mt-2 block text-xl">Choose the word</span>
      </Prompt>
      <div className="grid gap-3">
        {q.options.map((o) => (
          <BigButton key={o.w} tone="sun" onClick={() => pick(o)}>
            {o.w}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </>
  );
}

function ListenGame({ cat }: { cat: number }) {
  const [q, setQ] = useState(() => question(cat));
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function pick(w: Word) {
    if (status !== "idle") return;
    if (w.w === q.answer.w) {
      setStatus("good");
      playSound("good");
      speak("Well done!", "en-US");
      gameActions.award("vocabulario", 3);
      setTimeout(() => {
        setStatus("idle");
        setQ(question(cat));
      }, 1300);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <>
      <Prompt>Listen and tap the picture</Prompt>
      <div className="mb-5 grid">
        <BigButton tone="card" onClick={() => speak(q.answer.w, "en-US")}>
          🔊 Play the word
        </BigButton>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {q.options.map((o) => (
          <button
            key={o.w}
            type="button"
            aria-label={o.w}
            onClick={() => pick(o)}
            className="grid aspect-square place-items-center rounded-3xl bg-card text-5xl toy-press"
          >
            {o.e}
          </button>
        ))}
      </div>
      <Feedback status={status} />
    </>
  );
}

function Spell({ cat }: { cat: number }) {
  const words = pool(cat).filter((w) => w.w.length <= 9);
  const [word, setWord] = useState(() => words[randomInt(0, words.length - 1)]!);
  const [tiles, setTiles] = useState(() =>
    shuffle(word.w.split("").map((c, i) => ({ c, i }))),
  );
  const [built, setBuilt] = useState<{ c: string; i: number }[]>([]);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function next() {
    const n = words[randomInt(0, words.length - 1)]!;
    setWord(n);
    setTiles(shuffle(n.w.split("").map((c, i) => ({ c, i }))));
    setBuilt([]);
  }

  function add(t: { c: string; i: number }) {
    if (status !== "idle") return;
    const b = [...built, t];
    setBuilt(b);
    setTiles((s) => s.filter((x) => x.i !== t.i));
    if (b.length === word.w.length) {
      if (b.map((x) => x.c).join("") === word.w) {
        setStatus("good");
        playSound("win");
        speak(word.w, "en-US");
        gameActions.award("vocabulario", 4);
        setTimeout(() => {
          setStatus("idle");
          next();
        }, 1600);
      } else {
        setStatus("bad");
        playSound("bad");
        setTimeout(() => {
          setStatus("idle");
          setBuilt([]);
          setTiles(shuffle(word.w.split("").map((c, i) => ({ c, i }))));
        }, 1000);
      }
    }
  }

  return (
    <>
      <Prompt>
        <span className="block text-6xl">{word.e}</span>
        <span className="mt-2 block text-lg">Spell the word</span>
      </Prompt>

      <div className="card-soft flex min-h-16 flex-wrap items-center gap-2 px-4 py-3">
        {built.length === 0 && (
          <span className="font-bold text-muted-foreground">Tap the letters…</span>
        )}
        {built.map((t, k) => (
          <button
            key={`${t.i}-${k}`}
            type="button"
            onClick={() => {
              setBuilt((b) => b.filter((_, j) => j !== k));
              setTiles((s) => [...s, t]);
            }}
            className="grid h-12 w-10 place-items-center rounded-xl bg-grass font-display text-xl text-grass-foreground toy-press"
          >
            {t.c === " " ? "␣" : t.c}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {tiles.map((t) => (
          <button
            key={t.i}
            type="button"
            onClick={() => add(t)}
            className="grid h-14 w-12 place-items-center rounded-xl bg-card font-display text-2xl toy-press"
          >
            {t.c === " " ? "␣" : t.c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <BigButton tone="card" onClick={() => speak(word.w, "en-US")}>
          🔊 Listen
        </BigButton>
        <BigButton tone="sun" onClick={next}>
          ➡️ Next
        </BigButton>
      </div>

      <Feedback status={status} />
    </>
  );
}
