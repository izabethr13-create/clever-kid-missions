const COLORS = ["#f4a261", "#e76f51", "#8ecae6", "#95d5b2", "#cdb4db", "#ffd166"];

const PIECES = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  left: Math.round((i * 37) % 100),
  delay: ((i * 7) % 10) / 12,
  duration: 1.3 + ((i * 13) % 9) / 10,
  color: COLORS[i % COLORS.length]!,
  size: 8 + ((i * 5) % 8),
  rotate: (i * 47) % 360,
}));

export function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {PIECES.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-10%] block rounded-[2px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
