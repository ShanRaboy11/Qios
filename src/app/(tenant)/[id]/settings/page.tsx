import React from "react";
import { notFound, redirect } from "next/navigation";
import { TenantSettings } from "@/components/organisms/TenantSettings";
import { getTenantSettings } from "./actions";

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: { tab?: string; section?: string };
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ?? {};
  const initialTab = resolvedSearchParams.tab === "store" ? "store" : "profile";
  const scrollToQrSection = resolvedSearchParams.section === "store-access-qr";

  let settingsData;
  try {
    settingsData = await getTenantSettings(resolvedParams.id);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "settings:unauthenticated";

    if (message === "settings:not_found") {
      notFound();
    }

    if (message === "settings:forbidden") {
      redirect("/login");
    }

    redirect("/login");
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="h2 text-text-primary">Account Settings</h2>
          <p className="b1 text-text-secondary mt-2">
            Manage your store details, branding, security, and notifications
          </p>
        </div>
      </div>
      <TenantSettings
        tenantId={resolvedParams.id}
        initialData={settingsData}
        initialTab={initialTab}
        scrollToQrSection={scrollToQrSection}
      />
    </>
  );
}
