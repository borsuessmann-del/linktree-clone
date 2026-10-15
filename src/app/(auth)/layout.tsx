import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex flex-1 flex-col overflow-hidden">
      {/* Dezenter Brand-Glow von oben – keine flache Fläche */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(60%_70%_at_50%_0%,color-mix(in_oklch,var(--brand)_20%,transparent),transparent)]"
      />

      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="rounded-lg px-1 text-sm font-semibold tracking-tight transition-colors duration-150 ease-out hover:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Linktree-Clone
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pt-8 pb-16 sm:items-center sm:pt-0">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
