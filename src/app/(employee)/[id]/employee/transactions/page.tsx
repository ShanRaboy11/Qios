"use client";

import React from "react";
import { useParams } from "next/navigation";
import { TransactionTable } from "@/components/organisms/TransactionTable";

export default function TransactionsPage() {
  const params = useParams();
  const tenantId = params?.id as string;

  return (
    <>
      <header className="mb-2">
        <h2 className="h2 text-text-primary">Transactions</h2>
        <p className="b1 text-text-secondary mt-2">
          Review today&apos;s orders and payment history
        </p>
      </header>

      <div className="mt-8">
        <TransactionTable
          tenantId={tenantId}
          businessName=""
          apiPath={`/api/tenants/${tenantId}/employee/transactions`}
        />
      </div>
    </>
  );
}