import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PublicProfile } from "@/components/public/public-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicProfile } from "@/lib/data/public-profile";
import { normalizeUsername } from "@/lib/validation/auth";

export async function generateMetadata({
  params,
}: PageProps<"/u/[username]">): Promise<Metadata> {
  const { username } = await params;
  const data = await getPublicProfile(normalizeUsername(username));
  if (!data) {
    return { title: "Seite nicht gefunden · Linktree-Clone" };
  }
  const name = data.display_name || data.username;
  return {
    title: `${name} (@${data.username})`,
    description: data.bio ?? `Alle Links von ${name} auf einer Seite.`,
  };
}

// Usernames sind erst zur Laufzeit bekannt → Inhalt hinter Suspense (cacheComponents).
export default function PublicProfilePage({ params }: PageProps<"/u/[username]">) {
  return (
    <Suspense fallback={<PublicProfileSkeleton />}>
      <PublicProfileContent params={params} />
    </Suspense>
  );
}

async function PublicProfileContent({
  params,
}: Pick<PageProps<"/u/[username]">, "params">) {
  const { username } = await params;
  const data = await getPublicProfile(normalizeUsername(username));
  if (!data) notFound();

  return (
    <PublicProfile
      username={data.username}
      displayName={data.display_name}
      bio={data.bio}
      avatarUrl={data.avatar_url}
      accentColor={data.accent_color}
      links={data.links}
    />
  );
}

function PublicProfileSkeleton() {
  return (
    <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center px-4 pt-14 sm:pt-20">
      <Skeleton className="size-24 rounded-full" />
      <Skeleton className="mt-6 h-6 w-40" />
      <Skeleton className="mt-3 h-4 w-56" />
      <div className="mt-8 flex w-full flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-14 rounded-2xl" />
        ))}
      </div>
    </main>
  );
}
