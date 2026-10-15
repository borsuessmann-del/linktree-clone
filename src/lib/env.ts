// NEXT_PUBLIC_-Variablen müssen wörtlich ausgeschrieben werden, damit Next.js sie ins Browser-Bundle einsetzt.
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Umgebungsvariable ${name} fehlt. Bitte in .env.local eintragen (Supabase Dashboard → Connect → Next.js).`,
    );
  }
  return value;
}

export const env = {
  supabaseUrl: required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ),
  supabasePublishableKey: required(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  ),
};
