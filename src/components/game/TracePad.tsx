import { useEffect, useRef, useState } from "react";

/**
 * Almohadilla de trazo: la niña sigue con el dedo un camino punteado.
 * Se marcan puntos guía; cuando todos se tocan, el trazo está completo.
 */
export function TracePad({
  paths,
  onComplete,
  size = 300,
  strokeWidth = 34,
}: {
  paths: string[];
  onComplete: () => void;
  size?: number;
  strokeWidth?: number;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [dots, setDots] = useState<{ x: number; y: number }[]>([]);
  const [hit, setHit] = useState<boolean[]>([]);
  const [ink, setInk] = useState<{ x: number; y: number }[][]>([]);
  const drawing = useRef(false);
  const finished = useRef(false);

  useEffect(() => {
    finished.current = false;
    const pts: { x: number; y: number }[] = [];
    pathRefs.current.forEach((p) => {
      if (!p) return;
      const len = p.getTotalLength();
      const n = Math.max(6, Math.round(len / 26));
      for (let i = 0; i <= n; i++) {
        const pt = p.getPointAtLength((i / n) * len);
        pts.push({ x: pt.x, y: pt.y });
      }
    });
    setDots(pts);
    setHit(pts.map(() => false));
    setInk([]);
  }, [paths]);

  function toLocal(e: React.PointerEvent) {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * size,
      y: ((e.clientY - r.top) / r.height) * size,
    };
  }

  function handle(e: React.PointerEvent) {
    if (!drawing.current) return;
    const p = toLocal(e);
    if (!p) return;
    setInk((s) => {
      const copy = s.slice();
      const last = copy[copy.length - 1];
      if (last) last.push(p);
      return copy;
    });
    setHit((prev) => {
      let changed = false;
      const next = prev.slice();
      dots.forEach((d, i) => {
        if (!next[i] && Math.hypot(d.x - p.x, d.y - p.y) < strokeWidth * 0.85) {
          next[i] = true;
          changed = true;
        }
      });
      if (changed && next.every(Boolean) && !finished.current) {
        finished.current = true;
        setTimeout(onComplete, 150);
      }
      return changed ? next : prev;
    });
  }

  const done = hit.length > 0 ? hit.filter(Boolean).length / hit.length : 0;

  return (
    <div className="grid place-items-center">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-xs touch-none rounded-3xl bg-card toy-shadow"
        onPointerDown={(e) => {
          drawing.current = true;
          (e.target as Element).setPointerCapture?.(e.pointerId);
          setInk((s) => [...s, []]);
          handle(e);
        }}
        onPointerMove={handle}
        onPointerUp={() => (drawing.current = false)}
        onPointerLeave={() => (drawing.current = false)}
      >
        {paths.map((d, i) => (
          <path
            key={`g${i}`}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={d}
            fill="none"
            stroke="currentColor"
            className="text-muted"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {dots.map((d, i) => (
          <circle
            key={`d${i}`}
            cx={d.x}
            cy={d.y}
            r={5}
            className={hit[i] ? "fill-grass" : "fill-border"}
          />
        ))}
        {ink.map((stroke, i) => (
          <polyline
            key={`s${i}`}
            points={stroke.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <div className="mt-3 h-3 w-full max-w-xs overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-grass transition-all"
          style={{ width: `${Math.round(done * 100)}%` }}
        />
      </div>
    </div>
  );
}
