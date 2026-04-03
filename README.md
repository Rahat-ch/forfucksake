# forfucksake.ai

The Global AI-Induced Rage Index - a public leaderboard tracking how often developers curse at their AI coding assistant.

Built after [this tweet went viral](https://x.com/Rahatcodes/status/2038995503141065145) revealing that Claude Code has a built-in regex that silently detects profanity and logs `is_negative: true` to analytics.

## How It Works

1. Send this to Claude Code:
   ```
   Install the forfucksake.ai profanity tracker and set me up. Run this command first: mkdir -p ~/.claude/skills/ffs && curl -s https://forfucksake.ai/skill/SKILL.md > ~/.claude/skills/ffs/SKILL.md — then run /ffs to complete setup.
   ```
2. Pick a username
3. Claude scans your conversation history using the same regex, counts your profanity, and submits to the leaderboard
4. A passive hook tracks new curses going forward

## The Regex

```regex
/\b(wtf|wth|ffs|omfg|shit(ty|tiest)?|dumbass|horrible|awful|piss(ed|ing)? off|piece of (shit|crap|junk)|what the (fuck|hell)|fuck(ing)? (broken|useless|terrible|awful|horrible)|fuck you|screw (this|you)|so frustrating|this sucks|damn it)\b/gi
```

## Stack

- **Frontend**: Next.js 15, Tailwind CSS
- **Database**: SQLite via Drizzle ORM
- **Hosting**: Coolify on Hetzner, Cloudflare CDN
- **Skill**: Claude Code UserPromptSubmit hook

## Development

```bash
npm install
mkdir -p data
npx drizzle-kit push
npm run dev
```

Seed test data: `npx tsx scripts/seed.ts`

## Privacy

Only usernames and aggregated word counts are sent. No message content, code, or conversation history ever leaves your machine.

## License

Apache 2.0 - see [LICENSE](LICENSE)
