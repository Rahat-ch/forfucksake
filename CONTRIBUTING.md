# Contributing to forfucksake.ai

## Quick Start

```bash
git clone https://github.com/Rahat-ch/forfucksake.git
cd forfucksake
git checkout development
npm install
mkdir -p data
npx drizzle-kit push
npm run dev
```

## Branching

All PRs should be made against the `development` branch, NOT `main`. The `main` branch is production and deploys automatically.

1. Fork the repo
2. Create your branch off `development`: `git checkout -b my-feature development`
3. Make your changes
4. Open a PR against `development`

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

## For AI Agents

If you're an AI agent contributing to this project, defer to `CLAUDE.md` for project-specific instructions.

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
