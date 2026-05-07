"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { Badge } from "@/components/atoms/Badge";
import { Checkbox } from "@/components/atoms/Checkbox";
import {
  GripVertical,
  Plus,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Trash2,
  Search,
  LayoutGrid,
  List as ListIcon,
  X,
  ChevronDown,
  ChevronUp,
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
      { id: "s1", name: "Regular", description: "Good for 1", price: "0.00" },
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["1"]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // dashboard state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

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
  const [imageNativeSize, setImageNativeSize] = useState({ w: 1, h: 1 });
  const [cropScale, setCropScale] = useState(1);
  const [cropPan, setCropPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // container size for crop bounds checking
  const CROP_CONTAINER_SIZE = 320;

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
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

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const newCat: Category = {
        id: `cat_${Date.now()}`,
        name: newCategoryName.trim(),
      };
      setCategories([...categories, newCat]);
      setExpandedCategories([...expandedCategories, newCat.id]);
    }
    setNewCategoryName("");
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newCats = categories.filter((c) => c.id !== id);
    setCategories(newCats);
    // optionally delete all items in this category
    setItems((prev) => prev.filter((i) => i.categoryId !== id));
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  // derived data
  const hasChanges = JSON.stringify(originalItem) !== JSON.stringify(draftItem);

  const isValidDraft =
    draftItem?.name?.trim() !== "" &&
    draftItem?.price?.trim() !== "" &&
    !!draftItem?.image &&
    draftItem?.sizes.every(
      (s) => s.name.trim() !== "" && s.price.trim() !== "",
    ) &&
    (!draftItem?.addonsEnabled ||
      draftItem?.addons.every(
        (a) => a.name.trim() !== "" && a.price.trim() !== "",
      ));

  // selection handlers
  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const deleteSelectedItems = () => {
    setItems((prev) => prev.filter((i) => !selectedItems.includes(i.id)));
    setSelectedItems([]);
  };

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
    if (!draftItem || !isValidDraft) return;

    const exists = items.some((i) => i.id === draftItem.id);
    if (exists) {
      setItems(items.map((i) => (i.id === draftItem.id ? draftItem : i)));
    } else {
      setItems([...items, draftItem]);
    }
    handleCloseDrawer();
  };

  const handleCreateNewItem = (categoryId: string) => {
    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      categoryId,
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
    // ensure the category is expanded if they click add item (just in case)
    if (!expandedCategories.includes(categoryId)) {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
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
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
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
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        const img = new window.Image();
        img.onload = () => {
          setImageNativeSize({ w: img.width, h: img.height });
          setCropModalImage(src);
          setCropScale(1);
          setCropPan({ x: 0, y: 0 });
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // crop mathematical bounds & rendering
  const coverScale = Math.max(
    CROP_CONTAINER_SIZE / imageNativeSize.w,
    CROP_CONTAINER_SIZE / imageNativeSize.h,
  );
  const renderedWidth = imageNativeSize.w * coverScale;
  const renderedHeight = imageNativeSize.h * coverScale;
  const maxPanX = Math.max(
    0,
    (renderedWidth * cropScale - CROP_CONTAINER_SIZE) / 2,
  );
  const maxPanY = Math.max(
    0,
    (renderedHeight * cropScale - CROP_CONTAINER_SIZE) / 2,
  );

  // automatically restrict bounds if zooming out
  useEffect(() => {
    setCropPan((prev) => ({
      x: Math.max(-maxPanX, Math.min(maxPanX, prev.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, prev.y)),
    }));
  }, [cropScale, maxPanX, maxPanY]);

  const confirmImageCrop = () => {
    if (cropModalImage) {
      const canvas = document.createElement("canvas");
      // high res output for quality
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");

      const img = new window.Image();
      img.onload = () => {
        if (!ctx) return;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const outScale = canvas.width / CROP_CONTAINER_SIZE;

        // mirror css transform: origin center, apply pan, apply scale
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.translate(cropPan.x * outScale, cropPan.y * outScale);
        ctx.scale(cropScale, cropScale);

        const drawW = renderedWidth * outScale;
        const drawH = renderedHeight * outScale;
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        updateDraft("image", dataUrl);
        setCropModalImage(null);
      };
      img.src = cropModalImage;
    }
  };

  // crop interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - cropPan.x, y: e.clientY - cropPan.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const nextX = e.clientX - dragStart.current.x;
    const nextY = e.clientY - dragStart.current.y;

    setCropPan({
      x: Math.max(-maxPanX, Math.min(maxPanX, nextX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, nextY)),
    });
  };
  const handleMouseUp = () => setIsDragging(false);

  // formatting options for the addon dropdown
  const dropdownOptions = items
    .filter((i) => i.id !== draftItem?.id)
    .map((i) => ({ label: `${i.name} (₱${i.price})`, value: i.id }));

  return (
    <div className="font-inter relative flex flex-col w-full">
      <div className="flex flex-col w-full relative">
        {/* left side: dashboard (100% or 60% when drawer open) */}
        <div
          className={cn(
            "flex-1 transition-all duration-500 w-full",
            draftItem &&
              "opacity-50 blur-[2px] pointer-events-none select-none lg:max-w-[60%]",
          )}
        >
          {draftItem && (
            <>
              <div
                className="absolute inset-0 z-40 bg-transparent pointer-events-auto cursor-default"
                onClick={(e) => e.stopPropagation()}
              />
              <style>{`
                nav { display: none !important; }
              `}</style>
            </>
          )}

          {/* item dashboard (main panel) */}
          <main className="flex flex-col min-w-0 w-full">
            {/* dashboard tools */}
            <div className="flex-shrink-0 flex flex-col gap-6 mb-6">

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md w-full">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-text-secondary" />
                  </div>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search all items"
                    className="pl-12 !py-2.5 rounded-xl !bg-white/80 b2 w-full"
                  />
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="sm:hidden flex-1 justify-center b3 py-2 h-auto"
                  >
                    <Plus size={18} className="mr-1" /> Create Category
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="hidden sm:flex b3"
                    leftIcon={<Plus size={18} />}
                  >
                    Create Category
                  </Button>
                  <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl shadow-sm border border-black/5 flex-shrink-0">
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
            </div>

            {/* dashboard accordion content */}
            <div
              className={cn(
                "flex-1 custom-scrollbar",
                draftItem ? "overflow-hidden" : "",
              )}
            >
              {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-secondary opacity-70">
                  <ImageIcon size={48} className="mb-4 opacity-50" />
                  <p className="b2 font-bold">No categories found</p>
                  <p className="b4">Create a new category to get started.</p>
                </div>
              ) : (
                categories.map((cat) => {
                  const catItems = items.filter(
                    (i) =>
                      i.categoryId === cat.id &&
                      i.name.toLowerCase().includes(searchQuery.toLowerCase()),
                  );
                  const isExpanded = expandedCategories.includes(cat.id);

                  // if searching and this category has no matches, we can optionally hide it
                  if (searchQuery && catItems.length === 0) return null;

                  return (
                    <div
                      key={cat.id}
                      draggable
                      onDragStart={(e) => handleDragStartCategory(e, cat.id)}
                      onDragOver={handleDragOverCategory}
                      onDrop={(e) => handleDropCategory(e, cat.id)}
                      className={cn(
                        "bg-white rounded-[24px] border border-[#E5E5E5] mb-6 shadow-sm transition-all text-left group/accordion",
                        draggedCategoryId === cat.id &&
                          "opacity-50 border-dashed border-2 border-brand-primary",
                      )}
                    >
                      {/* accordion header */}
                      <div
                        onClick={() => toggleCategory(cat.id)}
                        className={cn(
                          "p-4 md:px-6 md:py-4 flex flex-col md:flex-row items-start overflow-hidden md:items-center justify-between cursor-pointer transition-colors gap-4 md:gap-0 bg-brand-secondary/70",
                          isExpanded
                            ? "rounded-t-[24px] border-b border-[#E5E5E5]"
                            : "rounded-[24px]",
                        )}
                      >
                        {/* mobile layout */}
                        <div className="flex md:hidden flex-col w-full gap-1">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <div className="cursor-grab text-text-secondary/30 hover:text-text-primary active:cursor-grabbing">
                                <GripVertical size={20} />
                              </div>
                              <h3 className="text-xl font-extrabold text-text-primary leading-tight">
                                {cat.name}
                              </h3>
                            </div>
                            <div
                              className="flex items-center gap-1 shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleCreateNewItem(cat.id)}
                                className="w-8 h-8 flex items-center justify-center text-brand-accent bg-brand-accent/10 rounded-lg transition-colors"
                              >
                                <Plus size={18} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteCategory(e, cat.id)}
                                className="w-8 h-8 flex items-center justify-center text-warning-primary bg-warning-primary/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between w-full pl-7">
                            <Badge
                              color="secondary"
                              variant="subtle"
                              shape="pill"
                              className="w-fit text-[11px] font-bold px-3 py-1"
                            >
                              {
                                items.filter((i) => i.categoryId === cat.id)
                                  .length
                              }{" "}
                              Items
                            </Badge>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategory(cat.id);
                              }}
                              className="p-1 cursor-pointer"
                            >
                              <ChevronDown
                                className={cn(
                                  "text-text-secondary transition-transform duration-300",
                                  isExpanded && "rotate-180",
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {/* desktop layout */}
                        <div className="hidden md:flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                          <div className="flex items-center gap-3">
                            <div className="cursor-grab text-text-secondary/30 hover:text-text-primary active:cursor-grabbing mr-1">
                              <GripVertical size={20} />
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                              <h3 className="text-xl font-extrabold text-text-primary leading-tight">
                                {cat.name}
                              </h3>
                              <Badge
                                color="secondary"
                                variant="subtle"
                                shape="pill"
                                className="w-fit text-[11px] font-bold px-3 py-1"
                              >
                                {
                                  items.filter((i) => i.categoryId === cat.id)
                                    .length
                                }{" "}
                                Items
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div
                          className="hidden md:flex items-center gap-3 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateNewItem(cat.id);
                            }}
                            className="px-3 py-1.5 flex items-center gap-2 text-brand-accent hover:bg-brand-accent/10 rounded-xl transition-colors b3"
                            title="Add Item"
                          >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add Item</span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteCategory(e, cat.id)}
                            className="p-2 text-warning-primary hover:bg-warning-primary/10 rounded-xl transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="w-px h-6 bg-black/10 mx-1" />
                          <div
                            onClick={() => toggleCategory(cat.id)}
                            className="p-1 cursor-pointer"
                          >
                            <ChevronDown
                              className={cn(
                                "text-text-secondary transition-transform duration-300",
                                isExpanded && "rotate-180",
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* accordion body */}
                      {isExpanded && (
                        <div className="p-6 bg-slate-50/50 rounded-b-[24px] animate-in fade-in slide-in-from-top-2 duration-200">
                          {catItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-text-secondary opacity-70">
                              <p className="b3 font-bold">No items</p>
                              <p className="b5">Click 'Add Item' to start.</p>
                            </div>
                          ) : viewMode === "grid" ? (
                            <div
                              className={cn(
                                "grid gap-6",
                                draftItem
                                  ? "grid-cols-1 xl:grid-cols-2"
                                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                              )}
                            >
                              {catItems.map((item) => (
                                <div
                                  key={item.id}
                                  onClick={() => handleOpenDrawer(item)}
                                  className="bg-white rounded-[24px] border border-black/5 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer group flex flex-col relative"
                                >
                                  {/* select checkbox with solid white background to prevent morphing */}
                                  <div
                                    className="absolute top-4 left-4 z-20 bg-white rounded-[4px] flex items-center justify-center"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Checkbox
                                      checked={selectedItems.includes(item.id)}
                                      onChange={() => toggleSelection(item.id)}
                                    />
                                  </div>

                                  <div className="aspect-video bg-black/5 flex items-center justify-center relative overflow-hidden">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                    ) : (
                                      <ImageIcon
                                        size={32}
                                        className="text-black/20"
                                      />
                                    )}
                                    {!item.isAvailable && (
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                        <Badge
                                          color="error"
                                          variant="solid"
                                          className="px-2 py-0.5 text-[11px] font-bold"
                                        >
                                          Unavailable
                                        </Badge>
                                      </div>
                                    )}
                                    {/* ai synced badge on top right */}
                                    {item.aiSynced && (
                                      <div className="absolute top-3 right-3 z-10">
                                        <Badge
                                          color="success"
                                          variant="subtle"
                                          className="px-2 py-0.5 text-[11px] font-bold shadow-sm"
                                        >
                                          AI Synced
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                      <h4 className="b2 font-bold text-text-primary group-hover:text-brand-primary transition-colors leading-tight">
                                        {item.name}
                                      </h4>
                                      <span className="b2 font-bold text-brand-accent flex-shrink-0">
                                        ₱{item.price}
                                      </span>
                                    </div>
                                    <p className="b4 text-text-secondary line-clamp-2 mt-auto">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-4">
                              {catItems.map((item) => (
                                <div
                                  key={item.id}
                                  onClick={() => handleOpenDrawer(item)}
                                  className="bg-white rounded-2xl border border-black/5 p-3 md:p-2.5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer group relative pl-5"
                                >
                                  {/* select checkbox with a little left margin */}
                                  <div
                                    className="absolute left-4 top-4 md:relative md:top-auto md:left-auto md:translate-y-0 z-20 bg-white rounded-[4px] flex items-center justify-center"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Checkbox
                                      checked={selectedItems.includes(item.id)}
                                      onChange={() => toggleSelection(item.id)}
                                    />
                                  </div>

                                  {/* mobile list layout */}
                                  <div className="flex md:hidden flex-col gap-0.5 w-full pl-8">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="b3 font-bold text-text-primary truncate max-w-[140px]">
                                        {item.name}
                                      </h4>
                                      <div className="flex gap-1">
                                        {!item.isAvailable && (
                                          <Badge
                                            color="error"
                                            variant="subtle"
                                            className="px-1.5 py-0 text-[9px] font-bold"
                                          >
                                            Unavail
                                          </Badge>
                                        )}
                                        {item.aiSynced && (
                                          <Badge
                                            color="success"
                                            variant="subtle"
                                            className="px-1.5 py-0 text-[9px] font-bold"
                                          >
                                            Synced
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="font-bold text-brand-accent b3">
                                      ₱{item.price}
                                    </div>
                                  </div>

                                  <div className="hidden md:flex w-14 h-14 rounded-xl bg-black/5 flex-shrink-0 items-center justify-center overflow-hidden relative ml-2">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                    ) : (
                                      <ImageIcon
                                        size={20}
                                        className="text-black/20"
                                      />
                                    )}
                                  </div>
                                  <div className="hidden md:flex flex-1 min-w-0 flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="b2 font-bold text-text-primary group-hover:text-brand-primary transition-colors truncate">
                                        {item.name}
                                      </h4>
                                      {!item.isAvailable && (
                                        <Badge
                                          color="error"
                                          variant="subtle"
                                          className="px-2 py-0.5 text-[11px] font-bold"
                                        >
                                          Unavailable
                                        </Badge>
                                      )}
                                      {item.aiSynced && (
                                        <Badge
                                          color="success"
                                          variant="subtle"
                                          className="px-2 py-0.5 text-[11px] font-bold"
                                        >
                                          AI Synced
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="b4 text-text-secondary truncate">
                                      {item.description}
                                    </p>
                                  </div>
                                  <div className="hidden md:block font-bold text-brand-accent text-lg flex-shrink-0 pl-4 border-l border-black/5 min-w-[130px] max-w-[180px] text-right truncate">
                                    ₱{item.price}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </main>
        </div>

        {/* floating bulk action bar */}
        {selectedItems.length > 0 && !draftItem && (
          <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-full flex items-center gap-3 z-[60] border border-black/5 animate-in slide-in-from-bottom-10"
            style={{ boxShadow: "var(--kds-shadow-hover)" }}
          >
            <Button
              variant="ghost"
              onClick={() => setSelectedItems([])}
              className="p-1 h-auto b2 font-bold text-text-secondary hover:text-text-primary hover:bg-transparent"
            >
              Deselect
            </Button>
            <div className="w-px h-5 bg-black/10" />
            <Badge
              color="primary"
              variant="solid"
              className="b2 font-bold px-3 py-1 text-text-primary shadow-sm"
            >
              {selectedItems.length} selected
            </Badge>
            <div className="w-px h-5 bg-black/10" />
            <Button
              variant="ghost"
              onClick={deleteSelectedItems}
              className="p-1 h-auto b2 font-bold text-warning-primary hover:text-warning-primary hover:bg-transparent"
            >
              Delete
            </Button>
          </div>
        )}

        {/* right side: drawer (40% flush right, rounded left corners) */}
        {draftItem && (
          <div
            className={cn(
              "fixed bg-bg-primary shadow-2xl flex flex-col z-50 overflow-hidden duration-500 animate-in border-white",
              "inset-x-0 bottom-0 top-16 w-full rounded-t-[32px] rounded-b-none slide-in-from-bottom border-t-4 border-x-4 border-b-0",
              "lg:top-0 lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[40%] lg:rounded-l-[40px] lg:rounded-r-none lg:slide-in-from-right lg:border-4 lg:border-r-0",
            )}
          >
            {/* drawer header */}
            <div className="bg-brand-secondary p-5 flex-shrink-0 relative flex flex-col gap-2">
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={handleCloseDrawer}
                  className="p-2 bg-black/5 hover:bg-black/10 rounded-full text-text-primary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

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
                  className="shadow-sm mt-2 text-[11px] font-bold px-3 py-1"
                >
                  {draftItem.aiSynced ? "AI Synced" : "Syncing to Gemini..."}
                </Badge>
              </div>
            </div>

            {/* drawer body */}
            <div className="flex-1 overflow-y-auto p-6 bg-bg-primary custom-scrollbar flex flex-col gap-8">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <h4 className="b3 font-bold text-text-secondary uppercase tracking-widest">
                    Item Information
                  </h4>
                  <Badge
                    color="error"
                    variant="outline"
                    shape="pill"
                    className="text-[10px] px-2 py-0.5 uppercase font-bold border-warning-primary/30"
                  >
                    Required
                  </Badge>
                </div>

                {/* top row: image + name/desc side by side */}
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* image upload box */}
                  <div className="flex flex-col gap-2 w-48 flex-shrink-0">
                    <div
                      className={cn(
                        "w-48 h-48 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative shadow-inner transition-colors bg-white/40 hover:bg-white/60",
                        draftItem.image
                          ? "border-0"
                          : "border-2 border-dashed border-black/10 hover:border-brand-primary",
                      )}
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
                          <span className="b5 font-bold text-text-secondary uppercase">
                            Upload Image
                          </span>
                        </>
                      )}
                    </div>
                    <span className="b5 font-medium text-text-secondary/60 text-center uppercase tracking-wider">
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

                  {/* right: name & description */}
                  <div className="flex-1 flex flex-col gap-4 w-full">
                    <div>
                      <label className="b4 font-bold text-text-secondary uppercase tracking-widest block mb-1">
                        Item Name{" "}
                        <span className="text-brand-accent ml-0.5">*</span>
                      </label>
                      <Input
                        value={draftItem.name}
                        onChange={(e) => updateDraft("name", e.target.value)}
                        placeholder="e.g. Chicken Adobo"
                        className="bg-white !py-2.5 b2 font-bold placeholder:text-text-secondary/50 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="b4 font-bold text-text-secondary uppercase tracking-widest flex justify-between mb-1">
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
                        className="w-full bg-white border-2 border-[#E5E5E5] rounded-[14px] p-3 b2 focus:border-brand-primary outline-none transition-colors resize-none h-[88px] custom-scrollbar placeholder:text-text-secondary/50 placeholder:font-normal"
                      />
                    </div>
                  </div>
                </div>

                {/* bottom row: price & availability */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="b4 font-bold text-text-secondary uppercase tracking-widest block mb-1">
                      Price (₱){" "}
                      <span className="text-brand-accent ml-0.5">*</span>
                    </label>
                    <Input
                      value={draftItem.price}
                      onChange={(e) =>
                        handleNumberInput(e, (val) => updateDraft("price", val))
                      }
                      inputMode="decimal"
                      placeholder="0.00"
                      className="bg-white !py-2.5 b2 font-bold placeholder:text-text-secondary/50 placeholder:font-normal"
                    />
                  </div>
                  <div>
                    <label className="b4 font-bold text-text-secondary uppercase tracking-widest block mb-1">
                      Availability{" "}
                      <span className="text-brand-accent ml-0.5">*</span>
                    </label>
                    <div className="flex items-center h-[46px]">
                      <Toggle
                        isOn={draftItem.isAvailable}
                        onChange={(val) => updateDraft("isAvailable", val)}
                        variant="accent"
                      />
                      <span className="ml-3 b2 font-medium text-text-secondary">
                        {draftItem.isAvailable ? "Available" : "Hidden"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-black/10 my-2" />

              {/* sizes form section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="b3 font-bold text-text-secondary uppercase tracking-widest">
                    Size Options
                  </h4>
                  <Badge
                    color="error"
                    variant="outline"
                    shape="pill"
                    className="text-[10px] px-2 py-0.5 uppercase font-bold border-warning-primary/30"
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
                          className="!py-1.5 b2 placeholder:text-text-secondary/50"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            value={size.description}
                            onChange={(e) => {
                              const newSizes = [...draftItem.sizes];
                              newSizes[index].description = e.target.value;
                              updateDraft("sizes", newSizes);
                            }}
                            placeholder="Description (optional)"
                            className="!py-1.5 flex-1 b2 placeholder:text-text-secondary/50"
                          />
                          <div className="relative w-full sm:w-32 flex-shrink-0">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary b2 font-medium">
                              ₱
                            </span>
                            <Input
                              value={size.price}
                              onChange={(e) => {
                                const newSizes = [...draftItem.sizes];
                                const val = e.target.value;
                                if (
                                  val === "" ||
                                  /^[0-9]*\.?[0-9]*$/.test(val)
                                ) {
                                  newSizes[index].price = val;
                                  updateDraft("sizes", newSizes);
                                }
                              }}
                              inputMode="decimal"
                              placeholder="0.00"
                              className="!py-1.5 w-full pl-7 b2 placeholder:text-text-secondary/50"
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
                        className="p-2 text-text-secondary hover:bg-warning-secondary hover:text-warning-primary rounded-xl transition-colors mt-1"
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
                    className="w-full border border-dashed border-black/10 hover:border-brand-primary hover:bg-brand-primary/5 text-text-secondary hover:text-brand-primary rounded-2xl py-3 mt-2 b2"
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
                    <h4 className="b3 font-bold text-text-secondary uppercase tracking-widest">
                      Add-ons
                    </h4>
                    <Badge
                      color="warning"
                      variant="outline"
                      shape="pill"
                      className="text-[10px] px-2 py-0.5 uppercase font-bold border-warning-primary/30"
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
                              className="!py-1.5 b2 placeholder:text-text-secondary/50"
                            />
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Input
                                value={addon.description}
                                onChange={(e) => {
                                  const newAddons = [...draftItem.addons];
                                  newAddons[index].description = e.target.value;
                                  updateDraft("addons", newAddons);
                                }}
                                placeholder="Description (optional)"
                                className="!py-1.5 flex-1 b2 placeholder:text-text-secondary/50"
                              />
                              <div className="relative w-full sm:w-32 flex-shrink-0">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary b2 font-medium">
                                  +₱
                                </span>
                                <Input
                                  value={addon.price}
                                  onChange={(e) => {
                                    const newAddons = [...draftItem.addons];
                                    const val = e.target.value;
                                    if (
                                      val === "" ||
                                      /^[0-9]*\.?[0-9]*$/.test(val)
                                    ) {
                                      newAddons[index].price = val;
                                      updateDraft("addons", newAddons);
                                    }
                                  }}
                                  inputMode="decimal"
                                  placeholder="0.00"
                                  className="!py-1.5 w-full pl-8 text-right b2 placeholder:text-text-secondary/50"
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
                            className="p-2 text-text-secondary hover:bg-warning-secondary hover:text-warning-primary rounded-xl transition-colors mt-1"
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
                        className="flex-1 border border-dashed border-black/10 hover:border-brand-primary hover:bg-brand-primary/5 text-text-secondary hover:text-brand-primary rounded-2xl py-3 b2"
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
                            "w-full border border-dashed rounded-2xl py-3 transition-colors b2",
                            isLinkDropdownOpen
                              ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                              : "border-black/10 hover:border-brand-primary hover:bg-brand-primary/5 text-text-secondary hover:text-brand-primary",
                          )}
                        >
                          Menu Item{" "}
                          <ChevronDown
                            size={16}
                            className={cn(
                              "ml-2 transition-transform duration-300",
                              isLinkDropdownOpen && "rotate-180",
                            )}
                          />
                        </Button>

                        {/* flexible dropdown list mapped precisely to the user's snippet styling */}
                        {isLinkDropdownOpen && (
                          <div
                            className={cn(
                              "absolute top-[calc(100%+8px)] left-0 z-50 bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 w-full",
                            )}
                          >
                            <ul className="max-h-[240px] overflow-y-auto">
                              {dropdownOptions.length === 0 ? (
                                <li className="px-6 py-4 b2 text-text-secondary text-center">
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
                                      "cursor-pointer transition-colors",
                                      "px-4 py-3 b2",
                                      "hover:bg-slate-50",
                                      index === 0 && "rounded-t-[14px]",
                                      index === dropdownOptions.length - 1 &&
                                        "rounded-b-[14px]",
                                      "text-text-primary border-b border-black/5 last:border-0",
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
                <div className="flex flex-col text-left mr-auto hidden lg:flex">
                  <span className="b2 font-bold text-text-primary">
                    Unsaved changes
                  </span>
                  <span className="b5 text-text-secondary">
                    You modified this item's configuration.
                  </span>
                </div>
              )}
              {hasChanges && (
                <Button
                  variant="ghost"
                  onClick={() =>
                    setDraftItem(JSON.parse(JSON.stringify(originalItem)))
                  }
                  className="text-warning-primary hover:bg-warning-secondary w-full sm:w-auto b3"
                >
                  Discard
                </Button>
              )}
              <Button
                variant={hasChanges ? "primary" : "ghost"}
                onClick={handleSaveItem}
                disabled={!hasChanges || !isValidDraft}
                className={cn(
                  (!hasChanges || !isValidDraft) && "opacity-50",
                  "w-full sm:w-auto b3",
                )}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* new category modal exactly matching roles/page.tsx */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-text-primary/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl md:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-black/[0.05] flex-shrink-0">
              <h2 className="b2 font-bold text-text-primary">
                Create New Category
              </h2>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setNewCategoryName("");
                }}
                className="text-text-secondary hover:text-text-primary transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
              <p className="b3 text-text-secondary font-semibold">
                Enter a name for the new menu category.
              </p>

              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category Name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateCategory();
                }}
                autoFocus
                className="b2 bg-white"
              />

              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  onClick={handleCreateCategory}
                  className="w-full b2"
                >
                  Create Category
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* image crop modal */}
      {cropModalImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
          <div className="bg-bg-primary rounded-2xl md:rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="px-6 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-black/[0.05] flex-shrink-0">
              <h2 className="b2 font-bold text-text-primary">Adjust Image</h2>
              <button
                onClick={() => setCropModalImage(null)}
                className="text-text-secondary hover:text-text-primary transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
              <p className="b3 text-text-secondary font-semibold">
                Zoom, crop, or re-center your menu item image.
              </p>

              <div
                className="relative w-[320px] h-[320px] mx-auto rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center group cursor-move shadow-inner"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={cropModalImage}
                  style={{
                    width: `${renderedWidth}px`,
                    height: `${renderedHeight}px`,
                    transform: `translate(${cropPan.x}px, ${cropPan.y}px) scale(${cropScale})`,
                    transition: isDragging ? "none" : "transform 0.1s ease-out",
                  }}
                  className="max-w-none origin-center pointer-events-none absolute"
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
              <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-white max-w-[320px] mx-auto w-full">
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
                <Button
                  variant="ghost"
                  onClick={() => setCropModalImage(null)}
                  className="b3"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmImageCrop}
                  className="b3"
                >
                  Confirm & Save
                </Button>
              </div>
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
