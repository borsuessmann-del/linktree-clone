import type { Metadata } from "next";
import { Suspense } from "react";

import { SignupForm } from "@/components/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { normalizeUsername, USERNAME_MAX_LENGTH } from "@/lib/validation/auth";

export const metadata: Metadata = {
  title: "Registrieren · Linktree-Clone",
};

export default function SignupPage({ searchParams }: PageProps<"/signup">) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Konto erstellen
        </CardTitle>
        <CardDescription>Deine Links auf einer Seite – in einer Minute.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* searchParams gibt es erst zur Laufzeit → hinter Suspense (cacheComponents) */}
        <Suspense fallback={<SignupForm initialUsername="" />}>
          <SignupFormWithClaim searchParams={searchParams} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function SignupFormWithClaim({
  searchParams,
}: Pick<PageProps<"/signup">, "searchParams">) {
  const { username } = await searchParams;
  // ?username= aus dem Landing-Claim (Spec 12); nur als Vorschlag, Prüfung folgt im Formular.
  const initialUsername =
    typeof username === "string"
      ? normalizeUsername(username).slice(0, USERNAME_MAX_LENGTH)
      : "";
  return <SignupForm initialUsername={initialUsername} />;
}
