import { createClient } from "@supabase/supabase-js";

export function createSupabaseBrowserClient(persistSession = true) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase browser credentials are not configured.");
  }

  // When "Remember me" is off, use sessionStorage so the session is cleared
  // when the tab/window is closed. When it is on, fall back to the default
  // localStorage so the session survives browser restarts.
  // persistSession is always true; storage type controls the lifetime.
  const storage =
    typeof window !== "undefined"
      ? persistSession
        ? window.localStorage
        : window.sessionStorage
      : undefined;

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storage,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
