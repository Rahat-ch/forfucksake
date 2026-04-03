import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  const [stats] = await db
    .select({
      totalUsers: sql<number>`count(*)`,
      totalFucks: sql<number>`coalesce(sum(${submissions.total}), 0)`,
    })
    .from(submissions);

  const all = await db
    .select({ breakdown: submissions.breakdown })
    .from(submissions);

  const globalBreakdown: Record<string, number> = {};
  for (const row of all) {
    const bd: Record<string, number> = JSON.parse(row.breakdown);
    for (const [word, count] of Object.entries(bd)) {
      globalBreakdown[word] = (globalBreakdown[word] || 0) + count;
    }
  }

  let topWord = "";
  let topCount = 0;
  for (const [word, count] of Object.entries(globalBreakdown)) {
    if (count > topCount) { topCount = count; topWord = word; }
  }

  return NextResponse.json({
    totalUsers: stats.totalUsers,
    totalFucks: stats.totalFucks,
    topWord: topWord || null,
    avgPerUser: stats.totalUsers > 0 ? Math.round(stats.totalFucks / stats.totalUsers) : 0,
  });
}
