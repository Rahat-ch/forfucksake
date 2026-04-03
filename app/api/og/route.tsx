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
            padding: "40px",
          }}
        >
          <div style={{ fontSize: 120, fontWeight: 900, color: "#E8432A", lineHeight: 0.9 }}>
            forfuckssake
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#E8432A",
              marginTop: 24,
              border: "3px solid #E8432A",
              borderRadius: 999,
              padding: "12px 32px",
            }}
          >
            The Global AI-Induced Rage Index
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
        <div style={{ fontSize: 36, color: "#E8432A", fontWeight: 700, opacity: 0.6 }}>
          forfuckssake.ai
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, color: "#E8432A", marginTop: 20 }}>
          {user.username}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            marginTop: 16,
          }}
        >
          <span style={{ fontSize: 96, fontWeight: 900, color: "#E8432A" }}>
            {user.total.toLocaleString()}
          </span>
          <span style={{ fontSize: 36, fontWeight: 700, color: "#E8432A", opacity: 0.7 }}>
            fucks given
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: 32,
          }}
        >
          <div
            style={{
              backgroundColor: "#E8432A",
              color: "#FFF8F0",
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            RANK #{rank}
          </div>
          {user.topWord && (
            <div
              style={{
                backgroundColor: "#E8432A",
                color: "#FFF8F0",
                padding: "10px 24px",
                borderRadius: 8,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              TOP WORD: {user.topWord}
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
