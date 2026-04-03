import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ShareButton } from "@/components/ShareButton";

export const dynamic = "force-dynamic";

const EXAMPLE_USERS = new Set([
  "dan", "prompteng", "sisyphus", "whisperer", "token_b",
  "regular_user", "chill_guy", "bot_test", "rage_quit_dev",
  "zen_coder", "midnight_hacker", "coffee_overflow",
]);

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} - forfuckssake.ai`,
    description: `See how much ${username} curses at their AI`,
    openGraph: {
      title: `${username} on forfuckssake.ai`,
      description: `See how much ${username} curses at their AI`,
      images: [`https://forfucksake.ai/api/og?username=${username}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${username} on forfuckssake.ai`,
      images: [`https://forfucksake.ai/api/og?username=${username}`],
    },
  };
}

export default async function UserProfile({ params }: Props) {
  const { username } = await params;

  const rows = await db
    .select()
    .from(submissions)
    .where(eq(submissions.username, username.toLowerCase()))
    .limit(1);

  if (rows.length === 0) notFound();

  const user = rows[0];
  const breakdown: Record<string, number> = JSON.parse(user.breakdown);

  const [{ rank }] = await db
    .select({ rank: sql<number>`count(*) + 1` })
    .from(submissions)
    .where(sql`${submissions.total} > ${user.total}`);

  const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const isExample = EXAMPLE_USERS.has(user.username);

  return (
    <div className="px-6 pt-8 pb-24 max-w-2xl mx-auto">
      {isExample && (
        <div className="bg-cream border-2 border-red rounded-xl px-4 py-3 text-center text-sm font-bold mb-6">
          EXAMPLE PROFILE — This is fake data. Install the skill to get your real stats.
        </div>
      )}
      <div className="text-center mb-8">
        <p className="text-sm font-bold uppercase tracking-wider opacity-60">forfuckssake.ai</p>
        <h1 className="text-5xl font-black mt-2">{user.username}</h1>
      </div>

      <div className="flex justify-center gap-4 mb-10">
        <div className="bg-cream border-2 border-red rounded-2xl px-6 py-4 text-center">
          <div className="text-3xl font-black">{user.total.toLocaleString()}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mt-1">Fucks Given</div>
        </div>
        <div className="bg-cream border-2 border-red rounded-2xl px-6 py-4 text-center">
          <div className="text-3xl font-black">#{rank}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mt-1">Rank</div>
        </div>
        {user.topWord && (
          <div className="bg-cream border-2 border-red rounded-2xl px-6 py-4 text-center">
            <div className="text-3xl font-black">{user.topWord}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mt-1">Top Word</div>
          </div>
        )}
      </div>

      <div className="bg-cream border-2 border-red rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Full Breakdown</h2>
        <div className="space-y-2">
          {sorted.map(([word, count]) => {
            const pct = user.total > 0 ? (count / user.total) * 100 : 0;
            return (
              <div key={word} className="flex items-center gap-3">
                <span className="text-sm font-medium w-40 truncate">{word}</span>
                <div className="flex-1 h-3 bg-pink-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm font-bold w-12 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center">
        <ShareButton username={user.username} total={user.total} rank={rank} />
      </div>
    </div>
  );
}
