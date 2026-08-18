import { useSyncExternalStore } from "react";

export type StationId =
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

export type GameState = {
  name: string;
  stars: number;
  starsByStation: Record<StationId, number>;
  dayKey: string;
  missionsToday: number;
  unlocked: string[];
  avatar: { hat: string | null; item: string | null; color: string };
  music: boolean;
  voice: boolean;
};

export const DAILY_GOAL = 10;

export const PRIZES: { id: string; label: string; emoji: string; cost: number; slot: "hat" | "item" }[] = [
  { id: "corona", label: "Corona", emoji: "👑", cost: 6, slot: "hat" },
  { id: "gorro", label: "Gorro mágico", emoji: "🎩", cost: 10, slot: "hat" },
  { id: "lazo", label: "Lazo", emoji: "🎀", cost: 14, slot: "hat" },
  { id: "varita", label: "Varita", emoji: "🪄", cost: 18, slot: "item" },
  { id: "globo", label: "Globo", emoji: "🎈", cost: 22, slot: "item" },
  { id: "mascota", label: "Gatito", emoji: "🐱", cost: 30, slot: "item" },
];

export const AVATAR_COLORS = ["#f4a261", "#e76f51", "#8ecae6", "#95d5b2", "#cdb4db", "#ffd166"];

const KEY = "mundo-numeros-v1";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function initial(): GameState {
  return {
    name: "",
    stars: 0,
    starsByStation: {
      camino: 0,
      cueva: 0,
      pizzeria: 0,
      torre: 0,
      cocodrilo: 0,
      numeros100: 0,
      romanos: 0,
      calendario: 0,
      moneda: 0,
      trazos: 0,
      consonantes: 0,
      inversas: 0,
      oraciones: 0,
      evaluacion: 0,
      tecnicas: 0,
      phonics: 0,
      vocabulario: 0,
      huerto: 0,
      energia: 0,
      reserva: 0,
      universo: 0,
      guatemala: 0,
      restaurant: 0,
      zoo: 0,
      cvc: 0,
      commands: 0,
    },
    dayKey: today(),
    missionsToday: 0,
    unlocked: [],
    avatar: { hat: null, item: null, color: AVATAR_COLORS[0]! },
    music: true,
    voice: true,
  };
}

let state: GameState = initial();
let loaded = false;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = { ...initial(), ...(JSON.parse(raw) as Partial<GameState>) };
      parsed.starsByStation = { ...initial().starsByStation, ...parsed.starsByStation };
      if (parsed.dayKey !== today()) {
        parsed.dayKey = today();
        parsed.missionsToday = 0;
      }
      state = parsed;
    }
  } catch {
    /* ignore */
  }
  emit();
}

function set(updater: (s: GameState) => GameState) {
  state = updater(state);
  persist();
  emit();
}

const serverSnapshot = initial();

export function useGame() {
  return useSyncExternalStore(
    (cb) => {
      load();
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => serverSnapshot,
  );
}

export const gameActions = {
  setName(name: string) {
    set((s) => ({ ...s, name }));
  },
  award(station: StationId, stars: number) {
    set((s) => ({
      ...s,
      stars: s.stars + stars,
      starsByStation: { ...s.starsByStation, [station]: s.starsByStation[station] + stars },
      missionsToday: Math.min(DAILY_GOAL, s.missionsToday + 1),
      dayKey: today(),
    }));
  },
  unlock(id: string) {
    set((s) => (s.unlocked.includes(id) ? s : { ...s, unlocked: [...s.unlocked, id] }));
  },
  equip(slot: "hat" | "item", id: string | null) {
    set((s) => ({ ...s, avatar: { ...s.avatar, [slot]: id } }));
  },
  setColor(color: string) {
    set((s) => ({ ...s, avatar: { ...s.avatar, color } }));
  },
  toggleMusic() {
    set((s) => ({ ...s, music: !s.music }));
    if (state.music) startMusic();
    else stopMusic();
  },
  toggleVoice() {
    set((s) => ({ ...s, voice: !s.voice }));
  },
  reset() {
    set(() => initial());
  },
};

/* ---------- Música infantil de fondo (sintetizada, en bucle) ---------- */

let musicCtx: AudioContext | null = null;
let musicTimer: number | null = null;
let musicGain: GainNode | null = null;

const MELODY = [
  [523, 0.4], [587, 0.4], [659, 0.4], [523, 0.4],
  [659, 0.4], [698, 0.4], [784, 0.8],
  [784, 0.3], [880, 0.3], [784, 0.3], [659, 0.3],
  [587, 0.4], [523, 0.8],
] as const;

function makeCtx() {
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return new Ctx();
}

export function startMusic() {
  if (typeof window === "undefined" || musicTimer !== null) return;
  try {
    musicCtx = musicCtx ?? makeCtx();
    void musicCtx.resume();
    musicGain = musicCtx.createGain();
    musicGain.gain.value = 0.07;
    musicGain.connect(musicCtx.destination);

    const loop = () => {
      const ctx = musicCtx;
      const out = musicGain;
      if (!ctx || !out) return;
      let t = ctx.currentTime + 0.05;
      MELODY.forEach(([freq, dur]) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(1, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.95);
        osc.connect(g).connect(out);
        osc.start(t);
        osc.stop(t + dur);
        t += dur;
      });
      const total = MELODY.reduce((n, [, d]) => n + d, 0);
      musicTimer = window.setTimeout(loop, total * 1000);
    };
    loop();
  } catch {
    /* ignore */
  }
}

export function stopMusic() {
  if (musicTimer !== null) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }
  try {
    musicGain?.disconnect();
  } catch {
    /* ignore */
  }
  musicGain = null;
}

export function isMusicPlaying() {
  return musicTimer !== null;
}

export function playSound(kind: "good" | "bad" | "win") {
  if (typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const notes = kind === "good" ? [523, 659, 784] : kind === "win" ? [523, 659, 784, 1046] : [300, 200];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === "bad" ? "sawtooth" : "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      const t = ctx.currentTime + i * 0.12;
      gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch {
    /* ignore */
  }
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function speak(text: string, lang: "es-ES" | "en-US" = "es-ES") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = lang === "en-US" ? 0.8 : 0.9;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith(lang.slice(0, 2)));
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export function sayResult(ok: boolean) {
  if (!state.voice) return;
  speak(ok ? "¡Bien hecho!" : "Inténtalo de nuevo", "es-ES");
}
