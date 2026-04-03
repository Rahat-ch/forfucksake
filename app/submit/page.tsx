import { InstallBlock } from "@/components/InstallBlock";

const faqs = [
  {
    q: "What is this?",
    a: "Claude Code (Anthropic's CLI) has a built-in regex that detects when you curse at it — things like \"wtf\", \"fuck you\", \"this sucks\", etc. It silently logs is_negative: true to analytics. We built a public leaderboard so you can see how you compare.",
  },
  {
    q: "What data gets sent?",
    a: "Only your chosen username and aggregated word counts. We never see your actual messages, code, or conversation history. The scan runs entirely on your machine.",
  },
  {
    q: "How does passive tracking work?",
    a: "After running /ffs, a lightweight hook fires on every message you send in Claude Code. It runs the same profanity regex locally and POSTs just the matched word counts to our API. Fire-and-forget, never blocks your workflow.",
  },
  {
    q: "What's the exact regex?",
    a: String.raw`/\b(wtf|wth|ffs|omfg|shit(ty|tiest)?|dumbass|horrible|awful|piss(ed|ing)? off|piece of (shit|crap|junk)|what the (fuck|hell)|fuck(ing)? (broken|useless|terrible|awful|horrible)|fuck you|screw (this|you)|so frustrating|this sucks|damn it)\b/gi`,
  },
  {
    q: "Can I fake my score?",
    a: "Technically yes. We don't verify JSONL files. But where's the fun in that? Your real rage is funnier than anything you could make up.",
  },
  {
    q: "How do I uninstall?",
    a: "Delete ~/.claude/skills/ffs/, ~/.claude/ffs.json, ~/.claude/ffs-hook.sh, and remove the UserPromptSubmit hook from ~/.claude/settings.json.",
  },
];

export default function SubmitPage() {
  return (
    <div className="px-6 pt-8 pb-24 max-w-3xl mx-auto">
      <h1 className="text-4xl font-black text-center mb-2">Submit Fuck</h1>
      <p className="text-center text-sm text-red/60 mb-10">
        Install the Claude Code skill and let it do the rest
      </p>
      <InstallBlock />

      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-cream border-2 border-red rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-2">{faq.q}</h3>
              <p className="text-sm text-red/70 leading-relaxed break-all">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
