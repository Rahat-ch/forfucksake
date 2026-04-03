import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const rows = await db
    .select()
    .from(submissions)
    .where(eq(submissions.username, username.toLowerCase()))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const user = rows[0];

  const [{ rank }] = await db
    .select({ rank: sql<number>`count(*) + 1` })
    .from(submissions)
    .where(sql`${submissions.total} > ${user.total}`);

  return NextResponse.json({
    username: user.username,
    total: user.total,
    breakdown: JSON.parse(user.breakdown),
    topWord: user.topWord,
    rank,
    messagesScanned: user.messagesScanned,
    conversationsScanned: user.conversationsScanned,
    updatedAt: user.updatedAt,
  });
}
