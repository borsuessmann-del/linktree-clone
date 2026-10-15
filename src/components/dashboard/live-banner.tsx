"use client";

import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function LiveBanner({ username }: { username: string }) {
  const path = `/u/${username}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      toast.success("Link kopiert");
    } catch {
      toast.error("Kopieren nicht möglich – bitte den Link manuell markieren.");
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card bg-linear-to-b from-card to-muted/40 p-4 shadow-sm ring-1 ring-foreground/10 sm:flex-row sm:items-center">
      <p className="flex min-w-0 items-center gap-2.5 text-sm">
        <span aria-hidden className="relative flex size-2.5 shrink-0">
          <span className="absolute inline-flex size-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex size-2.5 rounded-full bg-success" />
        </span>
        <span className="text-muted-foreground">Deine Seite ist live:</span>
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate rounded-sm font-medium underline-offset-4 transition-colors duration-150 ease-out hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {path}
        </a>
      </p>
      <Button variant="outline" size="sm" onClick={copyLink} className="sm:ml-auto">
        <CopyIcon data-icon="inline-start" />
        Link kopieren
      </Button>
    </div>
  );
}
