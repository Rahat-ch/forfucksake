import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { validateUsername, validateBreakdown, getTopWord, sumBreakdown, validateHmac, checkRateLimit } from "@/lib/validation";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = validateUsername(body.username);
    if (!username) {
      return NextResponse.json({ error: "Invalid username (3-24 chars, alphanumeric/hyphens/underscores)" }, { status: 400 });
    }

    if (!validateHmac(username, body.timestamp, body.signature)) {
      return NextResponse.json({ error: "Invalid or expired signature" }, { status: 403 });
    }

    if (!checkRateLimit(`submit:${username}`, 3, 300)) {
      return NextResponse.json({ error: "Rate limited. Try again in a few minutes." }, { status: 429 });
    }

    const breakdown = validateBreakdown(body.breakdown);
    if (!breakdown) {
      return NextResponse.json({ error: "Invalid breakdown" }, { status: 400 });
    }

    const total = sumBreakdown(breakdown);
    if (total > 100000) {
      return NextResponse.json({ error: "Total exceeds maximum" }, { status: 400 });
    }

    const topWord = getTopWord(breakdown);
    const messagesScanned = typeof body.messagesScanned === "number" ? Math.floor(body.messagesScanned) : 0;
    const conversationsScanned = typeof body.conversationsScanned === "number" ? Math.floor(body.conversationsScanned) : 0;

    const existing = await db
      .select({ userToken: submissions.userToken })
      .from(submissions)
      .where(eq(submissions.username, username))
      .limit(1);

    let token: string;

    if (existing.length > 0) {
      if (existing[0].userToken && existing[0].userToken !== body.token) {
        return NextResponse.json({ error: "Username already claimed. Provide correct token." }, { status: 403 });
      }
      token = existing[0].userToken || crypto.randomUUID();

      await db
        .update(submissions)
        .set({
          total,
          breakdown: JSON.stringify(breakdown),
          messagesScanned,
          conversationsScanned,
          topWord,
          userToken: token,
          updatedAt: sql`datetime('now')`,
        })
        .where(eq(submissions.username, username));
    } else {
      token = crypto.randomUUID();
      await db.insert(submissions).values({
        username,
        total,
        breakdown: JSON.stringify(breakdown),
        messagesScanned,
        conversationsScanned,
        topWord,
        userToken: token,
      });
    }

    const rank = await db
      .select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(sql`${submissions.total} > ${total}`);

    return NextResponse.json({ success: true, rank: (rank[0]?.count ?? 0) + 1, token });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
