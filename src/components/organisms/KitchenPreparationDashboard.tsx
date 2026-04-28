"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

interface OrderItem {
  id: string;
  name: string;
  notes: string;
  quantity: number;
}

interface Order {
  id: string;
  status: OrderStatus;
  time: string;
  counter: string;
  type: string;
  targetTimePercentage: number;
  items: OrderItem[];
}

const initialOrders: Order[] = [
  {
    id: "#R-4821",
    status: "preparing",
    time: "10:22",
    counter: "Counter 3",
    type: "Dine-in",
    targetTimePercentage: 86,
    items: [
      { id: "1", name: "Garlic Fried Rice", notes: "Extra crispy", quantity: 1 },
      { id: "2", name: "Soy Chicken", notes: "Extra crispy", quantity: 1 },
      { id: "3", name: "Mango Shake", notes: "Medium", quantity: 1 },
    ],
  },
  {
    id: "#R-4822",
    status: "preparing",
    time: "5:22",
    counter: "Counter 2",
    type: "Takeout",
    targetTimePercentage: 53,
    items: [
      { id: "4", name: "Kare-Kare Meal", notes: "Mild to peanut sauce", quantity: 1 },
      { id: "5", name: "Lumpia Shanghai", notes: "10 pieces", quantity: 2 },
    ],
  },
  {
    id: "#R-4823",
    status: "pending",
    time: "3:22",
    counter: "Counter 1",
    type: "Dine-in",
    targetTimePercentage: 28,
    items: [
      { id: "6", name: "Beef Tapa", notes: "Well done", quantity: 1 },
      { id: "7", name: "Garlic Rice", notes: "Medium serving", quantity: 1 },
      { id: "8", name: "Fried Egg", notes: "Over easy", quantity: 2 },
    ],
  },
  {
    id: "#R-4824",
    status: "ready",
    time: "17:22",
    counter: "Counter 4",
    type: "Dine-in",
    targetTimePercentage: 144,
    items: [
      { id: "9", name: "Sisig Rice Bowl", notes: "Medium spice", quantity: 1 },
      { id: "10", name: "Calamansi Juice", notes: "Less sugar", quantity: 2 },
    ],
  },
  {
    id: "#R-4825",
    status: "preparing",
    time: "8:15",
    counter: "Counter 1",
    type: "Dine-in",
    targetTimePercentage: 62,
    items: [
      { id: "11", name: "Chicken Adobo", notes: "Extra sauce", quantity: 1 },
      { id: "12", name: "Pancit Canton", notes: "No liver", quantity: 1 },
    ],
  },
];

