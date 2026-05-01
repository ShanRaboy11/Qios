"use server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function processOnboarding(data: {
  businessData: { name: string, email: string },
  contactData: { phoneNumber: string },
  authData: { email: string, password: string },
  subscriptionData: { packageId: string },
  featureData: { inventoryMode: string, generalFeatures: any },
  documentData?: Record<string, { name: string, content: string, type: string }>
}) {
  const supabase = createSupabaseAdminClient();
  
  // 1. Create a User in Auth
  const { data: authDataRes, error: authError } = await supabase.auth.admin.createUser({
    email: data.authData.email,
    password: data.authData.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.businessData.name,
      business_email: data.businessData.email,
      phone_number: data.contactData.phoneNumber,
      subscription_plan: data.subscriptionData.packageId,
      features: data.featureData.generalFeatures
    }
  });

  if (authError || !authDataRes.user) {
    throw new Error(authError?.message || "Failed to create user");
  }
  
  const userId = authDataRes.user.id;

  // 2. Create the Tenant
  const { data: tenantRes, error: tenantError } = await supabase.from('tenants').insert({
    name: data.businessData.name,
    inventory_mode: data.featureData.inventoryMode
  }).select('id').single();

  if (tenantError || !tenantRes) {
    throw new Error(tenantError?.message || "Failed to create tenant");
  }

  const tenantId = tenantRes.id;
  
  // Handle Document Uploads
  let uploadedUrls: string[] = [];
  if (data.documentData && Object.keys(data.documentData).length > 0) {
    for (const [key, file] of Object.entries(data.documentData)) {
      const base64Data = file.content.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const filePath = `${tenantId}/${key}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      
      const { error: uploadError } = await supabase.storage
        .from('verification-docs')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false
        });
        
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('verification-docs').getPublicUrl(filePath);
        if (urlData?.publicUrl) {
           uploadedUrls.push(urlData.publicUrl);
        }
      } else {
        console.error("Document upload failed:", uploadError);
      }
    }
    
    // Update tenant with document urls
    if (uploadedUrls.length > 0) {
       await supabase.from('tenants').update({
         verification_doc_urls: uploadedUrls
       }).eq('id', tenantId);
    }
  }

  // 3. Update the Profile
  const { error: profileError } = await supabase.from('profiles').update({
    tenant_id: tenantId,
    role: 'admin',
  }).eq('id', userId);

  if (profileError) {
    throw new Error(profileError.message || "Failed to link user to tenant");
  }

  return { success: true, tenantId, userId };
}