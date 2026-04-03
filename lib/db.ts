import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "forfucksake.db");

const dirPath = path.dirname(DB_PATH);
import { mkdirSync } from "fs";
try {
  mkdirSync(dirPath, { recursive: true });
} catch {}

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("busy_timeout = 5000");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    total INTEGER NOT NULL DEFAULT 0,
    breakdown TEXT NOT NULL DEFAULT '{}',
    messages_scanned INTEGER NOT NULL DEFAULT 0,
    conversations_scanned INTEGER NOT NULL DEFAULT 0,
    top_word TEXT,
    user_token TEXT,
    submitted_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_submissions_total ON submissions(total DESC);
`);

export const db = drizzle(sqlite, { schema });
