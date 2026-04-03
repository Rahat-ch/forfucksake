import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { desc, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
  const offset = (page - 1) * limit;

  const entries = await db
    .select({
      username: submissions.username,
      total: submissions.total,
      topWord: submissions.topWord,
      breakdown: submissions.breakdown,
      updatedAt: submissions.updatedAt,
    })
    .from(submissions)
    .orderBy(desc(submissions.total))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(submissions);

  return NextResponse.json({
    entries: entries.map((e, i) => ({
      ...e,
      breakdown: JSON.parse(e.breakdown),
      rank: offset + i + 1,
    })),
    totalEntries: count,
    page,
  });
}
