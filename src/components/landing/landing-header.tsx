import Link from "next/link";
import { Suspense } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/dal";

/** Schwebender, abgerundeter Header (design-analysis §7 Landing). */
export function LandingHeader() {
  return (
    <header className="sticky top-3 z-40 px-3 sm:top-4 sm:px-6">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-2 rounded-2xl bg-card/80 px-3 shadow-md ring-1 ring-foreground/10 backdrop-blur-md sm:px-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg pr-1 transition-opacity duration-150 ease-out hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-lg bg-linear-to-b from-brand to-brand/85 text-xs font-bold text-brand-foreground shadow-sm"
          >
            L
          </span>
          {/* Unter sm nur das Logo-Zeichen, damit der Header einzeilig bleibt */}
          <span className="sr-only text-sm font-semibold tracking-tight whitespace-nowrap sm:not-sr-only">
            Linktree-Clone
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          {/* Login-Status gibt es erst pro Request → hinter Suspense, Rest bleibt statisch. */}
          <Suspense fallback={<GuestActions />}>
            <AuthActions />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

async function AuthActions() {
  const user = await getCurrentUser();
  if (!user) return <GuestActions />;
  return (
    <Button asChild>
      <Link href="/dashboard">Zum Dashboard</Link>
    </Button>
  );
}

function GuestActions() {
  return (
    <>
      <Button asChild variant="ghost">
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/signup">Registrieren</Link>
      </Button>
    </>
  );
}
