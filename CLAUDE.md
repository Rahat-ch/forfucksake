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

## Branching

- `main` - production. Deploys to forfucksake.ai via Coolify.
- `development` - all PRs target this branch. Merged to main for releases.

All work should be done on feature branches off `development`. Never push directly to `main`.

## Dev

```bash
git checkout development
npm install && mkdir -p data && npx drizzle-kit push && npm run dev
```

## Versioning & Releases

Bump version in `package.json` on every deploy to main. The version badge on the landing page reads from package.json automatically. Use semver:
- patch (1.0.x): bug fixes, copy changes, style tweaks
- minor (1.x.0): new features, new pages, API changes
- major (x.0.0): breaking changes to API or skill

On every version bump:
1. Bump version in `package.json`
2. Commit with message `vX.Y.Z - description`
3. Tag: `git tag -a vX.Y.Z -m "vX.Y.Z - description"`
4. Push: `git push && git push origin vX.Y.Z`
5. Release: `gh release create vX.Y.Z --title "vX.Y.Z - description" --generate-notes`
6. Redeploy on Coolify

## Dependencies

All deps pinned to exact versions (no `^` ranges). When updating deps, update both `package.json` and `package-lock.json`.

## Deploy

Dockerfile with standalone output. SQLite persisted via Docker volume at /app/data. Deployed on Coolify/Hetzner behind Cloudflare. Redeploy from Coolify dashboard after pushing to main.
