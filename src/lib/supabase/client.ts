import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient(persistSession = true) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase browser credentials are not configured.");
  }

  // @supabase/ssr inherently synchronizes the user's session with browser cookies.
  // This is required so that the Next.js Middleware can read the user's session on the server.
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
