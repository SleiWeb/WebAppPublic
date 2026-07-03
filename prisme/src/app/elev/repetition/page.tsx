import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { getSession } from "@/lib/auth/session";
import { getDueReviews } from "@/lib/data/student";
import { ReviewSession } from "@/components/review/ReviewSession";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

/**
 * "Repetition i dag" (doc 05 §5.10): en kort session med det, eleven er
 * ved at glemme. Kan også starte en målrettet træningsrunde fra en
 * aflevering (?skabelon=...&aflevering=...).
 */
export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ skabelon?: string; aflevering?: string; antal?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const params = await searchParams;

  if (params.skabelon) {
    return (
      <AppShell session={session}>
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold">Træningsrunde</h1>
          <ReviewSession
            items={[{ kcName: "Aflevering", templateSlug: params.skabelon }]}
            assignmentId={params.aflevering}
            perItem={Number(params.antal ?? 6)}
          />
        </div>
      </AppShell>
    );
  }

  const reviews = await getDueReviews(session.userId);

  return (
    <AppShell session={session}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Repetition i dag</h1>
          <p className="mt-1 text-slate-600">
            Kort og godt: vi genopfrisker det, du er ved at glemme — så det
            sætter sig fast for alvor.
          </p>
        </div>
        {reviews.length === 0 ? (
          <EmptyState
            title="Ingen repetition i dag 🌿"
            body="Alt sidder frisk i hukommelsen. Kom tilbage i morgen — eller lær noget nyt på fagkortet."
          />
        ) : (
          <ReviewSession
            items={reviews.map((r) => ({
              kcName: r.kcName,
              templateSlug: r.templateSlug,
            }))}
            perItem={1}
          />
        )}
      </div>
    </AppShell>
  );
}
