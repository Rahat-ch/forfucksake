import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#F5A0B8", padding: "60px" }}>
          <div style={{ display: "flex", fontSize: 130, fontWeight: 900, color: "#E8432A", lineHeight: 0.85 }}>forfuckssake</div>
          <div style={{ display: "flex", fontSize: 34, color: "#E8432A", marginTop: 30, border: "4px solid #E8432A", borderRadius: 999, padding: "14px 40px", fontWeight: 700 }}>The Global AI-Induced Rage Index</div>
          <div style={{ display: "flex", fontSize: 26, color: "#E8432A", marginTop: 30, opacity: 0.7, fontWeight: 600 }}>Track your developer rage. Compete for shame.</div>
          <div style={{ display: "flex", fontSize: 18, color: "#E8432A", marginTop: 16, opacity: 0.4, fontWeight: 600 }}>forfucksake.ai</div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const rows = await db.select().from(submissions).where(eq(submissions.username, username.toLowerCase())).limit(1);

  if (rows.length === 0) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F5A0B8", color: "#E8432A", fontSize: 48, fontWeight: 900 }}>User not found</div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const user = rows[0];
  const [{ rank }] = await db.select({ rank: sql<number>`count(*) + 1` }).from(submissions).where(sql`${submissions.total} > ${user.total}`);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#F5A0B8", padding: "50px 60px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 900, color: "#E8432A", lineHeight: 0.9 }}>forfuckssake</div>
          <div style={{ display: "flex", fontSize: 18, color: "#E8432A", opacity: 0.5, marginTop: 8, fontWeight: 600 }}>The Global AI-Induced Rage Index</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 900, color: "#E8432A" }}>{user.username}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 4 }}>
            <div style={{ display: "flex", fontSize: 110, fontWeight: 900, color: "#E8432A", lineHeight: 1 }}>{user.total.toLocaleString()}</div>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#E8432A", opacity: 0.6 }}>fucks given</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", backgroundColor: "#E8432A", color: "#FFF8F0", padding: "12px 28px", borderRadius: 12, fontSize: 22, fontWeight: 800 }}>RANK #{rank}</div>
          {user.topWord && (
            <div style={{ display: "flex", backgroundColor: "#FFF8F0", color: "#E8432A", padding: "12px 28px", borderRadius: 12, fontSize: 22, fontWeight: 700, border: "3px solid #E8432A" }}>TOP: {user.topWord}</div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
