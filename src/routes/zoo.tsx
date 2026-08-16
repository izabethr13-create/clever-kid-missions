import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StationShell } from "@/components/game/StationShell";
import { QuizGame, Tabs, type QuizItem } from "@/components/game/QuizGame";

export const Route = createFileRoute("/zoo")({
  head: () => ({
    meta: [
      { title: "Zoo & ABC — English vocabulary games | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "English mini-games for kids: zoo animals, ABC letters, numbers and guessing games with native audio.",
      },
      { property: "og:title", content: "Zoo & ABC Games" },
      { property: "og:description", content: "Animals, letters and guessing games in English." },
    ],
  }),
  component: ZooPage,
});

const ANIMALS: QuizItem[] = [
  { q: "What animal is this?", visual: "🦁", options: ["Lion", "Tiger", "Bear"], answer: "Lion", say: "What animal is this?" },
  { q: "What animal is this?", visual: "🐘", options: ["Elephant", "Zebra", "Monkey"], answer: "Elephant" },
  { q: "What animal is this?", visual: "🦓", options: ["Zebra", "Horse", "Cow"], answer: "Zebra" },
  { q: "What animal is this?", visual: "🐒", options: ["Monkey", "Koala", "Fox"], answer: "Monkey" },
  { q: "What animal is this?", visual: "🐍", options: ["Snake", "Frog", "Fish"], answer: "Snake" },
  { q: "What animal is this?", visual: "🦒", options: ["Giraffe", "Camel", "Duck"], answer: "Giraffe" },
  { q: "What animal is this?", visual: "🐊", options: ["Crocodile", "Turtle", "Whale"], answer: "Crocodile" },
  { q: "What animal is this?", visual: "🦜", options: ["Parrot", "Owl", "Penguin"], answer: "Parrot" },
  { q: "What animal is this?", visual: "🐻", options: ["Bear", "Wolf", "Dog"], answer: "Bear" },
  { q: "What animal is this?", visual: "🐧", options: ["Penguin", "Duck", "Swan"], answer: "Penguin" },
];

const GUESS: QuizItem[] = [
  { q: "It is big and grey and has a long trunk. What is it?", visual: "❓", options: ["An elephant", "A cat", "A bird"], answer: "An elephant" },
  { q: "It is yellow and it lives in the jungle. It roars.", visual: "❓", options: ["A lion", "A fish", "A cow"], answer: "A lion" },
  { q: "It has black and white stripes.", visual: "❓", options: ["A zebra", "A frog", "A bee"], answer: "A zebra" },
  { q: "It is very tall and eats leaves.", visual: "❓", options: ["A giraffe", "A mouse", "A duck"], answer: "A giraffe" },
  { q: "It swims in the sea and it is very big.", visual: "❓", options: ["A whale", "A dog", "A hen"], answer: "A whale" },
  { q: "It can fly and it says 'hello'.", visual: "❓", options: ["A parrot", "A pig", "A goat"], answer: "A parrot" },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ABC: QuizItem[] = ALPHABET.map((l, i) => ({
  q: `Which letter comes after ${l}?`,
  visual: `${l}${l.toLowerCase()}`,
  options: [
    ALPHABET[(i + 1) % 26]!,
    ALPHABET[(i + 4) % 26]!,
    ALPHABET[(i + 9) % 26]!,
  ],
  answer: ALPHABET[(i + 1) % 26]!,
  say: `Which letter comes after ${l}?`,
}));

const DICE: QuizItem[] = [
  { q: "How many dots?", visual: "⚀", options: ["One", "Two", "Six"], answer: "One" },
  { q: "How many dots?", visual: "⚁", options: ["Two", "Five", "Three"], answer: "Two" },
  { q: "How many dots?", visual: "⚂", options: ["Three", "One", "Four"], answer: "Three" },
  { q: "How many dots?", visual: "⚃", options: ["Four", "Six", "Two"], answer: "Four" },
  { q: "How many dots?", visual: "⚄", options: ["Five", "Three", "Seven"], answer: "Five" },
  { q: "How many dots?", visual: "⚅", options: ["Six", "Four", "Nine"], answer: "Six" },
  { q: "Count and choose: 🍎🍎🍎🍎🍎🍎🍎", visual: "🍎", options: ["Seven", "Five", "Nine"], answer: "Seven" },
  { q: "Count and choose: ⭐⭐⭐⭐⭐⭐⭐⭐", visual: "⭐", options: ["Eight", "Six", "Ten"], answer: "Eight" },
  { q: "Count and choose: 🐟🐟🐟🐟🐟🐟🐟🐟🐟", visual: "🐟", options: ["Nine", "Seven", "Four"], answer: "Nine" },
  { q: "Count and choose: 🎈 x10", visual: "🎈", options: ["Ten", "Twelve", "Two"], answer: "Ten" },
];

function ZooPage() {
  const [tab, setTab] = useState<"animals" | "guess" | "abc" | "dice">("animals");
  return (
    <StationShell title="Zoo & ABC" emoji="🦓">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "animals", label: "🦁" },
          { id: "guess", label: "❓" },
          { id: "abc", label: "🔠" },
          { id: "dice", label: "🎲" },
        ]}
      />
      {tab === "animals" ? (
        <QuizGame station="zoo" items={ANIMALS} lang="en-US" />
      ) : tab === "guess" ? (
        <QuizGame station="zoo" items={GUESS} lang="en-US" columns={1} />
      ) : tab === "abc" ? (
        <QuizGame station="zoo" items={ABC} lang="en-US" columns={3} />
      ) : (
        <QuizGame station="zoo" items={DICE} lang="en-US" columns={3} />
      )}
    </StationShell>
  );
}
