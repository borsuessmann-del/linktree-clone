import Link from "next/link";

import { ProfileAvatar } from "@/components/profile-avatar";
import {
  PublicLinkList,
  type PublicLinkItem,
} from "@/components/public/public-link-list";
import { UserTheme } from "@/components/user-theme";
import { cn } from "@/lib/utils";

export type PublicProfileProps = {
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  accentColor: string;
  links: PublicLinkItem[];
  /** Live-Preview im Dashboard: nichts klickbar, kein zweites <main>/<h1>. */
  preview?: boolean;
  className?: string;
};

const FOOTER_PILL_CLASSES =
  "rounded-full bg-card/80 px-4 py-2 text-center text-sm text-muted-foreground shadow-md ring-1 ring-foreground/10 backdrop-blur";

/**
 * Öffentliche Profilseite als reine Darstellung (Props statt Datenabruf) –
 * genutzt von /u/[username] und der Live-Preview im Dashboard.
 */
export function PublicProfile({
  username,
  displayName,
  bio,
  avatarUrl,
  accentColor,
  links,
  preview = false,
  className,
}: PublicProfileProps) {
  const name = displayName || username;
  const Root = preview ? "div" : "main";
  const Heading = preview ? "p" : "h1";
  const footerContent = (
    <>
      Erstellt mit <span className="font-semibold text-foreground">Linktree-Clone</span> ·
      Eigene Seite erstellen
    </>
  );

  return (
    <UserTheme
      accent={accentColor}
      className={cn(
        "flex flex-1 flex-col bg-background bg-[radial-gradient(80%_45%_at_50%_0%,color-mix(in_oklch,var(--brand)_16%,transparent),transparent)]",
        className,
      )}
    >
      <Root
        className={cn(
          "mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 pb-10",
          preview ? "pt-12" : "pt-14 sm:pt-20",
        )}
      >
        <header className="flex flex-col items-center text-center">
          <ProfileAvatar
            src={avatarUrl}
            name={name}
            className="ring-2 ring-brand ring-offset-2 ring-offset-background"
          />
          <Heading className="mt-6 text-2xl font-semibold tracking-tight text-balance break-words">
            {name}
          </Heading>
          {displayName && <p className="mt-1 text-sm text-muted-foreground">@{username}</p>}
          {bio && (
            <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-pretty break-words text-muted-foreground">
              {bio}
            </p>
          )}
        </header>

        <section aria-label="Links" className="mt-8">
          {links.length > 0 ? (
            <PublicLinkList links={links} preview={preview} />
          ) : (
            <p className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              Hier gibt&apos;s noch keine Links.
            </p>
          )}
        </section>

        <footer className="mt-auto flex justify-center pt-12">
          {preview ? (
            <span className={FOOTER_PILL_CLASSES}>{footerContent}</span>
          ) : (
            <Link
              href="/signup"
              className={cn(
                FOOTER_PILL_CLASSES,
                "transition-[translate,color,box-shadow] duration-150 ease-out outline-none hover:-translate-y-px hover:text-foreground hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring",
              )}
            >
              {footerContent}
            </Link>
          )}
        </footer>
      </Root>
    </UserTheme>
  );
}
