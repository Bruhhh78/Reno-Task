import { Notice, Priority, Category } from ".prisma/client";
import Link from "next/link";

interface NoticeCardProps {
  notice: Notice;
  onDelete: (id: number) => void;
}

const categoryColors: Record<Category, string> = {
  Exam: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  Event: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  General: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
};

export default function NoticeCard({ notice, onDelete }: NoticeCardProps) {
  const isUrgent = notice.priority === Priority.Urgent;
  const formattedDate = new Date(notice.publishDate).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
        ${
          isUrgent
            ? "bg-gradient-to-br from-red-950/60 to-gray-900 border border-red-500/40 shadow-red-900/30 shadow-lg"
            : "bg-gradient-to-br from-gray-800/80 to-gray-900 border border-gray-700/50 shadow-gray-900/20 shadow-md"
        }`}
    >
      {/* Urgent badge */}
      {isUrgent && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-0.5 text-xs font-bold text-white shadow-lg shadow-red-500/30 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-white inline-block" />
          URGENT
        </span>
      )}

      {/* Image */}
      {notice.image && (
        <div className="overflow-hidden rounded-xl">
          <img
            src={notice.image}
            alt={notice.title}
            className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-start gap-2 pr-16">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[notice.category]}`}
        >
          {notice.category}
        </span>
        <span className="rounded-full bg-gray-700/60 px-2.5 py-0.5 text-xs text-gray-400 border border-gray-600/30">
          📅 {formattedDate}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-white leading-snug">
        {notice.title}
      </h2>

      {/* Body */}
      <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
        {notice.body}
      </p>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-700/40">
        <Link
          href={`/edit/${notice.id}`}
          className="flex-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 px-3 py-2 text-center text-sm font-medium text-indigo-300 transition-all duration-200 hover:text-indigo-100"
        >
          ✏️ Edit
        </Link>
        <button
          onClick={() => onDelete(notice.id)}
          className="flex-1 rounded-xl bg-red-600/10 hover:bg-red-600/30 border border-red-500/20 px-3 py-2 text-sm font-medium text-red-400 transition-all duration-200 hover:text-red-300"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
