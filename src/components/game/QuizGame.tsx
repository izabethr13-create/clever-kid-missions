import { useMemo, useState, useEffect, useRef } from "react";
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

export type IslandId =
  | "trazado"
  | "ciencia_ciudadania"
  | "comunicacion_lenguaje"
  | "lectura"
  | "matemáticas_espanol"
  | "conversation"
  | "grammar"
  | "phonics"
  | "numbers"
  | "science"
  | "vocabulary"
  | "math"
  | "pre_reading"
  | "spelling";

export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
}: {
  value: T;
  onChange: (value: T) => void;
  tabs: ReadonlyArray<{ id: T; label: string }>;
}) {
  return (
    <div
      role="tablist"
      className="mb-5 flex gap-2 overflow-x-auto rounded-3xl bg-muted p-2"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === value;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`toy-press min-w-16 flex-1 rounded-2xl px-4 py-3 font-display text-lg transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// --- LISTA DE REPRODUCCIÓN DE MÚSICA INFANTIL DE FONDO ---
const BACKGROUND_PLAYLIST = [
  "https://actions.google.com/sounds/v1/ambiences/children_playing.ogg",
  "https://actions.google.com/sounds/v1/cartoon/toy_music_box.ogg",
  "https://actions.google.com/sounds/v1/cartoon/happy_whistle.ogg",
];

// --- SUBCOMPONENTE DE TRAZADO INTERACTIVO (SIN LÍNEA VERDE OBLIGATORIA) ---
function TracingCanvas({
  letter = "b",
  onComplete,
}: {
  letter?: string;
  onComplete?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [letter]);

  const getCoordinates = (
    e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ("clientX" in e) {
      return {
        x: (e as MouseEvent).clientX - rect.left,
        y: (e as MouseEvent).clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#3b82f6"; // Color azul del trazo
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Al soltar el dedo o ratón, completa directamente sin pedir la línea verde
  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    playSound?.("success" as any);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative w-72 h-72 bg-white rounded-3xl shadow-md border border-border flex items-center justify-center overflow-hidden touch-none">
        {/* Letra de guía clara al fondo */}
        <span className="absolute select-none text-[180px] font-bold text-muted-foreground/20 pointer-events-none">
          {letter}
        </span>

        {/* Canvas interactivo */}
        <canvas
          ref={canvasRef}
          width={288}
          height={288}
          className="absolute inset-0 z-10 cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <p className="text-sm font-semibold text-center text-muted-foreground">
        Escribe la letra encima
      </p>
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState<IslandId>("trazado");
  const [idx, setIdx] = useState(0);

  // Lista de letras para el módulo de trazado
  const lettersList = ["b", "g", "y", "f", "h", "a", "m", "p", "s", "t"];

  // --- REPRODUCTOR DE MÚSICA MULTI-CANCIÓN ---
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(BACKGROUND_PLAYLIST[currentTrackIdx]);
    audio.volume = 0.15;
    audioRef.current = audio;

    if (!isMuted) {
      audio.play().catch(() => {});
    }

    const handleEnded = () => {
      setCurrentTrackIdx((prev) => (prev + 1) % BACKGROUND_PLAYLIST.length);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [currentTrackIdx]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  const nextSong = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % BACKGROUND_PLAYLIST.length);
  };

  // --- BASE DE DATOS ORGANIZADA POR ISLAS ---
  const islasData: Record<IslandId, QuizItem[]> = useMemo(() => {
    const mathDynamic: QuizItem[] = [];
    for (let i = 0; i < 10; i++) {
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

    return {
      trazado: [],
      ciencia_ciudadania: [
        { q: "¿Qué relación hay entre los cuerpos celestes de nuestro cielo?", visual: "☀️", answer: "La Tierra y los planetas giran alrededor del Sol", options: ["La Tierra y los planetas giran alrededor del Sol", "Las estrellas están pegadas a las nubes"] },
        { q: "¿Cuál representa un grave foco de contaminación ambiental?", visual: "🗑️", answer: "Tirar basura en las calles y humo de fábricas", options: ["Tirar basura en las calles y humo de fábricas", "Sembrar plantas medicinales"] },
        { q: "¿Cuál de estos es un recurso natural vital para la vida?", visual: "🌳", answer: "Los bosques y el agua", options: ["Los bosques y el agua", "Las botellas de plástico", "Los juguetes"] },
        { q: "Civismo de Guatemala: ¿Cuál es nuestra moneda nacional?", visual: "🪙", answer: "El Quetzal", options: ["El Quetzal", "El Dólar", "El Peso"] },
        { q: "¿Cuál es un símbolo patrio oficial de la República de Guatemala?", visual: "🇬🇹", answer: "La Monja Blanca y la Ceiba", options: ["La Monja Blanca y la Ceiba", "El Tigre y la Palma", "El Escudo de México"] },
        { q: "¿Cuál es una ronda, juego o tradición típica de Guatemala?", visual: "🪁", answer: "Volar barriletes gigantes y jugar trompo", options: ["Volar barriletes gigantes y jugar trompo", "Hacer muñecos de nieve"] },
      ],
      comunicacion_lenguaje: [
        { q: "Consonantes: Elige la palabra escrita correctamente con 'Ww' o 'Xx':", visual: "📝", answer: "Xilófono", options: ["Xilófono", "Wilófono", "Silófono"] },
        { q: "Letras Inversas: Identifica la palabra con la inversión vocal-s (as, es, is, os, us):", visual: "🏰", answer: "Castillo", options: ["Castillo", "Saco", "Rosa"] },
        { q: "Uso de la Diéresis: ¿Qué palabra lleva los puntitos en la Ü (güe / güi)?", visual: "🐧", answer: "Pingüino", options: ["Pingüino", "Pinguino", "Pinginia"] },
        { q: "Combinación de dos consonantes: Completa la palabra [_ _ á t a n o]", visual: "🍌", answer: "Pl", options: ["Pl", "Bl", "Cl", "Gl"] },
        { q: "Combinación de dos consonantes: Completa la palabra [_ _ u t a]", visual: "🍎", answer: "Fr", options: ["Fr", "Pr", "Tr", "Dr"] },
      ],
      lectura: [
        { q: "Técnica Lectoras: Lee rápido y encuentra la sílaba que falta: bla, ble, ___, blo, blu", visual: "✏️", answer: "bli", options: ["bli", "bil", "bal"] },
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
      ],
      matemáticas_espanol: [
        { q: "¿Cómo se escribe el número Romano para el valor 5?", visual: "🏛️", answer: "V", options: ["V", "X", "I"] },
        { q: "¿Cómo se escribe el número Romano para el valor 10?", visual: "🏛️", answer: "X", options: ["X", "V", "L"] },
        { q: "Numeración Maya: ¿Qué valor representa una barra horizontal — ?", visual: "🪵", answer: "5", options: ["5", "1", "10", "0"] },
        { q: "Numeración Maya: ¿Qué valor representa un punto • ?", visual: "⚪", answer: "1", options: ["1", "5", "0"] },
        { q: "Conteo de 5 en 5: Completa la serie: 70, 75, 80, 85, ___", visual: "📈", answer: "90", options: ["90", "86", "95"] },
        { q: "Conteo de 10 en 10: Completa la serie: 60, 70, 80, ___", visual: "🔢", answer: "90", options: ["90", "85", "100"] },
        { q: "Medidas de tiempo: ¿Qué instrumento nos ayuda a ver las semanas y meses del año?", visual: "📅", answer: "El calendario", options: ["El calendario", "El reloj", "La regla"] },
        ...mathDynamic,
      ],
      conversation: [
        { q: "What is this? 🦘", visual: "🦘", answer: "It is a kangaroo.", options: ["It is a kangaroo.", "It is a lion.", "It is an elephant."] },
        { q: "Do you see the crocodiles? 🐊", visual: "🐊", answer: "Yes, I do.", options: ["Yes, I do.", "No, I am not.", "Yes, it is."] },
        { q: "What are the monkeys doing? 🐒", visual: "🐒", answer: "They are eating.", options: ["They are eating.", "They are flying.", "They are swimming."] },
        { q: "Where do you want to go? ⛰️", visual: "⛰️", answer: "I want to go to the mountains.", options: ["I want to go to the mountains.", "I want to go to the beach.", "I want to go to the lake."] },
        { q: "What we can do in the mountains?", visual: "🥾", answer: "Let's go hiking.", options: ["Let's go hiking.", "Let's go fishing.", "Let's go jogging."] },
      ],
      grammar: [
        { q: "Zookeeper routine: What happens in the morning?", visual: "🌅", answer: "The zookeeper opens the zoo.", options: ["The zookeeper opens the zoo.", "The zookeeper closes the zoo.", "The zookeeper sweeps the exhibit."] },
        { q: "Zookeeper routine: What happens in the afternoon?", visual: "☀️", answer: "The zookeeper sweeps the monkey's exhibit.", options: ["The zookeeper sweeps the monkey's exhibit.", "The zookeeper opens the zoo."] },
        { q: "Zookeeper routine: What happens at night?", visual: "🌃", answer: "The zookeeper closes the zoo.", options: ["The zookeeper closes the zoo.", "The zookeeper opens the zoo."] },
        { q: "Describe the transportation: I see a plane.", visual: "✈️", answer: "It is big.", options: ["It is big.", "It is small.", "It is slow."] },
      ],
      phonics: [
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
      ],
      numbers: [
        { q: "What time is it? 🕒", visual: "🕒", answer: "It's 2 o'clock.", options: ["It's 2 o'clock.", "It's 5 o'clock.", "It's 12 o'clock."] },
        { q: "Identify the number: Which number comes after 80?", visual: "🔢", answer: "81", options: ["81", "80", "90"] },
        { q: "Count by 10s: 10, 20, 30, 40, ___", visual: "🔟", answer: "50", options: ["50", "45", "60"] },
      ],
      science: [
        { q: "Observación científica: ¿Qué pasa con las orugas (caterpillars)?", visual: "🐛", answer: "Hacen capullos y luego se vuelven mariposas", options: ["Hacen capullos y luego se vuelven mariposas", "Se vuelven hormigas"] },
        { q: "Where do fish live?", visual: "🐠", answer: "Underwater", options: ["Underwater", "On trees", "In the desert"] },
      ],
      vocabulary: [
        { q: "Which animal is tall and has a long neck?", visual: "🦒", answer: "Giraffe", options: ["Giraffe", "Tiger", "Kangaroo"] },
        { q: "Where do you go to swim in summer?", visual: "🏖️", answer: "Beach", options: ["Beach", "Mountain", "Lake"] },
      ],
      math: [
        { q: "How many ones make a ten?", visual: "🔢", answer: "10", options: ["10", "5", "1"] },
        { q: "Match the numeral with the amount: 5", visual: "🖐️", answer: "Five", options: ["Five", "Ten", "Two"] },
      ],
      pre_reading: [
        { q: "Short A CVC: Complete the word list: Map, Mad, Dad, Fan, and...", visual: "🥫", answer: "Can", options: ["Can", "Cake", "Car"] },
        { q: "Short E CVC: Complete the word list: Web, Leg, Jet, Wet, and...", visual: "🔴", answer: "Red", options: ["Red", "Read", "Run"] },
        { q: "Short I CVC: Complete the word list: Lip, Pig, Pin, Wig, and...", visual: "🔢", answer: "Six", options: ["Six", "See", "Sit"] },
        { q: "Short O CVC: Complete the word list: Box, Log, Fog, Mom, and...", visual: "🤖", answer: "Bot", options: ["Bot", "Boat", "Boy"] },
        { q: "Short U CVC: Complete the word list: Bug, Sun, Rug, Cut, and...", visual: "🏃", answer: "Run", options: ["Run", "Rain", "Red"] },
        { q: "Técnica CVC: Junta los sonidos en tu mente rápido. ¿Qué palabra se forma? [ M - A - P ]", visual: "🗺️", answer: "Map", options: ["Map", "Mop", "Man"] },
      ],
      spelling: [
        { q: "Spelling Bee: How do you spell 'Cat'?", visual: "🐱", answer: "Cat", options: ["Cat", "Car", "Cut"] },
        { q: "Spelling Bee: How do you spell 'Car'?", visual: "🚗", answer: "Car", options: ["Car", "Cat", "Can"] },
        { q: "Spelling Bee: How do you spell 'Hot'?", visual: "☀️", answer: "Hot", options: ["Hot", "Hat", "Hog"] },
        { q: "Spelling Bee: How do you spell 'Bat'?", visual: "🦇", answer: "Bat", options: ["Bat", "Bit", "Bad"] },
        { q: "Spelling Bee: How do you spell 'Kids'?", visual: "👧", answer: "Kids", options: ["Kids", "Kits", "Kind"] },
        { q: "Spelling Bee: How do you spell 'Man'?", visual: "👨", answer: "Man", options: ["Man", "Map", "Mad"] },
        { q: "Spelling Bee: How do you spell 'Tall'?", visual: "🦒", answer: "Tall", options: ["Tall", "Tell", "Ball"] },
        { q: "Spelling Bee: How do you spell 'Big'?", visual: "🐘", answer: "Big", options: ["Big", "Bug", "Bag"] },
        { q: "Spelling Bee: How do you spell 'Vet'?", visual: "🩺", answer: "Vet", options: ["Vet", "Van", "Web"] },
        { q: "Spelling Bee: How do you spell 'Sit'?", visual: "🪑", answer: "Sit", options: ["Sit", "Six", "Sat"] },
        { q: "Spelling Bee: How do you spell 'Dog'?", visual: "🐶", answer: "Dog", options: ["Dog", "Dig", "Log"] },
        { q: "Spelling Bee: How do you spell 'Yes'?", visual: "👍", answer: "Yes", options: ["Yes", "Yell", "Yet"] },
        { q: "Spelling Bee: How do you spell 'Hat'?", visual: "🎩", answer: "Hat", options: ["Hat", "Hot", "Hit"] },
        { q: "Spelling Bee: How do you spell 'Up'?", visual: "🎈", answer: "Up", options: ["Up", "Us", "On"] },
        { q: "Spelling Bee: How do you spell 'Yell'?", visual: "🗣️", answer: "Yell", options: ["Yell", "Yes", "Yellow"] },
        { q: "Spelling Bee: How do you spell 'Bug'?", visual: "🪲", answer: "Bug", options: ["Bug", "Big", "Bus"] },
        { q: "Spelling Bee: How do you spell 'Web'?", visual: "🕸️", answer: "Web", options: ["Web", "Wet", "Vet"] },
        { q: "Spelling Bee: How do you spell 'Boy'?", visual: "👦", answer: "Boy", options: ["Boy", "Box", "Toy"] },
        { q: "Spelling Bee: How do you spell 'Bus'?", visual: "🚌", answer: "Bus", options: ["Bus", "Bug", "But"] },
        { q: "Spelling Bee: How do you spell 'Ten'?", visual: "🔟", answer: "Ten", options: ["Ten", "Pen", "Net"] },
        { q: "Spelling Bee: How do you spell 'Map'?", visual: "🗺️", answer: "Map", options: ["Map", "Man", "Mop"] },
        { q: "Spelling Bee: How do you spell 'Pig'?", visual: "🐷", answer: "Pig", options: ["Pig", "Big", "Pin"] },
        { q: "Spelling Bee: How do you spell 'Moon'?", visual: "🌙", answer: "Moon", options: ["Moon", "Mom", "Soon"] },
        { q: "Spelling Bee: How do you spell 'Banana'?", visual: "🍌", answer: "Banana", options: ["Banana", "Band", "Bonana"] },
      ],
    };
  }, []);

  const currentQuestions = items.length > 0 ? items : islasData[activeTab] ?? [];
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

  const tabsList: { id: IslandId; label: string }[] = [
    { id: "trazado", label: "✍️ Trazar Letras" },
    { id: "ciencia_ciudadania", label: "🌱 Ciencia y Ciudadanía" },
    { id: "comunicacion_lenguaje", label: "🗣️ Comunicación" },
    { id: "lectura", label: "📖 Lectura" },
    { id: "matemáticas_espanol", label: "🔢 Mate (Español)" },
    { id: "conversation", label: "💬 Conversation" },
    { id: "grammar", label: "📝 Grammar" },
    { id: "phonics", label: "🔊 Phonics" },
    { id: "numbers", label: "⏰ Numbers" },
    { id: "science", label: "🔬 Science" },
    { id: "vocabulary", label: "🎨 Vocabulary" },
    { id: "math", label: "➕ Math (English)" },
    { id: "pre_reading", label: "🔤 Pre-reading" },
    { id: "spelling", label: "🐝 Spelling" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de control de música */}
      <div className="flex justify-between items-center bg-card/60 p-2 rounded-xl border border-border">
        <span className="text-xs font-semibold flex items-center gap-1">
          🎵 Música de fondo ({currentTrackIdx + 1}/{BACKGROUND_PLAYLIST.length})
        </span>
        <div className="flex gap-2">
          <button
            onClick={nextSong}
            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-lg font-bold"
          >
            ⏭️ Siguiente
          </button>
          <button
            onClick={toggleMusic}
            className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-lg font-bold"
          >
            {isMuted ? "🔇 Activar" : "🔊 Silenciar"}
          </button>
        </div>
      </div>

      {/* Selector de pestañas / Islas */}
      <div className="flex flex-wrap gap-2 mb-2 justify-center">
        {tabsList.map((t) => (
          <BigButton
            key={t.id}
            tone={activeTab === t.id ? "primary" : "card"}
            onClick={() => {
              setActiveTab(t.id);
              setIdx(0);
            }}
            className="!text-xs font-bold py-2 px-3 flex-grow sm:flex-grow-0"
          >
            {t.label}
          </BigButton>
        ))}
      </div>

      {/* RENDERIZADO SI LA PESTAÑA ES TRAZADO DE LETRAS */}
      {activeTab === "trazado" ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-center">
            Traza la letra <span className="text-primary">{lettersList[idx]}</span> 🔊
          </h2>

          <BigButton
            tone="card"
            onClick={() => speak(`Traza la letra ${lettersList[idx]}`, lang)}
          >
            🔊 Escuchar Instrucción
          </BigButton>

          <TracingCanvas
            letter={lettersList[idx]}
            onComplete={() => {
              // Avanza automáticamente a la siguiente letra sin pedir la línea verde
              setIdx((prev) => (prev + 1) % lettersList.length);
            }}
          />

          {/* Selector interactivo de letras abajo */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {lettersList.map((letra, i) => (
              <button
                key={letra}
                onClick={() => setIdx(i)}
                className={`w-10 h-10 rounded-full font-bold text-lg border transition-colors ${
                  idx === i
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-card-foreground border-border"
                }`}
              >
                {letra}
              </button>
            ))}
          </div>

          <p className="text-sm text-center text-muted-foreground mt-2">
            Misión {idx + 1} de {lettersList.length}
          </p>
        </div>
      ) : (
        /* RENDERIZADO DE LAS DEMÁS ISLAS / PREGUNTAS */
        currentItem && (
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

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
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
              Pregunta {idx + 1} de {currentQuestions.length}
            </p>
          </div>
        )
      )}
    </div>
  );
}
