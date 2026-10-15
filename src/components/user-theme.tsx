import type { CSSProperties, ReactNode } from "react";

import { getContrastForeground, safeAccent } from "@/lib/theme/color";
import { cn } from "@/lib/utils";

/**
 * Setzt die User-Farbe als CSS-Variablen für alle Kinder.
 * Sicherheit: nur validierter Hex-Wert, nur über das React-style-Objekt –
 * nie <style> oder dangerouslySetInnerHTML (CSS-Injection).
 */
export function UserTheme({
  accent,
  className,
  children,
}: {
  accent: unknown;
  className?: string;
  children: ReactNode;
}) {
  const brand = safeAccent(accent);
  const style = {
    "--brand": brand,
    "--brand-foreground": getContrastForeground(brand),
  } as CSSProperties;

  return (
    <div className={cn("user-theme", className)} style={style}>
      {children}
    </div>
  );
}
