import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import { Notice } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import NoticeCard from "@/components/NoticeCard";

interface HomeProps {
  initialNotices: Notice[];
}

export default function Home({ initialNotices }: HomeProps) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
        if (res.ok) {
          setNotices(notices.filter((n) => n.id !== id));
        }
      } catch (err) {
        console.error("Failed to delete notice");
      }
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            NoticeBoard
          </div>
          <Link href="/add" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Post Notice
          </Link>
        </div>
      </header>

      <div className="container">
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 800, margin: "0 0 8px 0" }}>Recent Notices</h1>
          <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "16px" }}>Stay up to date with the latest announcements.</p>
        </div>
        
        {notices.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "16px", border: "2px dashed #cbd5e1" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📭</div>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "24px" }}>No notices yet</h2>
            <p style={{ color: "var(--text-secondary)", margin: "0 0 32px 0", fontSize: "15px" }}>There are currently no active notices on the board.</p>
            <Link href="/add" className="btn btn-primary">Create the first notice</Link>
          </div>
        ) : (
          <div className="grid">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
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
