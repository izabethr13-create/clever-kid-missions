import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StationShell } from "@/components/game/StationShell";
import { speak, useGame } from "@/lib/game-store";

export const Route = createFileRoute("/grados")({
  head: () => ({
    meta: [
      { title: "Islas de Aprendizaje por grado — 1º a 6º Primaria" },
      {
        name: "description",
        content:
          "Explora una isla por cada grado de primaria, de 1º a 6º, con Comunicación y Lenguaje, Matemáticas, Ciencias y Inglés, cada una con su barra de progreso.",
      },
      { property: "og:title", content: "Islas de Aprendizaje por grado" },
      {
        property: "og:description",
        content: "Seis islas, una por grado de primaria, con cuatro asignaturas y su progreso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GradosPage,
});

type Subject = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  to: string;
  stations: string[];
};

const SUBJECTS = (grade: number): Subject[] => [
  {
    id: "lenguaje",
    name: "Comunicación y Lenguaje",
    emoji: "🌳",
    color: "bg-grass",
    to: "/lenguaje",
    stations: ["trazos", "consonantes", "inversas", "oraciones", "evaluacion", "tecnicas", "lecturas"],
  },
  {
    id: "mate",
    name: "Matemáticas",
    emoji: "🔢",
    color: "bg-sky",
    to: "/matematicas",
    stations: [
      "camino",
      "cueva",
      "pizzeria",
      "torre",
      "cocodrilo",
      "numeros100",
      "romanos",
      "mayas",
      "calendario",
      "moneda",
    ],
  },
  {
    id: "ciencia",
    name: "Ciencias Sociales y Naturales",
    emoji: "🔬",
    color: "bg-primary",
    to: "/ciencia",
    stations: ["huerto", "jardin", "cadena", "energia", "reserva", "universo", "guatemala"],
  },
  {
    id: "ingles",
    name: "Inglés",
    emoji: "🦁",
    color: "bg-sun",
    to: "/english",
    stations: [
      "phonics",
      "vowels",
      "cvc",
      "vocabulario",
      "zoo",
      "places",
      "spelling",
      "restaurant",
      "commands",
    ],
  },
  // el grado cambia la meta de estrellas de cada asignatura
].map((s) => ({ ...s, id: `${s.id}-${grade}` }));

const GRADES = [
  { n: 1, emoji: "🏝️", label: "1º Primaria", color: "from-sky/80" },
  { n: 2, emoji: "🌋", label: "2º Primaria", color: "from-grass/80" },
  { n: 3, emoji: "🏖️", label: "3º Primaria", color: "from-sun/80" },
  { n: 4, emoji: "⛰️", label: "4º Primaria", color: "from-berry/80" },
  { n: 5, emoji: "🌴", label: "5º Primaria", color: "from-primary/80" },
  { n: 6, emoji: "🗺️", label: "6º Primaria", color: "from-secondary" },
];

function GradosPage() {
  const game = useGame();
  const [open, setOpen] = useState<number | null>(1);

  return (
    <StationShell title="Islas de Aprendizaje" emoji="🗺️">
      <p className="mb-5 text-center font-display text-xl leading-relaxed text-muted-foreground">
        Toca tu grado y elige una asignatura
      </p>

      <ul className="space-y-4">
        {GRADES.map((g) => {
          const subjects = SUBJECTS(g.n);
          const isOpen = open === g.n;
          return (
            <li key={g.n} className="card-soft overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setOpen(isOpen ? null : g.n);
                  if (!isOpen) speak(`Isla de ${g.label}`);
                }}
                aria-expanded={isOpen}
                className={`flex w-full items-center gap-4 bg-gradient-to-r ${g.color} to-transparent px-5 py-5 text-left toy-press`}
              >
                <span className="text-5xl">{g.emoji}</span>
                <span className="flex-1 font-display text-2xl leading-relaxed tracking-wide">
                  {g.label}
                </span>
                <span className="font-display text-2xl">{isOpen ? "▾" : "▸"}</span>
              </button>

              {isOpen && (
                <ul className="space-y-3 px-4 pb-5 pt-3">
                  {subjects.map((s) => {
                    const stars = s.stations.reduce(
                      (n, st) => n + (game.starsByStation[st] || 0),
                      0,
                    );
                    // la meta sube con el grado
                    const goal = s.stations.length * (4 + g.n);
                    const pct = Math.min(100, Math.round((stars / goal) * 100));
                    return (
                      <li key={s.id}>
                        <Link
                          to={s.to}
                          className="block rounded-3xl bg-muted/70 px-4 py-4 toy-press"
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-3xl">{s.emoji}</span>
                            <span className="flex-1 font-display text-xl leading-relaxed tracking-wide">
                              {s.name}
                            </span>
                            <span className="font-display text-lg">{pct}%</span>
                          </span>
                          <span className="mt-3 block h-4 overflow-hidden rounded-full bg-background">
                            <span
                              className={`block h-full rounded-full ${s.color} transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </span>
                          <span className="mt-1 block text-xs font-bold text-muted-foreground">
                            {stars} de {goal} estrellas
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-8 text-center">
        <Link
          to="/progreso"
          className="toy-press inline-block rounded-3xl bg-card px-6 py-4 font-display text-2xl"
        >
          📊 Volver a mi progreso
        </Link>
      </div>
    </StationShell>
  );
}
