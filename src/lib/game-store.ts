import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

export type StationId = string;

export type GameState = {
  name: string;
  stars: number;
  starsByStation: Record<string, number>;
  dayKey: string;
  missionsToday: number;
  unlocked: string[];
  avatar: { hat: string | null; item: string | null; color: string };
  music: boolean;
  voice: boolean;
  track: string;
  cloudCode: string;
};

export const DAILY_GOAL = 10;

export const PRIZES: {
  id: string;
  label: string;
  emoji: string;
  cost: number;
  slot: "hat" | "item";
}[] = [
  { id: "corona", label: "Corona", emoji: "👑", cost: 6, slot: "hat" },
  { id: "gorro", label: "Gorro mágico", emoji: "🎩", cost: 10, slot: "hat" },
  { id: "lazo", label: "Lazo", emoji: "🎀", cost: 14, slot: "hat" },
  { id: "flor", label: "Flor", emoji: "🌸", cost: 16, slot: "hat" },
  { id: "casco", label: "Casco de héroe", emoji: "⛑️", cost: 20, slot: "hat" },
  { id: "gafas", label: "Gafas de sol", emoji: "🕶️", cost: 24, slot: "hat" },
  { id: "diadema", label: "Diadema de estrellas", emoji: "✨", cost: 28, slot: "hat" },
  { id: "sombrero", label: "Sombrero vaquero", emoji: "🤠", cost: 34, slot: "hat" },
  { id: "arcoiris", label: "Arcoíris", emoji: "🌈", cost: 40, slot: "hat" },
  { id: "varita", label: "Varita", emoji: "🪄", cost: 18, slot: "item" },
  { id: "globo", label: "Globo", emoji: "🎈", cost: 22, slot: "item" },
  { id: "mascota", label: "Gatito", emoji: "🐱", cost: 30, slot: "item" },
  { id: "perrito", label: "Perrito", emoji: "🐶", cost: 36, slot: "item" },
  { id: "guitarra", label: "Guitarra", emoji: "🎸", cost: 42, slot: "item" },
  { id: "cohete", label: "Cohete", emoji: "🚀", cost: 48, slot: "item" },
  { id: "unicornio", label: "Unicornio", emoji: "🦄", cost: 55, slot: "item" },
  { id: "dragon", label: "Dragoncito", emoji: "🐲", cost: 65, slot: "item" },
  { id: "trofeo", label: "Trofeo de oro", emoji: "🏆", cost: 80, slot: "item" },
];

export const AVATAR_COLORS = ["#f4a261", "#e76f51", "#8ecae6", "#95d5b2", "#cdb4db", "#ffd166"];

const KEY = "mundo-numeros-v1";

function today() {
  return new Date().toISOString().slice(0, 10);
}

const STATIONS = [
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
  "trazos",
  "consonantes",
  "inversas",
  "oraciones",
  "evaluacion",
  "tecnicas",
  "lecturas",
  "phonics",
  "vowels",
  "cvc",
  "vocabulario",
  "zoo",
  "places",
  "spelling",
  "restaurant",
  "commands",
  "huerto",
  "jardin",
  "cadena",
  "energia",
  "reserva",
  "universo",
  "guatemala",
];

function initial(): GameState {
  const starsByStation: Record<string, number> = {};
  STATIONS.forEach((s) => (starsByStation[s] = 0));
  return {
    name: "",
    stars: 0,
    starsByStation,
    dayKey: today(),
    missionsToday: 0,
    unlocked: [],
    avatar: { hat: null, item: null, color: AVATAR_COLORS[0]! },
    music: true,
    voice: true,
    track: "jonas",
    cloudCode: "",
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
  queueCloudSave();
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
  if (state.cloudCode) void cloudLoad(state.cloudCode);
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
      starsByStation: { ...s.starsByStation, [station]: (s.starsByStation[station] ?? 0) + stars },
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
  setTrack(id: string) {
    set((s) => ({ ...s, track: id }));
    if (state.music) {
      stopMusic();
      startMusic();
    }
  },
  setCloudCode(code: string) {
    set((s) => ({ ...s, cloudCode: code.toUpperCase().trim() }));
  },
  reset() {
    set(() => ({ ...initial(), cloudCode: state.cloudCode }));
  },
};

/* ---------- Guardado en la nube ---------- */

let cloudTimer: number | null = null;

export function makeCloudCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += letters[Math.floor(Math.random() * letters.length)];
  return out;
}

function queueCloudSave() {
  if (typeof window === "undefined" || !state.cloudCode) return;
  if (cloudTimer !== null) clearTimeout(cloudTimer);
  cloudTimer = window.setTimeout(() => {
    void cloudSave();
  }, 1200);
}

export async function cloudSave() {
  if (!state.cloudCode) return false;
  const { stars, starsByStation, unlocked, avatar, name, track, music, voice } = state;
  const { error } = await supabase
    .from("progreso_nube")
    .upsert(
      {
        code: state.cloudCode,
        data: { stars, starsByStation, unlocked, avatar, name, track, music, voice },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "code" },
    );
  return !error;
}

