import React from "react";
import { OrderStatusTracker } from "@/components/organisms/OrderStatusTracker";

export default function OrderStatusPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <OrderStatusTracker />
    </main>
  );
}
