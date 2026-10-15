"use client";

import {
  createContext,
  use,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { LinkItem } from "@/lib/validation/link";
import type { ProfileInput } from "@/lib/validation/profile";

/** Entwurf aus den Formularfeldern (Strings, noch nicht gespeichert). */
export type ProfileDraft = ProfileInput;

type EditorState = {
  username: string;
  profile: ProfileDraft;
  setProfile: Dispatch<SetStateAction<ProfileDraft>>;
  accent: string;
  setAccent: Dispatch<SetStateAction<string>>;
  links: LinkItem[];
  setLinks: Dispatch<SetStateAction<LinkItem[]>>;
};

const EditorContext = createContext<EditorState | null>(null);

/**
 * Gemeinsamer Editor-Zustand: Die Editoren (Profil, Farbe, Links) schreiben hinein,
 * die Live-Preview liest daraus – Änderungen sind sofort sichtbar, auch vor dem Speichern.
 */
export function EditorProvider({
  username,
  initialProfile,
  initialAccent,
  initialLinks,
  children,
}: {
  username: string;
  initialProfile: ProfileDraft;
  initialAccent: string;
  initialLinks: LinkItem[];
  children: ReactNode;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [accent, setAccent] = useState(initialAccent);
  const [links, setLinks] = useState(initialLinks);

  return (
    <EditorContext
      value={{ username, profile, setProfile, accent, setAccent, links, setLinks }}
    >
      {children}
    </EditorContext>
  );
}

export function useEditor() {
  const context = use(EditorContext);
  if (!context) {
    throw new Error("useEditor muss innerhalb von <EditorProvider> verwendet werden.");
  }
  return context;
}
