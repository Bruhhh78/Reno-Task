import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Notice } from ".prisma/client";
import { prisma } from "@/lib/prisma";
import NoticeForm, { NoticeFormData } from "@/components/NoticeForm";

interface EditNoticePageProps {
  notice: Notice & { publishDate: string; createdAt: string; updatedAt: string };
}

export default function EditNoticePage({ notice }: EditNoticePageProps) {
  const defaultValues: NoticeFormData = {
    title: notice.title,
    body: notice.body,
    category: notice.category as NoticeFormData["category"],
    priority: notice.priority as NoticeFormData["priority"],
    publishDate: notice.publishDate.split("T")[0], // format as YYYY-MM-DD
    image: notice.image ?? "",
  };

  return (
    <>
      <Head>
        <title>Edit Notice – Notice Board</title>
        <meta name="description" content="Edit an existing notice on the Reno Platforms notice board." />
      </Head>

      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
            >
              ←
            </Link>
            <div>
              <h1 className="text-base font-bold text-white leading-none">
                Edit Notice
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Notice Board · Reno Platforms</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <div className="rounded-2xl bg-gray-900/60 border border-gray-700/50 p-6 shadow-xl backdrop-blur-sm">
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
