import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StationShell } from "@/components/game/StationShell";
import { QuizGame, Tabs, type QuizItem } from "@/components/game/QuizGame";
import { BigButton, Prompt } from "@/components/game/StationShell";
import { gameActions, speak } from "@/lib/game-store";

export const Route = createFileRoute("/guatemala")({
  head: () => ({
    meta: [
      { title: "Guatemala — Símbolos patrios, civismo y tradiciones | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Juegos de civismo para niños: símbolos patrios de Guatemala, mapa y departamentos, rondas infantiles, juegos y tradiciones.",
      },
      { property: "og:title", content: "Guatemala: civismo y símbolos patrios" },
      {
        property: "og:description",
        content: "Bandera, quetzal, monja blanca, ceiba, mapa y tradiciones guatemaltecas.",
      },
    ],
  }),
  component: GuatemalaPage,
});

const SIMBOLOS: QuizItem[] = [
  { q: "¿Cuál es el ave símbolo de Guatemala?", visual: "🦜", options: ["El Quetzal", "La paloma", "El águila"], answer: "El Quetzal" },
  { q: "¿Cuál es la flor nacional?", visual: "🌸", options: ["La Monja Blanca", "La rosa", "El girasol"], answer: "La Monja Blanca" },
  { q: "¿Cuál es el árbol nacional?", visual: "🌳", options: ["La Ceiba", "El pino", "El mango"], answer: "La Ceiba" },
  { q: "¿De qué colores es la bandera de Guatemala?", visual: "🇬🇹", options: ["Celeste y blanco", "Rojo y verde", "Amarillo y azul"], answer: "Celeste y blanco" },
  { q: "¿Cómo se llama nuestro himno?", visual: "🎵", options: ["Himno Nacional de Guatemala", "Las mañanitas", "Feliz cumpleaños"], answer: "Himno Nacional de Guatemala" },
  { q: "¿Qué se canta de pie y en silencio?", visual: "🧍", options: ["El Himno Nacional", "Una ronda", "Una canción de cuna"], answer: "El Himno Nacional" },
  { q: "¿Qué animal aparece en el escudo?", visual: "🛡️", options: ["El Quetzal", "El jaguar", "El toro"], answer: "El Quetzal" },
  { q: "¿Qué representa el color celeste de la bandera?", visual: "💧", options: ["El cielo y el mar", "El fuego", "La tierra"], answer: "El cielo y el mar" },
  { q: "¿Cuándo celebramos la Independencia?", visual: "🎉", options: ["15 de septiembre", "25 de diciembre", "1 de enero"], answer: "15 de septiembre" },
  { q: "¿Cuál es la moneda de Guatemala?", visual: "💵", options: ["El Quetzal", "El dólar", "El euro"], answer: "El Quetzal" },
];

const CIVISMO: QuizItem[] = [
  { q: "Un compañero se cae, ¿qué haces?", visual: "🤕", options: ["Lo ayudo a levantarse", "Me río de él"], answer: "Lo ayudo a levantarse" },
  { q: "Encuentras basura en el patio…", visual: "🍬", options: ["La tiro al basurero", "La dejo ahí"], answer: "La tiro al basurero" },
  { q: "Cuando alguien habla, yo…", visual: "👂", options: ["Escucho con respeto", "Grito más fuerte"], answer: "Escucho con respeto" },
  { q: "Al recibir un regalo digo…", visual: "🎁", options: ["Gracias", "Nada"], answer: "Gracias" },
  { q: "Para cruzar la calle uso…", visual: "🚸", options: ["El paso de cebra", "Corro sin ver"], answer: "El paso de cebra" },
  { q: "En la fila del recreo…", visual: "🧑‍🤝‍🧑", options: ["Espero mi turno", "Me meto adelante"], answer: "Espero mi turno" },
  { q: "Si rompo algo sin querer…", visual: "🧩", options: ["Pido disculpas", "Culpo a otro"], answer: "Pido disculpas" },
  { q: "Cuidar mi escuela significa…", visual: "🏫", options: ["No rayar las paredes", "Pintar los pupitres"], answer: "No rayar las paredes" },
];

