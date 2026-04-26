import { createClient } from "@supabase/supabase-js";

export function createSupabaseBrowserClient(persistSession = true) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase browser credentials are not configured.");
  }

  // When "Remember me" is off, store the session in sessionStorage so it is
  // cleared when the browser tab/window is closed instead of persisting in
  // localStorage across browser restarts.
  const storage =
    !persistSession && typeof window !== "undefined"
      ? window.sessionStorage
      : undefined;

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession,
      storage,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
