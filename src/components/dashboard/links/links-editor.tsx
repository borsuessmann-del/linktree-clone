"use client";

import { PlusIcon } from "lucide-react";
import { MotionConfig, Reorder } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  createLink,
  deleteLink,
  reorderLinks,
  restoreLink,
  toggleLinkVisibility,
  updateLink,
} from "@/app/dashboard/link-actions";
import { useEditor } from "@/components/dashboard/editor-context";
import { EmptyLinks } from "@/components/dashboard/links/empty-links";
import {
  LinkEditorCard,
  type MoveDirection,
} from "@/components/dashboard/links/link-editor-card";
import { LinkForm } from "@/components/dashboard/links/link-form";
import { Button } from "@/components/ui/button";
import { MAX_LINKS, type LinkItem } from "@/lib/validation/link";

const UNDO_DURATION_MS = 5000;

function byPosition(a: LinkItem, b: LinkItem) {
  return a.position - b.position;
}

/** Positionen wie nach `reorder_links`: Index ab 0. */
function withIndexPositions(links: LinkItem[]) {
  return links.map((link, index) => ({ ...link, position: index }));
}

function sameOrder(a: LinkItem[], b: LinkItem[]) {
  return a.length === b.length && a.every((link, index) => link.id === b[index].id);
}

/**
 * Link-Liste im Dashboard. Änderungen erscheinen sofort (optimistisch)
 * und werden bei einem Server-Fehler zurückgedreht.
 */
export function LinksEditor() {
  // Liste liegt im Editor-Context, damit die Live-Preview Reihenfolge/Sichtbarkeit sofort zeigt.
  const { links, setLinks } = useEditor();
  const [isAdding, setIsAdding] = useState(false);
  const isAtLimit = links.length >= MAX_LINKS;

  // Aktuelle Liste für onDragEnd (der Handler kann sonst veralteten State sehen).
  const linksRef = useRef(links);
  const orderBeforeDrag = useRef<LinkItem[]>(links);
  // Speichervorgänge nacheinander abarbeiten, damit die letzte Reihenfolge gewinnt.
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const focusAfterMove = useRef<{ id: string; direction: MoveDirection } | null>(null);

  useEffect(() => {
    linksRef.current = links;

    // Nach ↑/↓ den Fokus auf dem Pfeil halten – ist er jetzt deaktiviert, auf den anderen.
    const target = focusAfterMove.current;
    if (!target) return;
    focusAfterMove.current = null;
    const item = document.querySelector(`[data-link-id="${target.id}"]`);
    const preferred = item?.querySelector<HTMLButtonElement>(`[data-move="${target.direction}"]`);
    const other = item?.querySelector<HTMLButtonElement>(
      `[data-move="${target.direction === "up" ? "down" : "up"}"]`,
    );
    (preferred && !preferred.disabled ? preferred : other)?.focus();
  }, [links]);

  function replaceLink(link: LinkItem) {
    setLinks((current) => current.map((item) => (item.id === link.id ? link : item)));
  }
  function removeLink(id: string) {
    setLinks((current) => current.filter((item) => item.id !== id));
  }
  function insertLink(link: LinkItem) {
    setLinks((current) =>
      [...current.filter((item) => item.id !== link.id), link].sort(byPosition),
    );
  }

  function saveOrder(next: LinkItem[], previous: LinkItem[]) {
    if (sameOrder(next, previous)) return;
    setLinks(withIndexPositions(next));
    const ids = next.map((link) => link.id);
    saveQueue.current = saveQueue.current.then(async () => {
      const result = await reorderLinks(ids);
      if (!result.ok) {
        setLinks(previous);
        toast.error(result.error);
      }
    });
  }

  function handleMove(index: number, direction: MoveDirection) {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= links.length) return;
    const next = [...links];
    [next[index], next[target]] = [next[target], next[index]];
    focusAfterMove.current = { id: links[index].id, direction };
    saveOrder(next, links);
  }

  async function handleToggle(link: LinkItem, isVisible: boolean) {
    replaceLink({ ...link, is_visible: isVisible });
    const result = await toggleLinkVisibility(link.id, isVisible);
    if (!result.ok) {
      replaceLink(link);
      toast.error(result.error);
    }
  }

  async function handleRestore(link: LinkItem) {
    insertLink(link);
    const result = await restoreLink(link);
    if (result.ok) {
      toast.success("Link wiederhergestellt");
    } else {
      removeLink(link.id);
      toast.error(result.error);
    }
  }

  async function handleDelete(link: LinkItem) {
    removeLink(link.id);
    const result = await deleteLink(link.id);
    if (!result.ok) {
      insertLink(link);
      toast.error(result.error);
      return;
    }
    toast("Link gelöscht", {
      description: link.title,
      duration: UNDO_DURATION_MS,
      action: { label: "Rückgängig", onClick: () => handleRestore(link) },
    });
  }

  if (links.length === 0 && !isAdding) {
    return <EmptyLinks onAdd={() => setIsAdding(true)} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {links.length} von {MAX_LINKS} Links
        </p>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} disabled={isAtLimit}>
            <PlusIcon data-icon="inline-start" />
            Link hinzufügen
          </Button>
        )}
      </div>

      {isAtLimit && (
        <p className="text-sm text-muted-foreground">
          Du hast das Maximum von {MAX_LINKS} Links erreicht. Lösche einen Link, um einen neuen
          anzulegen.
        </p>
      )}

      {isAdding && (
        <div className="rounded-2xl bg-card p-4 shadow-md ring-1 ring-ring/40">
          <LinkForm
            submitLabel="Hinzufügen"
            onCancel={() => setIsAdding(false)}
            onSubmit={async (values) => {
              const result = await createLink(values);
              if (result.ok) {
                setLinks((current) => [result.data, ...current]);
                setIsAdding(false);
                toast.success("Link hinzugefügt");
              }
              return result;
            }}
          />
        </div>
      )}

      {links.length > 0 && (
        // Bei „Bewegung reduzieren“ entfallen Layout-/Transform-Animationen.
        <MotionConfig reducedMotion="user">
          <Reorder.Group
            as="ul"
            axis="y"
            values={links}
            onReorder={setLinks}
            className="flex flex-col gap-3"
            aria-label="Deine Links"
          >
            {links.map((link, index) => (
              <LinkEditorCard
                key={link.id}
                link={link}
                isFirst={index === 0}
                isLast={index === links.length - 1}
                onMove={(direction) => handleMove(index, direction)}
                onDragStart={() => {
                  orderBeforeDrag.current = linksRef.current;
                }}
                onDragEnd={() => saveOrder(linksRef.current, orderBeforeDrag.current)}
                onToggleVisibility={(isVisible) => handleToggle(link, isVisible)}
                onDelete={() => handleDelete(link)}
                onSave={async (values) => {
                  const result = await updateLink(link.id, values);
                  if (result.ok) replaceLink(result.data);
                  return result;
                }}
              />
            ))}
          </Reorder.Group>
        </MotionConfig>
      )}
    </div>
  );
}
