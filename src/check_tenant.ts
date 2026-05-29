import { createSupabaseAdminClient } from "./lib/supabase/admin";

async function main() {
  const supabase = createSupabaseAdminClient();
  const { data: tenant, error } = await supabase
    .from("tenants")
    .select("business_name, settings")
    .eq("id", "94a085b3-2b22-4a00-9836-3918a998c2de")
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  console.log("Tenant Details:", tenant);
}

main().catch(console.error);
