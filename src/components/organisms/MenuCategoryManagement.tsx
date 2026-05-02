"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { Badge } from "@/components/atoms/Badge";
import {
  GripVertical,
  Plus,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Search,
  LayoutGrid,
  List as ListIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// types

interface Category {
  id: string;
  name: string;
}

interface Modifier {
  id: string;
  itemId: string;
  name: string;
  description: string;
  price: string;
}

interface Size {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: string;
  isAvailable: boolean;
  aiSynced: boolean;
  isBestseller: boolean;
  specialInstructionsEnabled: boolean;
  modifiersEnabled: boolean;
  modifiers: Modifier[];
  sizes: Size[];
  image?: string;
}

// mock data

const INITIAL_CATEGORIES: Category[] = [
  { id: "1", name: "Sizzling" },
  { id: "2", name: "Drinks" },
  { id: "3", name: "Desserts" },
  { id: "4", name: "Breakfast" },
];

const INITIAL_ITEMS: MenuItem[] = [
  {
    id: "item_1",
    categoryId: "1",
    name: "Chicken Adobo",
    description: "Slow-cooked in vinegar, soy, & garlic",
    price: "500.00",
    isAvailable: true,
    aiSynced: true,
    isBestseller: true,
    specialInstructionsEnabled: true,
    modifiersEnabled: true,
    modifiers: [
      {
        id: "m1",
        itemId: "item_2",
        name: "Extra Rice",
        description: "Steamed white rice",
        price: "35.00",
      },
    ],
    sizes: [
      { id: "s1", name: "Regular", description: "Good for 1", price: "Free" },
      { id: "s2", name: "Large", description: "Good for 2-3", price: "150.00" },
    ],
  },
  {
    id: "item_2",
    categoryId: "2",
    name: "Extra Rice",
    description: "Steamed white rice",
    price: "35.00",
    isAvailable: true,
    aiSynced: true,
    isBestseller: false,
    specialInstructionsEnabled: false,
    modifiersEnabled: false,
    modifiers: [],
    sizes: [],
  },
  {
    id: "item_3",
    categoryId: "2",
    name: "Iced Tea",
    description: "House blend iced tea",
    price: "65.00",
    isAvailable: true,
    aiSynced: true,
    isBestseller: false,
    specialInstructionsEnabled: false,
    modifiersEnabled: false,
    modifiers: [],
    sizes: [],
  },
];

const MenuCategoryManagement = () => {
  // global state
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [items, setItems] = useState<MenuItem[]>(INITIAL_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState("1");

  // dashboard state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // drawer state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // drag state
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(
    null,
  );

  // handlers for category drag and drop
  const handleDragStartCategory = (e: React.DragEvent, id: string) => {
    setDraggedCategoryId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverCategory = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropCategory = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedCategoryId || draggedCategoryId === targetId) return;

    const newCats = [...categories];
    const draggedIdx = newCats.findIndex((c) => c.id === draggedCategoryId);
    const targetIdx = newCats.findIndex((c) => c.id === targetId);

    const [draggedCat] = newCats.splice(draggedIdx, 1);
    newCats.splice(targetIdx, 0, draggedCat);

    setCategories(newCats);
    setDraggedCategoryId(null);
  };

  // derived data
  const filteredItems = items.filter(
    (item) =>
      item.categoryId === selectedCategory &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const activeCategory = categories.find((c) => c.id === selectedCategory);

  // item save handler
  const handleSaveItem = () => {
    if (!editingItem) return;

    // check if it's a new item or an existing one
    const exists = items.some((i) => i.id === editingItem.id);
    if (exists) {
      setItems(items.map((i) => (i.id === editingItem.id ? editingItem : i)));
    } else {
      setItems([...items, editingItem]);
    }
    setEditingItem(null);
  };

  // create new item handler
  const handleCreateNewItem = () => {
    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      categoryId: selectedCategory,
      name: "New Menu Item",
      description: "Item description",
      price: "0.00",
      isAvailable: true,
      aiSynced: false,
      isBestseller: false,
      specialInstructionsEnabled: true,
      modifiersEnabled: false,
      modifiers: [],
      sizes: [],
    };
    setEditingItem(newItem);
  };

  return (
    <div className="min-h-screen bg-bg-primary p-4 md:p-8 font-inter relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* category navigator (sidebar) */}
        <aside className="lg:col-span-3 flex flex-col flex-shrink-0 border-4 border-white rounded-[32px] md:rounded-[40px] bg-white/30 backdrop-blur-md h-[85vh] shadow-xl overflow-hidden">
          <div className="p-6 pb-4 flex flex-col gap-4">
            <h3 className="h3 text-text-primary mb-2">Categories</h3>
            <Button
              variant="primary"
              className="w-full"
              leftIcon={<Plus size={18} />}
            >
              New Category
            </Button>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={18} className="text-text-secondary" />
              </div>
              <Input
                placeholder="Search categories..."
                className="pl-12 !py-2.5 rounded-xl !bg-white/60 !border-white/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  draggable
                  onDragStart={(e) => handleDragStartCategory(e, cat.id)}
                  onDragOver={handleDragOverCategory}
                  onDrop={(e) => handleDropCategory(e, cat.id)}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-300",
                    selectedCategory === cat.id
                      ? "bg-white shadow-md border border-white/60 transform scale-[1.02]"
                      : "hover:bg-white/40 border border-transparent",
                    draggedCategoryId === cat.id &&
                      "opacity-50 border-dashed border-2 border-brand-primary",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab text-text-secondary/50 hover:text-text-primary active:cursor-grabbing">
                      <GripVertical size={16} />
                    </div>
                    <span
                      className={cn(
                        "b2 font-bold transition-colors",
                        selectedCategory === cat.id
                          ? "text-text-primary"
                          : "text-text-primary/80",
                      )}
                    >
                      {cat.name}
                    </span>
                  </div>
                  {selectedCategory === cat.id && (
                    <ChevronRight size={18} className="text-brand-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* item dashboard (main panel) */}
        <main className="lg:col-span-9 flex flex-col min-w-0">
          <div className="bg-bg-primary border-4 border-white rounded-[32px] md:rounded-[40px] shadow-xl overflow-hidden flex flex-col h-[85vh] relative">
            {/* dashboard header */}
            <div className="p-6 md:p-8 flex-shrink-0 flex flex-col gap-6 border-b border-black/5 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="h2 text-text-primary">
                    {activeCategory?.name || "Items"}
                  </h2>
                  <p className="b1 text-text-secondary mt-1">
                    Manage items for this category
                  </p>
                </div>
                <Button
                  variant="accent"
                  onClick={handleCreateNewItem}
                  leftIcon={<Plus size={18} />}
                >
                  Add Item
                </Button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-text-secondary" />
                  </div>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search items..."
                    className="pl-12 !py-2.5 rounded-xl !bg-white/80"
                  />
                </div>

                <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl shadow-sm border border-black/5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      viewMode === "grid"
                        ? "bg-brand-primary text-white shadow-sm"
                        : "text-text-secondary hover:text-text-primary hover:bg-black/5",
                    )}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      viewMode === "list"
                        ? "bg-brand-primary text-white shadow-sm"
                        : "text-text-secondary hover:text-text-primary hover:bg-black/5",
                    )}
                  >
                    <ListIcon size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* dashboard content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-secondary opacity-70">
                  <ImageIcon size={48} className="mb-4 opacity-50" />
                  <p className="b2 font-bold">No items found</p>
                  <p className="b4">Add a new item to get started.</p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setEditingItem(item)}
                      className="bg-white rounded-[24px] border border-black/5 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer group flex flex-col"
                    >
                      <div className="aspect-video bg-black/5 flex items-center justify-center relative overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <ImageIcon size={32} className="text-black/20" />
                        )}
                        {!item.isAvailable && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                            <Badge color="secondary" variant="solid">
                              Unavailable
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="b2 font-bold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">
                            {item.name}
                          </h4>
                          <span className="font-bold text-brand-accent flex-shrink-0">
                            ₱{item.price}
                          </span>
                        </div>
                        <p className="b5 text-text-secondary line-clamp-2 mb-4 flex-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-auto">
                          {item.isBestseller && (
                            <Badge
                              color="accent"
                              variant="solid"
                              className="!text-[9px]"
                            >
                              Bestseller
                            </Badge>
                          )}
                          {item.aiSynced && (
                            <Badge
                              color="success"
                              variant="subtle"
                              className="!text-[9px]"
                            >
                              AI Synced
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setEditingItem(item)}
                      className="bg-white rounded-2xl border border-black/5 p-4 flex items-center gap-5 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="w-20 h-20 rounded-xl bg-black/5 flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <ImageIcon size={24} className="text-black/20" />
                        )}
                        {!item.isAvailable && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="b2 font-bold text-text-primary group-hover:text-brand-primary transition-colors truncate">
                            {item.name}
                          </h4>
                          {!item.isAvailable && (
                            <Badge
                              color="secondary"
                              variant="solid"
                              className="!text-[9px] py-0"
                            >
                              Unavailable
                            </Badge>
                          )}
                        </div>
                        <p className="b5 text-text-secondary truncate mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2">
                          {item.isBestseller && (
                            <Badge
                              color="accent"
                              variant="solid"
                              className="!text-[9px] py-0"
                            >
                              Bestseller
                            </Badge>
                          )}
                          {item.aiSynced && (
                            <Badge
                              color="success"
                              variant="subtle"
                              className="!text-[9px] py-0"
                            >
                              AI Synced
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="font-bold text-brand-accent text-lg flex-shrink-0 pl-4 border-l border-black/5">
                        ₱{item.price}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* slide-in drawer for item configuration */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm transition-opacity">
          {/* overlay background to close */}
          <div
            className="absolute inset-0"
            onClick={() => setEditingItem(null)}
          />

          <div className="w-full max-w-2xl h-full bg-bg-primary shadow-2xl flex flex-col relative animate-in slide-in-from-right duration-300">
            {/* close button */}
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/5 hover:bg-black/10 rounded-full text-text-primary transition-colors"
            >
              <X size={20} />
            </button>

            {/* header - the yellow banner builder */}
            <div className="bg-brand-secondary p-8 pt-12 flex-shrink-0 relative flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <button
                  onClick={() =>
                    setEditingItem({
                      ...editingItem,
                      isBestseller: !editingItem.isBestseller,
                    })
                  }
                  className="group outline-none"
                  title="Toggle Bestseller Badge"
                >
                  <Badge
                    color={editingItem.isBestseller ? "accent" : "primary"}
                    variant={editingItem.isBestseller ? "solid" : "subtle"}
                    shape="rounded"
                    className="uppercase font-bold transition-all group-hover:scale-105"
                  >
                    Bestseller
                  </Badge>
                </button>

                <Badge
                  color={editingItem.aiSynced ? "success" : "secondary"}
                  variant="solid"
                  shape="pill"
                  leftIcon={
                    editingItem.aiSynced ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Sparkles size={14} className="animate-pulse" />
                    )
                  }
                  className="shadow-sm mr-10"
                >
                  {editingItem.aiSynced ? "AI Synced" : "Syncing to Gemini..."}
                </Badge>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-6 w-full">
                <div className="flex flex-col gap-1 flex-1 w-full max-w-lg mt-2">
                  <Input
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    placeholder="Item Name"
                    className="!text-3xl md:!text-[38px] leading-none font-figtree font-bold !bg-transparent !border-transparent !p-0 !h-auto focus:!border-white/50 focus:!bg-white/20 transition-all placeholder:text-black/20 text-text-primary"
                  />
                  <Input
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description (e.g. ingredients)"
                    className="!text-sm md:!text-base font-inter !bg-transparent !border-transparent !p-0 mt-2 !h-auto focus:!border-white/50 focus:!bg-white/20 transition-all placeholder:text-black/20 text-text-primary/80"
                  />
                </div>

                {/* image upload placeholder */}
                <button className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-dashed border-black/10 bg-white/40 hover:bg-white/60 transition-all flex flex-col items-center justify-center gap-2 text-black/40 hover:text-brand-primary flex-shrink-0 group shadow-inner">
                  <ImageIcon
                    size={32}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4 leading-tight">
                    Upload Image
                    <br />
                    <span className="text-[8px] opacity-70 normal-case tracking-normal">
                      jpg, jpeg, png
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* body - options & modifiers builder */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-bg-primary pb-32 custom-scrollbar">
              {/* price & availability toggle */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-black/10">
                <div className="flex items-center gap-1">
                  <span className="text-brand-accent h3 font-bold">₱</span>
                  <Input
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="!text-2xl font-bold !text-brand-accent !bg-transparent !border-transparent !px-2 !py-0 !w-32 focus:!border-brand-accent/30 focus:!bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                    Available
                  </span>
                  <Toggle
                    isOn={editingItem.isAvailable}
                    onChange={(val) =>
                      setEditingItem({ ...editingItem, isAvailable: val })
                    }
                    variant="accent"
                  />
                </div>
              </div>

              {/* modifiers builder section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-text-secondary uppercase tracking-widest">
                      Modifiers
                    </h4>
                    <Badge
                      color="warning"
                      variant="outline"
                      shape="pill"
                      className="!text-[10px] uppercase font-bold border-warning-primary/30"
                    >
                      Choose any
                    </Badge>
                  </div>
                  <Toggle
                    isOn={editingItem.modifiersEnabled}
                    onChange={(val) =>
                      setEditingItem({
                        ...editingItem,
                        modifiersEnabled: val,
                      })
                    }
                    variant="primary"
                  />
                </div>

                {editingItem.modifiersEnabled ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-3">
                      {editingItem.modifiers.map((mod, index) => (
                        <div
                          key={mod.id}
                          className="flex items-start md:items-center gap-3 p-3 bg-white rounded-2xl border border-black/5 hover:border-black/10 transition-colors group shadow-sm"
                        >
                          <div className="cursor-grab text-black/20 hover:text-black/40 pt-2 md:pt-0 pl-1">
                            <GripVertical size={16} />
                          </div>
                          <div className="w-5 h-5 rounded flex-shrink-0 border-2 border-brand-primary mt-2 md:mt-0" />

                          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full min-w-0">
                            <div className="flex flex-col flex-1 gap-1 min-w-0">
                              <Input
                                value={mod.name}
                                onChange={(e) => {
                                  const newMods = [...editingItem.modifiers];
                                  newMods[index].name = e.target.value;
                                  setEditingItem({
                                    ...editingItem,
                                    modifiers: newMods,
                                  });
                                }}
                                placeholder="Modifier Name"
                                className="!bg-transparent !border-transparent !p-0 !h-auto !font-bold focus:!bg-gray-50 focus:!p-1 transition-all"
                              />
                              <Input
                                value={mod.description}
                                onChange={(e) => {
                                  const newMods = [...editingItem.modifiers];
                                  newMods[index].description = e.target.value;
                                  setEditingItem({
                                    ...editingItem,
                                    modifiers: newMods,
                                  });
                                }}
                                placeholder="Sub-description (optional)"
                                className="!bg-transparent !border-transparent !p-0 !h-auto !text-xs !text-text-secondary focus:!bg-gray-50 focus:!p-1 transition-all"
                              />
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0 self-end md:self-auto">
                              <span className="text-brand-accent font-bold text-sm">
                                +₱
                              </span>
                              <Input
                                value={mod.price}
                                onChange={(e) => {
                                  const newMods = [...editingItem.modifiers];
                                  newMods[index].price = e.target.value;
                                  setEditingItem({
                                    ...editingItem,
                                    modifiers: newMods,
                                  });
                                }}
                                placeholder="0.00"
                                className="!bg-transparent !border-transparent !p-0 !h-auto !w-16 !font-bold !text-brand-accent focus:!bg-gray-50 focus:!p-1 text-right transition-all"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              setEditingItem({
                                ...editingItem,
                                modifiers: editingItem.modifiers.filter(
                                  (m) => m.id !== mod.id,
                                ),
                              })
                            }
                            className="text-error-primary/30 hover:text-error-primary p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Modifier"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* add modifier from other items */}
                    <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl flex flex-col gap-3">
                      <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">
                        Link Existing Item as Modifier
                      </span>
                      <select
                        className="w-full p-3 rounded-xl bg-white border border-transparent focus:border-brand-primary outline-none text-sm font-medium text-text-primary shadow-sm"
                        onChange={(e) => {
                          if (!e.target.value) return;
                          const selectedItem = items.find(
                            (i) => i.id === e.target.value,
                          );
                          if (selectedItem) {
                            setEditingItem({
                              ...editingItem,
                              modifiers: [
                                ...editingItem.modifiers,
                                {
                                  id: `mod_${Date.now()}`,
                                  itemId: selectedItem.id,
                                  name: selectedItem.name,
                                  description: selectedItem.description,
                                  price: "0.00",
                                },
                              ],
                            });
                          }
                          e.target.value = ""; // reset select
                        }}
                      >
                        <option value="">
                          Select an item to add as a modifier...
                        </option>
                        {items
                          .filter((i) => i.id !== editingItem.id)
                          .map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name} (₱{i.price})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-dashed border-black/10 text-center text-text-secondary text-sm">
                    Modifiers are disabled for this item.
                  </div>
                )}
              </div>

              <div className="w-full h-px bg-black/10 my-8" />

              {/* sizes builder section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <h4 className="text-sm font-bold text-text-secondary uppercase tracking-widest">
                    Size Options
                  </h4>
                  <Badge
                    color="error"
                    variant="outline"
                    shape="pill"
                    className="!text-[10px] uppercase font-bold border-warning-primary/30"
                  >
                    Required
                  </Badge>
                </div>

                <div className="space-y-3">
                  {editingItem.sizes.map((size, index) => (
                    <div
                      key={size.id}
                      className="flex items-start md:items-center gap-3 p-3 bg-white rounded-2xl border border-black/5 hover:border-black/10 transition-colors group shadow-sm"
                    >
                      <div className="cursor-grab text-black/20 hover:text-black/40 pt-2 md:pt-0 pl-1">
                        <GripVertical size={16} />
                      </div>
                      <div className="w-5 h-5 rounded-full flex-shrink-0 border-2 border-brand-primary mt-2 md:mt-0 flex items-center justify-center">
                        {index === 1 && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                        )}
                      </div>

                      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full min-w-0">
                        <div className="flex flex-col flex-1 gap-1 min-w-0">
                          <Input
                            value={size.name}
                            onChange={(e) => {
                              const newSizes = [...editingItem.sizes];
                              newSizes[index].name = e.target.value;
                              setEditingItem({
                                ...editingItem,
                                sizes: newSizes,
                              });
                            }}
                            placeholder="Size Name"
                            className="!bg-transparent !border-transparent !p-0 !h-auto !font-bold focus:!bg-gray-50 focus:!p-1 transition-all"
                          />
                          <Input
                            value={size.description}
                            onChange={(e) => {
                              const newSizes = [...editingItem.sizes];
                              newSizes[index].description = e.target.value;
                              setEditingItem({
                                ...editingItem,
                                sizes: newSizes,
                              });
                            }}
                            placeholder="Sub-description (optional)"
                            className="!bg-transparent !border-transparent !p-0 !h-auto !text-xs !text-text-secondary focus:!bg-gray-50 focus:!p-1 transition-all"
                          />
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0 self-end md:self-auto">
                          <Input
                            value={size.price}
                            onChange={(e) => {
                              const newSizes = [...editingItem.sizes];
                              newSizes[index].price = e.target.value;
                              setEditingItem({
                                ...editingItem,
                                sizes: newSizes,
                              });
                            }}
                            placeholder="Free"
                            className={cn(
                              "!bg-transparent !border-transparent !p-0 !h-auto !w-20 !font-bold focus:!bg-gray-50 focus:!p-1 text-right transition-all",
                              size.price.toLowerCase() === "free"
                                ? "!text-success-primary"
                                : "!text-brand-accent",
                            )}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setEditingItem({
                            ...editingItem,
                            sizes: editingItem.sizes.filter(
                              (s) => s.id !== size.id,
                            ),
                          })
                        }
                        className="text-error-primary/30 hover:text-error-primary p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Size"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setEditingItem({
                        ...editingItem,
                        sizes: [
                          ...editingItem.sizes,
                          {
                            id: `size_${Date.now()}`,
                            name: "New Size",
                            description: "",
                            price: "Free",
                          },
                        ],
                      })
                    }
                    className="w-full border border-dashed border-black/10 hover:border-brand-primary hover:bg-brand-primary/5 text-text-secondary hover:text-brand-primary rounded-2xl py-3"
                  >
                    <Plus size={16} className="mr-2" /> Add Size
                  </Button>
                </div>
              </div>

              <div className="w-full h-px bg-black/10 my-8" />

              {/* special instructions setup */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-text-secondary uppercase tracking-widest">
                    Special Instructions
                  </h4>
                  <Toggle
                    isOn={editingItem.specialInstructionsEnabled}
                    onChange={(val) =>
                      setEditingItem({
                        ...editingItem,
                        specialInstructionsEnabled: val,
                      })
                    }
                    variant="primary"
                  />
                </div>
                {editingItem.specialInstructionsEnabled && (
                  <div className="w-full min-h-[100px] bg-white rounded-[20px] border border-black/5 shadow-sm p-4 text-text-secondary/50 text-sm italic animate-in fade-in slide-in-from-top-2 duration-300">
                    e.g., less sauce, extra spicy (Visual preview for the
                    customer)
                  </div>
                )}
              </div>
            </div>

            {/* sticky action footer */}
            <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 bg-bg-primary/90 backdrop-blur-md border-t border-white flex justify-center z-10">
              <Button
                variant="accent"
                size="lg"
                onClick={handleSaveItem}
                className="w-full max-w-sm rounded-full font-bold shadow-xl"
              >
                Save Item Configuration
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* scrollbar styling matching other pages */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.2);
        }
      `,
        }}
      />
    </div>
  );
};

export default MenuCategoryManagement;
