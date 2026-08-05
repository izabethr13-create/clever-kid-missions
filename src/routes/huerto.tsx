import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton, Feedback, Prompt, StationShell } from "@/components/game/StationShell";
import { gameActions, playSound, randomInt, shuffle, speak } from "@/lib/game-store";

export const Route = createFileRoute("/huerto")({
  head: () => ({
    meta: [
      { title: "El Huerto Virtual — Frutas y verduras | Isla del Aprendizaje" },
      {
        name: "description",
        content:
          "Siembra la semilla, riégala con sol y agua, cosecha y clasifica los alimentos entre frutas y verduras en el huerto virtual.",
      },
      { property: "og:title", content: "El Huerto Virtual" },
      {
        property: "og:description",
        content: "Un huerto interactivo para sembrar, regar, cosechar y clasificar alimentos.",
      },
    ],
  }),
  component: HuertoPage,
});

type Mode = "menu" | "sembrar" | "clasificar";

const FRUTAS = ["🍎", "🍌", "🍓", "🍇", "🍊", "🍉", "🍐", "🥝"];
const VERDURAS = ["🥕", "🥦", "🌽", "🥬", "🍆", "🫑", "🧅", "🥔"];

function HuertoPage() {
  const [mode, setMode] = useState<Mode>("menu");
  return (
    <StationShell title="El Huerto Virtual" emoji="🌱">
      {mode === "menu" ? (
        <ul className="space-y-3">
          <li>
            <BigButton tone="card" className="w-full text-left" onClick={() => setMode("sembrar")}>
              <span className="mr-3">🌾</span>Sembrar y cosechar
            </BigButton>
          </li>
          <li>
            <BigButton tone="card" className="w-full text-left" onClick={() => setMode("clasificar")}>
              <span className="mr-3">🧺</span>Frutas o verduras
            </BigButton>
          </li>
        </ul>
      ) : (
        <div>
          <button
            onClick={() => setMode("menu")}
            className="mb-4 rounded-2xl bg-secondary px-4 py-2 font-display text-lg text-secondary-foreground toy-press"
          >
            ← Otros juegos
          </button>
          {mode === "sembrar" ? <Sembrar /> : <Clasificar />}
        </div>
      )}
    </StationShell>
  );
}

const STEPS = ["semilla", "regar", "sol", "cosechar"] as const;

function Sembrar() {
  const [step, setStep] = useState(0);
  const [plant, setPlant] = useState(() => shuffle([...FRUTAS, ...VERDURAS])[0]!);
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");
  const [basket, setBasket] = useState<string[]>([]);

  const art = ["🕳️", "🌱", "🌿", "🌳"][step] ?? "🌳";

  function act(action: (typeof STEPS)[number]) {
    if (action === STEPS[step]) {
      playSound("good");
      if (step === 3) {
        setStatus("good");
        gameActions.award("huerto", 3);
        setBasket((b) => [...b, plant]);
        speak(`Cosechaste ${plant === "🍎" ? "una manzana" : "un alimento"}`);
        setTimeout(() => {
          setStatus("idle");
          setStep(0);
          setPlant(shuffle([...FRUTAS, ...VERDURAS])[0]!);
        }, 1200);
      } else {
        setStep((s) => s + 1);
      }
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  const labels: Record<(typeof STEPS)[number], string> = {
    semilla: "🌰 Sembrar semilla",
    regar: "💧 Regar",
    sol: "☀️ Dar sol",
    cosechar: "🧺 Cosechar",
  };

  return (
    <div>
      <Prompt>
        Paso {step + 1} de 4: ¿qué necesita la planta ahora?
      </Prompt>
      <div className="card-soft grid place-items-center gap-2 px-4 py-10">
        <span className="animate-float-soft text-7xl">{step === 3 ? plant : art}</span>
        <p className="font-display text-xl text-muted-foreground">
          {["Tierra lista", "Brotó la semilla", "Está creciendo", "¡Lista para cosechar!"][step]}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {shuffle([...STEPS]).map((s) => (
          <BigButton key={s} tone="grass" onClick={() => act(s)}>
            {labels[s]}
          </BigButton>
        ))}
      </div>
      {basket.length > 0 && (
        <p className="mt-4 text-center text-3xl">🧺 {basket.join(" ")}</p>
      )}
      <Feedback status={status} />
    </div>
  );
}

function Clasificar() {
  const [item, setItem] = useState(() => pick());
  const [status, setStatus] = useState<"idle" | "good" | "bad">("idle");

  function pick() {
    const fruta = Math.random() < 0.5;
    const list = fruta ? FRUTAS : VERDURAS;
    return { emoji: list[randomInt(0, list.length - 1)]!, fruta };
  }

  function answer(fruta: boolean) {
    if (fruta === item.fruta) {
      setStatus("good");
      playSound("good");
      gameActions.award("huerto", 2);
      setTimeout(() => {
        setStatus("idle");
        setItem(pick());
      }, 1000);
    } else {
      setStatus("bad");
      playSound("bad");
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <div>
      <Prompt>¿Es fruta o verdura?</Prompt>
      <div className="card-soft grid place-items-center px-4 py-12">
        <span className="animate-pop-in text-8xl">{item.emoji}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <BigButton tone="berry" onClick={() => answer(true)}>
          🍎 Fruta
        </BigButton>
        <BigButton tone="grass" onClick={() => answer(false)}>
          🥕 Verdura
        </BigButton>
      </div>
      <Feedback status={status} />
    </div>
  );
}
