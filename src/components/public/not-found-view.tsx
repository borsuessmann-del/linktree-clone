import { CompassIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function NotFoundView() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background bg-[radial-gradient(70%_50%_at_50%_0%,color-mix(in_oklch,var(--brand)_14%,transparent),transparent)] px-4 py-16">
      <Empty className="max-w-sm">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CompassIcon />
          </EmptyMedia>
          <EmptyTitle className="text-xl">Diese Seite gibt es nicht</EmptyTitle>
          <EmptyDescription>
            Vielleicht ist der Name falsch geschrieben – oder er ist noch frei.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild size="lg">
            <Link href="/signup">Eigene Seite erstellen</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
