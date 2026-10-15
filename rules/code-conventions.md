# Code-Konventionen

## Benennung
| Was | Konvention | Beispiel |
|---|---|---|
| Dateien | kebab-case | `link-list.tsx`, `use-links.ts` |
| Komponenten | PascalCase | `LinkList`, `AccentPicker` |
| Hooks | `use`-Präfix | `useLinks` |
| Server Actions | Verb zuerst | `createLink`, `updateProfile` |

## React / Next.js
- Server Components sind Default; `"use client"` nur, wenn State, Effekte, Event-Handler oder Browser-APIs nötig sind — und so tief im Baum wie möglich.
- Datenänderungen über Server Actions; jede Action validiert ihre Eingaben selbst (Client-Validierung ist nur Komfort).
- Supabase-Client: Server-Variante in Server Components/Actions, Browser-Variante nur in Client Components.

## TypeScript
- `strict` bleibt an.
- Kein `any` — stattdessen `unknown` + Type Guard oder generierte Supabase-Typen.
- Kein `@ts-ignore` / `@ts-expect-error` — Ursache beheben.

## Sauberkeit
- Kein `console.log` in committetem Code.
- Keine Secrets im Code — nur `.env.local` (ist in `.gitignore`).
- Imports über Alias `@/…`.
