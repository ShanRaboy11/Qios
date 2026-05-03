"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { Badge } from "@/components/atoms/Badge";
import { Dropdown } from "@/components/molecules/Dropdown";
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
  addonsEnabled: boolean;
  addons: Modifier[];
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
    addonsEnabled: true,
    addons: [
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
    addonsEnabled: false,
    addons: [],
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
    addonsEnabled: false,
    addons: [],
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
  const [originalItem, setOriginalItem] = useState<MenuItem | null>(null);
  const [draftItem, setDraftItem] = useState<MenuItem | null>(null);

  // drag state
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(
    null
  );

  // crop modal state
  const [cropModalImage, setCropModalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const activeCategory = categories.find((c) => c.id === selectedCategory);

  const hasChanges =
    JSON.stringify(originalItem) !== JSON.stringify(draftItem);

  // drawer handlers
  const handleOpenDrawer = (item: MenuItem) => {
    setOriginalItem(item);
    setDraftItem(JSON.parse(JSON.stringify(item)));
  };

  const handleCloseDrawer = () => {
    setOriginalItem(null);
    setDraftItem(null);
  };

  const handleSaveItem = () => {
    if (!draftItem) return;

    const exists = items.some((i) => i.id === draftItem.id);
    if (exists) {
      setItems(items.map((i) => (i.id === draftItem.id ? draftItem : i)));
    } else {
      setItems([...items, draftItem]);
    }
    handleCloseDrawer();
  };

  const handleCreateNewItem = () => {
    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      categoryId: selectedCategory,
      name: "",
      description: "",
      price: "",
      isAvailable: true,
      aiSynced: false,
      addonsEnabled: false,
      addons: [],
      sizes: [],
    };
    handleOpenDrawer(newItem);
  };

  const updateDraft = (field: keyof MenuItem, value: any) => {
    if (!draftItem) return;
    setDraftItem({ ...draftItem, [field]: value });
  };

  // image handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCropModalImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmImageCrop = () => {
    if (cropModalImage) {
      updateDraft("image", cropModalImage);
    }
    setCropModalImage(null);
  };

  // formatting options for the addon dropdown
  const dropdownOptions = items
    .filter((i) => i.id !== draftItem?.id)
    .map((i) => ({ label: `${i.name} (₱${i.price})`, value: i.id }));

  return (
    <div className="min-h-screen bg-bg-primary p-4 md:p-8 font-inter relative overflow-hidden flex flex-col">
      <div className="flex flex-1 gap-6 md:gap-8 max-w-[1400px] mx-auto w-full relative">
        {/* left side: dashboard (60% or 100%) */}
        <div
          className={cn(
            "flex-1 transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8",
            draftItem && "opacity-50 blur-[2px] pointer-events-none lg:max-w-[60%]"
          )}
        >
          {/* category navigator (sidebar) */}
          <aside
            className={cn(
              "flex flex-col border-4 border-white rounded-[32px] md:rounded-[40px] bg-white/30 backdrop-blur-md shadow-xl overflow-hidden h-[85vh]",
              draftItem ? "lg:col-span-4" : "lg:col-span-3"
            )}
          >
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
                        "opacity-50 border-dashed border-2 border-brand-primary"
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
                            : "text-text-primary/80"
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
          <main
            className={cn(
              "flex flex-col min-w-0 border-4 border-white rounded-[32px] md:rounded-[40px] shadow-xl overflow-hidden relative h-[85vh]",
              draftItem ? "lg:col-span-8" : "lg:col-span-9"
            )}
          >
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
                        : "text-text-secondary hover:text-text-primary hover:bg-black/5"
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
                        : "text-text-secondary hover:text-text-primary hover:bg-black/5"
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
                      onClick={() => handleOpenDrawer(item)}
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
                      onClick={() => handleOpenDrawer(item)}
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
          </main>
        </div>

        {/* right side: drawer (40% flush right, rounded left corners) */}
        {draftItem && (
          <div className="fixed inset-y-0 right-0 w-full lg:w-[40%] bg-bg-primary shadow-2xl rounded-l-[40px] rounded-r-none flex flex-col animate-in slide-in-from-right duration-500 z-50 overflow-hidden border-4 border-r-0 border-white">
            {/* drawer header */}
            <div className="bg-brand-secondary p-8 flex-shrink-0 relative flex flex-col gap-4">
              <button
                onClick={handleCloseDrawer}
                className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full text-text-primary transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3">
                <Badge
                  color={draftItem.aiSynced ? "success" : "secondary"}
                  variant="solid"
                  shape="pill"
                  leftIcon={
                    draftItem.aiSynced ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Sparkles size={14} className="animate-pulse" />
                    )
                  }
                  className="shadow-sm mt-4"
                >
                  {draftItem.aiSynced ? "AI Synced" : "Syncing to Gemini..."}
                </Badge>
              </div>
            </div>

            {/* drawer body - form layout */}
            <div className="flex-1 overflow-y-auto p-8 bg-bg-primary custom-scrollbar flex flex-col gap-6">
              
              {/* image upload form */}
              <div>
                <label className="b4 font-bold text-text-secondary uppercase tracking-widest block mb-2">
                  Item Image
                </label>
                <div
                  className="w-full aspect-video rounded-2xl border-2 border-dashed border-black/10 bg-white/40 hover:bg-white/60 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative shadow-inner"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {draftItem.image ? (
                    <img
                      src={draftItem.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <>
                      <ImageIcon
                        size={32}
                        className="text-black/20 group-hover:text-brand-primary transition-colors mb-2"
                      />
                      <span className="b4 font-bold text-text-secondary uppercase">
                        Click to upload
                      </span>
                      <span className="text-[10px] text-text-secondary/60 mt-1">
                        jpg, jpeg, png
                      </span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleImageSelect}
                />
              </div>

              {/* name & description form */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="b4 font-bold text-text-secondary uppercase tracking-widest block mb-2">
                    Item Name
                  </label>
                  <Input
                    value={draftItem.name}
                    onChange={(e) => updateDraft("name", e.target.value)}
                    placeholder="e.g. Chicken Adobo"
                    className="bg-white/80 !py-2.5 shadow-sm border border-black/5"
                  />
                </div>
                <div>
                  <label className="b4 font-bold text-text-secondary uppercase tracking-widest block mb-2">
                    Description
                  </label>
                  <Input
                    value={draftItem.description}
                    onChange={(e) => updateDraft("description", e.target.value)}
                    placeholder="Brief description"
                    className="bg-white/80 !py-2.5 shadow-sm border border-black/5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="b4 font-bold text-text-secondary uppercase tracking-widest block mb-2">
                      Price (₱)
                    </label>
                    <Input
                      type="number"
                      value={draftItem.price}
                      onChange={(e) => updateDraft("price", e.target.value)}
                      placeholder="0.00"
                      className="bg-white/80 !py-2.5 shadow-sm border border-black/5"
                    />
                  </div>
                  <div>
                    <label className="b4 font-bold text-text-secondary uppercase tracking-widest block mb-2">
                      Availability
                    </label>
                    <div className="h-[46px] flex items-center bg-white/80 rounded-xl px-4 shadow-sm border border-black/5">
                      <Toggle
                        isOn={draftItem.isAvailable}
                        onChange={(val) => updateDraft("isAvailable", val)}
                        variant="accent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-black/10 my-2" />

              {/* sizes form section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="b4 font-bold text-text-secondary uppercase tracking-widest">
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
                  {draftItem.sizes.map((size, index) => (
                    <div
                      key={size.id}
                      className="flex items-start gap-2 p-3 bg-white/80 rounded-2xl border border-black/5 shadow-sm group"
                    >
                      <div className="flex-1 flex flex-col gap-2">
                        <Input
                          value={size.name}
                          onChange={(e) => {
                            const newSizes = [...draftItem.sizes];
                            newSizes[index].name = e.target.value;
                            updateDraft("sizes", newSizes);
                          }}
                          placeholder="Size Name"
                          className="!py-1.5"
                        />
                        <div className="flex gap-2">
                          <Input
                            value={size.description}
                            onChange={(e) => {
                              const newSizes = [...draftItem.sizes];
                              newSizes[index].description = e.target.value;
                              updateDraft("sizes", newSizes);
                            }}
                            placeholder="Description (optional)"
                            className="!py-1.5 flex-1"
                          />
                          <Input
                            value={size.price}
                            onChange={(e) => {
                              const newSizes = [...draftItem.sizes];
                              newSizes[index].price = e.target.value;
                              updateDraft("sizes", newSizes);
                            }}
                            placeholder="Free"
                            className="!py-1.5 w-20 text-right"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          updateDraft(
                            "sizes",
                            draftItem.sizes.filter((s) => s.id !== size.id)
                          )
                        }
                        className="text-error-primary/30 hover:text-error-primary p-2 transition-colors mt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    onClick={() =>
                      updateDraft("sizes", [
                        ...draftItem.sizes,
                        {
                          id: `size_${Date.now()}`,
                          name: "",
                          description: "",
                          price: "",
                        },
                      ])
                    }
                    className="w-full border border-dashed border-black/10 hover:border-brand-primary hover:bg-brand-primary/5 text-text-secondary hover:text-brand-primary rounded-2xl py-3 mt-2"
                  >
                    <Plus size={16} className="mr-2" /> Add Size
                  </Button>
                </div>
              </div>

              <div className="w-full h-px bg-black/10 my-2" />

              {/* add-ons form section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h4 className="b4 font-bold text-text-secondary uppercase tracking-widest">
                      Add-ons
                    </h4>
                    <Badge
                      color="warning"
                      variant="outline"
                      shape="pill"
                      className="!text-[10px] uppercase font-bold border-warning-primary/30"
                    >
                      Optional
                    </Badge>
                  </div>
                  <Toggle
                    isOn={draftItem.addonsEnabled}
                    onChange={(val) => updateDraft("addonsEnabled", val)}
                    variant="primary"
                  />
                </div>

                {draftItem.addonsEnabled && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="space-y-3">
                      {draftItem.addons.map((addon, index) => (
                        <div
                          key={addon.id}
                          className="flex items-start gap-2 p-3 bg-white/80 rounded-2xl border border-black/5 shadow-sm group"
                        >
                          <div className="flex-1 flex flex-col gap-2">
                            <Input
                              value={addon.name}
                              onChange={(e) => {
                                const newAddons = [...draftItem.addons];
                                newAddons[index].name = e.target.value;
                                updateDraft("addons", newAddons);
                              }}
                              placeholder="Add-on Name"
                              className="!py-1.5"
                            />
                            <div className="flex gap-2">
                              <Input
                                value={addon.description}
                                onChange={(e) => {
                                  const newAddons = [...draftItem.addons];
                                  newAddons[index].description = e.target.value;
                                  updateDraft("addons", newAddons);
                                }}
                                placeholder="Description (optional)"
                                className="!py-1.5 flex-1"
                              />
                              <Input
                                value={addon.price}
                                onChange={(e) => {
                                  const newAddons = [...draftItem.addons];
                                  newAddons[index].price = e.target.value;
                                  updateDraft("addons", newAddons);
                                }}
                                placeholder="+₱0.00"
                                className="!py-1.5 w-20 text-right"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              updateDraft(
                                "addons",
                                draftItem.addons.filter((m) => m.id !== addon.id)
                              )
                            }
                            className="text-error-primary/30 hover:text-error-primary p-2 transition-colors mt-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* add-on dropdown linking */}
                    <div className="p-4 bg-black/5 rounded-2xl flex flex-col gap-3">
                      <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                        Link Existing Menu Item
                      </span>
                      <Dropdown
                        label=""
                        placeholder="Select item to link as add-on..."
                        value=""
                        options={dropdownOptions}
                        onSelect={(opt) => {
                          const selectedItem = items.find(
                            (i) => i.id === opt.value
                          );
                          if (selectedItem) {
                            updateDraft("addons", [
                              ...draftItem.addons,
                              {
                                id: `addon_${Date.now()}`,
                                itemId: selectedItem.id,
                                name: selectedItem.name,
                                description: selectedItem.description,
                                price: selectedItem.price,
                              },
                            ]);
                          }
                        }}
                        className="bg-white max-w-none shadow-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* sticky save / discard footer */}
            <div className="p-6 border-t-2 border-white/50 flex flex-col sm:flex-row items-center justify-end gap-3 flex-shrink-0 bg-white/80 backdrop-blur-md z-10">
              {hasChanges && (
                <div className="flex flex-col mr-auto">
                  <span className="b2 font-bold text-text-primary">
                    Unsaved changes
                  </span>
                  <span className="b4 text-text-secondary">Modified item configuration</span>
                </div>
              )}
              {hasChanges && (
                <Button
                  variant="ghost"
                  onClick={() => setDraftItem(JSON.parse(JSON.stringify(originalItem)))}
                  className="text-warning-primary hover:bg-warning-secondary w-full sm:w-auto"
                >
                  Discard
                </Button>
              )}
              <Button
                variant={hasChanges ? "primary" : "ghost"}
                onClick={handleSaveItem}
                disabled={!hasChanges}
                className={cn(!hasChanges && "opacity-50", "w-full sm:w-auto")}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* image crop modal */}
      {cropModalImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-bg-primary rounded-[32px] p-6 md:p-8 max-w-lg w-full flex flex-col gap-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div>
              <h3 className="h3 text-text-primary">Adjust Image</h3>
              <p className="b1 text-text-secondary mt-1">
                Crop or re-center your menu item image.
              </p>
            </div>
            
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center group cursor-move">
              <img
                src={cropModalImage}
                className="w-full h-full object-cover scale-110"
                alt="Crop preview"
              />
              {/* 3x3 mock crop grid overlay */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-white/40 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
                  ></div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setCropModalImage(null)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmImageCrop}>
                Confirm & Save
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
