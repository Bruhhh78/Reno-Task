import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

export interface NoticeFormData {
  title: string;
  body: string;
  category: "Exam" | "Event" | "General";
  priority: "Normal" | "Urgent";
  publishDate: string;
  image?: string;
}

interface NoticeFormProps {
  defaultValues?: Partial<NoticeFormData>;
  noticeId?: number;
}

export default function NoticeForm({ defaultValues, noticeId }: NoticeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!noticeId;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NoticeFormData>({ defaultValues });

  const selectedPriority = watch("priority");

  const onSubmit = async (data: NoticeFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(
        isEditing ? `/api/notices/${noticeId}` : "/api/notices",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong");
        return;
      }
      router.push("/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Error banner */}
      {error && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "12px",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.25)",
          color: "#ef4444",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Title */}
      <div className="form-group">
        <label className="form-label">
          Title <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="e.g. Final Exam Schedule Announced"
          className="form-input"
        />
        {errors.title && <p className="form-error">⚠ {errors.title.message}</p>}
      </div>

      {/* Body */}
      <div className="form-group">
        <label className="form-label">
          Description <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <textarea
          {...register("body", { required: "Body is required" })}
          placeholder="Write the full notice details here..."
          className="form-textarea"
        />
        {errors.body && <p className="form-error">⚠ {errors.body.message}</p>}
      </div>

      {/* Category + Priority */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">
            Category <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <select
              {...register("category", { required: "Category is required" })}
              className="form-select"
              style={{ paddingRight: "40px" }}
            >
              <option value="">Select…</option>
              <option value="Exam">📝 Exam</option>
              <option value="Event">🎉 Event</option>
              <option value="General">📢 General</option>
            </select>
            <svg
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          {errors.category && <p className="form-error">⚠ {errors.category.message}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Priority <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
            {["Normal", "Urgent"].map((p) => {
              const isSelected = selectedPriority === p;
              const isUrgent = p === "Urgent";
              return (
                <label
                  key={p}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "10px",
                    borderRadius: "12px",
                    border: `1.5px solid ${isSelected ? (isUrgent ? "#ef4444" : "var(--accent)") : "var(--border-default)"}`,
                    background: isSelected ? (isUrgent ? "rgba(239,68,68,0.1)" : "var(--accent-subtle)") : "var(--bg-elevated)",
                    color: isSelected ? (isUrgent ? "#ef4444" : "var(--accent)") : "var(--text-secondary)",
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    value={p}
                    {...register("priority", { required: "Priority is required" })}
                    style={{ display: "none" }}
                  />
                  {isUrgent ? "🔴" : "🟢"} {p}
                </label>
              );
            })}
          </div>
          {errors.priority && <p className="form-error">⚠ {errors.priority.message}</p>}
        </div>
      </div>

      {/* Publish Date */}
      <div className="form-group">
        <label className="form-label">
          Publish Date <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          type="date"
          {...register("publishDate", { required: "Publish date is required" })}
          className="form-input"
        />
        {errors.publishDate && <p className="form-error">⚠ {errors.publishDate.message}</p>}
      </div>

      {/* Image URL */}
      <div className="form-group">
        <label className="form-label">
          Image URL{" "}
          <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 11 }}>
            — optional
          </span>
        </label>
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </span>
          <input
            {...register("image")}
            placeholder="https://example.com/image.jpg"
            className="form-input"
            style={{ paddingLeft: "38px" }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="btn-secondary"
          style={{ flex: 1, justifyContent: "center" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          style={{ flex: 2, justifyContent: "center" }}
        >
          {isSubmitting ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isEditing
                  ? <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>
                  : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>
                }
              </svg>
              {isEditing ? "Update Notice" : "Post Notice"}
            </>
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
