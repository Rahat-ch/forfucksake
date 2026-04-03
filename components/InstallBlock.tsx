"use client";

import { useState } from "react";

const CLAUDE_PROMPT = `Fetch https://forfucksake.ai/skill/SKILL.md and save it to ~/.claude/skills/ffs/SKILL.md (create the directory if needed). Then follow all the instructions in it to set me up.`;

export function InstallBlock() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CLAUDE_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Get Started</h2>

      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold mb-2 uppercase tracking-wide">Copy this and send it to Claude Code</p>
          <div className="relative">
            <div className="bg-cream border-2 border-red rounded-xl p-5 pr-16 text-sm font-mono text-red/80 leading-relaxed">
              {CLAUDE_PROMPT}
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 px-4 py-1.5 bg-red text-cream text-[10px] font-bold rounded-md hover:bg-red-dark transition-colors"
            >
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-red/70">
            Claude will install the skill, scan your conversation history, ask you to pick a username,
            and submit your score. After setup, it passively tracks new curses in the background.
          </p>
        </div>
      </div>
    </div>
  );
}