export async function cloudLoad(code: string) {
  const clean = code.toUpperCase().trim();
  if (!clean) return false;
  const { data, error } = await supabase
    .from("progreso_nube")
    .select("data")
    .eq("code", clean)
    .maybeSingle();
  if (error || !data) return false;
  const saved = (data.data ?? {}) as Partial<GameState>;
  state = {
    ...state,
    ...saved,
    starsByStation: { ...initial().starsByStation, ...(saved.starsByStation ?? {}) },
    cloudCode: clean,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  emit();
  return true;
}

/* ---------- Música infantil de fondo (sintetizada, en bucle) ---------- */

let musicCtx: AudioContext | null = null;
let musicTimer: number | null = null;
let musicGain: GainNode | null = null;

type Note = readonly [number, number];

const N: Record<string, number> = {
  C4: 262, D4: 294, E4: 330, F4: 349, G4: 392, A4: 440, B4: 494,
  C5: 523, D5: 587, E5: 659, F5: 698, G5: 784, A5: 880, B5: 988, C6: 1046,
};

export const MUSIC_TRACKS: { id: string; label: string; emoji: string; melody: Note[] }[] = [
  {
    id: "jonas",
    label: "Jonás",
    emoji: "🐋",
    melody: [
      [N.G4!, 0.3], [N.G4!, 0.3], [N.A4!, 0.3], [N.G4!, 0.3],
      [N.C5!, 0.6], [N.B4!, 0.6],
      [N.G4!, 0.3], [N.G4!, 0.3], [N.A4!, 0.3], [N.G4!, 0.3],
      [N.D5!, 0.6], [N.C5!, 0.6],
      [N.E5!, 0.3], [N.D5!, 0.3], [N.C5!, 0.3], [N.B4!, 0.3],
      [N.A4!, 0.4], [N.G4!, 0.8],
    ],
  },
  {
    id: "diezveces",
    label: "10 veces más",
    emoji: "🔟",
    melody: [
      [N.C5!, 0.25], [N.C5!, 0.25], [N.E5!, 0.25], [N.G5!, 0.5],
      [N.G5!, 0.25], [N.E5!, 0.25], [N.C5!, 0.5],
      [N.D5!, 0.25], [N.D5!, 0.25], [N.F5!, 0.25], [N.A5!, 0.5],
      [N.A5!, 0.25], [N.F5!, 0.25], [N.D5!, 0.5],
      [N.E5!, 0.25], [N.G5!, 0.25], [N.C6!, 0.6], [N.G5!, 0.4], [N.C5!, 0.8],
    ],
  },
  {
    id: "fiesta",
    label: "Esto es una fiesta",
    emoji: "🎉",
    melody: [
      [N.E5!, 0.2], [N.E5!, 0.2], [N.F5!, 0.2], [N.G5!, 0.4],
      [N.G5!, 0.2], [N.F5!, 0.2], [N.E5!, 0.2], [N.D5!, 0.4],
      [N.C5!, 0.2], [N.C5!, 0.2], [N.D5!, 0.2], [N.E5!, 0.4],
      [N.E5!, 0.3], [N.D5!, 0.3], [N.D5!, 0.6],
      [N.E5!, 0.2], [N.E5!, 0.2], [N.F5!, 0.2], [N.G5!, 0.4],
      [N.G5!, 0.2], [N.F5!, 0.2], [N.E5!, 0.2], [N.D5!, 0.4],
      [N.C5!, 0.2], [N.E5!, 0.2], [N.G5!, 0.2], [N.C6!, 0.8],
    ],
  },
  {
    id: "david",
    label: "El guerrero David",
    emoji: "🛡️",
    melody: [
      [N.C5!, 0.3], [N.E5!, 0.3], [N.G5!, 0.3], [N.E5!, 0.3],
      [N.F5!, 0.3], [N.E5!, 0.3], [N.D5!, 0.6],
      [N.C5!, 0.3], [N.E5!, 0.3], [N.G5!, 0.3], [N.C6!, 0.6],
      [N.B5!, 0.3], [N.A5!, 0.3], [N.G5!, 0.6],
      [N.G5!, 0.3], [N.F5!, 0.3], [N.E5!, 0.3], [N.D5!, 0.3], [N.C5!, 0.9],
    ],
  },
];

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

    const melody =
      (MUSIC_TRACKS.find((t) => t.id === state.track) ?? MUSIC_TRACKS[0]!).melody;

    const loop = () => {
      const ctx = musicCtx;
      const out = musicGain;
      if (!ctx || !out) return;
      let t = ctx.currentTime + 0.05;
      melody.forEach(([freq, dur]) => {
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
      const total = melody.reduce((n, [, d]) => n + d, 0);
      musicTimer = window.setTimeout(loop, total * 1000 + 600);
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
    u.rate = lang === "en-US" ? 0.8 : 0.85;
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
