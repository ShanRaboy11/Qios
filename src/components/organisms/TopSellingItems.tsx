"use client";

import React from "react";
import Image from "next/image";

const mockTopItems = [
  {
    id: 1,
    name: "Truffle Burger",
    category: "Mains",
    sales: 342,
    revenue: 125000,
    trend: "+12%",
  },
  {
    id: 2,
    name: "Sweet Potato Fries",
    category: "Sides",
    sales: 289,
    revenue: 43350,
    trend: "+5%",
  },
  {
    id: 3,
    name: "Iced Caramel Macchiato",
    category: "Beverages",
    sales: 256,
    revenue: 51200,
    trend: "+18%",
  },
  {
    id: 4,
    name: "Classic Cheeseburger",
    category: "Mains",
    sales: 210,
    revenue: 63000,
    trend: "-2%",
  },
  {
    id: 5,
    name: "Onion Rings",
    category: "Sides",
    sales: 185,
    revenue: 27750,
    trend: "+8%",
  },
];

export const TopSellingItems = () => {
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full w-full">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-xl text-text-primary">
            Top Selling Items
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Highest performing menu items
          </p>
        </div>
        <button className="text-sm font-medium text-brand-accent hover:underline">
          View All
        </button>
      </div>

      <div className="p-2 sm:p-4">
        <div className="overflow-x-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="text-text-secondary text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-2 sm:px-4">Item Name</th>
                <th className="py-3 px-2 sm:px-4 w-20 text-center">Sales</th>
                <th className="py-3 px-2 sm:px-4 w-28 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {mockTopItems.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-2 sm:px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-accent text-xs shrink-0">
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-text-primary text-[13px] sm:text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-text-secondary">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 sm:px-4 font-bold text-text-primary text-center text-sm">
                    {item.sales}
                  </td>
                  <td className="py-4 px-2 sm:px-4 text-right">
                    <p className="font-bold text-text-primary text-sm">
                      ₱{item.revenue.toLocaleString()}
                    </p>
                    <p
                      className={`text-[11px] font-medium ${item.trend.startsWith("+") ? "text-success-primary" : "text-error-primary"}`}
                    >
                      {item.trend}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
