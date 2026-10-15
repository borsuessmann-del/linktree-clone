import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";
import { env } from "@/lib/env";

/**
 * Cookie-freier Client für öffentliche Daten (Rolle `anon`, RLS greift).
 * Nötig in `'use cache'`-Funktionen, die keine Cookies lesen dürfen.
 */
export function createPublicClient() {
  return createClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
