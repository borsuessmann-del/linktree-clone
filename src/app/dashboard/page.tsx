import { LinkIcon, PaletteIcon, UserRoundIcon, type LucideIcon } from "lucide-react";
import { Suspense, type ReactNode } from "react";

import { AccentPicker } from "@/components/dashboard/accent-picker";
import { EditorProvider } from "@/components/dashboard/editor-context";
import { LiveBanner } from "@/components/dashboard/live-banner";
import { LinksEditor } from "@/components/dashboard/links/links-editor";
import { LivePreview } from "@/components/dashboard/live-preview";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { Workspace } from "@/components/dashboard/workspace";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { requireProfile } from "@/lib/auth/dal";
import { getOwnLinks } from "@/lib/data/links";
import { safeAccent } from "@/lib/theme/color";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      <Suspense fallback={<Skeleton className="h-28 rounded-2xl sm:h-16" />}>
        <LiveBannerForUser />
      </Suspense>
      <Suspense fallback={<WorkspaceSkeleton />}>
        <DashboardWorkspace />
      </Suspense>
    </div>
  );
}

async function LiveBannerForUser() {
  const profile = await requireProfile();
  return <LiveBanner username={profile.username} />;
}

/** Lädt alle Editor-Daten auf einmal – Editoren und Live-Preview teilen sich den Zustand. */
async function DashboardWorkspace() {
  const [profile, links] = await Promise.all([requireProfile(), getOwnLinks()]);

  return (
    <EditorProvider
      username={profile.username}
      initialProfile={{
        display_name: profile.display_name ?? "",
        bio: profile.bio ?? "",
        avatar_url: profile.avatar_url ?? "",
      }}
      initialAccent={safeAccent(profile.accent_color)}
      initialLinks={links}
    >
      <Workspace editor={<EditorSections />} preview={<LivePreview />} />
    </EditorProvider>
  );
}

function EditorSections() {
  return (
    <div className="flex flex-col gap-6">
      <EditorSection title="Profil" description="Name, Bio und Avatar deiner Seite." icon={UserRoundIcon}>
        <ProfileForm />
      </EditorSection>
      <EditorSection title="Design" description="Die Akzentfarbe deiner Seite." icon={PaletteIcon}>
        <AccentPicker />
      </EditorSection>
      <EditorSection title="Links" description="Deine Links – sichtbar auf deiner öffentlichen Seite." icon={LinkIcon}>
        <LinksEditor />
      </EditorSection>
    </div>
  );
}

function EditorSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Icon aria-hidden className="size-4 text-muted-foreground" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_395px] lg:gap-8">
      <div className="flex flex-col gap-6">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="hidden h-[min(760px,calc(100dvh-8rem))] rounded-[2.5rem] lg:block" />
    </div>
  );
}
