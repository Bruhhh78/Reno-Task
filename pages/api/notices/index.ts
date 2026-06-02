import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Category, Priority } from ".prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          // Urgent first, then by publishDate descending
          { priority: "desc" },
          { publishDate: "desc" },
        ],
      });
      return res.status(200).json(notices);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch notices" });
    }
  }

  if (req.method === "POST") {
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
      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category: category as Category,
          priority: priority as Priority,
          publishDate: new Date(publishDate),
          image: image?.trim() || null,
        },
      });
      return res.status(201).json(notice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create notice" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
