import React from "react";
import { LiveActivityFeed } from "@/components/organisms/LiveActivityFeed";

export default function TenantDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8 px-6 md:px-8">Live Activity Feed</h1>
        <LiveActivityFeed />
      </div>
    </main>
  );
}