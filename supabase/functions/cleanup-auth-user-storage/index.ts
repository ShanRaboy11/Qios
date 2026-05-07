import { createClient } from "jsr:@supabase/supabase-js@2";

const SHARED_SECRET = "9fcb63d8-4e3a-4e6b-9c48-6a3a06e1dd4e";
const SECRET_HEADER = "x-qios-delete-secret";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (req.headers.get(SECRET_HEADER) !== SHARED_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  const userId = payload?.user_id;

  if (!userId || typeof userId !== "string") {
    return Response.json({ success: false, error: "Missing user_id." }, { status: 400 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json(
      { success: false, error: "Missing Supabase service credentials." },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const bucket = supabase.storage.from("verification-docs");
  const { data: files, error: listError } = await bucket.list(userId, {
    limit: 1000,
  });

  if (listError) {
    return Response.json(
      { success: false, error: listError.message },
      { status: 500 },
    );
  }

  const filePaths = (files || []).map((file) => `${userId}/${file.name}`);

  if (filePaths.length > 0) {
    const { error: removeError } = await bucket.remove(filePaths);

    if (removeError) {
      return Response.json(
        { success: false, error: removeError.message },
        { status: 500 },
      );
    }
  }

  return Response.json({ success: true, deletedCount: filePaths.length });
});
