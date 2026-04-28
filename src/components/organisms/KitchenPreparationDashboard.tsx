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

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-brand-primary/20 text-text-primary border-brand-primary";
      case "preparing":
        return "bg-brand-accent/10 text-brand-accent border-brand-accent/30";
      case "ready":
        return "bg-success-secondary text-success-primary border-success-primary/30";
      case "completed":
        return "bg-bg-primary text-text-secondary border-gray-200";
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  const renderOrderCard = (order: Order) => (
    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col gap-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-gray-900">{order.id}</span>
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${order.targetTimePercentage > 100 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
          {order.time}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
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
              <div className="bg-gray-100 text-gray-700 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0">
                {item.quantity}x
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                {item.notes && <span className="text-xs text-gray-500 mt-0.5">{item.notes}</span>}
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
    <div className="flex flex-col bg-bg-primary min-h-screen p-6 gap-6">
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
            {preparingOrders.length}
          </div>
          <div>
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Preparing</p>
            <p className="text-lg font-bold text-text-primary">Active Orders</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-gray-900 font-bold text-xl">
            {pendingOrders.length}
          </div>
          <div>
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Pending</p>
            <p className="text-lg font-bold text-text-primary">In Queue</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success-secondary flex items-center justify-center text-success-primary font-bold text-xl">
            {readyOrders.length}
          </div>
          <div>
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Ready</p>
            <p className="text-lg font-bold text-text-primary">For Pickup</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-secondary flex items-center justify-center text-brand-accent font-bold text-xl">
            {orders.filter((o) => o.status !== 'completed').length}
          </div>
          <div>
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Total</p>
            <p className="text-lg font-bold text-text-primary">All Orders</p>
          </div>
        </div>
      </div>

      {/* Main Boards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Pending Column */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="w-3 h-3 rounded-full bg-brand-primary shadow-sm shadow-brand-secondary"></div>
            <h2 className="text-lg font-bold text-text-primary">Pending Orders</h2>
            <span className="ml-auto bg-bg-primary border border-gray-200 text-text-secondary px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">{pendingOrders.length}</span>
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
            <span className="ml-auto bg-bg-primary border border-gray-200 text-text-secondary px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">{preparingOrders.length}</span>
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
            <span className="ml-auto bg-bg-primary border border-gray-200 text-text-secondary px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">{readyOrders.length}</span>
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