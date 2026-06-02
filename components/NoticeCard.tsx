import { Notice } from ".prisma/client";
import Link from "next/link";

interface NoticeCardProps {
  notice: Notice;
  onDelete: (id: number) => void;
  index?: number;
}

const categoryMap = {
  Exam:    { label: "Exam",    className: "badge badge-exam",    icon: "📝" },
  Event:   { label: "Event",   className: "badge badge-event",   icon: "🎉" },
  General: { label: "General", className: "badge badge-general", icon: "📢" },
};

export default function NoticeCard({ notice, onDelete, index = 0 }: NoticeCardProps) {
  const isUrgent = notice.priority === "Urgent";
  const cat = categoryMap[notice.category as keyof typeof categoryMap];
  const formattedDate = new Date(notice.publishDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      className={`notice-card card-enter ${isUrgent ? "urgent" : ""}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Card image */}
      {notice.image && (
        <div style={{ overflow: "hidden", borderRadius: "14px 14px 0 0", margin: "0 0 0 0" }}>
          <img
            src={notice.image}
            alt={notice.title}
            style={{
              width: "100%",
              height: "160px",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
      )}

      <div style={{ padding: "18px" }}>
        {/* Top row: badges */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span className={cat.className}>
            {cat.icon} {cat.label}
          </span>
          {isUrgent && (
            <span className="badge badge-urgent">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
              URGENT
            </span>
          )}
          <span className="badge badge-date" style={{ marginLeft: "auto" }}>
            📅 {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h2
          className="line-clamp-2"
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.45,
            marginBottom: "8px",
          }}
        >
          {notice.title}
        </h2>

        {/* Body */}
        <p
          className="line-clamp-3"
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            marginBottom: "16px",
          }}
        >
          {notice.body}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border-subtle)", marginBottom: "14px" }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href={`/edit/${notice.id}`} className="btn-edit" style={{ flex: 1, justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </Link>
          <button
            onClick={() => onDelete(notice.id)}
            className="btn-delete"
            style={{ flex: 1, justifyContent: "center" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
