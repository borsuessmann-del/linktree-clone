"use client";

import { useEditor } from "@/components/dashboard/editor-context";
import { PhoneFrame } from "@/components/dashboard/phone-frame";
import { PublicProfile } from "@/components/public/public-profile";
import { isHttpsUrl } from "@/lib/validation/profile";

/** Zeigt die Public-Page aus dem aktuellen Editor-Zustand – auch ungespeicherte Änderungen. */
export function LivePreview() {
  const { username, profile, accent, links } = useEditor();
  const avatarUrl = profile.avatar_url.trim();

  return (
    <div data-live-preview className="flex flex-col gap-3 lg:sticky lg:top-22">
      <h2 className="text-sm font-medium text-muted-foreground">
        Vorschau <span className="font-normal">· aktualisiert sich beim Bearbeiten</span>
      </h2>
      <PhoneFrame>
        <PublicProfile
          preview
          username={username}
          displayName={profile.display_name.trim() || null}
          bio={profile.bio.trim() || null}
          // Wie im Formular: nur gültige https-Adressen laden.
          avatarUrl={isHttpsUrl(avatarUrl) ? avatarUrl : null}
          accentColor={accent}
          links={links
            .filter((link) => link.is_visible)
            .map(({ id, title, url }) => ({ id, title, url }))}
        />
      </PhoneFrame>
    </div>
  );
}
