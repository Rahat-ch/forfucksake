export default function ApiDocs() {
  return (
    <div className="px-6 pt-8 pb-24 max-w-3xl mx-auto">
      <h1 className="text-4xl font-black text-center mb-2">API</h1>
      <p className="text-center text-sm text-red/60 mb-10">
        Build your own integrations
      </p>

      <div className="space-y-8">
        <Endpoint
          method="POST"
          path="/api/submit"
          description="Submit a full profanity scan (replaces existing data for the username)"
          body={`{
  "username": "your-name",
  "total": 47,
  "breakdown": { "shit": 12, "wtf": 9, "what the fuck": 6 },
  "messagesScanned": 4231,
  "conversationsScanned": 67
}`}
          response={`{ "success": true, "rank": 3 }`}
        />

        <Endpoint
          method="POST"
          path="/api/track"
          description="Increment counts (used by the passive hook)"
          body={`{
  "username": "your-name",
  "words": { "shit": 1, "wtf": 2 }
}`}
          response={`{ "success": true }`}
        />

        <Endpoint
          method="GET"
          path="/api/leaderboard?page=1&limit=50"
          description="Get the ranked leaderboard"
          response={`{
  "entries": [{ "username": "...", "total": 47, "topWord": "shit", "rank": 1 }],
  "totalEntries": 347,
  "page": 1
}`}
        />

        <Endpoint
          method="GET"
          path="/api/stats"
          description="Global stats"
          response={`{
  "totalUsers": 347,
  "totalFucks": 12847,
  "topWord": "shit",
  "avgPerUser": 37
}`}
        />

        <Endpoint
          method="GET"
          path="/api/user/:username"
          description="Get a single user's stats"
          response={`{
  "username": "...",
  "total": 47,
  "breakdown": { "shit": 12, "wtf": 9 },
  "rank": 3,
  "topWord": "shit"
}`}
        />
      </div>
    </div>
  );
}

function Endpoint({
  method,
  path,
  description,
  body,
  response,
}: {
  method: string;
  path: string;
  description: string;
  body?: string;
  response: string;
}) {
  return (
    <div className="bg-cream border-2 border-red rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b-2 border-red flex items-center gap-3">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${method === "POST" ? "bg-red text-cream" : "bg-red/20 text-red"}`}>
          {method}
        </span>
        <code className="text-sm font-mono font-bold">{path}</code>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-red/70">{description}</p>
        {body && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Body</p>
            <pre className="text-xs font-mono bg-pink-light/50 rounded-lg p-3 overflow-x-auto">{body}</pre>
          </div>
        )}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Response</p>
          <pre className="text-xs font-mono bg-pink-light/50 rounded-lg p-3 overflow-x-auto">{response}</pre>
        </div>
      </div>
    </div>
  );
}
