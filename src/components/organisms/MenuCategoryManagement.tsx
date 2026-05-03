"use client";

import React, { useState, useRef, useEffect } from "react";
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
  ChevronDown,
  ZoomIn,
  ZoomOut,
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

  // dropdown state for linking existing items
  const [isLinkDropdownOpen, setIsLinkDropdownOpen] = useState(false);

  // drag state
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(
    null,
  );

  // crop modal state
  const [cropModalImage, setCropModalImage] = useState<string | null>(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropPan, setCropPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isLinkDropdownOpen) setIsLinkDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isLinkDropdownOpen]);

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

  const hasChanges = JSON.stringify(originalItem) !== JSON.stringify(draftItem);

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

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (val: string) => void,
  ) => {
    const val = e.target.value;
    if (val === "" || /^\\d*\\.?\\d*$/.test(val)) {
      callback(val);
    }
  };

  // image handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropModalImage(e.target?.result as string);
        setCropScale(1);
        setCropPan({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmImageCrop = () => {
    if (cropModalImage) {
      // In a real app, we'd apply a canvas crop here using scale/pan state.
      // For the UI demo, we save the image.
      updateDraft("image", cropModalImage);
    }
    setCropModalImage(null);
  };

  // crop interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - cropPan.x, y: e.clientY - cropPan.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCropPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };
  const handleMouseUp = () => setIsDragging(false);

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
            draftItem &&
              "opacity-50 blur-[2px] pointer-events-none select-none overflow-hidden lg:max-w-[60%]",
          )}
        >
          {/* category navigator (sidebar) */}
          <aside
            className={cn(
              "flex flex-col border-4 border-white rounded-[32px] md:rounded-[40px] bg-white/30 backdrop-blur-md shadow-xl overflow-hidden h-[85vh]",
              draftItem ? "lg:col-span-4" : "lg:col-span-3",
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
          <main
            className={cn(
              "flex flex-col min-w-0 border-4 border-white rounded-[32px] md:rounded-[40px] shadow-xl overflow-hidden relative h-[85vh]",
              draftItem ? "lg:col-span-8" : "lg:col-span-9",
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
            {/* drawer header - reduced padding */}
            <div className="bg-brand-secondary p-5 flex-shrink-0 relative flex flex-col gap-2">
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
                  className="shadow-sm mt-2"
                >
                  {draftItem.aiSynced ? "AI Synced" : "Syncing to Gemini..."}
                </Badge>
              </div>
            </div>

            {/* drawer body - compact form layout */}
            <div className="flex-1 overflow-y-auto p-6 bg-bg-primary custom-scrollbar flex flex-col gap-8">
              {/* compact top section: image + core info */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* 1:1 image upload */}
                <div className="flex flex-col gap-2 w-32 flex-shrink-0">
                  <div
                    className="w-32 h-32 rounded-2xl border-2 border-dashed border-black/10 bg-white/40 hover:bg-white/60 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative shadow-inner"
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
                          size={24}
                          className="text-black/20 group-hover:text-brand-primary transition-colors mb-1"
                        />
                        <span className="text-[10px] font-bold text-text-secondary uppercase">
                          Upload
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-[9px] font-medium text-text-secondary/60 text-center uppercase tracking-wider">
                    Max 5MB (JPG, PNG)
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleImageSelect}
                  />
                </div>

                {/* right side info */}
                <div className="flex-1 flex flex-col gap-4 w-full">
                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest block mb-1">
                      Item Name
                    </label>
                    <Input
                      value={draftItem.name}
                      onChange={(e) => updateDraft("name", e.target.value)}
                      placeholder="e.g. Chicken Adobo"
                      className="bg-white/80"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex justify-between mb-1">
                      <span>Description</span>
                      <span className="text-black/40 normal-case font-medium">
                        {draftItem.description.length}/150
                      </span>
                    </label>
                    <textarea
                      value={draftItem.description}
                      onChange={(e) => {
                        if (e.target.value.length <= 150) {
                          updateDraft("description", e.target.value);
                        }
                      }}
                      placeholder="Brief description"
                      className="w-full bg-white/80 border-2 border-[#E5E5E5] rounded-xl p-3 text-sm focus:border-brand-primary outline-none transition-colors resize-none h-20 custom-scrollbar shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest block mb-1">
                        Price (₱)
                      </label>
                      <Input
                        value={draftItem.price}
                        onChange={(e) =>
                          handleNumberInput(e, (val) =>
                            updateDraft("price", val),
                          )
                        }
                        inputMode="decimal"
                        placeholder="0.00"
                        className="bg-white/80"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest block mb-1">
                        Availability
                      </label>
                      <div className="flex items-center h-[42px]">
                        <Toggle
                          isOn={draftItem.isAvailable}
                          onChange={(val) => updateDraft("isAvailable", val)}
                          variant="accent"
                        />
                        <span className="ml-3 text-sm font-medium text-text-secondary">
                          {draftItem.isAvailable ? "Available" : "Hidden"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-black/10" />

              {/* sizes form section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
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
                          <div className="relative w-32">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">
                              ₱
                            </span>
                            <Input
                              value={size.price}
                              onChange={(e) => {
                                const newSizes = [...draftItem.sizes];
                                const val = e.target.value;
                                if (val === "" || /^\\d*\\.?\\d*$/.test(val)) {
                                  newSizes[index].price = val;
                                  updateDraft("sizes", newSizes);
                                }
                              }}
                              inputMode="decimal"
                              placeholder="0.00"
                              className="!py-1.5 w-full pl-7"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          updateDraft(
                            "sizes",
                            draftItem.sizes.filter((s) => s.id !== size.id),
                          )
                        }
                        className="p-2 text-text-secondary hover:text-white hover:bg-error-primary rounded-xl transition-colors mt-1"
                      >
                        <Trash2 size={18} />
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

              <div className="w-full h-px bg-black/10" />

              {/* add-ons form section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-text-secondary uppercase tracking-widest">
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
                              <div className="relative w-32">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">
                                  +₱
                                </span>
                                <Input
                                  value={addon.price}
                                  onChange={(e) => {
                                    const newAddons = [...draftItem.addons];
                                    const val = e.target.value;
                                    if (
                                      val === "" ||
                                      /^\\d*\\.?\\d*$/.test(val)
                                    ) {
                                      newAddons[index].price = val;
                                      updateDraft("addons", newAddons);
                                    }
                                  }}
                                  inputMode="decimal"
                                  placeholder="0.00"
                                  className="!py-1.5 w-full pl-8 text-right"
                                />
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              updateDraft(
                                "addons",
                                draftItem.addons.filter(
                                  (m) => m.id !== addon.id,
                                ),
                              )
                            }
                            className="p-2 text-text-secondary hover:text-white hover:bg-error-primary rounded-xl transition-colors mt-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* add-on actions */}
                    <div className="flex gap-3 mt-2">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          updateDraft("addons", [
                            ...draftItem.addons,
                            {
                              id: `addon_${Date.now()}`,
                              itemId: "",
                              name: "",
                              description: "",
                              price: "",
                            },
                          ])
                        }
                        className="flex-1 border border-dashed border-black/10 hover:border-brand-primary hover:bg-brand-primary/5 text-text-secondary hover:text-brand-primary rounded-2xl py-3"
                      >
                        <Plus size={16} className="mr-2" /> Create New
                      </Button>

                      <div
                        className="flex-1 relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setIsLinkDropdownOpen(!isLinkDropdownOpen)
                          }
                          className={cn(
                            "w-full border border-dashed rounded-2xl py-3 transition-colors",
                            isLinkDropdownOpen
                              ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                              : "border-black/10 hover:border-brand-primary hover:bg-brand-primary/5 text-text-secondary hover:text-brand-primary",
                          )}
                        >
                          Link Menu Item{" "}
                          <ChevronDown
                            size={16}
                            className={cn(
                              "ml-2 transition-transform duration-300",
                              isLinkDropdownOpen && "rotate-180",
                            )}
                          />
                        </Button>

                        {/* Flexible Dropdown List (User Snippet Based) */}
                        {isLinkDropdownOpen && (
                          <div
                            className={cn(
                              "absolute top-[calc(100%+8px)] left-0 z-50 bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 w-full",
                            )}
                          >
                            <ul className="max-h-[240px] overflow-y-auto custom-scrollbar py-1">
                              {dropdownOptions.length === 0 ? (
                                <li className="px-4 py-4 text-sm text-text-secondary text-center">
                                  No items available
                                </li>
                              ) : (
                                dropdownOptions.map((option, index) => (
                                  <li
                                    key={option.value}
                                    onClick={() => {
                                      const selectedItem = items.find(
                                        (i) => i.id === option.value,
                                      );
                                      if (selectedItem) {
                                        updateDraft("addons", [
                                          ...draftItem.addons,
                                          {
                                            id: `addon_${Date.now()}`,
                                            itemId: selectedItem.id,
                                            name: selectedItem.name,
                                            description:
                                              selectedItem.description,
                                            price: selectedItem.price,
                                          },
                                        ]);
                                      }
                                      setIsLinkDropdownOpen(false);
                                    }}
                                    className={cn(
                                      "cursor-pointer transition-colors px-4 py-3 text-sm hover:bg-slate-50 border-b border-black/5 last:border-0",
                                      "text-text-primary font-medium",
                                    )}
                                  >
                                    {option.label}
                                  </li>
                                ))
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
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
                  <span className="b4 text-text-secondary">
                    Modified item configuration
                  </span>
                </div>
              )}
              {hasChanges && (
                <Button
                  variant="ghost"
                  onClick={() =>
                    setDraftItem(JSON.parse(JSON.stringify(originalItem)))
                  }
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
          <div className="bg-bg-primary rounded-[32px] p-6 md:p-8 max-w-lg w-full flex flex-col gap-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div>
              <h3 className="h3 text-text-primary">Adjust Image</h3>
              <p className="b1 text-text-secondary mt-1">
                Zoom, crop, or re-center your menu item image.
              </p>
            </div>

            <div
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center group cursor-move shadow-inner"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={cropModalImage}
                style={{
                  transform: `translate(${cropPan.x}px, ${cropPan.y}px) scale(${cropScale})`,
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                }}
                className="w-full h-full object-cover origin-center pointer-events-none"
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

            {/* zoom controls */}
            <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-white">
              <ZoomOut size={18} className="text-text-secondary" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={cropScale}
                onChange={(e) => setCropScale(parseFloat(e.target.value))}
                className="flex-1 accent-brand-primary"
              />
              <ZoomIn size={18} className="text-text-secondary" />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setCropModalImage(null)}>
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
