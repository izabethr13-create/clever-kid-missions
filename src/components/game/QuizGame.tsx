import { useMemo, useState } from "react";
import { BigButton } from "@/components/game/StationShell";
import { speak, playSound, type StationId } from "@/lib/game-store";

export type QuizItem = {
  q: string;
  visual?: string;
  options: string[];
  answer: string;
  say?: string;
  text?: string;
};

export function QuizGame({
  station,
  items = [],
  lang = "es-ES",
  stars = 2,
  columns = 2,
}: {
  station: StationId;
  items?: QuizItem[];
  lang?: "es-ES" | "en-US";
  stars?: number;
  columns?: 1 | 2 | 3;
}) {
  const [activeTab, setActiveTab] = useState<"misiones" | "lectura">("misiones");
  const [idx, setIdx] = useState(0);

  const preguntasMisiones: QuizItem[] = useMemo(() => {
    const mathDynamic: QuizItem[] = [];
    for (let i = 0; i < 15; i++) {
      const n1 = Math.floor(Math.random() * 25) + 51;
      const n2 = Math.floor(Math.random() * 24) + 1;
      const res = n1 + n2;
      mathDynamic.push({
        q: `Resuelve la suma:\n ${n1}\n+ ${n2}\n------\n= ?`,
        visual: "🧮",
        answer: res.toString(),
        options: [res.toString(), (res + i + 1).toString(), (res - 3).toString()],
      });
    }

    return [
      { q: "Long A: Which word makes the long A sound?", visual: "🍰", answer: "Cake", options: ["Cake", "Cat", "Map", "Bat"] },
      { q: "Long A: Complete the words list: Rain, Plane, Game, and...", visual: "✈️", answer: "Day", options: ["Day", "Dad", "Man", "Hat"] },
      { q: "Long E: Choose the word with the same sound as 'See':", visual: "👀", answer: "Read", options: ["Read", "Web", "Leg", "Jet"] },
      { q: "Long E: Complete the list: She, Hero, He, and...", visual: "🦸", answer: "See", options: ["See", "Short", "Red", "Wet"] },
      { q: "Long I: Which word sounds like 'Pie'?", visual: "🥧", answer: "Night", options: ["Night", "Lip", "Pig", "Six"] },
      { q: "Long I: Complete the list: Fries, Light, Like, and...", visual: "🍟", answer: "Pie", options: ["Pie", "Pin", "Sit", "Wig"] },
      { q: "Long O: Which word has the long O sound like 'Boat'?", visual: "⛵", answer: "Pony", options: ["Pony", "Box", "Log", "Fog"] },
      { q: "Long O: Complete the list: Toe, Home, Broke, and...", visual: "🏠", answer: "Boat", options: ["Boat", "Bot", "Mom", "Dog"] },
      { q: "Long U: Which word has the long U sound like 'Music'?", visual: "🎵", answer: "Universe", options: ["Universe", "Bug", "Sun", "Rug"] },
      { q: "Long U: Complete the list: Mute, Human, Cube, and...", visual: "🧊", answer: "Music", options: ["Music", "Bus", "Cut", "Up"] },

      { q: "Spelling Bee: How do you spell 'Cat'?", visual: "🐱", answer: "Cat", options: ["Cat", "Car", "Cut"] },
      { q: "Spelling Bee: How do you spell 'Car'?", visual: "🚗", answer: "Car", options: ["Car", "Cat", "Can"] },
      { q: "Spelling Bee: How do you spell 'Hot'?", visual: "☀️", answer: "Hot", options: ["Hot", "Hat", "Hog"] },
      { q: "Spelling Bee: How do you spell 'Bat'?", visual: "🦇", answer: "Bat", options: ["Bat", "Bit", "Bad"] },
      { q: "Spelling Bee: How do you spell 'Kids'?", visual: "👧", answer: "Kids", options: ["Kids", "Kits", "Kind"] },

      { q: "Short A CVC: Complete the word list: Map, Mad, Dad, Fan, and...", visual: "🥫", answer: "Can", options: ["Can", "Cake", "Car"] },
      { q: "Short E CVC: Complete the word list: Web, Leg, Jet, Wet, and...", visual: "🔴", answer: "Red", options: ["Red", "Read", "Run"] },

      { q: "What is this? 🦘", visual: "🦘", answer: "It is a kangaroo.", options: ["It is a kangaroo.", "It is a lion.", "It is an elephant."] },
      { q: "Do you see the crocodiles? 🐊", visual: "🐊", answer: "Yes, I do.", options: ["Yes, I do.", "No, I am not.", "Yes, it is."] },

      { q: "¿Qué relación hay entre los cuerpos celestes de nuestro cielo?", visual: "☀️", answer: "La Tierra y los planetas giran alrededor del Sol", options: ["La Tierra y los planetas giran alrededor del Sol", "Las estrellas están pegadas a las nubes"] },
      { q: "¿Cuál representa un grave foco de contaminación ambiental?", visual: "🗑️", answer: "Tirar basura en las calles y humo de fábricas", options: ["Tirar basura en las calles y humo de fábricas", "Sembrar plantas medicinales"] },

      ...mathDynamic,
    ];
  }, []);

  const preguntasLectura: QuizItem[] = useMemo(() => {
    return [
      { q: "Técnica Lectoras: Lee rápido y encuentra la sílaba que falta: bla, ble, ___, blo, blu", visual: "✏️", answer: "bli", options: ["bli", "bil", "bal"] },
      { q: "Técnica CVC: Junta los sonidos en tu mente rápido. ¿Qué palabra se forma? [ M - A - P ]", visual: "🗺️", answer: "Map", options: ["Map", "Mop", "Man"] },
      {
        text: "El Quetzalito vuela alegre sobre el bosque nuboso de Guatemala. Tiene plumas de color verde brillante y busca aguacatillos maduros en las ramas altas para compartir con sus amigos de la selva.",
        q: "¿De qué color son las plumas del Quetzalito?",
        visual: "🦜",
        answer: "Verde brillante",
        options: ["Verde brillante", "Rojo fuego", "Azul marino"],
      },
      {
        text: "Mateo guarda una moneda de un Quetzal en su alcancía de barro todos los viernes. Sabe que con el hábito del ahorro podrá comprarse el hermoso libro de cuentos del espacio exterior que vio en la escuela.",
        q: "¿Qué guarda Mateo en su alcancía todos los viernes?",
        visual: "🐂",
        answer: "Una moneda de un Quetzal",
        options: ["Una moneda de un Quetzal", "Un juguete de plástico", "Un dulce de fresa"],
      },
      {
        text: "La oruga Lili caminaba despacio por una hoja verde. Un día, hizo un capullo suave para dormir durante dos semanas. Al despertar, rompió el capullo, abrió unas hermosas alas de colores y se transformó en una linda mariposa.",
        q: "¿En qué se transformó la oruga Lili al final del cuento?",
        visual: "🦋",
        answer: "En una linda mariposa",
        options: ["En una linda mariposa", "En un caracol rápido", "En una abejita"],
      },
    ];
  }, []);

  const currentQuestions = items.length > 0 ? items : activeTab === "misiones" ? preguntasMisiones : preguntasLectura;
  const currentItem = currentQuestions[idx] ?? currentQuestions[0];

  const pick = (selectedOption: string) => {
  if (!currentItem) return;

  if (selectedOption === currentItem.answer) {
    playSound?.("success" as any);
  } else {
    playSound?.("error" as any);
  }

  if (currentQuestions.length > 0) {
    setIdx((prev) => (prev + 1) % currentQuestions.length);
  }
};

  const gridColsClass = columns === 1 ? "grid-cols-1" : columns === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={activeTab}
        onChange={(v) => {
          setActiveTab(v);
          setIdx(0);
        }}
        tabs={[
          { id: "misiones", label: "🌟 Bloque de Misiones Completas" },
          { id: "lectura", label: "🏝️ Isla de Comprensión Lectora" },
        ]}
      />

      {currentItem && (
        <div className="flex flex-col gap-4">
          {currentItem.visual && (
            <div className="text-4xl text-center">{currentItem.visual}</div>
          )}

          {currentItem.text && (
            <p className="text-lg italic font-medium text-center">
              📖 "{currentItem.text}"
            </p>
          )}

          <h2 className="text-xl font-bold text-center whitespace-pre-line">
            {currentItem.q}
          </h2>

          <BigButton
            tone="card"
            onClick={() =>
              speak(
                currentItem.text
                  ? `${currentItem.text} ... Pregunta: ${currentItem.q}`
                  : currentItem.q,
                lang
              )
            }
          >
            {currentItem.text ? "🔊 Escuchar Historia" : "🔊 Escuchar Pregunta"}
          </BigButton>

          <div className={`grid gap-3 ${gridColsClass}`}>
            {currentItem.options.map((o) => (
              <BigButton
                key={o}
                tone="sun"
                onClick={() => pick(o)}
                className="py-4 text-base"
              >
                {o}
              </BigButton>
            ))}
          </div>

          <p className="text-sm text-center text-muted-foreground mt-2">
            Pregunta {idx + 1} de {currentQuestions.length} en{" "}
            {activeTab === "lectura" ? "Isla de Lectura" : "Misiones"}
          </p>
        </div>
      )}
    </div>
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
      className="mb-6 grid gap-2"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((t) => (
        <BigButton
          key={t.id}
          tone={value === t.id ? "primary" : "card"}
          onClick={() => onChange(t.id)}
          className="!text-xs font-bold whitespace-normal h-auto min-h-[44px] py-2"
        >
          {t.label}
        </BigButton>
      ))}
    </div>
  );
}