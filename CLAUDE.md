@AGENTS.md

# forfucksake.ai

Public profanity leaderboard for Claude Code users. Next.js 15 + Tailwind + Drizzle + SQLite.

## Architecture

- `app/` - Pages (/, /wall, /submit, /api-docs, /u/[username]) + API routes
- `components/` - FloatingPills, TabNav, Leaderboard, StatusBadges, InstallBlock, ShareButton
- `lib/db.ts` - SQLite connection with auto-migration on startup
- `lib/schema.ts` - Drizzle schema (submissions table)
- `lib/validation.ts` - Username, breakdown, HMAC, rate limiting
- `public/skill/SKILL.md` - The /ffs skill served for curl install

## API Auth

- HMAC signature: `hmac(username:timestamp, secret)` on all write endpoints
- User token: returned on first submit, required for all future writes to that username
- In-memory rate limiting per username

## Design

Pink (#F5A0B8) bg, red-orange (#E8432A) text, cream (#FFF8F0) pill backgrounds. Scattered floating pills on homepage, not a table.

## Dev

```bash
npm install && mkdir -p data && npx drizzle-kit push && npm run dev
```

## Deploy

Dockerfile with standalone output. SQLite persisted via Docker volume at /app/data. Deployed on Coolify/Hetzner behind Cloudflare.
