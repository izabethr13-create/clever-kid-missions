import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Prompt, StationShell } from "@/components/game/StationShell";
import { QuizGame, Tabs, type QuizItem } from "@/components/game/QuizGame";
import { gameActions, speak } from "@/lib/game-store";

export const Route = createFileRoute("/tecnicas")({
  head: () => ({
    meta: [
      { title: "Expresión oral: rimas, trabalenguas y poemas | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Técnicas de expresión para niños: rimas, trabalenguas, poemas cortos y normas para hablar y escuchar.",
      },
      { property: "og:title", content: "Técnicas de expresión oral" },
      { property: "og:description", content: "Rimas, trabalenguas y buenas normas al hablar." },
    ],
  }),
  component: TecnicasPage,
});

const TEXTOS: { t: string; emoji: string; texto: string }[] = [
  { t: "Trabalenguas", emoji: "😜", texto: "Tres tristes tigres tragaban trigo en un trigal." },
  { t: "Trabalenguas", emoji: "🥁", texto: "Pablito clavó un clavito en la calva de un calvito." },
  { t: "Poema", emoji: "🌙", texto: "La luna se fue a dormir sobre una nube de algodón, y el viento le cantó bajito una dulce canción." },
  { t: "Rima", emoji: "🐈", texto: "El gato de mi vecina se paseaba en la cocina." },
  { t: "Ronda", emoji: "🎶", texto: "A la rueda, rueda, de pan y canela, dame un besito y vete a la escuela." },
];

function Repite() {
  const [i, setI] = useState(0);
  const item = TEXTOS[i]!;
  return (
    <>
      <Prompt>
        <span className="block text-6xl">{item.emoji}</span>
        <span className="mt-2 block text-xl">{item.t}</span>
      </Prompt>
      <p className="card-soft px-5 py-5 text-center font-display text-2xl leading-snug">{item.texto}</p>
      <div className="mt-4 grid gap-3">
        <BigButton tone="card" onClick={() => speak(item.texto)}>
          🔊 Escuchar
        </BigButton>
        <BigButton
          tone="primary"
          onClick={() => {
            gameActions.award("tecnicas", 2);
            setI((n) => (n + 1) % TEXTOS.length);
          }}
        >
          ✅ Ya lo repetí
        </BigButton>
      </div>
    </>
  );
}

const NORMAS: QuizItem[] = [
  { q: "Para hablar en clase primero…", visual: "✋", options: ["Levanto la mano", "Grito", "Interrumpo"], answer: "Levanto la mano" },
  { q: "Cuando alguien cuenta algo yo…", visual: "👂", options: ["Escucho con atención", "Hablo encima"], answer: "Escucho con atención" },
  { q: "Al hablar debo usar una voz…", visual: "🗣️", options: ["Clara y tranquila", "Muy bajita", "Gritando"], answer: "Clara y tranquila" },
  { q: "¿Qué palabra rima con 'gato'?", visual: "🐱", options: ["pato", "perro", "mesa"], answer: "pato" },
  { q: "¿Qué palabra rima con 'flor'?", visual: "🌷", options: ["color", "casa", "silla"], answer: "color" },
  { q: "¿Qué palabra rima con 'luna'?", visual: "🌕", options: ["cuna", "sol", "estrella"], answer: "cuna" },
  { q: "Antes de contar un cuento pienso en…", visual: "💭", options: ["El inicio", "El ruido", "La tarea"], answer: "El inicio" },
  { q: "Al terminar de hablar digo…", visual: "🙏", options: ["Gracias", "Nada"], answer: "Gracias" },
];

function TecnicasPage() {
  const [tab, setTab] = useState<"repite" | "normas">("repite");
  return (
    <StationShell title="Expresión oral" emoji="🎤">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "repite", label: "🎤 Repite" },
          { id: "normas", label: "🧠 Juega" },
        ]}
      />
      {tab === "repite" ? <Repite /> : <QuizGame station="tecnicas" items={NORMAS} />}
    </StationShell>
  );
}
