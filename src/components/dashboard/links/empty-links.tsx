import { LinkIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyLinks({ onAdd }: { onAdd: () => void }) {
  return (
    <Empty className="rounded-2xl border border-dashed bg-linear-to-b from-muted/40 to-transparent">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LinkIcon />
        </EmptyMedia>
        <EmptyTitle>Füge deinen ersten Link hinzu</EmptyTitle>
        <EmptyDescription>
          Portfolio, Shop, Social Media – alles, was Besucher von dir sehen sollen.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="lg" onClick={onAdd}>
          <PlusIcon data-icon="inline-start" />
          Link hinzufügen
        </Button>
      </EmptyContent>
    </Empty>
  );
}
