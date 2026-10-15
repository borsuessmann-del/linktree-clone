"use client";

import { PencilIcon, SmartphoneIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type View = "edit" | "preview";

/**
 * Zweispaltiger Arbeitsbereich. Ab lg sind beide Spalten sichtbar,
 * darunter schaltet der Umschalter zwischen Editor und Vorschau.
 * Beide Spalten bleiben gemountet, damit Eingaben beim Umschalten erhalten bleiben.
 */
export function Workspace({
  editor,
  preview,
}: {
  editor: ReactNode;
  preview: ReactNode;
}) {
  const [view, setView] = useState<View>("edit");

  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        type="single"
        variant="outline"
        spacing={0}
        value={view}
        onValueChange={(value) => {
          if (value) setView(value as View);
        }}
        aria-label="Ansicht wählen"
        className="w-full lg:hidden"
      >
        <ToggleGroupItem value="edit" className="flex-1">
          <PencilIcon data-icon="inline-start" />
          Bearbeiten
        </ToggleGroupItem>
        <ToggleGroupItem value="preview" className="flex-1">
          <SmartphoneIcon data-icon="inline-start" />
          Vorschau
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_395px] lg:gap-8">
        <div className={cn(view === "preview" && "max-lg:hidden")}>{editor}</div>
        <div className={cn(view === "edit" && "max-lg:hidden")}>{preview}</div>
      </div>
    </div>
  );
}
