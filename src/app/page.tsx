import { GripVerticalIcon, PaletteIcon, SmartphoneIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { ClaimForm } from "@/components/landing/claim-form";
import { DemoPhone } from "@/components/landing/demo-phone";
import { LandingHeader } from "@/components/landing/landing-header";

const features: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: GripVerticalIcon, title: "Sortieren per Drag-and-Drop", text: "Ziehen oder Pfeiltasten – die Reihenfolge ist sofort live." },
  { icon: PaletteIcon, title: "Deine Farbe", text: "Zehn Vorlagen oder eigene Farbe, immer gut lesbar." },
  { icon: SmartphoneIcon, title: "Live-Vorschau", text: "Du siehst jede Änderung, bevor du speicherst." },
];

export default function Home() {
  return (
    <div className="relative isolate flex flex-1 flex-col overflow-x-clip">
      {/* Glow-Hintergrund statt flacher Fläche */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem] bg-[radial-gradient(55%_60%_at_25%_10%,color-mix(in_oklch,var(--brand)_18%,transparent),transparent),radial-gradient(45%_55%_at_85%_30%,color-mix(in_oklch,var(--brand)_10%,transparent),transparent)]"
      />

      <LandingHeader />

      <main className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:pt-20">
        <section className="flex flex-col items-start gap-6 duration-500 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none">
          <span className="rounded-full bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm ring-1 ring-foreground/10">
            Link-in-Bio · kostenlos
          </span>
          <h1 className="text-5xl font-semibold tracking-tighter text-balance sm:text-6xl">
            Deine Links.
            <br />
            <span className="bg-linear-to-r from-brand to-brand/60 bg-clip-text text-transparent">
              Eine Seite.
            </span>
          </h1>
          <p className="max-w-md text-lg text-pretty text-muted-foreground">
            Sammle Portfolio, Shop und Socials auf einer schönen Seite unter deinem Namen – in
            deiner Farbe, sortiert, wie du willst.
          </p>
          <ClaimForm />
        </section>

        <div className="flex justify-center delay-150 duration-700 animate-in fade-in slide-in-from-bottom-4 fill-mode-both motion-reduce:animate-none">
          <DemoPhone />
        </div>
      </main>

      <section aria-label="Funktionen" className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="flex flex-col gap-2 rounded-2xl bg-card bg-linear-to-b from-card to-muted/40 p-5 shadow-sm ring-1 ring-foreground/10"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-muted">
                <Icon aria-hidden className="size-4" />
              </span>
              <h2 className="font-medium">{title}</h2>
              <p className="text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>Linktree-Clone · ein Kurs-Projekt</p>
          <nav aria-label="Konto" className="flex gap-4">
            <Link className="rounded-sm transition-colors duration-150 ease-out hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" href="/login">
              Login
            </Link>
            <Link className="rounded-sm transition-colors duration-150 ease-out hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" href="/signup">
              Registrieren
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
