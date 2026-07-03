import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { submitAnswer } from "@/lib/exercise/service";

const Submitted = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("numeric"), raw: z.string().max(200) }),
  z.object({ kind: z.literal("expression"), raw: z.string().max(500) }),
  z.object({ kind: z.literal("mcq"), optionId: z.string().max(100) }),
  z.object({ kind: z.literal("multi"), optionIds: z.array(z.string().max(100)).max(20) }),
  z.object({ kind: z.literal("point"), x: z.number(), y: z.number() }),
]);

const Body = z.object({
  instanceId: z.string().uuid(),
  answer: Submitted,
  hintsUsed: z.number().int().min(0).max(10).default(0),
  durationMs: z.number().int().min(0).optional(),
  assignmentId: z.string().uuid().optional(),
  context: z.enum(["lesson", "checkpoint", "review", "assignment"]).default("lesson"),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Ikke logget ind" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Ugyldigt kald" }, { status: 400 });
  try {
    const result = await submitAnswer({ userId: session.userId, ...parsed.data });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fejl" },
      { status: 400 }
    );
  }
}
