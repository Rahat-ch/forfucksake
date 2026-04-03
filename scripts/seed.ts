import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "forfucksake.db");
const db = new Database(DB_PATH);

const users = [
  { username: "dan", total: 4200, breakdown: { shit: 1200, wtf: 900, "what the fuck": 600, "fucking broken": 500, "this sucks": 400, dumbass: 300, awful: 300 }, topWord: "shit" },
  { username: "prompteng", total: 3800, breakdown: { wtf: 1100, shit: 800, horrible: 600, "fuck you": 500, ffs: 400, awful: 400 }, topWord: "wtf" },
  { username: "sisyphus", total: 2900, breakdown: { "what the fuck": 800, shit: 700, "fucking useless": 500, awful: 400, "damn it": 300, "so frustrating": 200 }, topWord: "what the fuck" },
  { username: "whisperer", total: 2100, breakdown: { shit: 600, wtf: 500, horrible: 400, "screw this": 300, "piece of shit": 200, ffs: 100 }, topWord: "shit" },
  { username: "token_b", total: 1800, breakdown: { ffs: 500, wtf: 400, shit: 350, awful: 250, "damn it": 200, horrible: 100 }, topWord: "ffs" },
  { username: "regular_user", total: 900, breakdown: { shit: 300, wtf: 200, "this sucks": 150, awful: 100, horrible: 100, "damn it": 50 }, topWord: "shit" },
  { username: "chill_guy", total: 12, breakdown: { "damn it": 5, awful: 4, horrible: 3 }, topWord: "damn it" },
  { username: "bot_test", total: 1, breakdown: { wtf: 1 }, topWord: "wtf" },
  { username: "rage_quit_dev", total: 5100, breakdown: { "fuck you": 1500, shit: 1200, "what the fuck": 800, "fucking broken": 700, "piece of shit": 500, wtf: 400 }, topWord: "fuck you" },
  { username: "zen_coder", total: 45, breakdown: { "damn it": 20, "so frustrating": 15, awful: 10 }, topWord: "damn it" },
  { username: "midnight_hacker", total: 3200, breakdown: { shit: 900, "fucking broken": 800, wtf: 600, "what the fuck": 500, ffs: 400 }, topWord: "shit" },
  { username: "coffee_overflow", total: 1500, breakdown: { wtf: 500, shit: 400, "this sucks": 300, horrible: 200, ffs: 100 }, topWord: "wtf" },
];

const stmt = db.prepare(`
  INSERT OR REPLACE INTO submissions (username, total, breakdown, messages_scanned, conversations_scanned, top_word, submitted_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

for (const u of users) {
  stmt.run(u.username, u.total, JSON.stringify(u.breakdown), Math.floor(u.total * 20), Math.floor(u.total / 5), u.topWord);
}

console.log(`Seeded ${users.length} users`);
db.close();
