import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Category, Priority } from ".prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const noticeId = parseInt(id as string, 10);

  if (isNaN(noticeId)) {
    return res.status(400).json({ error: "Invalid notice ID" });
  }

  if (req.method === "PUT") {
    const { title, body, category, priority, publishDate, image } = req.body;

    // Server-side validation
    const validationErrors: string[] = [];
    if (!title || typeof title !== "string" || title.trim() === "") {
      validationErrors.push("Title is required");
    }
    if (!body || typeof body !== "string" || body.trim() === "") {
      validationErrors.push("Body is required");
    }
    if (!category || !Object.values(Category).includes(category)) {
      validationErrors.push("Category must be one of: Exam, Event, General");
    }
    if (!priority || !Object.values(Priority).includes(priority)) {
      validationErrors.push("Priority must be Normal or Urgent");
    }
    if (!publishDate || isNaN(Date.parse(publishDate))) {
      validationErrors.push("A valid publish date is required");
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors.join(". ") });
    }

    try {
      const notice = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          title: title.trim(),
          body: body.trim(),
          category: category as Category,
          priority: priority as Priority,
          publishDate: new Date(publishDate),
          image: image?.trim() || null,
        },
      });
      return res.status(200).json(notice);
    } catch (error: any) {
      if (error?.code === "P2025") {
        return res.status(404).json({ error: "Notice not found" });
      }
      console.error(error);
      return res.status(500).json({ error: "Failed to update notice" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.notice.delete({ where: { id: noticeId } });
      return res.status(200).json({ message: "Notice deleted successfully" });
    } catch (error: any) {
      if (error?.code === "P2025") {
        return res.status(404).json({ error: "Notice not found" });
      }
      console.error(error);
      return res.status(500).json({ error: "Failed to delete notice" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
