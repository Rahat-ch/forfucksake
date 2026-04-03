import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { desc, sql } from "drizzle-orm";
import { StatusBadges } from "@/components/StatusBadges";
import { FloatingPills } from "@/components/FloatingPills";

export const dynamic = "force-dynamic";

export default async function Home() {
  const entries = await db
    .select({
      username: submissions.username,
      total: submissions.total,
    })
    .from(submissions)
    .orderBy(desc(submissions.total))
    .limit(30);

  const [stats] = await db
    .select({
      totalUsers: sql<number>`count(*)`,
      totalFucks: sql<number>`coalesce(sum(${submissions.total}), 0)`,
    })
    .from(submissions);

  const pillData = entries.map((e, i) => ({
    username: e.username,
    total: e.total,
    rank: i + 1,
  }));

  return (
    <div className="px-6 pt-8 pb-24 max-w-5xl mx-auto">
      <h1 className="text-[clamp(3rem,12vw,9rem)] font-black leading-[0.9] tracking-tight text-center">
        forfuckssake
      </h1>

      <div className="flex justify-center mt-6">
        <span className="px-5 py-2 border-2 border-red rounded-full text-sm font-bold">
          The Global AI-Induced Rage Index
        </span>
      </div>

      <StatusBadges totalFucks={stats.totalFucks} totalUsers={stats.totalUsers} />

      <FloatingPills entries={pillData} />
    </div>
  );
}
