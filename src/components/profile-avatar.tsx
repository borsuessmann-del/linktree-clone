import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/** „Ada Lovelace“ → „AL“, „ada“ → „A“. */
export function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
}

/**
 * Profilbild mit Initialen-Fallback auf Brand-Verlauf (leer oder Ladefehler).
 * Nutzt ein normales <img>, damit beliebige Hosts ohne next/image-Config funktionieren.
 */
export function ProfileAvatar({
  src,
  name,
  className,
}: {
  src: string | null | undefined;
  name: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-24 text-2xl", className)}>
      {src && (
        <AvatarImage
          src={src}
          alt={`Profilbild von ${name}`}
          referrerPolicy="no-referrer"
        />
      )}
      <AvatarFallback className="bg-linear-to-br from-brand/75 to-brand text-[length:inherit] font-semibold text-brand-foreground">
        <span aria-hidden>{getInitials(name)}</span>
        <span className="sr-only">Profilbild von {name}</span>
      </AvatarFallback>
    </Avatar>
  );
}
