"use client";

interface ShareButtonProps {
  username: string;
  total: number;
  rank: number;
}

export function ShareButton({ username, total, rank }: ShareButtonProps) {
  const text = `I've cursed at Claude ${total} times. Ranked #${rank} on the Global AI-Induced Rage Index.`;
  const url = `https://forfucksake.ai/u/${username}`;
  const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-red text-cream rounded-full text-xs font-bold tracking-wide hover:bg-red-dark transition-colors"
    >
      SHARE ON X
    </a>
  );
}
