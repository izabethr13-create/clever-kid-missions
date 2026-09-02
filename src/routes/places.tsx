import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StationShell } from "@/components/game/StationShell";
import { QuizGame, Tabs, type QuizItem } from "@/components/game/QuizGame";

export const Route = createFileRoute("/places")({
  head: () => ({
    meta: [
      { title: "Places, Weather & Transportation for kids | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "English practice for kids: places, weather words, outdoor activities, transportation and sequence words first, then, last.",
      },
      { property: "og:title", content: "Places & Weather" },
      { property: "og:description", content: "Where do you want to go? Learn places and weather." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlacesPage,
});

const PLACES: QuizItem[] = [
  { q: "Where do you want to go? 🏖️", visual: "🏖️", options: ["The beach", "The school", "The zoo"], answer: "The beach", say: "Where do you want to go?" },
  { q: "Where do you want to go? 🏫", visual: "🏫", options: ["The school", "The park", "The farm"], answer: "The school", say: "Where do you want to go?" },
  { q: "Where do you want to go? 🏞️", visual: "🏞️", options: ["The park", "The hospital", "The store"], answer: "The park", say: "Where do you want to go?" },
  { q: "Where do you want to go? 🚜", visual: "🚜", options: ["The farm", "The beach", "The library"], answer: "The farm", say: "Where do you want to go?" },
  { q: "Where do you want to go? 🏥", visual: "🏥", options: ["The hospital", "The zoo", "The mountain"], answer: "The hospital", say: "Where do you want to go?" },
  { q: "Where do you want to go? ⛰️", visual: "⛰️", options: ["The mountain", "The store", "The school"], answer: "The mountain", say: "Where do you want to go?" },
  { q: "Where do you want to go? 📚", visual: "📚", options: ["The library", "The farm", "The beach"], answer: "The library", say: "Where do you want to go?" },
  { q: "Where do you want to go? 🛒", visual: "🛒", options: ["The store", "The park", "The hospital"], answer: "The store", say: "Where do you want to go?" },
];

const WEATHER: QuizItem[] = [
  { q: "How is the weather? ☀️", visual: "☀️", options: ["It is sunny", "It is rainy", "It is snowy"], answer: "It is sunny", say: "How is the weather?" },
  { q: "How is the weather? 🌧️", visual: "🌧️", options: ["It is rainy", "It is sunny", "It is windy"], answer: "It is rainy", say: "How is the weather?" },
  { q: "How is the weather? ❄️", visual: "❄️", options: ["It is cold", "It is hot", "It is cloudy"], answer: "It is cold", say: "How is the weather?" },
  { q: "How is the weather? ☁️", visual: "☁️", options: ["It is cloudy", "It is sunny", "It is snowy"], answer: "It is cloudy", say: "How is the weather?" },
  { q: "How is the weather? 🌬️", visual: "🌬️", options: ["It is windy", "It is rainy", "It is hot"], answer: "It is windy", say: "How is the weather?" },
  { q: "How is the weather? 🔥", visual: "🔥", options: ["It is hot", "It is cold", "It is cloudy"], answer: "It is hot", say: "How is the weather?" },
];

const ACTIVITIES: QuizItem[] = [
  { q: "What do you do at the beach?", visual: "🏊", options: ["I swim", "I ski", "I read"], answer: "I swim", say: "What do you do at the beach?" },
  { q: "What do you do at the park?", visual: "🚴", options: ["I ride a bike", "I cook", "I sleep"], answer: "I ride a bike", say: "What do you do at the park?" },
  { q: "What do you do at the mountain?", visual: "🥾", options: ["I hike", "I swim", "I drive"], answer: "I hike", say: "What do you do at the mountain?" },
  { q: "What do you do at school?", visual: "✏️", options: ["I write", "I fly", "I fish"], answer: "I write", say: "What do you do at school?" },
  { q: "Do you see a kite? 🪁", visual: "🪁", options: ["Yes, I do", "No, I don't", "It is a boat"], answer: "Yes, I do", say: "Do you see a kite?" },
];

const TRANSPORT: QuizItem[] = [
  { q: "What is this? 🚌", visual: "🚌", options: ["A bus", "A car", "A boat"], answer: "A bus", say: "What is this?" },
  { q: "What is this? ✈️", visual: "✈️", options: ["A plane", "A train", "A bike"], answer: "A plane", say: "What is this?" },
  { q: "What is this? 🚂", visual: "🚂", options: ["A train", "A truck", "A plane"], answer: "A train", say: "What is this?" },
  { q: "What is this? ⛵", visual: "⛵", options: ["A boat", "A car", "A bus"], answer: "A boat", say: "What is this?" },
  { q: "What is this? 🚗", visual: "🚗", options: ["A car", "A boat", "A train"], answer: "A car", say: "What is this?" },
  { q: "What is this? 🚲", visual: "🚲", options: ["A bike", "A plane", "A bus"], answer: "A bike", say: "What is this?" },
];

const SEQUENCE: QuizItem[] = [
  { q: "First I wake up. Then I...", visual: "🥣", options: ["eat breakfast", "go to sleep", "swim"], answer: "eat breakfast", say: "First I wake up. Then I..." },
  { q: "First, then, ... which word is last?", visual: "3️⃣", options: ["last", "first", "then"], answer: "last", say: "Which word do we use at the end?" },
  { q: "Last I ...", visual: "🛏️", options: ["go to bed", "wake up", "get dressed"], answer: "go to bed", say: "Last I..." },
  { q: "First I put on socks. Then I put on...", visual: "👟", options: ["shoes", "soup", "a kite"], answer: "shoes", say: "First I put on socks. Then I put on..." },
];

function PlacesPage() {
  const [tab, setTab] = useState<"places" | "weather" | "activities" | "transport" | "sequence">("places");
  return (
    <StationShell title="Places & Weather" emoji="⛰️">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "places", label: "🗺️ Places" },
          { id: "weather", label: "🌦️ Weather" },
          { id: "activities", label: "🚴 Actions" },
          { id: "transport", label: "🚌 Transport" },
          { id: "sequence", label: "1️⃣ First/Then" },
        ]}
      />
      {tab === "places" && <QuizGame station="places" items={PLACES} lang="en-US" />}
      {tab === "weather" && <QuizGame station="places" items={WEATHER} lang="en-US" />}
      {tab === "activities" && <QuizGame station="places" items={ACTIVITIES} lang="en-US" />}
      {tab === "transport" && <QuizGame station="places" items={TRANSPORT} lang="en-US" columns={3} />}
      {tab === "sequence" && <QuizGame station="places" items={SEQUENCE} lang="en-US" />}
    </StationShell>
  );
}
