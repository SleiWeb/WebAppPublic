import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { startExercise } from "@/lib/exercise/service";

const Body = z.object({ templateSlug: z.string() });

export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Ikke logget ind" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Ugyldigt kald" }, { status: 400 });
  try {
    const exercise = await startExercise(session.userId, parsed.data.templateSlug);
    return NextResponse.json(exercise);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fejl" },
      { status: 400 }
    );
  }
}
