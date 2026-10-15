"use client";

import { motion, MotionConfig } from "motion/react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type PublicLinkItem = { id: string; title: string; url: string };

const CARD_CLASSES =
  "flex min-h-14 w-full items-center justify-center rounded-2xl bg-card bg-linear-to-b from-card to-card/90 px-5 py-3 text-center text-base font-medium break-words shadow-md ring-1 ring-foreground/10 transition-[translate,scale,box-shadow] duration-150 ease-out outline-none hover:-translate-y-px hover:shadow-lg hover:ring-2 hover:ring-brand";

/**
 * Link-Cards mit gestaffeltem Einblenden (40 ms Versatz, Fade + 8px Slide).
 * `preview`: nicht klickbar, Tooltip „Vorschau“, Umsortieren wird weich animiert.
 */
export function PublicLinkList({
  links,
  preview = false,
}: {
  links: PublicLinkItem[];
  preview?: boolean;
}) {
  return (
    // „Bewegung reduzieren“: nur noch Einblenden, kein Slide.
    <MotionConfig reducedMotion="user">
      <ul className="flex flex-col gap-3">
        {links.map((link, index) => (
          <motion.li
            key={link.id}
            layout={preview ? "position" : false}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut", delay: preview ? 0 : index * 0.04 }}
          >
            {preview ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={CARD_CLASSES}>{link.title}</span>
                </TooltipTrigger>
                <TooltipContent>Vorschau – auf deiner Seite klickbar</TooltipContent>
              </Tooltip>
            ) : (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  CARD_CLASSES,
                  "focus-visible:ring-3 focus-visible:ring-ring active:scale-[.98]",
                )}
              >
                {link.title}
              </a>
            )}
          </motion.li>
        ))}
      </ul>
    </MotionConfig>
  );
}
