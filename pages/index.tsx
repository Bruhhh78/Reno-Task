import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Notice } from ".prisma/client";
import { prisma } from "@/lib/prisma";
import NoticeCard from "@/components/NoticeCard";
import ConfirmDialog from "@/components/ConfirmDialog";

interface HomeProps {
  initialNotices: Notice[];
}

export default function Home({ initialNotices }: HomeProps) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = (id: number) => setDeleteId(id);
  const handleCancelDelete = () => setDeleteId(null);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/notices/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setNotices((prev) => prev.filter((n) => n.id !== deleteId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const urgentCount = notices.filter((n) => n.priority === "Urgent").length;

  return (
    <>
      <Head>
        <title>Notice Board – Reno Platforms</title>
        <meta
          name="description"
          content="Official notice board for Reno Platforms. View, create, edit and delete institutional notices."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
                <span className="text-lg">📋</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-none">
                  Notice Board
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">Reno Platforms</p>
              </div>
            </div>
            <Link
              href="/add"
              id="add-notice-btn"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all"
            >
              <span className="text-base leading-none">+</span>
              <span>New Notice</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {/* Stats bar */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-gray-800/50 border border-gray-700/40 px-4 py-2">
              <span className="text-sm text-gray-400">Total</span>
              <span className="font-bold text-white">{notices.length}</span>
            </div>
            {urgentCount > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-sm text-red-400 font-medium">
                  {urgentCount} Urgent
                </span>
              </div>
            )}
          </div>

          {notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 text-5xl">📭</div>
              <h2 className="text-xl font-semibold text-gray-300">
                No notices yet
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Create your first notice to get started.
              </p>
              <Link
                href="/add"
                className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all"
              >
                Add Notice
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {notices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-800/40 py-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Reno Platforms · Notice Board
        </footer>
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
  });

  return {
    props: {
      // Dates must be serialized as strings for Next.js SSR
      initialNotices: notices.map((n) => ({
        ...n,
        publishDate: n.publishDate.toISOString(),
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
    },
  };
};
