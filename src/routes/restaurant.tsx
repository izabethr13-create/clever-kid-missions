import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, randomInt, shuffle, speak } from "@/lib/game-store";

export const Route = createFileRoute("/restaurant")({
  head: () => ({
    meta: [
      { title: "Restaurant & Conversation — English for kids | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Eating Out and Our Things mini-games: identify people, food, drinks and utensils, and practice questions like What is this? and May I have some cake, please?",
      },
      { property: "og:title", content: "Restaurant & Conversation" },
      {
        property: "og:description",
        content: "Restaurant vocabulary and interactive English conversation practice for kids.",
      },
    ],
  }),
  component: RestaurantPage,
});

type Mode = "menu" | "identify" | "grammar";

const ITEMS: { word: string; emoji: string; group: "people" | "food" | "drinks" | "things" }[] = [
  { word: "waiter", emoji: "🧑‍🍳", group: "people" },
  { word: "daughter", emoji: "👧", group: "people" },
  { word: "doctor", emoji: "🧑‍⚕️", group: "people" },
  { word: "pizza", emoji: "🍕", group: "food" },
  { word: "spaghetti", emoji: "🍝", group: "food" },
  { word: "cake", emoji: "🍰", group: "food" },
  { word: "ice cream", emoji: "🍨", group: "food" },
  { word: "salad", emoji: "🥗", group: "food" },
  { word: "chicken", emoji: "🍗", group: "food" },
  { word: "vegetables", emoji: "🥦", group: "food" },
  { word: "water", emoji: "💧", group: "drinks" },
  { word: "milk", emoji: "🥛", group: "drinks" },
  { word: "juice", emoji: "🧃", group: "drinks" },
  { word: "menus", emoji: "📖", group: "things" },
  { word: "napkins", emoji: "🧻", group: "things" },
  { word: "straws", emoji: "🥤", group: "things" },
  { word: "cell phone", emoji: "📱", group: "things" },
  { word: "tablet", emoji: "📲", group: "things" },
  { word: "backpack", emoji: "🎒", group: "things" },
];

const GRAMMAR: { q: string; emoji: string; options: string[]; correct: number }[] = [
  {
    q: "What is this?",
    emoji: "🍰",
    options: ["It is a cake.", "These are cakes.", "I am a cake."],
    correct: 0,
  },
  {
    q: "What are these?",
    emoji: "🍟🍟",
    options: ["These are fries.", "It is a fry.", "This is fries."],
    correct: 0,
  },
  {
    q: "Is this your ice cream? 🍨 (it is yours)",
    emoji: "🍨",
    options: ["Yes, it is.", "No, it isn't.", "Yes, they are."],
    correct: 0,
  },
  {
    q: "Is this your backpack? 🎒 (it is NOT yours)",
    emoji: "🎒",
    options: ["No, it isn't.", "Yes, it is.", "No, I am not."],
    correct: 0,
  },
  {
    q: "May I have some cake, please?",
    emoji: "🍰",
    options: ["Yes, of course.", "It is a cake.", "I am looking for it."],
    correct: 0,
  },
  {
    q: "What are you looking for? 📱",
    emoji: "📱",
    options: ["I'm looking for my cell phone.", "It is a cell phone.", "Yes, of course."],
    correct: 0,
  },
  {
    q: "What is this?",
    emoji: "🧃",
    options: ["It is a juice.", "These are juices.", "No, it isn't."],
    correct: 0,
  },
];

function RestaurantPage() {
  const [mode, setMode] = useState<Mode>("menu");
  return (
    <StationShell title="Restaurant & Conversation" emoji="🍽️">
      {mode === "menu" ? (
        <ul className="space-y-3">
          <li>
            <BigButton tone="card" className="w-full text-left" onClick={() => setMode("identify")}>
              <span className="mr-3">🍕</span>Eating Out · people, food, drinks & things
            </BigButton>
          </li>
          <li>
            <BigButton tone="card" className="w-full text-left" onClick={() => setMode("grammar")}>
              <span className="mr-3">💬</span>Let&apos;s talk · questions & answers
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
          {mode === "identify" ? <Identify /> : <Grammar />}
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
      gameActions.award("restaurant", stars);
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

function Identify() {
  const { item, status, resolve } = useRound(() => {
    const target = ITEMS[randomInt(0, ITEMS.length - 1)]!;
    const others = shuffle(ITEMS.filter((i) => i.word !== target.word)).slice(0, 2);
    return { target, options: shuffle([target, ...others]) };
  }, 2);

  return (
    <div>
      <Prompt>What is this?</Prompt>
      <div className="card-soft grid place-items-center gap-3 px-4 py-10">
        <span className="animate-pop-in text-8xl">{item.target.emoji}</span>
        <button
          type="button"
          onClick={() => speak(`What is this?`, "en-US")}
          className="rounded-2xl bg-secondary px-4 py-2 font-display text-lg text-secondary-foreground toy-press"
        >
          🔊 Listen
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        {item.options.map((o) => (
          <BigButton
            key={o.word}
            tone="sun"
            onClick={() => {
              speak(`It is a ${o.word}`, "en-US");
              resolve(o.word === item.target.word);
            }}
          >
            It is a {o.word}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </div>
  );
}

function Grammar() {
  const { item, status, resolve } = useRound(() => {
    const g = GRAMMAR[randomInt(0, GRAMMAR.length - 1)]!;
    return { q: g.q, emoji: g.emoji, good: g.options[g.correct]!, options: shuffle([...g.options]) };
  }, 3);

  return (
    <div>
      <Prompt>
        <span className="mr-2 text-4xl">{item.emoji}</span>
        {item.q}
      </Prompt>
      <div className="mb-4 text-center">
        <button
          type="button"
          onClick={() => speak(item.q, "en-US")}
          className="rounded-2xl bg-secondary px-4 py-2 font-display text-lg text-secondary-foreground toy-press"
        >
          🔊 Listen to the question
        </button>
      </div>
      <div className="grid gap-3">
        {item.options.map((o) => (
          <BigButton
            key={o}
            tone="berry"
            className="text-xl"
            onClick={() => {
              speak(o, "en-US");
              resolve(o === item.good);
            }}
          >
            {o}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </div>
  );
}
