import { useMemo, useState } from "react";
import { BigButton, Feedback } from "@/components/game/StationShell";
import { gameActions, playSound, shuffle, speak, type StationId } from "@/lib/game-store";

export type QuizItem = {
  q: string;
  visual?: string;
  options: string[];
  answer: string;
  say?: string;
  text?: string;
};

/** Pestañas grandes y accesibles (amigables con dislexia: iconos + texto opcional). */
export function Tabs<T extends string>({
  tabs,
  value,
  activeTab,
  onChange,
}: {
  tabs: { id: T; label: string }[];
  value?: T;
  activeTab?: T;
  onChange: (id: T) => void;
}) {
  const current = value ?? activeTab;
  return (
    <div className="mb-4 flex flex-wrap justify-center gap-2">
      {tabs.map((tab) => (
        <BigButton
          key={tab.id}
          tone={current === tab.id ? "primary" : "card"}
          active={current === tab.id}
          onClick={() => onChange(tab.id)}
          className="!px-5 !py-3 !text-2xl"
        >
          {tab.label}
        </BigButton>
      ))}
    </div>
  );
}

/**
 * Juego de preguntas genérico.
 * Adaptaciones para dislexia y discalculia:
 *  - Sin límite de tiempo, una pregunta a la vez.
 *  - Botón de escuchar (voz) en la pregunta y en cada opción.
 *  - Tipografía grande, mucho interlineado y espaciado entre letras.
 *  - Opciones en una sola columna por defecto, con áreas grandes de toque.
 */
export function QuizGame({
  station = "general",
  items = [],
  lang = "es-ES",
  stars = 1,
  columns = 1,
}: {
  station?: StationId;
  items?: QuizItem[];
  lang?: "es-ES" | "en-US";
  stars?: number;
  columns?: 1 | 2 | 3;
}) {
  const list = useMemo(() => (items.length ? shuffle(items) : []), [items]);
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  const item = list[idx];
  if (!item) {
    return <p className="text-center font-display text-2xl">Muy pronto habrá más misiones 🌟</p>;
  }

  const pick = (option: string) => {
    if (option === item.answer) {
      playSound("good");
      setStatus("good");
      gameActions.award(station, stars);
      window.setTimeout(() => {
        setStatus("idle");
        setIdx((p) => (p + 1) % list.length);
      }, 1100);
    } else {
      playSound("bad");
      setStatus("bad");
      window.setTimeout(() => setStatus("idle"), 1100);
    }
  };

  const gridCols =
    columns === 3 ? "sm:grid-cols-3" : columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";

  return (
    <div className="flex flex-col gap-4">
      <Feedback status={status} />

      {item.visual && <div className="text-center text-7xl">{item.visual}</div>}

      {item.text && (
        <p className="card-soft px-5 py-4 text-xl leading-loose tracking-wide">{item.text}</p>
      )}

      <h2 className="text-center font-display text-3xl leading-snug tracking-wide">{item.q}</h2>

      <BigButton
        tone="card"
        className="!text-xl"
        onClick={() => speak(item.say ?? (item.text ? `${item.text}. ${item.q}` : item.q), lang)}
      >
        🔊 Escuchar
      </BigButton>

      <div className={`grid gap-3 ${gridCols}`}>
        {item.options.map((o) => (
          <BigButton
            key={o}
            tone="sun"
            className="min-h-20 !text-2xl leading-snug tracking-wide"
            onClick={() => pick(o)}
          >
            {o}
          </BigButton>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <BigButton
          tone="card"
          className="!px-4 !py-2 !text-base"
          onClick={() => setIdx((p) => (p + 1) % list.length)}
        >
          ⏭️ Otra
        </BigButton>
        <p className="text-sm font-bold text-muted-foreground">
          {idx + 1} de {list.length}
        </p>
      </div>
    </div>
  );
}

export default QuizGame;
