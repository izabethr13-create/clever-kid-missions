import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, randomInt, shuffle } from "@/lib/game-store";

export const Route = createFileRoute("/torre")({
  head: () => ({
    meta: [
      { title: "La Torre del Tiempo — El reloj | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Aprende la hora en punto y la hora y media moviendo las manecillas, y reconoce mañana, medio día, tarde y noche.",
      },
      { property: "og:title", content: "La Torre del Tiempo" },
      {
        property: "og:description",
        content: "Reloj interactivo con manecillas que se arrastran y momentos del día.",
      },
    ],
  }),
  component: TorrePage,
});

function TorrePage() {
  const [tab, setTab] = useState<"reloj" | "momentos">("reloj");
  return (
    <StationShell title="La Torre del Tiempo" emoji="⏰">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <BigButton tone={tab === "reloj" ? "primary" : "card"} onClick={() => setTab("reloj")}>
          🕐 El reloj
        </BigButton>
        <BigButton tone={tab === "momentos" ? "primary" : "card"} onClick={() => setTab("momentos")}>
          🌞 Momentos
        </BigButton>
      </div>
      {tab === "reloj" ? <RelojGame /> : <MomentosGame />}
    </StationShell>
  );
}

function makeTarget() {
  const hour = randomInt(1, 12);
  const half = Math.random() < 0.5;
  return { hour, minute: half ? 30 : 0 };
}

function RelojGame() {
  const [target, setTarget] = useState(makeTarget);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"hour" | "minute" | null>(null);

  const size = 280;
  const c = size / 2;

  function angleFromEvent(e: React.PointerEvent) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    let deg = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    return deg;
  }

  function onMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const deg = angleFromEvent(e);
    if (dragging.current === "minute") {
      setMinute(Math.round(deg / 30) % 12 === 0 ? 0 : (Math.round(deg / 30) % 12) * 5);
    } else {
      const h = Math.round(deg / 30) % 12;
      setHour(h === 0 ? 12 : h);
    }
  }

  function check() {
    const ok = hour === target.hour && minute === target.minute;
    if (ok) {
      setStatus("good");
      playSound("win");
      gameActions.award("torre", 3);
      setTimeout(() => {
        setStatus("idle");
        setTarget(makeTarget());
        setHour(12);
        setMinute(0);
      }, 1200);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  const hx = c + 70 * Math.sin((hourAngle * Math.PI) / 180);
  const hy = c - 70 * Math.cos((hourAngle * Math.PI) / 180);
  const mx = c + 105 * Math.sin((minuteAngle * Math.PI) / 180);
  const my = c - 105 * Math.cos((minuteAngle * Math.PI) / 180);

  return (
    <div>
      <Prompt>
        Pon el reloj en{" "}
        <span className="text-primary">
          {target.hour}:{target.minute === 0 ? "00" : "30"}
        </span>{" "}
        <span className="block text-lg text-muted-foreground">
          {target.minute === 0 ? "hora en punto" : "hora y media"}
        </span>
      </Prompt>

      <div className="card-soft grid place-items-center p-4">
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="touch-none"
          onPointerMove={onMove}
          onPointerUp={() => (dragging.current = null)}
          onPointerLeave={() => (dragging.current = null)}
        >
          <circle cx={c} cy={c} r={c - 6} fill="var(--card)" stroke="var(--primary)" strokeWidth={10} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = ((i + 1) / 12) * Math.PI * 2;
            return (
              <text
                key={i}
                x={c + (c - 34) * Math.sin(a)}
                y={c - (c - 34) * Math.cos(a) + 8}
                textAnchor="middle"
                fontSize={24}
                fontWeight={800}
                fill="var(--foreground)"
              >
                {i + 1}
              </text>
            );
          })}
          <line x1={c} y1={c} x2={mx} y2={my} stroke="var(--berry)" strokeWidth={8} strokeLinecap="round" />
          <line x1={c} y1={c} x2={hx} y2={hy} stroke="var(--foreground)" strokeWidth={12} strokeLinecap="round" />
          <circle
            cx={mx}
            cy={my}
            r={18}
            fill="var(--berry)"
            opacity={0.35}
            className="cursor-grab"
            onPointerDown={() => (dragging.current = "minute")}
          />
          <circle
            cx={hx}
            cy={hy}
            r={18}
            fill="var(--foreground)"
            opacity={0.3}
            className="cursor-grab"
            onPointerDown={() => (dragging.current = "hour")}
          />
          <circle cx={c} cy={c} r={10} fill="var(--primary)" />
        </svg>
        <p className="mt-2 font-display text-3xl">
          {hour}:{minute === 0 ? "00" : minute}
        </p>
        <p className="text-sm font-bold text-muted-foreground">
          Arrastra la aguja grande (roja) y la pequeña
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <BigButton tone="card" onClick={() => setMinute((m) => (m === 0 ? 30 : 0))}>
          🔄 Minutero
        </BigButton>
        <BigButton tone="grass" onClick={check}>
          ⭐ Comprobar
        </BigButton>
      </div>

      <Feedback status={status} />
    </div>
  );
}

const MOMENTOS = [
  { id: "mañana", emoji: "🌅", label: "Mañana", clue: "Me levanto y desayuno a las 7:00" },
  { id: "medio día", emoji: "☀️", label: "Medio día", clue: "Almuerzo a las 12:00" },
  { id: "tarde", emoji: "🌇", label: "Tarde", clue: "Juego en el parque a las 4:00" },
  { id: "noche", emoji: "🌙", label: "Noche", clue: "Me pongo la pijama a las 8:30" },
];

function MomentosGame() {
  const [q, setQ] = useState(() => MOMENTOS[randomInt(0, 3)]!);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const [options] = useState(() => shuffle(MOMENTOS));

  function pick(id: string) {
    if (id === q.id) {
      setStatus("good");
      playSound("good");
      gameActions.award("torre", 2);
      setTimeout(() => {
        setStatus("idle");
        setQ(MOMENTOS[randomInt(0, 3)]!);
      }, 1000);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <div>
      <Prompt>{q.clue}. ¿Qué momento del día es?</Prompt>
      <div className="grid grid-cols-2 gap-3">
        {options.map((m) => (
          <BigButton key={m.id} tone="sun" onClick={() => pick(m.id)} className="py-6">
            <span className="block text-4xl">{m.emoji}</span>
            {m.label}
          </BigButton>
        ))}
      </div>
      <Feedback status={status} />
    </div>
  );
}
