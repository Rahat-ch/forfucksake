"use client";

import { useState } from "react";

const INSTALL_CMD = `mkdir -p ~/.claude/skills/ffs && curl -s https://forfucksake.ai/skill/SKILL.md > ~/.claude/skills/ffs/SKILL.md`;

export function InstallBlock() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Install the Skill</h2>

      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold mb-2 uppercase tracking-wide">Step 1: Run this in your terminal</p>
          <div className="relative">
            <pre className="bg-cream border-2 border-red rounded-xl p-4 text-xs font-mono overflow-x-auto text-red/80">
              {INSTALL_CMD}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 px-3 py-1 bg-red text-cream text-[10px] font-bold rounded-md hover:bg-red-dark transition-colors"
            >
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold mb-2 uppercase tracking-wide">Step 2: Open Claude Code and type</p>
          <div className="bg-cream border-2 border-red rounded-xl p-4">
            <code className="text-lg font-mono font-bold">/ffs</code>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold mb-2 uppercase tracking-wide">Step 3: Choose your username</p>
          <p className="text-sm text-red/70">
            The skill scans your conversation history, counts your profanity, and submits to the leaderboard.
            After setup, it passively tracks new curses in the background.
          </p>
        </div>
      </div>
    </div>
  );
}
