import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import guerreroDavid from "@/assets/guerrero-david.m4a.asset.json";
import abejita from "@/assets/abejita-chiquitita.m4a.asset.json";
import soyFeliz from "@/assets/soy-feliz.m4a.asset.json";
import lazaro from "@/assets/lazaro.m4a.asset.json";
import capibara from "@/assets/capibara.m4a.asset.json";
import lechuza from "@/assets/lechuza.m4a.asset.json";
import juanPaco from "@/assets/juan-paco.m4a.asset.json";
import librosBiblia from "@/assets/libros-biblia.m4a.asset.json";
import sonadorJose from "@/assets/sonador-jose.m4a.asset.json";
import arcaNoe from "@/assets/arca-noe.m4a.asset.json";
import estoFiesta from "@/assets/esto-es-una-fiesta.m4a.asset.json";

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
    track: "davidcancion",
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
let musicEl: HTMLAudioElement | null = null;

type Note = readonly [number, number];

export const MUSIC_TRACKS: {
  id: string;
  label: string;
  emoji: string;
  melody: Note[];
  src?: string;
}[] = [
  {
    id: "davidcancion",
    label: "El guerrero David (canción)",
    emoji: "🎶",
    src: guerreroDavid.url,
    melody: [],
  },
  {
    id: "abejita",
    label: "Abejita chiquitita",
    emoji: "🐝",
    src: abejita.url,
    melody: [],
  },
  {
    id: "soyfeliz",
    label: "Soy feliz",
    emoji: "😊",
    src: soyFeliz.url,
    melody: [],
  },
  {
    id: "lazaro",
    label: "Lázaro",
    emoji: "💪",
    src: lazaro.url,
    melody: [],
  },
  { id: "capibara", label: "Capibara", emoji: "🦫", src: capibara.url, melody: [] },
  { id: "lechuza", label: "La lechuza", emoji: "🦉", src: lechuza.url, melody: [] },
  { id: "juanpaco", label: "Juan Paco Pedro de la Mar", emoji: "🚢", src: juanPaco.url, melody: [] },
  { id: "librosbiblia", label: "Los libros de la Biblia", emoji: "📖", src: librosBiblia.url, melody: [] },
  { id: "sonadorjose", label: "El soñador José", emoji: "💭", src: sonadorJose.url, melody: [] },
  { id: "arcanoe", label: "El arca de Noé", emoji: "🦒", src: arcaNoe.url, melody: [] },
  { id: "fiesta", label: "Esto es una fiesta", emoji: "🎉", src: estoFiesta.url, melody: [] },
];

function makeCtx() {
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return new Ctx();
}

export function startMusic() {
  if (typeof window === "undefined" || musicTimer !== null || musicEl !== null) return;
  const track = MUSIC_TRACKS.find((t) => t.id === state.track) ?? MUSIC_TRACKS[0]!;
  if (track.src) {
    try {
      const el = new Audio(track.src);
      el.loop = true;
      el.volume = 0.22;
      musicEl = el;
      void el.play().catch(() => {
        musicEl = null;
      });
    } catch {
      musicEl = null;
    }
    return;
  }
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
  if (musicEl) {
    try {
      musicEl.pause();
      musicEl.currentTime = 0;
    } catch {
      /* ignore */
    }
    musicEl = null;
  }
}

export function isMusicPlaying() {
  return musicTimer !== null || musicEl !== null;
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
