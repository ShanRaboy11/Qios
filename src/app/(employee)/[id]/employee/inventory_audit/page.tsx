"use client";

import React from "react";

export default function InventoryAuditPage() {
  return (
    <>
      <header className="mb-2">
        <h2 className="h2 text-text-primary">Inventory Audit</h2>
        <p className="b1 text-text-secondary mt-2">
          Quick stock updates and low stock alerts
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Inventory System Placeholder
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          The full inventory audit list will be populated here, allowing staff
          to quickly update quantities directly from the floor.
        </p>
      </div>
    </>
  );
}
