import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Notice } from ".prisma/client";
import { prisma } from "@/lib/prisma";
import NoticeForm, { NoticeFormData } from "@/components/NoticeForm";
import ThemeToggle from "@/components/ThemeToggle";

interface EditNoticePageProps {
  notice: Notice & { publishDate: string; createdAt: string; updatedAt: string };
}

export default function EditNoticePage({ notice }: EditNoticePageProps) {
  const defaultValues: NoticeFormData = {
    title: notice.title,
    body: notice.body,
    category: notice.category as NoticeFormData["category"],
    priority: notice.priority as NoticeFormData["priority"],
    publishDate: notice.publishDate.split("T")[0],
    image: notice.image ?? "",
  };

  return (
    <>
      <Head>
        <title>Edit Notice – Notice Board</title>
        <meta name="description" content="Edit an existing notice on the Reno Platforms notice board." />
      </Head>

      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>

        {/* Header */}
        <header className="site-header">
          <div style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <Link
              href="/"
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
            </Link>

            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                Edit Notice
              </span>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
                Notice Board · Reno Platforms
              </div>
            </div>

            <div style={{ flex: 1 }} />
            <ThemeToggle />
          </div>
        </header>

        {/* Main */}
        <main style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}>
          {/* Page header */}
          <div className="animate-fade-up" style={{ marginBottom: 28 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 10,
              background: "var(--accent-subtle)",
              border: "1px solid var(--border-default)",
              marginBottom: 16,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>Editing</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6, letterSpacing: "-0.02em" }}>
              Update Notice
            </h1>
            <p
              className="line-clamp-2"
              style={{ fontSize: 14, color: "var(--text-secondary)" }}
            >
              {notice.title}
            </p>
          </div>

          {/* Form card */}
          <div
            className="animate-fade-up glass-card"
            style={{ padding: "28px", animationDelay: "80ms" }}
          >
            <NoticeForm defaultValues={defaultValues} noticeId={notice.id} />
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = parseInt(params?.id as string, 10);
  if (isNaN(id)) return { notFound: true };
  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) return { notFound: true };
  return {
    props: {
      notice: {
        ...notice,
        publishDate: notice.publishDate.toISOString(),
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
      },
    },
  };
};
