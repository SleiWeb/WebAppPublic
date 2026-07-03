import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { getHint } from "@/lib/exercise/service";

const Body = z.object({
  instanceId: z.string().uuid(),
  level: z.number().int().min(1).max(10),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Ikke logget ind" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Ugyldigt kald" }, { status: 400 });
  const hint = await getHint(parsed.data.instanceId, parsed.data.level);
  if (!hint)
    return NextResponse.json({ error: "Intet hint på det niveau" }, { status: 404 });
  return NextResponse.json(hint);
}
