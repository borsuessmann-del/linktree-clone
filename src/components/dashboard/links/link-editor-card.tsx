"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  GripVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { Reorder, useDragControls, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { LinkActionResult } from "@/app/dashboard/link-actions";
import { LinkForm } from "@/components/dashboard/links/link-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { LinkInput, LinkItem } from "@/lib/validation/link";

export type MoveDirection = "up" | "down";

function displayUrl(url: string) {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export function LinkEditorCard({
  link,
  isFirst,
  isLast,
  onSave,
  onToggleVisibility,
  onDelete,
  onMove,
  onDragStart,
  onDragEnd,
}: {
  link: LinkItem;
  isFirst: boolean;
  isLast: boolean;
  onSave: (values: LinkInput) => Promise<LinkActionResult>;
  onToggleVisibility: (isVisible: boolean) => void;
  onDelete: () => void;
  onMove: (direction: MoveDirection) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const dragControls = useDragControls();
  const reduceMotion = useReducedMotion();

  // Nach Speichern/Abbrechen den Fokus zurück auf den Stift setzen.
  useEffect(() => {
    if (!isEditing && restoreFocus.current) {
      restoreFocus.current = false;
      editButtonRef.current?.focus();
    }
  }, [isEditing]);

  function closeEditor() {
    restoreFocus.current = true;
    setIsEditing(false);
  }

  return (
    <Reorder.Item
      as="li"
      value={link}
      dragListener={false}
      dragControls={dragControls}
      onDragStart={() => {
        setIsDragging(true);
        onDragStart();
      }}
      onDragEnd={() => {
        setIsDragging(false);
        onDragEnd();
      }}
      whileDrag={reduceMotion ? undefined : { scale: 1.02 }}
      className={cn(
        "relative rounded-2xl bg-card ring-1 transition-shadow duration-150 ease-out",
        isEditing
          ? "p-4 shadow-md ring-ring/40"
          : "flex items-center gap-1.5 bg-linear-to-b from-card to-muted/30 py-2 pr-2 pl-1.5 shadow-sm ring-foreground/10 hover:shadow-md",
        isDragging && "z-10 shadow-lg ring-ring/40",
      )}
      data-link-id={link.id}
    >
      {isEditing ? (
        <LinkForm
          initial={{ title: link.title, url: link.url }}
          submitLabel="Speichern"
          onCancel={closeEditor}
          onSubmit={async (values) => {
            const result = await onSave(values);
            if (result.ok) closeEditor();
            return result;
          }}
        />
      ) : (
        <>
          {/* Griff nur für Maus/Touch – Tastatur nutzt die Pfeil-Buttons daneben. */}
          <div
            aria-hidden
            onPointerDown={(event) => dragControls.start(event)}
            className={cn(
              "flex h-10 w-6 shrink-0 touch-none items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground",
              isDragging ? "cursor-grabbing" : "cursor-grab",
            )}
          >
            <GripVerticalIcon className="size-4" />
          </div>
          <div className="flex shrink-0 flex-col">
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={isFirst}
              onClick={() => onMove("up")}
              aria-label={`„${link.title}“ nach oben`}
              data-move="up"
            >
              <ChevronUpIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={isLast}
              onClick={() => onMove("down")}
              aria-label={`„${link.title}“ nach unten`}
              data-move="down"
            >
              <ChevronDownIcon />
            </Button>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-0.5 pl-1">
            <div className="flex min-w-0 items-center gap-2">
              <p
                className={cn(
                  "truncate text-sm font-medium transition-opacity duration-150 ease-out",
                  !link.is_visible && "opacity-50",
                )}
              >
                {link.title}
              </p>
              {!link.is_visible && <Badge variant="outline">Ausgeblendet</Badge>}
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-fit max-w-full truncate rounded-sm text-xs text-muted-foreground underline-offset-4 transition-opacity duration-150 ease-out hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                !link.is_visible && "opacity-50",
              )}
            >
              {displayUrl(link.url)}
            </a>
          </div>

          <Switch
            checked={link.is_visible}
            onCheckedChange={onToggleVisibility}
            aria-label={`„${link.title}“ auf deiner Seite anzeigen`}
          />
          <div className="flex items-center">
            <Button
              ref={editButtonRef}
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              aria-label={`„${link.title}“ bearbeiten`}
            >
              <PencilIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              aria-label={`„${link.title}“ löschen`}
            >
              <Trash2Icon />
            </Button>
          </div>
        </>
      )}
    </Reorder.Item>
  );
}
