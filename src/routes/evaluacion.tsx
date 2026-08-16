import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { Tabs, QuizGame, type QuizItem } from "@/components/game/QuizGame";
import { gameActions, playSound, shuffle, speak } from "@/lib/game-store";

export const Route = createFileRoute("/evaluacion")({
  head: () => ({
    meta: [
      { title: "Comprensión lectora para niños | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Lecturas cortas con preguntas de comprensión, literatura infantil y adivinanzas, con lectura en voz alta.",
      },
      { property: "og:title", content: "Literatura y comprensión lectora" },
      { property: "og:description", content: "Lee cuentos cortos y responde preguntas." },
    ],
  }),
  component: EvaluacionPage,
});

type Lectura = {
  titulo: string;
  emoji: string;
  texto: string;
  preguntas: { q: string; options: string[]; answer: string }[];
};

const LECTURAS: Lectura[] = [
  {
    titulo: "El gato de Ana",
    emoji: "🐱",
    texto:
      "Ana tiene un gato blanco llamado Nube. Todas las mañanas Nube toma leche y luego duerme en la ventana. Por la tarde juega con una pelota roja.",
    preguntas: [
      { q: "¿Cómo se llama el gato?", options: ["Nube", "Luna", "Ana"], answer: "Nube" },
      { q: "¿De qué color es el gato?", options: ["Blanco", "Negro", "Café"], answer: "Blanco" },
      { q: "¿Qué toma en la mañana?", options: ["Leche", "Jugo", "Agua"], answer: "Leche" },
      { q: "¿Con qué juega por la tarde?", options: ["Una pelota roja", "Un carro", "Un globo"], answer: "Una pelota roja" },
    ],
  },
  {
    titulo: "La semilla de Pedro",
    emoji: "🌻",
    texto:
      "Pedro sembró una semilla en una maceta. La regó cada día con un poco de agua y la puso al sol. Después de dos semanas nació un girasol muy alto.",
    preguntas: [
      { q: "¿Qué sembró Pedro?", options: ["Una semilla", "Un árbol", "Una piedra"], answer: "Una semilla" },
      { q: "¿Qué le puso cada día?", options: ["Agua", "Leche", "Arena"], answer: "Agua" },
      { q: "¿Qué nació al final?", options: ["Un girasol", "Una rosa", "Un pino"], answer: "Un girasol" },
      { q: "¿Cuánto tiempo pasó?", options: ["Dos semanas", "Dos horas", "Un año"], answer: "Dos semanas" },
    ],
  },
  {
    titulo: "El paseo al lago",
    emoji: "🏞️",
    texto:
      "El sábado la familia fue al lago de Atitlán. Llevaron sandía y pan. María vio tres patos nadando y contó dos barcos. Regresaron a casa por la noche.",
    preguntas: [
      { q: "¿A dónde fueron?", options: ["Al lago de Atitlán", "Al mar", "Al parque"], answer: "Al lago de Atitlán" },
      { q: "¿Cuántos patos vio María?", options: ["Tres", "Dos", "Cinco"], answer: "Tres" },
      { q: "¿Qué llevaron de comer?", options: ["Sandía y pan", "Pizza", "Helado"], answer: "Sandía y pan" },
      { q: "¿Cuándo regresaron?", options: ["Por la noche", "En la mañana", "A medio día"], answer: "Por la noche" },
    ],
  },
];

function Lecturas() {
  const [i, setI] = useState(0);
  const [p, setP] = useState(0);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const lectura = LECTURAS[i]!;
  const pregunta = lectura.preguntas[p]!;
  const options = shuffle(pregunta.options);

  function pick(o: string) {
    if (status !== "idle") return;
    if (o === pregunta.answer) {
      setStatus("good");
      playSound("good");
      gameActions.award("evaluacion", 3);
      setTimeout(() => {
        setStatus("idle");
        if (p + 1 < lectura.preguntas.length) setP(p + 1);
        else {
          setP(0);
          setI((i + 1) % LECTURAS.length);
        }
      }, 1200);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <>
      <div className="card-soft mb-4 px-5 py-4">
        <p className="text-center text-4xl">{lectura.emoji}</p>
        <h2 className="mt-1 text-center font-display text-xl">{lectura.titulo}</h2>
        <p className="mt-2 text-lg font-bold leading-relaxed">{lectura.texto}</p>
        <div className="mt-3 grid">
          <BigButton tone="card" onClick={() => speak(`${lectura.titulo}. ${lectura.texto}`)}>
            🔊 Escuchar el cuento
          </BigButton>
        </div>
      </div>
      <Prompt>{pregunta.q}</Prompt>
      <div className="grid gap-3">
        {options.map((o) => (
          <BigButton key={o} tone="sun" onClick={() => pick(o)}>
            {o}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </>
  );
}

const ADIVINANZAS: QuizItem[] = [
  { q: "Vuela sin alas, silba sin boca…", visual: "💨", options: ["El viento", "El pájaro", "El avión"], answer: "El viento" },
  { q: "Blanca por dentro, verde por fuera; si quieres saber, espera.", visual: "🍐", options: ["La pera", "La sandía", "El limón"], answer: "La pera" },
  { q: "Tiene hojas y no es árbol, habla y no tiene boca.", visual: "📕", options: ["El libro", "La planta", "La radio"], answer: "El libro" },
  { q: "Oro parece, plata no es…", visual: "🍌", options: ["El plátano", "La moneda", "El sol"], answer: "El plátano" },
  { q: "¿Qué parte del cuento va al final?", visual: "📖", options: ["El final", "El inicio", "El título"], answer: "El final" },
  { q: "Los personajes de un cuento son…", visual: "🧒", options: ["Quienes actúan", "El lugar", "La hora"], answer: "Quienes actúan" },
  { q: "Una poesía se escribe en…", visual: "✒️", options: ["Versos", "Recetas", "Números"], answer: "Versos" },
  { q: "Una fábula siempre deja…", visual: "🦊", options: ["Una enseñanza", "Un dibujo", "Una canción"], answer: "Una enseñanza" },
];

function EvaluacionPage() {
  const [tab, setTab] = useState<"lecturas" | "literatura">("lecturas");
  return (
    <StationShell title="Comprensión lectora" emoji="📚">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "lecturas", label: "📖 Lee" },
          { id: "literatura", label: "🦊 Adivina" },
        ]}
      />
      {tab === "lecturas" ? <Lecturas /> : <QuizGame station="evaluacion" items={ADIVINANZAS} />}
    </StationShell>
  );
}
