import React from "react";
import MenuCatalog, { MenuItemData } from "@/components/organisms/MenuCatalog";

const dummyMenu: MenuItemData[] = [
  {
    id: "1",
    name: "Classic Burger",
    price: 8.99,
    available: true,
    category: "Meal",
    imageUrl: "/images/food-placeholder.png"
  },
  {
    id: "2",
    name: "Fries",
    price: 3.99,
    available: true,
    category: "Snacks",
    imageUrl: "/images/food-placeholder.png"
  }
];

export default function CustomerMenuPage({ params }: { params: Promise<{ tenantId: string }> }) {
  return (
    <main className="min-h-screen bg-bg-primary">
      <MenuCatalog initialItems={dummyMenu} />
    </main>
  );
}