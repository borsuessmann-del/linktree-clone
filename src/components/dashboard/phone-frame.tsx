import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Handy-Rahmen für Live-Preview und Landing-Demo.
 * `responsive` (Dashboard): Rahmen erst ab lg (~375×760, sticky), darunter volle Breite ohne Rahmen.
 * `always` (Landing): immer mit Rahmen, feste Größe.
 */
export function PhoneFrame({
  children,
  variant = "responsive",
}: {
  children: ReactNode;
  variant?: "responsive" | "always";
}) {
  const always = variant === "always";

  return (
    <div
      className={cn(
        "mx-auto w-full",
        always
          ? "h-[620px] w-[310px] rounded-[2.5rem] bg-linear-to-b from-card to-muted p-2.5 shadow-lg ring-1 ring-foreground/10 sm:h-[680px] sm:w-[340px]"
          : "lg:h-[min(760px,calc(100dvh-8rem))] lg:w-[375px] lg:rounded-[2.5rem] lg:bg-linear-to-b lg:from-card lg:to-muted lg:p-2.5 lg:shadow-lg lg:ring-1 lg:ring-foreground/10",
      )}
    >
      <div
        className={cn(
          "flex flex-col overflow-hidden",
          always
            ? "h-full rounded-[2rem] ring-1 ring-foreground/5"
            : "min-h-[70dvh] rounded-2xl ring-1 ring-foreground/10 lg:h-full lg:min-h-0 lg:rounded-[2rem] lg:ring-foreground/5",
        )}
      >
        {/* Scrollbar ausgeblendet (wie auf einem Handy), Scrollen bleibt möglich */}
        <div
          className={cn(
            "flex flex-1 flex-col [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            always ? "overflow-y-auto" : "lg:overflow-y-auto",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
