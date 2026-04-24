export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          AI Meeting Copilot
        </h1>
        <p className="text-lg text-gray-400">
          Upload meetings, generate transcripts, extract action items,
          and chat with your conversations.
        </p>

        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition">
            Upload Meeting
          </button>
          <button className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-900 transition">
            View Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}