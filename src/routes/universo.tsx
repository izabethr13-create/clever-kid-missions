import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StationShell } from "@/components/game/StationShell";
import { QuizGame, Tabs, type QuizItem } from "@/components/game/QuizGame";

export const Route = createFileRoute("/universo")({
  head: () => ({
    meta: [
      { title: "El Universo — Cuerpos celestes y recursos naturales | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Juegos sobre el universo para niños: relaciones entre los cuerpos celestes, objetos en el cielo, condiciones del tiempo, recursos naturales, minerales y focos de contaminación.",
      },
      { property: "og:title", content: "El Universo" },
      {
        property: "og:description",
        content: "Sol, Luna, planetas, clima, recursos naturales, minerales y contaminación.",
      },
    ],
  }),
  component: UniversoPage,
});

const CELESTES: QuizItem[] = [
  { q: "¿Qué astro nos da luz y calor de día?", visual: "☀️", options: ["El Sol", "La Luna", "Una estrella fugaz"], answer: "El Sol" },
  { q: "¿Qué vemos en el cielo de noche?", visual: "🌙", options: ["La Luna", "El Sol", "El arcoíris"], answer: "La Luna" },
  { q: "¿Alrededor de qué gira la Tierra?", visual: "🌍", options: ["Del Sol", "De la Luna", "De Marte"], answer: "Del Sol" },
  { q: "¿Qué gira alrededor de la Tierra?", visual: "🌎🌕", options: ["La Luna", "El Sol", "Las nubes"], answer: "La Luna" },
  { q: "¿En qué planeta vivimos?", visual: "🌏", options: ["La Tierra", "Júpiter", "El Sol"], answer: "La Tierra" },
  { q: "¿Qué son esos puntitos brillantes de la noche?", visual: "✨", options: ["Estrellas", "Piedras", "Focos"], answer: "Estrellas" },
  { q: "¿Cómo se llama el conjunto de planetas y el Sol?", visual: "🪐", options: ["Sistema Solar", "Bosque", "Océano"], answer: "Sistema Solar" },
  { q: "¿Qué pasa cuando la Tierra gira sobre sí misma?", visual: "🔄", options: ["El día y la noche", "Llueve", "Nieva"], answer: "El día y la noche" },
];

const CIELO: QuizItem[] = [
  { q: "¿Esto vuela en el cielo y lo hizo el ser humano?", visual: "✈️", options: ["Avión", "Nube", "Estrella"], answer: "Avión" },
  { q: "¿Qué objeto natural vemos en el cielo?", visual: "☁️", options: ["Nube", "Cohete", "Cometa de papel"], answer: "Nube" },
  { q: "¿Qué es esto que vuela en el cielo?", visual: "🚁", options: ["Helicóptero", "Planeta", "Luna"], answer: "Helicóptero" },
  { q: "¿Qué viaja al espacio?", visual: "🚀", options: ["Cohete", "Bicicleta", "Barco"], answer: "Cohete" },
  { q: "¿Qué animal vuela en el cielo?", visual: "🐦", options: ["Pájaro", "Pez", "Perro"], answer: "Pájaro" },
  { q: "¿Qué aparece después de la lluvia con sol?", visual: "🌈", options: ["Arcoíris", "Nieve", "Volcán"], answer: "Arcoíris" },
  { q: "¿Qué cae del cielo cuando llueve?", visual: "🌧️", options: ["Agua", "Arena", "Fuego"], answer: "Agua" },
  { q: "¿Qué juguete vuela con el viento?", visual: "🪁", options: ["Barrilete", "Pelota", "Muñeca"], answer: "Barrilete" },
];

const TIEMPO: QuizItem[] = [
  { q: "¿Cómo está el tiempo?", visual: "☀️", options: ["Soleado", "Lluvioso", "Nevado"], answer: "Soleado" },
  { q: "¿Cómo está el tiempo?", visual: "🌧️", options: ["Lluvioso", "Soleado", "Ventoso"], answer: "Lluvioso" },
  { q: "¿Cómo está el tiempo?", visual: "🌬️", options: ["Ventoso", "Caluroso", "Nublado"], answer: "Ventoso" },
  { q: "¿Cómo está el tiempo?", visual: "☁️", options: ["Nublado", "Soleado", "Nevado"], answer: "Nublado" },
  { q: "¿Cómo está el tiempo?", visual: "❄️", options: ["Frío", "Caluroso", "Soleado"], answer: "Frío" },
  { q: "¿Cómo está el tiempo?", visual: "⛈️", options: ["Tormenta", "Despejado", "Seco"], answer: "Tormenta" },
  { q: "Si llueve, ¿qué me llevo?", visual: "☂️", options: ["Paraguas", "Lentes de sol", "Sandalias"], answer: "Paraguas" },
  { q: "Si hace mucho sol, ¿qué me pongo?", visual: "🧴", options: ["Bloqueador y gorra", "Bufanda", "Botas de lluvia"], answer: "Bloqueador y gorra" },
];

