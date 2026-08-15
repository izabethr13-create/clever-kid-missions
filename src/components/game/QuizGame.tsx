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
  items,
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
  const order = useMemo(() => shuffle(items.map((_, i) => i)), [items]);
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const item = items[order[idx % order.length]!]!;
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
        <span className="mt-2 block">{item.q}</span>
      </Prompt>
      <div className="mb-4 grid">
        <BigButton tone="card" onClick={() => speak(item.say ?? item.q, lang)}>
          🔊 Escuchar
        </BigButton>
      </div>
      <div className={`grid gap-3 ${cols}`}>
        {options.map((o) => (
          <BigButton key={o} tone="sun" onClick={() => pick(o)}>
            {o}
          </BigButton>
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-bold text-muted-foreground">
        Pregunta {(idx % order.length) + 1} de {order.length}
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
