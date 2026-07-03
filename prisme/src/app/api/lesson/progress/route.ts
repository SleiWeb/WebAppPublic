import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { updateLessonProgress } from "@/lib/exercise/service";

const Body = z.object({
  lessonSlug: z.string(),
  percent: z.number().min(0).max(100),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Ikke logget ind" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Ugyldigt kald" }, { status: 400 });
  await updateLessonProgress({ userId: session.userId, ...parsed.data });
  return NextResponse.json({ ok: true });
}