const RECURSOS: QuizItem[] = [
  { q: "¿Es un recurso natural?", visual: "💧", options: ["Sí, el agua", "No, es artificial"], answer: "Sí, el agua" },
  { q: "¿Es un recurso natural?", visual: "🌳", options: ["Sí, los árboles", "No, es artificial"], answer: "Sí, los árboles" },
  { q: "¿Es un recurso natural?", visual: "📱", options: ["No, es artificial", "Sí, es natural"], answer: "No, es artificial" },
  { q: "¿Es un recurso natural?", visual: "🌬️", options: ["Sí, el aire", "No, es artificial"], answer: "Sí, el aire" },
  { q: "¿Es un recurso natural?", visual: "🚗", options: ["No, es artificial", "Sí, es natural"], answer: "No, es artificial" },
  { q: "¿Es un recurso natural?", visual: "🪨", options: ["Sí, las rocas", "No, es artificial"], answer: "Sí, las rocas" },
  { q: "¿Es un recurso natural?", visual: "🏭", options: ["No, es artificial", "Sí, es natural"], answer: "No, es artificial" },
  { q: "¿Es un recurso natural?", visual: "🌾", options: ["Sí, las plantas", "No, es artificial"], answer: "Sí, las plantas" },
];

const CONTAMINACION: QuizItem[] = [
  { q: "¿Esto contamina o cuida el ambiente?", visual: "🏭", options: ["Contamina el aire", "Cuida el ambiente"], answer: "Contamina el aire" },
  { q: "¿Esto contamina o cuida el ambiente?", visual: "🗑️", options: ["Contamina", "Cuida el ambiente"], answer: "Contamina" },
  { q: "¿Esto contamina o cuida el ambiente?", visual: "♻️", options: ["Cuida el ambiente", "Contamina"], answer: "Cuida el ambiente" },
  { q: "Tirar basura al río…", visual: "🌊🗑️", options: ["Contamina el agua", "Limpia el agua"], answer: "Contamina el agua" },
  { q: "El humo de los carros…", visual: "🚗💨", options: ["Contamina el aire", "Limpia el aire"], answer: "Contamina el aire" },
  { q: "Sembrar árboles…", visual: "🌱", options: ["Cuida el ambiente", "Contamina"], answer: "Cuida el ambiente" },
  { q: "Dejar la llave abierta…", visual: "🚰", options: ["Desperdicia el agua", "Ahorra agua"], answer: "Desperdicia el agua" },
  { q: "Poner música muy fuerte…", visual: "🔊", options: ["Contamina con ruido", "No pasa nada"], answer: "Contamina con ruido" },
];

const MINERALES: QuizItem[] = [
  { q: "¿Qué mineral es?", visual: "🪙", options: ["Oro", "Madera", "Plástico"], answer: "Oro" },
  { q: "¿Qué es esto?", visual: "💎", options: ["Un mineral precioso", "Una fruta", "Un animal"], answer: "Un mineral precioso" },
  { q: "La sal que comemos, ¿de dónde viene?", visual: "🧂", options: ["Es un mineral", "Es un animal", "Es una planta"], answer: "Es un mineral" },
  { q: "¿Con qué mineral se hacen los clavos?", visual: "🔩", options: ["Hierro", "Algodón", "Papel"], answer: "Hierro" },
  { q: "¿Es mineral o ser vivo?", visual: "🪨", options: ["Mineral", "Ser vivo"], answer: "Mineral" },
  { q: "¿Es mineral o ser vivo?", visual: "🐢", options: ["Ser vivo", "Mineral"], answer: "Ser vivo" },
  { q: "¿De dónde sacamos los minerales?", visual: "⛏️", options: ["De la tierra (minas)", "De los árboles", "Del cielo"], answer: "De la tierra (minas)" },
  { q: "¿Con qué mineral se hace el lápiz?", visual: "✏️", options: ["Grafito", "Azúcar", "Leche"], answer: "Grafito" },
];

type Tab = "celestes" | "cielo" | "tiempo" | "recursos" | "contaminacion" | "minerales";

function UniversoPage() {
  const [tab, setTab] = useState<Tab>("celestes");
  const data: Record<Tab, QuizItem[]> = {
    celestes: CELESTES,
    cielo: CIELO,
    tiempo: TIEMPO,
    recursos: RECURSOS,
    contaminacion: CONTAMINACION,
    minerales: MINERALES,
  };
  return (
    <StationShell title="El Universo" emoji="🪐">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "celestes", label: "🌞" },
          { id: "cielo", label: "✈️" },
          { id: "tiempo", label: "🌦️" },
        ]}
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "recursos", label: "🌳" },
          { id: "contaminacion", label: "🏭" },
          { id: "minerales", label: "💎" },
        ]}
      />
      <QuizGame key={tab} station="universo" items={data[tab]} />
    </StationShell>
  );
}
