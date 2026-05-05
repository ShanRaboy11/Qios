"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";

export const TenantDangerZone = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <h2 className="text-xl font-bold text-red-600 mb-1">
          Danger Zone
        </h2>
        <p className="text-sm text-text-secondary">
          Irreversible and destructive actions for your tenant account.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-5 rounded-xl border border-orange-200 bg-orange-50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
           <div>
              <h4 className="font-bold text-orange-900">Deactivate Store</h4>
              <p className="text-sm text-orange-700 mt-1 max-w-md">
                 Temporarily hide your store from customer-facing interfaces like Kiosks and QR Menus. You can reactivate anytime.
              </p>
           </div>
           <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-shrink-0 whitespace-nowrap">
              Deactivate
           </Button>
        </div>

        <div className="p-5 rounded-xl border border-red-200 bg-red-50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
           <div>
              <h4 className="font-bold text-red-900">Delete Account & Store Data</h4>
              <p className="text-sm text-red-700 mt-1 max-w-md">
                 Permanently remove your account, store details, inventory, and transaction history. This action cannot be undone.
              </p>
           </div>
           <Button className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0 whitespace-nowrap" leftIcon={<Trash2 size={16}/>}>
              Delete Account
           </Button>
        </div>
      </div>
    </div>
  );
};
