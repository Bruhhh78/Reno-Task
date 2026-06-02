import { useForm } from "react-hook-form";
import { Notice } from ".prisma/client";
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
    formState: { errors },
  } = useForm<NoticeFormData>({ defaultValues });

  const onSubmit = async (data: NoticeFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const url = isEditing ? `/api/notices/${noticeId}` : "/api/notices";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-300">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Notice title"
          className="rounded-xl bg-gray-800 border border-gray-600/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
        {errors.title && (
          <p className="text-xs text-red-400">{errors.title.message}</p>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-300">
          Body <span className="text-red-400">*</span>
        </label>
        <textarea
          {...register("body", { required: "Body is required" })}
          placeholder="Notice details..."
          rows={5}
          className="rounded-xl bg-gray-800 border border-gray-600/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
        />
        {errors.body && (
          <p className="text-xs text-red-400">{errors.body.message}</p>
        )}
      </div>

      {/* Category + Priority row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-300">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="rounded-xl bg-gray-800 border border-gray-600/50 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select category</option>
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
            <option value="General">General</option>
          </select>
          {errors.category && (
            <p className="text-xs text-red-400">{errors.category.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-300">
            Priority <span className="text-red-400">*</span>
          </label>
          <select
            {...register("priority", { required: "Priority is required" })}
            className="rounded-xl bg-gray-800 border border-gray-600/50 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select priority</option>
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
          {errors.priority && (
            <p className="text-xs text-red-400">{errors.priority.message}</p>
          )}
        </div>
      </div>

      {/* Publish Date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-300">
          Publish Date <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          {...register("publishDate", { required: "Publish date is required" })}
          className="rounded-xl bg-gray-800 border border-gray-600/50 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
        {errors.publishDate && (
          <p className="text-xs text-red-400">{errors.publishDate.message}</p>
        )}
      </div>

      {/* Image URL (optional) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-300">
          Image URL{" "}
          <span className="text-gray-500 font-normal text-xs">(optional)</span>
        </label>
        <input
          {...register("image")}
          placeholder="https://example.com/image.jpg"
          className="rounded-xl bg-gray-800 border border-gray-600/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex-1 rounded-xl border border-gray-600 bg-gray-800 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 transition-all"
        >
          {isSubmitting ? "Saving…" : isEditing ? "Update Notice" : "Create Notice"}
        </button>
      </div>
    </form>
  );
}
