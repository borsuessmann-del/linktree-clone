import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/database.types";
import { env } from "@/lib/env";

/** Supabase-Client für Client Components. */
export function createClient() {
  return createBrowserClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
  );
}
