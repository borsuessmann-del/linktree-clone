import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { UserMenu } from "@/components/dashboard/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { requireProfile } from "@/lib/auth/dal";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg pr-1 transition-opacity duration-150 ease-out hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-lg bg-linear-to-b from-brand to-brand/85 text-xs font-bold text-brand-foreground shadow-sm"
          >
            L
          </span>
          <span className="text-sm font-semibold tracking-tight">Linktree-Clone</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Suspense fallback={<HeaderActionsSkeleton />}>
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

async function HeaderActions() {
  const profile = await requireProfile();

  return (
    <>
      <Button asChild variant="outline">
        <a
          href={`/u/${profile.username}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Meine Seite ansehen (öffnet in neuem Tab)"
        >
          <span className="hidden sm:inline">Meine Seite ansehen</span>
          <ArrowUpRightIcon data-icon="inline-end" />
        </a>
      </Button>
      <ThemeToggle />
      <UserMenu email={profile.email} username={profile.username} />
    </>
  );
}

function HeaderActionsSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-8 rounded-lg sm:w-44" />
      <ThemeToggle />
      <Skeleton className="size-8 rounded-lg" />
    </>
  );
}