export default function KitchenPreparationDashboard() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  const renderOrderCard = (order: Order) => (
    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col gap-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-text-primary">{order.id}</span>
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${order.targetTimePercentage > 100 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-text-secondary'}`}>
          {order.time}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
        <span className="px-2 py-0.5 bg-gray-100 rounded-md">{order.counter}</span>
        <span>•</span>
        <span>{order.type}</span>
        <span>•</span>
        <span className={order.targetTimePercentage > 100 ? 'text-red-500 font-bold' : ''}>
          {order.targetTimePercentage}% of target
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-start border-b border-gray-50 pb-2 last:border-0 last:pb-0">
            <div className="flex gap-3">
              <div className="bg-gray-100 text-text-secondary w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0">
                {item.quantity}x
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">{item.name}</span>
                {item.notes && <span className="text-xs text-text-secondary mt-0.5">{item.notes}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-2 flex">
        {order.status === 'pending' && (
          <button
            onClick={() => updateOrderStatus(order.id, 'preparing')}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all bg-white text-text-primary hover:bg-bg-primary active:bg-gray-100 border border-brand-primary shadow-sm"
          >
            Start Preparing
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => updateOrderStatus(order.id, 'ready')}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all bg-success-primary text-text-tertiary hover:bg-success-primary/90 active:bg-success-primary/80 shadow-sm"
          >
            Mark Ready
          </button>
        )}
        {order.status === 'ready' && (
          <Button
            onClick={() => updateOrderStatus(order.id, 'completed')}
            variant="primary"
            className="w-full py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2"
          >
            Order Received
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen p-4 md:p-6 lg:p-8 gap-8 font-inter">
      {/* Dashboard Header Element */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary font-figtree tracking-tight">Kitchen Operations</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base font-medium">Real-time active order management system</p>
        </div>
        <div className="flex items-center gap-3 bg-success-primary/10 px-4 py-2.5 rounded-xl border border-success-primary/20 shadow-sm">
           <span className="w-2.5 h-2.5 rounded-full bg-success-primary animate-pulse"></span>
           <span className="text-sm font-bold text-success-primary tracking-wide">SYSTEM LIVE</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-text-primary font-bold text-2xl shadow-sm">
            {pendingOrders.length}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] text-text-secondary font-bold uppercase tracking-widest mb-0.5">Pending</p>
            <p className="text-[19px] font-bold text-text-primary leading-none">In Queue</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <div className="w-14 h-14 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-bold text-2xl shadow-sm">
            {preparingOrders.length}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] text-brand-accent/80 font-bold uppercase tracking-widest mb-0.5">Preparing</p>
            <p className="text-[19px] font-bold text-text-primary leading-none">Active Orders</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <div className="w-14 h-14 rounded-xl bg-success-primary/10 border border-success-primary/20 flex items-center justify-center text-success-primary font-bold text-2xl shadow-sm">
            {readyOrders.length}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] text-success-primary/80 font-bold uppercase tracking-widest mb-0.5">Ready</p>
            <p className="text-[19px] font-bold text-text-primary leading-none">For Pickup</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <div className="w-14 h-14 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold text-2xl shadow-sm">
            {orders.filter((o) => o.status !== 'completed').length}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] text-brand-dark/70 font-bold uppercase tracking-widest mb-0.5">Total</p>
            <p className="text-[19px] font-bold text-text-primary leading-none">All Orders</p>
          </div>
        </div>
      </div>

      {/* Main Boards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
        {/* Pending Column */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="w-3 h-3 rounded-full bg-gray-400 shadow-sm"></div>
            <h2 className="text-lg font-bold text-text-primary">Pending Orders</h2>
            <span className="ml-auto bg-gray-50 border border-gray-200 text-text-secondary px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">{pendingOrders.length}</span>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto">
            {pendingOrders.map(renderOrderCard)}
            {pendingOrders.length === 0 && (
              <div className="text-center p-10 text-text-secondary border-2 border-dashed border-gray-200 rounded-xl font-medium">
                No pending orders
              </div>
            )}
          </div>
        </div>

        {/* Preparing Column */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="w-3 h-3 rounded-full bg-brand-accent shadow-sm shadow-brand-accent/30"></div>
            <h2 className="text-lg font-bold text-text-primary">Preparing Now</h2>
            <span className="ml-auto bg-brand-accent/5 border border-brand-accent/20 text-brand-accent px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">{preparingOrders.length}</span>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto">
            {preparingOrders.map(renderOrderCard)}
            {preparingOrders.length === 0 && (
              <div className="text-center p-10 text-text-secondary border-2 border-dashed border-gray-200 rounded-xl font-medium">
                No preparing orders
              </div>
            )}
          </div>
        </div>

        {/* Ready Column */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="w-3 h-3 rounded-full bg-success-primary shadow-sm shadow-success-secondary"></div>
            <h2 className="text-lg font-bold text-text-primary">Ready for Pickup</h2>
            <span className="ml-auto bg-success-primary/5 border border-success-primary/20 text-success-primary px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">{readyOrders.length}</span>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto">
            {readyOrders.map(renderOrderCard)}
            {readyOrders.length === 0 && (
              <div className="text-center p-10 text-text-secondary border-2 border-dashed border-gray-200 rounded-xl font-medium">
                No orders ready
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
