import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, randomInt } from "@/lib/game-store";

export const Route = createFileRoute("/camino")({
  head: () => ({
    meta: [
      { title: "Camino Fantasma — Direccionalidad | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Juego de direccionalidad: mueve al personaje hacia la derecha, la izquierda, arriba y abajo para llegar al tesoro.",
      },
      { property: "og:title", content: "Camino Fantasma — Direccionalidad" },
      {
        property: "og:description",
        content: "Practica derecha, izquierda, arriba y abajo con un juego de tablero.",
      },
    ],
  }),
  component: CaminoPage,
});

const SIZE = 5;
type Dir = "up" | "down" | "left" | "right";
const LABELS: Record<Dir, string> = {
  up: "hacia arriba",
  down: "hacia abajo",
  left: "hacia la izquierda",
  right: "hacia la derecha",
};

function CaminoPage() {
  const [round, setRound] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 4 });
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  const mission = useMemo(() => {
    const dirs: Dir[] = ["up", "down", "left", "right"];
    const dir = dirs[randomInt(0, 3)]!;
    const steps = randomInt(1, 3);
    return { dir, steps };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const [done, setDone] = useState(0);

  function move(dir: Dir) {
    if (status !== "idle") return;
    if (dir !== mission.dir) {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
      return;
    }
    const next = { ...pos };
    if (dir === "up") next.y = Math.max(0, pos.y - 1);
    if (dir === "down") next.y = Math.min(SIZE - 1, pos.y + 1);
    if (dir === "left") next.x = Math.max(0, pos.x - 1);
    if (dir === "right") next.x = Math.min(SIZE - 1, pos.x + 1);
    setPos(next);
    const newDone = done + 1;
    setDone(newDone);
    if (newDone >= mission.steps) {
      setStatus("good");
      playSound("good");
      gameActions.award("camino", 2);
      setTimeout(() => {
        setStatus("idle");
        setDone(0);
        setRound((r) => r + 1);
      }, 1100);
    }
  }

  return (
    <StationShell title="Camino Fantasma" emoji="🧭">
      <Prompt>
        Camina <span className="text-primary">{mission.steps}</span>{" "}
        {mission.steps === 1 ? "paso" : "pasos"} {LABELS[mission.dir]}
      </Prompt>

      <div className="mx-auto grid w-full max-w-sm grid-cols-5 gap-1 rounded-3xl bg-card p-2 toy-shadow">
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const x = i % SIZE;
          const y = Math.floor(i / SIZE);
          const here = pos.x === x && pos.y === y;
          return (
            <div
              key={i}
              className={`grid aspect-square place-items-center rounded-xl text-2xl ${
                (x + y) % 2 === 0 ? "bg-secondary" : "bg-muted"
              }`}
            >
              {here && <span className="animate-pop-in text-3xl">👻</span>}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center font-bold text-muted-foreground">
        Pasos dados: {done} de {mission.steps}
      </p>

      <div className="mx-auto mt-5 grid w-56 grid-cols-3 gap-3">
        <span />
        <BigButton tone="sun" ariaLabel="Arriba" onClick={() => move("up")}>
          ⬆️
        </BigButton>
        <span />
        <BigButton tone="sun" ariaLabel="Izquierda" onClick={() => move("left")}>
          ⬅️
        </BigButton>
        <span />
        <BigButton tone="sun" ariaLabel="Derecha" onClick={() => move("right")}>
          ➡️
        </BigButton>
        <span />
        <BigButton tone="sun" ariaLabel="Abajo" onClick={() => move("down")}>
          ⬇️
        </BigButton>
        <span />
      </div>

      <Feedback status={status} />
    </StationShell>
  );
}
