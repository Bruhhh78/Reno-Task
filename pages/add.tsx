import Head from "next/head";
import Link from "next/link";
import NoticeForm from "@/components/NoticeForm";

export default function AddNoticePage() {
  return (
    <>
      <Head>
        <title>Add Notice – Notice Board</title>
        <meta name="description" content="Create a new notice on the Reno Platforms notice board." />
      </Head>

      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
            >
              ←
            </Link>
            <div>
              <h1 className="text-base font-bold text-white leading-none">
                Create Notice
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Notice Board · Reno Platforms</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <div className="rounded-2xl bg-gray-900/60 border border-gray-700/50 p-6 shadow-xl backdrop-blur-sm">
            <NoticeForm />
          </div>
        </main>
      </div>
    </>
  );
}
