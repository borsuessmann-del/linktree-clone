import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";
import { env } from "@/lib/env";

/**
 * Supabase-Client für Server Components, Server Actions und Route Handler.
 * Pro Aufruf neu erzeugen – nie als globales Singleton teilen.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components dürfen keine Cookies setzen. Unkritisch,
            // weil src/proxy.ts die Session bei jedem Request auffrischt.
          }
        },
      },
    },
  );
}
