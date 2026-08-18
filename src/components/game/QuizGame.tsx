import { useMemo, useState } from "react";
import { BigButton, Feedback, Prompt } from "@/components/game/StationShell";
import { gameActions, playSound, shuffle, speak, type StationId } from "@/lib/game-store";

export type QuizItem = {
  /** Texto grande de la pregunta */
  q: string;
  /** Emoji o pista visual */
  visual?: string;
  /** Opciones (la primera es la correcta; se barajan) */
  options: string[];
  answer: string;
  /** Texto que se lee en voz alta al mostrar la pregunta */
  say?: string;
};

export function QuizGame({
  station,
  items = [],
  lang = "es-ES",
  stars = 2,
  columns = 2,
}: {
  station: StationId;
  items: QuizItem[];
  lang?: "es-ES" | "en-US";
  stars?: number;
  columns?: 1 | 2 | 3;
}) {
  // 1. BANCO DE DATOS INTEGRADO CON TODOS TUS TEMAS (Miles de ejemplos dinámicos)
  const nuevasPreguntas: QuizItem[] = useMemo(() => {
    // Generador aleatorio de operaciones matemáticas dinámicas para que nunca se repitan
    const mathDynamic: QuizItem[] = [];
    for (let i = 0; i < 15; i++) {
      const n1 = Math.floor(Math.random() * 40) + 11;
      const n2 = Math.floor(Math.random() * 40) + 11;
      const res = n1 + n2;
      const tipo = i % 2 === 0 ? "vertical" : "horizontal";
      mathDynamic.push({
        q: `Resuelve esta suma ${tipo}: ${n1} + ${n2} = ?`,
        visual: "🧮",
        answer: res.toString(),
        options: [res.toString(), (res + 5).toString(), (res - 2).toString()]
      });
    }

    return [
      // --- INGLÉS: HOJA 1 (LONG VOWELS) ---
      { q: "Which word has a Long 'A' sound like in 'Cake'?", visual: "🍰", answer: "Plane", options: ["Plane", "Cat", "Map", "Game", "Rain", "Day"] },
      { q: "Which word has a Long 'E' sound like in 'See'?", visual: "👀", answer: "Read", options: ["Read", "Web", "Leg", "She", "Hero", "He"] },
      { q: "Which word has a Long 'I' sound like in 'Pie'?", visual: "🥧", answer: "Night", options: ["Night", "Lip", "Six", "Fries", "Light", "Like"] },
      { q: "Which word has a Long 'O' sound like in 'Boat'?", visual: "⛵", answer: "Pony", options: ["Pony", "Box", "Log", "Toe", "Home", "Broke"] },
      { q: "Which word has a Long 'U' sound like in 'Music'?", visual: "🎵", answer: "Universe", options: ["Universe", "Bug", "Sun", "Mute", "Human", "Cube"] },

      // --- INGLÉS: HOJA 2 (SPELLING & CVC) ---
      { q: "Spell the word for this popular yellow fruit: B-A-N-A-N-A", visual: "🍌", answer: "Banana", options: ["Banana", "Moon", "Tall", "Big", "Map"] },
      { q: "Complete the CVC Word with Short 'A': M - _ - P", visual: "🗺️", answer: "Map", options: ["Map", "Mep", "Mop", "Mad", "Dad", "Can"] },
      { q: "Identify the Short 'I' word from your spelling list:", visual: "✏️", answer: "Lip", options: ["Lip", "Like", "Light", "Wig", "Pin", "Pig"] },
      { q: "Which zookeeper time expression matches when the zoo closes?", visual: "🔑", answer: "At night", options: ["At night", "In the morning", "In the afternoon"] },
      { q: "Where do you want to go? I want to go to the...", visual: "⛰️", answer: "mountains", options: ["mountains", "beach", "lake", "stream"] },

      // --- EDUCACIÓN PARA LA CIENCIA Y LA CIUDADANÍA ---
      { q: "¿Qué relación hay entre los cuerpos celestes del Sistema Solar?", visual: "🌍", answer: "La Tierra gira alrededor del Sol", options: ["La Tierra gira alrededor del Sol", "El Sol gira alrededor de la Tierra", "La Luna es más grande que el Sol"] },
      { q: "¿Cuál es un grave foco de contaminación ambiental?", visual: "🏭", answer: "El humo de fábricas y basura en ríos", options: ["El humo de fábricas y basura en ríos", "Sembrar plantas medicinales", "Caminar en el parque"] },
      { q: "¿Cuál es un recurso natural renovable que debemos cuidar?", visual: "💧", answer: "El agua potable", options: ["El agua potable", "El plástico de botellas", "Las bolsas de duroport"] },
      { q: "¿Qué animales y plantas viven en ecosistemas bajo el agua?", visual: "🐟", answer: "Los peces, corales y algas", options: ["Los peces, corales y algas", "Las mariposas y orugas", "Los leones y jirafas"] },
      { q: "¿Qué proceso ocurre cuando una oruga hace un capullo?", visual: "🐛", answer: "Se convierte en mariposa", options: ["Se convierte en mariposa", "Se vuelve un caracol", "Se queda durmiendo siempre"] },

      // --- GUATEMALA: CIVISMO Y TRADICIONES ---
      { q: "¿Cuál es nuestra moneda nacional y por qué es importante el ahorro?", visual: "🪙", answer: "El Quetzal, para cumplir metas futuras", options: ["El Quetzal, para cumplir metas futuras", "El Dólar, para gastarlo en juguetes", "El Peso, para guardarlo bajo la cama"] },
      { q: "¿Cuál de estos es un símbolo patrio oficial de Guatemala?", visual: "🇬🇹", answer: "La Monja Blanca y el Quetzal", options: ["La Monja Blanca and el Quetzal", "El Jaguar", "La Rosa Roja"] },
      { q: "¿Cuál es una ronda o tradición muy famosa en Guatemala?", visual: "🪁", answer: "Volar barriletes gigantes y jugar tute", options: ["Volar barriletes gigantes y jugar tute", "Hacer muñecos de nieve", "Buscar cangrejos gigantes"] },

      // --- COMUNICACIÓN Y LENGUAJE ---
      { q: "Elige la palabra que utiliza correctamente la diéresis (güe/güi):", visual: "🦆", answer: "Cigüeña", options: ["Cigüeña", "Cigueña", "Cigüenia"] },
      { q: "Identifica la palabra que tiene una combinación inversa vocal-s:", visual: "⭐", answer: "Estrella", options: ["Estrella", "Sartén", "Rosa"] },
      { q: "Completa la combinación de dos consonantes correctas: _ _ á t a n o", visual: "🍌", answer: "Pl", options: ["Pl", "Cl", "Bl", "Gl", "Pr"] },
      { q: "Completa con las consonantes correctas: El examen de la escuela fue _ _ _ _ _ .", visual: "📝", answer: "corto e interesante", options: ["corto e interesante", "aburrido y larguísimo", "imposible de leer"] },

      // --- APRENDIZAJE MATEMÁTICO ---
      { q: "Completa la secuencia numérica de 5 en 5: 80, 85, 90, 95, ___", visual: "🔢", answer: "100", options: ["100", "96", "105"] },
      { q: "Cuenta de 10 en 10 hacia adelante: 60, 70, 80, ___", visual: "📈", answer: "90", options: ["90", "85", "100"] },
      { q: "Cuenta de 20 en 20 de forma exacta: 20, 40, 60, ___", visual: "🧮", answer: "80", options: ["80", "70", "100"] },
      { q: "¿Qué número representa el signo romano 'X'?", visual: "🏛️", answer: "10", options: ["10", "5", "50"] },
      { q: "En la numeración maya, ¿cuánto vale una barra — ?", visual: "🪵", answer: "5", options: ["5", "1", "10"] },
      { q: "¿Qué medida de tiempo usamos para ver los días, semanas y meses del año?", visual: "📅", answer: "El calendario", options: ["El calendario", "El termómetro", "La regla de medir"] },
      
      ...mathDynamic
    ];
  }, []);

  // Combinamos de forma segura los ítems externos con todo nuestro nuevo banco educativo
  const listaCompleta = useMemo(() => {
    return [...items, ...nuevasPreguntas];
  }, [items, nuevasPreguntas]);

  const order = useMemo(() => shuffle(listaCompleta.map((_, i) => i)), [listaCompleta]);
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  
  const item = listaCompleta[order[idx % order.length]!]!;
  const options = useMemo(() => shuffle(item.options), [item]);

  function pick(o: string) {
    if (status !== "idle") return;
    if (o === item.answer) {
      setStatus("good");
      playSound("good");
      gameActions.award(station, stars);
      setTimeout(() => {
        setStatus("idle");
        setIdx((i) => i + 1);
      }, 1200);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  const cols = columns === 1 ? "grid-cols-1" : columns === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <>
      <Prompt>
        {item.visual && <span className="block text-6xl leading-tight">{item.visual}</span>}
        <span className="mt-2 block font-medium text-xl text-center px-2">{item.q}</span>
      </Prompt>
      <div className="mb-4 grid">
        <BigButton tone="card" onClick={() => speak(item.say ?? item.q, lang)}>
          🔊 Escuchar Pregunta
        </BigButton>
      </div>
      <div className={`grid gap-3 ${cols}`}>
        {options.map((o) => (
          <BigButton key={o} tone="sun" onClick={() => pick(o)} className="py-4 text-base">
            {o}
          </BigButton>
        ))}
      </div>
      <p className="mt-6 text-center text-sm font-bold text-muted-foreground">
        Pregunta {(idx % order.length) + 1} de {order.length} Misiones
      </p>
      <Feedback status={status} />
    </>
  );
}

export function Tabs<T extends string>({
     value,
     onChange,
     tabs,
     }: {
  value: T;
  onChange: (v: T) => void;
  tabs: { id: T; label: string }[];
}) {
  return (
    <div
      className="mb-4 grid gap-2"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((t) => (
        <BigButton
          key={t.id}
          tone={value === t.id ? "primary" : "card"}
          onClick={() => onChange(t.id)}
          className="!text-lg"
        >
          {t.label}
        </BigButton>
      ))}
    </div>
  );
} 