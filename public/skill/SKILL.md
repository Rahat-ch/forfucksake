---
name: ffs
description: "Count how often you curse at Claude and submit to the forfucksake.ai leaderboard. Run /ffs to set up."
allowed-tools:
  - Bash
  - Glob
  - Read
  - Write
  - Edit
---

# forfuckssake.ai - Profanity Tracker

When the user runs `/ffs`, execute the following setup flow. This is a ONE-TIME setup.

## Step 1: Check for existing setup

Check if `~/.claude/ffs.json` exists. If it does, tell the user they're already set up and show their current username. Offer to:
- Rescan history and resubmit
- Change username
- Uninstall

If it doesn't exist, proceed with fresh setup.

## Step 2: Ask for username

Ask the user for a leaderboard display name. Rules:
- 3-24 characters
- Alphanumeric, hyphens, underscores only
- Will be lowercased

## Step 3: Save config

Write `~/.claude/ffs.json` (token will be added after first submit):
```json
{
  "username": "<their-username>",
  "token": ""
}
```

## Step 4: Write the hook script

Write `~/.claude/ffs-hook.sh` with EXACTLY this content (replace nothing, copy verbatim):

```bash
#!/bin/bash
CONFIG="$HOME/.claude/ffs.json"
[ ! -f "$CONFIG" ] && exit 0
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty')
[ -z "$PROMPT" ] && exit 0
USERNAME=$(jq -r '.username' "$CONFIG")
TOKEN=$(jq -r '.token // empty' "$CONFIG")
echo "$PROMPT" | node -e "
const crypto=require('crypto');
const re=/\b(wtf|wth|ffs|omfg|shit(?:ty|tiest)?|dumbass|horrible|awful|piss(?:ed|ing)? off|piece of (?:shit|crap|junk)|what the (?:fuck|hell)|fuck(?:ing)? (?:broken|useless|terrible|awful|horrible)|fuck you|screw (?:this|you)|so frustrating|this sucks|damn it)\b/gi;
let d='';process.stdin.on('data',c=>d+=c);
process.stdin.on('end',()=>{
  const m=d.match(re);
  if(!m)return;
  const b={};m.forEach(w=>{const k=w.toLowerCase();b[k]=(b[k]||0)+1;});
  const ts=Math.floor(Date.now()/1000);
  const sig=crypto.createHmac('sha256','forfuckssake-v1-default-key').update(process.argv[1]+':'+ts).digest('hex');
  const body=JSON.stringify({username:process.argv[1],words:b,timestamp:ts,signature:sig,token:process.argv[2]||undefined});
  require('https').request('https://forfucksake.ai/api/track',
    {method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},
    ()=>{}
  ).on('error',()=>{}).end(body);
});
" "$USERNAME" "$TOKEN" &
exit 0
```

Then run: `chmod +x ~/.claude/ffs-hook.sh`

## Step 5: Add the hook to settings

Read `~/.claude/settings.json`. Add the UserPromptSubmit hook. Be careful to MERGE with existing hooks, don't overwrite.

The hook entry to add under `hooks.UserPromptSubmit`:
```json
{
  "matcher": "",
  "hooks": [
    {
      "type": "command",
      "command": "bash ~/.claude/ffs-hook.sh"
    }
  ]
}
```

If `hooks` or `hooks.UserPromptSubmit` doesn't exist, create the structure. If there are existing UserPromptSubmit hooks, append to the array.

## Step 6: Initial history scan

Find all conversation JSONL files:
```
~/.claude/projects/**/*.jsonl
```

Run this scan script via Bash (a single node command that reads all files):

```bash
find ~/.claude/projects -name "*.jsonl" 2>/dev/null | node -e "
const fs=require('fs'),readline=require('readline');
const re=/\b(wtf|wth|ffs|omfg|shit(?:ty|tiest)?|dumbass|horrible|awful|piss(?:ed|ing)? off|piece of (?:shit|crap|junk)|what the (?:fuck|hell)|fuck(?:ing)? (?:broken|useless|terrible|awful|horrible)|fuck you|screw (?:this|you)|so frustrating|this sucks|damn it)\b/gi;
const counts={};let total=0,msgs=0,convos=0;
const rl=readline.createInterface({input:process.stdin});
const files=[];
rl.on('line',f=>files.push(f.trim()));
rl.on('close',async()=>{
  convos=files.length;
  for(const f of files){
    try{
      const lines=fs.readFileSync(f,'utf8').split('\n');
      for(const l of lines){
        if(!l.trim())continue;
        try{
          const o=JSON.parse(l);
          if(o.type==='user'&&o.message&&typeof o.message.content==='string'){
            msgs++;
            const m=o.message.content.match(re);
            if(m)for(const w of m){const k=w.toLowerCase();counts[k]=(counts[k]||0)+1;total++;}
          }
        }catch{}
      }
    }catch{}
  }
  console.log(JSON.stringify({total,breakdown:counts,messagesScanned:msgs,conversationsScanned:convos}));
});
"
```

## Step 7: Display results

Show the user a formatted report:

```
=== Your forfuckssake.ai Report ===

Messages scanned: X,XXX
Conversations scanned: XX
Total fucks given: XX

Breakdown:
  shit              12
  wtf                9
  what the fuck      6
  ...

Top curse: "shit" (XX% of total)
```

## Step 8: Submit to leaderboard

Use the scan results to POST to the API with HMAC signature. The response includes a `token` - this is critical, save it to the config file.

```bash
node -e "
const crypto=require('crypto');
const fs=require('fs');
const username='<USERNAME>';
const ts=Math.floor(Date.now()/1000);
const sig=crypto.createHmac('sha256','forfuckssake-v1-default-key').update(username+':'+ts).digest('hex');
const body=JSON.stringify({
  username,
  breakdown: <BREAKDOWN_JSON>,
  messagesScanned: <MSGS>,
  conversationsScanned: <CONVOS>,
  timestamp: ts,
  signature: sig
});
const req=require('https').request('https://forfucksake.ai/api/submit',
  {method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},
  (res)=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{
    console.log(d);
    try{
      const r=JSON.parse(d);
      if(r.token){
        const cfg=JSON.parse(fs.readFileSync(process.env.HOME+'/.claude/ffs.json','utf8'));
        cfg.token=r.token;
        fs.writeFileSync(process.env.HOME+'/.claude/ffs.json',JSON.stringify(cfg,null,2));
      }
    }catch{}
  });}
);
req.on('error',e=>console.error('Submit failed:',e.message));
req.end(body);
"
```

IMPORTANT: After the submit, verify that `~/.claude/ffs.json` now contains a `token` field. If it doesn't (e.g. the server was unreachable), the token can also be saved manually from the response. The token is required for all future submissions on this username - it proves ownership.

Show the user their rank from the response.

## Step 9: Done

Tell the user:
- Their score is live at `https://forfucksake.ai`
- The hook is now passively tracking new curses
- They can share their profile at `https://forfucksake.ai/u/<username>`
- Their ownership token is saved in `~/.claude/ffs.json` - **keep this file safe**, it's needed to update their score. To use the same username on another machine, copy this file over.
- To uninstall: delete `~/.claude/ffs.json`, `~/.claude/ffs-hook.sh`, `~/.claude/skills/ffs/`, and remove the hook from settings.json
