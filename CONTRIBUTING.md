# Contributing to forfucksake.ai

## Quick Start

```bash
git clone https://github.com/Rahat-ch/forfucksake.git
cd forfucksake
npm install
mkdir -p data
npx drizzle-kit push
npm run dev
```

## Stack

- Next.js 15 (App Router)
- Tailwind CSS
- Drizzle ORM + SQLite (better-sqlite3)
- Deployed on Coolify/Hetzner behind Cloudflare

## Project Structure

- `app/` - Next.js pages and API routes
- `components/` - React components
- `lib/` - Database, schema, validation
- `public/skill/` - The `/ffs` Claude Code skill
- `scripts/` - Seed scripts

## API

- `POST /api/submit` - Bulk submit (initial scan)
- `POST /api/track` - Incremental tracking (hook events)
- `GET /api/leaderboard` - Paginated leaderboard
- `GET /api/stats` - Global stats
- `GET /api/user/:username` - User profile data
- `GET /api/og?username=x` - Dynamic OG image

## Guidelines

- Keep it fun
- Don't break the leaderboard
- Test locally before opening a PR
- No auth/signup - keep the friction zero

## License

Apache 2.0
