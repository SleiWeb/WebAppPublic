import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { getSession } from "@/lib/auth/session";
import { getLessonWithBlocks } from "@/lib/data/content";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";

export const dynamic = "force-dynamic";

/** Lektionssiden: blokkene (Forklar → Udforsk → Prøv → Træn → Tjek) afspilles. */
export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ aflevering?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { slug } = await params;
  const { aflevering } = await searchParams;
  const lesson = await getLessonWithBlocks(slug);
  if (!lesson) notFound();

  return (
    <AppShell session={session}>
      <LessonPlayer
        lessonSlug={lesson.slug}
        title={lesson.title}
        blocks={lesson.blocks}
        assignmentId={aflevering}
        backHref="/fag/math"
      />
    </AppShell>
  );
}
