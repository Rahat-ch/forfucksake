import { Leaderboard } from "@/components/Leaderboard";

export default function WallOfShame() {
  return (
    <div className="px-6 pt-8 pb-24 max-w-3xl mx-auto">
      <h1 className="text-4xl font-black text-center mb-2">Wall of Shame</h1>
      <p className="text-center text-sm text-red/60 mb-8">
        Ranked by total fucks given to their AI
      </p>
      <Leaderboard />
    </div>
  );
}
