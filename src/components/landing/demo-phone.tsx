"use client";

import { useEffect, useState } from "react";

import { PhoneFrame } from "@/components/dashboard/phone-frame";
import { PublicProfile } from "@/components/public/public-profile";
import { ACCENT_PRESETS } from "@/lib/theme/color";

const DEMO_LINKS = [
  { id: "demo-1", title: "Portfolio", url: "https://example.com/portfolio" },
  { id: "demo-2", title: "Neue Fotoserie: Lichter des Nordens", url: "https://example.com/serie" },
  { id: "demo-3", title: "Print-Shop", url: "https://example.com/shop" },
  { id: "demo-4", title: "Instagram", url: "https://example.com/instagram" },
];

// Ein paar gut unterscheidbare Presets für den Farbwechsel.
const DEMO_ACCENTS = ["Indigo", "Rose", "Smaragd", "Amber", "Violett"].map(
  (name) => ACCENT_PRESETS.find((preset) => preset.name === name)?.value ?? ACCENT_PRESETS[0].value,
);
const ACCENT_INTERVAL_MS = 2800;

/** Beispiel-Profil im Handy-Rahmen; die Akzentfarbe wechselt (nicht bei „Bewegung reduzieren“). */
export function DemoPhone() {
  const [accentIndex, setAccentIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setAccentIndex((index) => (index + 1) % DEMO_ACCENTS.length),
      ACCENT_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div aria-label="Beispiel-Profil" role="img" className="relative">
      <PhoneFrame variant="always">
        <PublicProfile
          preview
          username="mara"
          displayName="Mara Sommer"
          bio="Fotografin & Reisende. Gerade unterwegs zwischen Tromsø und den Lofoten."
          avatarUrl={null}
          accentColor={DEMO_ACCENTS[accentIndex]}
          links={DEMO_LINKS}
        />
      </PhoneFrame>
    </div>
  );
}
