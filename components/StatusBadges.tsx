interface StatusBadgesProps {
  totalFucks: number;
  totalUsers: number;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function StatusBadges({ totalFucks, totalUsers }: StatusBadgesProps) {
  const badges = [
    { label: "SYSTEM: LIVE" },
    { label: `TOTAL FUCKS: ${formatCount(totalFucks)}` },
    { label: `${totalUsers} DEVS RAGING` },
    { label: "V1.0.0-RAGE" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      {badges.map((b) => (
        <span
          key={b.label}
          className="px-3 py-1.5 bg-red text-cream text-[10px] font-bold tracking-widest rounded-sm uppercase"
        >
          {b.label}
        </span>
      ))}
    </div>
  );
}