const MAPA: QuizItem[] = [
  { q: "¿En qué continente está Guatemala?", visual: "🗺️", options: ["América", "Europa", "Asia"], answer: "América" },
  { q: "¿Cuál es la capital de Guatemala?", visual: "🏙️", options: ["Ciudad de Guatemala", "Antigua", "Quetzaltenango"], answer: "Ciudad de Guatemala" },
  { q: "¿Qué lago famoso está en Guatemala?", visual: "🏞️", options: ["Lago de Atitlán", "Lago Titicaca", "Mar Rojo"], answer: "Lago de Atitlán" },
  { q: "¿Qué hay mucho en Guatemala?", visual: "🌋", options: ["Volcanes", "Desiertos de hielo", "Pingüinos"], answer: "Volcanes" },
  { q: "¿Cuántos departamentos tiene Guatemala?", visual: "📍", options: ["22", "10", "50"], answer: "22" },
  { q: "¿Qué país está al norte de Guatemala?", visual: "⬆️", options: ["México", "Chile", "España"], answer: "México" },
  { q: "¿Qué idioma se habla más en Guatemala?", visual: "🗣️", options: ["Español", "Francés", "Alemán"], answer: "Español" },
  { q: "¿Qué ciudad colonial es famosa por su empedrado?", visual: "⛪", options: ["Antigua Guatemala", "Cobán", "Escuintla"], answer: "Antigua Guatemala" },
];

const TRADICIONES: { title: string; emoji: string; text: string }[] = [
  { title: "Ronda: A la rueda de San Miguel", emoji: "🎶", text: "A la rueda, rueda de San Miguel, San Miguel, todos traen su caja de miel." },
  { title: "Ronda: Arroz con leche", emoji: "🍚", text: "Arroz con leche, me quiero casar, con una señorita de la capital." },
  { title: "Ronda: Doña Blanca", emoji: "🏰", text: "Doña Blanca está cubierta de pilares de oro y plata." },
  { title: "Juego: El barrilete", emoji: "🪁", text: "En noviembre volamos barriletes gigantes de colores." },
  { title: "Juego: La cuerda", emoji: "🤸", text: "Saltamos la cuerda contando uno, dos, tres, cuatro." },
  { title: "Tradición: La marimba", emoji: "🎹", text: "La marimba es el instrumento nacional de Guatemala." },
  { title: "Tradición: Fiambre", emoji: "🥗", text: "El fiambre se come el 1 de noviembre con la familia." },
  { title: "Tradición: Alfombras de aserrín", emoji: "🌺", text: "En Semana Santa se hacen alfombras de aserrín de colores." },
  { title: "Tradición: Trajes típicos", emoji: "👗", text: "Los huipiles son tejidos a mano con muchos colores." },
  { title: "Juego: Trompo y cincos", emoji: "🌀", text: "El trompo baila y los cincos ruedan en el patio." },
];

type Tab = "simbolos" | "civismo" | "mapa" | "rondas";

function GuatemalaPage() {
  const [tab, setTab] = useState<Tab>("simbolos");
  return (
    <StationShell title="Guatemala" emoji="🇬🇹">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "simbolos", label: "🦜" },
          { id: "civismo", label: "🤝" },
          { id: "mapa", label: "🗺️" },
          { id: "rondas", label: "🎶" },
        ]}
      />
      {tab === "rondas" ? (
        <Rondas />
      ) : (
        <QuizGame
          key={tab}
          station="guatemala"
          items={tab === "simbolos" ? SIMBOLOS : tab === "civismo" ? CIVISMO : MAPA}
        />
      )}
    </StationShell>
  );
}

function Rondas() {
  return (
    <>
      <Prompt>Rondas, juegos y tradiciones 🇬🇹</Prompt>
      <ul className="grid gap-3">
        {TRADICIONES.map((t) => (
          <li key={t.title}>
            <BigButton
              tone="card"
              className="w-full !text-left !text-lg"
              onClick={() => {
                speak(`${t.title}. ${t.text}`, "es-ES");
                gameActions.award("guatemala", 1);
              }}
            >
              <span className="mr-2 text-3xl">{t.emoji}</span>
              {t.title}
              <span className="mt-1 block text-sm font-bold opacity-70">{t.text}</span>
            </BigButton>
          </li>
        ))}
      </ul>
    </>
  );
}
