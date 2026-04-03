"use client";

interface PillData {
  username: string;
  total: number;
  rank: number;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// grid-based placement to avoid overlaps
function computePositions(entries: PillData[]) {
  const cols = 4;
  const rows = Math.ceil(entries.length / cols);
  const cellW = 80 / cols;
  const cellH = 85 / rows;

  return entries.map((entry, i) => {
    const rand = seededRandom(entry.username.charCodeAt(0) * 1000 + i * 31);
    const col = i % cols;
    const row = Math.floor(i / cols);

    const baseLeft = 8 + col * cellW;
    const baseTop = 5 + row * cellH;
    const jitterX = (rand() - 0.5) * cellW * 0.6;
    const jitterY = (rand() - 0.5) * cellH * 0.5;

    return {
      left: Math.max(2, Math.min(85, baseLeft + jitterX)),
      top: Math.max(2, Math.min(88, baseTop + jitterY)),
      rotation: (rand() * 30 - 15),
      scale: Math.min(1.3, 0.85 + (entry.total / (entries[0]?.total || 1)) * 0.45),
    };
  });
}

export function FloatingPills({ entries }: { entries: PillData[] }) {
  const positions = computePositions(entries);

  return (
    <div className="relative w-full min-h-[550px] mt-12 mb-32">
      {entries.map((entry, i) => {
        const pos = positions[i];
        return (
          <div
            key={entry.username}
            className="absolute cursor-default"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              transform: `rotate(${pos.rotation.toFixed(1)}deg) scale(${pos.scale})`,
            }}
          >
            <a
              href={`/u/${entry.username}`}
              className="flex items-center gap-2 bg-cream border-2 border-red rounded-full px-4 py-2 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 no-underline"
            >
              <span className="text-red font-medium text-sm whitespace-nowrap">
                {entry.username}
              </span>
              <span className="text-red font-bold text-sm">
                {formatCount(entry.total)}
              </span>
            </a>
          </div>
        );
      })}
    </div>
  );
}
