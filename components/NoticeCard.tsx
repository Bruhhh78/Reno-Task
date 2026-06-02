import { Notice } from ".prisma/client";
import Link from "next/link";

interface NoticeCardProps {
  notice: Notice;
  onDelete: (id: number) => void;
}

const getBadgeClass = (category: string) => {
  switch (category) {
    case "Exam": return "badge-exam";
    case "Event": return "badge-event";
    default: return "badge-general";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Exam": return "📝";
    case "Event": return "🎉";
    default: return "📢";
  }
};

export default function NoticeCard({ notice, onDelete }: NoticeCardProps) {
  const isUrgent = notice.priority === "Urgent";

  return (
    <div className={`card ${isUrgent ? "urgent" : ""}`}>
      {notice.image && (
        <img src={notice.image} alt={notice.title} className="card-image" />
      )}
      
      <div className="badges">
        <span className={`badge ${getBadgeClass(notice.category)}`}>
          {getCategoryIcon(notice.category)} {notice.category}
        </span>
        {isUrgent && (
          <span className="badge badge-urgent">
            🔴 Urgent
          </span>
        )}
        <span style={{ marginLeft: "auto", fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500, alignSelf: "center" }}>
          {new Date(notice.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>
      
      <h3 className="card-title">{notice.title}</h3>
      <p className="card-body">{notice.body}</p>

      <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
        <Link href={`/edit/${notice.id}`} className="btn btn-secondary" style={{ flex: 1 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </Link>
        <button onClick={() => onDelete(notice.id)} className="btn btn-danger" style={{ flex: 1 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          Delete
        </button>
      </div>
    </div>
  );
}
