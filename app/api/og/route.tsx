import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F5A0B8",
            padding: "60px",
          }}
        >
          <div style={{ fontSize: 140, fontWeight: 900, color: "#E8432A", lineHeight: 0.85, letterSpacing: "-0.03em" }}>
            forfuckssake
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#E8432A",
              marginTop: 32,
              border: "4px solid #E8432A",
              borderRadius: 999,
              padding: "14px 40px",
              fontWeight: 700,
            }}
          >
            The Global AI-Induced Rage Index
          </div>
          <div style={{ fontSize: 22, color: "#E8432A", marginTop: 24, opacity: 0.6, fontWeight: 600 }}>
            forfucksake.ai
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const rows = await db
    .select()
    .from(submissions)
    .where(eq(submissions.username, username.toLowerCase()))
    .limit(1);

  if (rows.length === 0) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F5A0B8",
            color: "#E8432A",
            fontSize: 48,
            fontWeight: 900,
          }}
        >
          User not found
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const user = rows[0];
  const [{ rank }] = await db
    .select({ rank: sql<number>`count(*) + 1` })
    .from(submissions)
    .where(sql`${submissions.total} > ${user.total}`);

  const breakdown: Record<string, number> = JSON.parse(user.breakdown);
  const topEntries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#F5A0B8",
          padding: "50px 60px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 80, fontWeight: 900, color: "#E8432A", lineHeight: 0.9, letterSpacing: "-0.02em" }}>
              forfuckssake
            </div>
            <div style={{ fontSize: 18, color: "#E8432A", opacity: 0.5, marginTop: 8, fontWeight: 600 }}>
              The Global AI-Induced Rage Index
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: 56, fontWeight: 900, color: "#E8432A" }}>
              {user.username}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: 120, fontWeight: 900, color: "#E8432A", lineHeight: 1 }}>
                {user.total.toLocaleString()}
              </span>
              <span style={{ fontSize: 32, fontWeight: 700, color: "#E8432A", opacity: 0.6 }}>
                fucks given
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div
              style={{
                backgroundColor: "#E8432A",
                color: "#FFF8F0",
                padding: "12px 28px",
                borderRadius: 12,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "0.05em",
              }}
            >
              RANK #{rank}
            </div>
            {topEntries.map(([word, count]) => (
              <div
                key={word}
                style={{
                  backgroundColor: "#FFF8F0",
                  color: "#E8432A",
                  padding: "12px 28px",
                  borderRadius: 12,
                  fontSize: 22,
                  fontWeight: 700,
                  border: "3px solid #E8432A",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <span>{word}</span>
                <span style={{ fontWeight: 900 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
