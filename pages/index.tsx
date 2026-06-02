import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Notice } from ".prisma/client";
import { prisma } from "@/lib/prisma";
import NoticeCard from "@/components/NoticeCard";
import ConfirmDialog from "@/components/ConfirmDialog";
import ThemeToggle from "@/components/ThemeToggle";

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
      if (res.ok) setNotices((prev) => prev.filter((n) => n.id !== deleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const urgentNotices = notices.filter((n) => n.priority === "Urgent");
  const normalNotices = notices.filter((n) => n.priority === "Normal");

  return (
    <>
      <Head>
        <title>Notice Board – Reno Platforms</title>
        <meta name="description" content="Official notice board for Reno Platforms. View, create, edit and delete institutional notices." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>

        {/* ===== HEADER ===== */}
        <header className="site-header">
          <div style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px var(--accent-glow)",
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <div>
                <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Notice<span style={{ color: "var(--accent)" }}>Board</span>
                </span>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, marginTop: -2 }}>
                  Reno Platforms
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }} />

            {/* Stats chips (desktop) */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {urgentNotices.length > 0 && (
                <span className="stat-chip" style={{ display: "flex" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", animation: "pulse-urgent 2s ease-in-out infinite" }} />
                  <strong style={{ color: "#ef4444" }}>{urgentNotices.length}</strong>
                  <span style={{ display: "none" }}>Urgent</span>
                </span>
              )}
            </div>

            {/* Actions */}
            <ThemeToggle />
            <Link href="/add" id="add-notice-btn" className="btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Post Notice
            </Link>
          </div>
        </header>

        {/* ===== MAIN ===== */}
        <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px 64px" }}>

          {/* Page title + stats */}
          <div className="animate-fade-up" style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6, letterSpacing: "-0.03em" }}>
              All Notices
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
              <span className="stat-chip">
                Total <strong>{notices.length}</strong>
              </span>
              <span className="stat-chip">
                Urgent <strong style={{ color: urgentNotices.length > 0 ? "#ef4444" : "var(--text-primary)" }}>{urgentNotices.length}</strong>
              </span>
              <span className="stat-chip">
                Normal <strong>{normalNotices.length}</strong>
              </span>
            </div>
          </div>

          {/* Empty state */}
          {notices.length === 0 && (
            <div className="animate-fade-up" style={{ textAlign: "center", paddingTop: 80, paddingBottom: 80 }}>
              <div className="empty-illustration">📭</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                No notices yet
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>
                Post your first notice and it will appear here.
              </p>
              <Link href="/add" className="btn-primary" style={{ display: "inline-flex" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Post First Notice
              </Link>
            </div>
          )}

          {/* Urgent section */}
          {urgentNotices.length > 0 && (
            <section>
              <div className="urgent-divider">
                <span style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "pulse-urgent 2s ease-in-out infinite" }} />
                  Urgent Notices
                </span>
              </div>
              <div className="card-grid">
                {urgentNotices.map((notice, i) => (
                  <NoticeCard key={notice.id} notice={notice} onDelete={handleDeleteRequest} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Normal section */}
          {normalNotices.length > 0 && (
            <section style={{ marginTop: urgentNotices.length > 0 ? 0 : 0 }}>
              {urgentNotices.length > 0 && (
                <div className="urgent-divider" style={{ color: "var(--text-muted)" }}>
                  General Notices
                </div>
              )}
              <div className="card-grid">
                {normalNotices.map((notice, i) => (
                  <NoticeCard key={notice.id} notice={notice} onDelete={handleDeleteRequest} index={urgentNotices.length + i} />
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ===== FOOTER ===== */}
        <footer style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "20px 24px",
          textAlign: "center",
          fontSize: 12,
          color: "var(--text-muted)",
        }}>
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
      initialNotices: notices.map((n) => ({
        ...n,
        publishDate: n.publishDate.toISOString(),
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
    },
  };
};
