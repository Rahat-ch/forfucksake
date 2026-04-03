import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { validateUsername, validateBreakdown, getTopWord, sumBreakdown, validateHmac, checkRateLimit } from "@/lib/validation";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = validateUsername(body.username);
    if (!username) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    if (!validateHmac(username, body.timestamp, body.signature)) {
      return NextResponse.json({ error: "Invalid or expired signature" }, { status: 403 });
    }

    if (!checkRateLimit(`track:${username}`, 30, 60)) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    const words = validateBreakdown(body.words);
    if (!words || Object.keys(words).length === 0) {
      return NextResponse.json({ error: "Invalid words" }, { status: 400 });
    }

    const increment = sumBreakdown(words);

    const existing = await db
      .select()
      .from(submissions)
      .where(eq(submissions.username, username))
      .limit(1);

    if (existing.length > 0) {
      const row = existing[0];
      if (row.userToken && row.userToken !== body.token) {
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
      }
      const oldBreakdown: Record<string, number> = JSON.parse(row.breakdown);

      for (const [word, count] of Object.entries(words)) {
        oldBreakdown[word] = (oldBreakdown[word] || 0) + count;
      }

      const newTotal = row.total + increment;
      if (newTotal > 100000) {
        return NextResponse.json({ error: "Total exceeds maximum" }, { status: 400 });
      }

      const topWord = getTopWord(oldBreakdown);

      await db
        .update(submissions)
        .set({
          total: newTotal,
          breakdown: JSON.stringify(oldBreakdown),
          topWord,
          updatedAt: sql`datetime('now')`,
        })
        .where(eq(submissions.username, username));
    } else {
      const topWord = getTopWord(words);
      await db.insert(submissions).values({
        username,
        total: increment,
        breakdown: JSON.stringify(words),
        topWord,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
