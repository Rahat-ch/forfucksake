"use client";

import { useEffect, useState } from "react";

interface Entry {
  username: string;
  total: number;
  topWord: string | null;
  rank: number;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?page=${page}&limit=50`)
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries);
        setTotal(data.totalEntries);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  if (loading) {
    return <div className="text-center py-12 text-red font-bold">Loading the rage...</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red font-bold text-lg">No fucks given yet.</p>
        <p className="text-red/60 mt-2">Be the first to submit.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-cream border-2 border-red rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-red">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Username</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Fucks</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider hidden sm:table-cell">Top Word</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.username} className="border-b border-red/20 hover:bg-pink-light/30 transition-colors">
                <td className="px-4 py-3 text-sm font-bold">{e.rank}</td>
                <td className="px-4 py-3 text-sm font-medium">{e.username}</td>
                <td className="px-4 py-3 text-sm font-bold text-right">{formatCount(e.total)}</td>
                <td className="px-4 py-3 text-sm text-right text-red/60 hidden sm:table-cell">{e.topWord || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 50 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-cream border-2 border-red rounded-full text-xs font-bold disabled:opacity-30"
          >
            PREV
          </button>
          <span className="px-4 py-2 text-xs font-bold">
            Page {page} of {Math.ceil(total / 50)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * 50 >= total}
            className="px-4 py-2 bg-cream border-2 border-red rounded-full text-xs font-bold disabled:opacity-30"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
}
