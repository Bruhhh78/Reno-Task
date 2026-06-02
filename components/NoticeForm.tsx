import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

export default function NoticeForm({ defaultValues, noticeId }: any) {
  const router = useRouter();
  const isEditing = !!noticeId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: defaultValues?.title || "",
    body: defaultValues?.body || "",
    category: defaultValues?.category || "General",
    priority: defaultValues?.priority || "Normal",
    publishDate: defaultValues?.publishDate || "",
    image: defaultValues?.image || "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(
        isEditing ? `/api/notices/${noticeId}` : "/api/notices",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        router.push("/");
      } else {
        alert("Failed to save notice. Please check your inputs.");
        setIsSubmitting(false);
      }
    } catch (err) {
      alert("Network error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <div className="form-group">
        <label className="form-label">Notice Title <span style={{ color: "#ef4444" }}>*</span></label>
        <input className="form-input" type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Final Exams Schedule" />
      </div>

      <div className="form-group">
        <label className="form-label">Detailed Description <span style={{ color: "#ef4444" }}>*</span></label>
        <textarea className="form-input" name="body" value={formData.body} onChange={handleChange} required rows={5} placeholder="Provide the details of the notice..."></textarea>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category <span style={{ color: "#ef4444" }}>*</span></label>
          <select className="form-input" name="category" value={formData.category} onChange={handleChange} required>
            <option value="Exam">📝 Exam</option>
            <option value="Event">🎉 Event</option>
            <option value="General">📢 General</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Priority <span style={{ color: "#ef4444" }}>*</span></label>
          <select className="form-input" name="priority" value={formData.priority} onChange={handleChange} required>
            <option value="Normal">🟢 Normal</option>
            <option value="Urgent">🔴 Urgent</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Publish Date <span style={{ color: "#ef4444" }}>*</span></label>
          <input className="form-input" type="date" name="publishDate" value={formData.publishDate} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Image URL (Optional)</label>
          <input className="form-input" type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
        <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (isEditing ? "Save Changes" : "Post Notice")}
        </button>
        <Link href="/" className="btn btn-secondary" style={{ flex: 1 }}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
