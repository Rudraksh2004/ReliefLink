import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        ReliefLink
      </h1>
      <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400 mb-8">
        The AI-powered NGO coordination platform for real-time disaster relief and volunteer matching.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/dashboard"
          className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25"
        >
          Go to Dashboard
        </Link>
        <Link 
          href="/community-needs"
          className="px-6 py-3 rounded-full border border-gray-300 dark:border-neutral-800 font-semibold hover:bg-gray-100 dark:hover:bg-neutral-900 transition-all"
        >
          Community Needs
        </Link>
      </div>
    </main>
  );
}
