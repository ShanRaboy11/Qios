"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SectionHeader } from "@/components/molecules/SectionHeader";

export const TenantBillingSettings = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Subscription & Billing
        </h2>
        <p className="text-sm text-text-secondary">
          Manage your Qios subscription plan and payment methods.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-brand-accent bg-brand-accent/5">
           <div className="flex items-start justify-between">
              <div>
                 <span className="inline-block px-2.5 py-1 bg-brand-accent text-white text-xs font-bold rounded-full mb-2">
                    PRO PLAN
                 </span>
                 <h3 className="text-xl font-bold text-text-primary">₱2,500 <span className="text-sm text-text-secondary font-normal">/ month</span></h3>
                 <p className="text-sm text-text-secondary mt-1">Next billing date: June 1, 2026</p>
              </div>
              <Button variant="outline" className="border-brand-accent text-brand-accent hover:bg-brand-accent/10">
                 Change Plan
              </Button>
           </div>
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Payment Method"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
             <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                   <CreditCard size={20} className="text-gray-500"/>
                </div>
                <div>
                   <h4 className="font-medium text-text-primary">Visa ending in 4242</h4>
                   <p className="text-sm text-text-secondary">Expires 12/28</p>
                </div>
             </div>
             <Button variant="ghost" className="text-brand-accent">Edit</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <SectionHeader
            title="Billing History"
            className="mb-0 py-2 border-gray-100"
          />
          <div className="rounded-xl border border-gray-100 overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                   <tr>
                      <th className="py-3 px-4 text-xs font-medium text-text-secondary">Date</th>
                      <th className="py-3 px-4 text-xs font-medium text-text-secondary">Amount</th>
                      <th className="py-3 px-4 text-xs font-medium text-text-secondary">Status</th>
                      <th className="py-3 px-4 text-xs font-medium text-text-secondary text-right">Invoice</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   <tr>
                      <td className="py-3 px-4 text-sm">May 1, 2026</td>
                      <td className="py-3 px-4 text-sm font-medium">₱2,500</td>
                      <td className="py-3 px-4 text-sm"><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">Paid</span></td>
                      <td className="py-3 px-4 text-sm text-right"><button className="text-brand-accent hover:underline">Download</button></td>
                   </tr>
                   <tr>
                      <td className="py-3 px-4 text-sm">Apr 1, 2026</td>
                      <td className="py-3 px-4 text-sm font-medium">₱2,500</td>
                      <td className="py-3 px-4 text-sm"><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">Paid</span></td>
                      <td className="py-3 px-4 text-sm text-right"><button className="text-brand-accent hover:underline">Download</button></td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};
