"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { Badge } from "@/components/atoms/Badge";
import { Checkbox } from "@/components/atoms/Checkbox";
import { SearchFilterBar } from "@/components/molecules/SearchFilterBar";
import { ActionConfirmationModal } from "@/components/molecules/ConfirmationModal";
import {
  GripVertical,
  Plus,
  Image as ImageIcon,
  Trash2,
  Search,
  LayoutGrid,
  List as ListIcon,
  X,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Edit2,
  FolderPlus,
  Filter,
  Flame,
  Coffee,
  IceCream2,
  Egg,
  Pizza,
  Beef,
  Fish,
  Salad,
  Soup,
  Sandwich,
  Cookie,
  Cake,
  Apple,
  Carrot,
  Grape,
  UtensilsCrossed,
  Wine,
  Beer,
  Milk,
  Star,
  Sun,
  Moon,
  Leaf,
  Zap,
  Drumstick,
  ShoppingBag,
  Croissant,
  CupSoda,
  Candy,
  ChefHat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useMenuManagement,
  Category,
  MenuItem,
  Addon,
  Size,
} from "@/hooks/useMenuManagement";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";

// ─── Types ──────────────────────────────────────────────────────────────────

type FilterAvail = "all" | "avail" | "unavail";

// ─── Icon options with Lucide components ─────────────────────────────────────

const ICON_OPTIONS: {
  icon: string;
  component: React.ReactNode;
  label: string;
}[] = [
  { icon: "flame", component: <Flame size={18} />, label: "Sizzling" },
  { icon: "drumstick", component: <Drumstick size={18} />, label: "Chicken" },
  { icon: "beef", component: <Beef size={18} />, label: "Beef" },
  { icon: "fish", component: <Fish size={18} />, label: "Seafood" },
  { icon: "egg", component: <Egg size={18} />, label: "Egg" },
  { icon: "soup", component: <Soup size={18} />, label: "Soup" },
  { icon: "salad", component: <Salad size={18} />, label: "Salad" },
  { icon: "pizza", component: <Pizza size={18} />, label: "Pizza" },
  { icon: "sandwich", component: <Sandwich size={18} />, label: "Sandwich" },
  { icon: "croissant", component: <Croissant size={18} />, label: "Pastry" },
  {
    icon: "chef-hat",
    component: <ChefHat size={18} />,
    label: "Chef's Special",
  },
  {
    icon: "utensils-crossed",
    component: <UtensilsCrossed size={18} />,
    label: "Combo",
  },
  { icon: "coffee", component: <Coffee size={18} />, label: "Coffee" },
  { icon: "cup-soda", component: <CupSoda size={18} />, label: "Soda" },
  { icon: "beer", component: <Beer size={18} />, label: "Beer" },
  { icon: "wine", component: <Wine size={18} />, label: "Wine" },
  { icon: "milk", component: <Milk size={18} />, label: "Milk" },
  { icon: "ice-cream", component: <IceCream2 size={18} />, label: "Ice Cream" },
  { icon: "cake", component: <Cake size={18} />, label: "Cake" },
  { icon: "cookie", component: <Cookie size={18} />, label: "Cookie" },
  { icon: "candy", component: <Candy size={18} />, label: "Sweets" },
  { icon: "apple", component: <Apple size={18} />, label: "Fruit" },
  { icon: "carrot", component: <Carrot size={18} />, label: "Veggies" },
  { icon: "grape", component: <Grape size={18} />, label: "Grape" },
  { icon: "leaf", component: <Leaf size={18} />, label: "Vegan" },
  {
    icon: "shopping-bag",
    component: <ShoppingBag size={18} />,
    label: "Bundle",
  },
  { icon: "star", component: <Star size={18} />, label: "Favorites" },
  { icon: "sun", component: <Sun size={18} />, label: "Breakfast" },
  { icon: "moon", component: <Moon size={18} />, label: "Dinner" },
  { icon: "zap", component: <Zap size={18} />, label: "Quick Bites" },
];

const renderCategoryIcon = (icon: string, size = 20) => {
  const map: Record<string, React.ReactNode> = {
    flame: <Flame size={size} />,
    drumstick: <Drumstick size={size} />,
    beef: <Beef size={size} />,
    fish: <Fish size={size} />,
    egg: <Egg size={size} />,
    soup: <Soup size={size} />,
    salad: <Salad size={size} />,
    pizza: <Pizza size={size} />,
    sandwich: <Sandwich size={size} />,
    croissant: <Croissant size={size} />,
    "chef-hat": <ChefHat size={size} />,
    "utensils-crossed": <UtensilsCrossed size={size} />,
    coffee: <Coffee size={size} />,
    "cup-soda": <CupSoda size={size} />,
    beer: <Beer size={size} />,
    wine: <Wine size={size} />,
    milk: <Milk size={size} />,
    "ice-cream": <IceCream2 size={size} />,
    cake: <Cake size={size} />,
    cookie: <Cookie size={size} />,
    candy: <Candy size={size} />,
    apple: <Apple size={size} />,
    carrot: <Carrot size={size} />,
    grape: <Grape size={size} />,
    leaf: <Leaf size={size} />,
    "shopping-bag": <ShoppingBag size={size} />,
    star: <Star size={size} />,
    sun: <Sun size={size} />,
    moon: <Moon size={size} />,
    zap: <Zap size={size} />,
  };
  return map[icon] ?? <UtensilsCrossed size={size} />;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const uid = () => `_${Math.random().toString(36).slice(2, 8)}`;

// ─── Skeleton components ──────────────────────────────────────────────────────

const CategorySkeleton = () => (
  <div className="flex items-center gap-3 p-3 rounded-2xl border border-transparent">
    <div className="w-4 h-4 rounded bg-black/10 animate-pulse flex-shrink-0" />
    <div className="w-8 h-8 rounded-xl bg-black/10 animate-pulse flex-shrink-0" />
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <div className="h-4 rounded bg-black/10 animate-pulse w-24" />
      <div className="h-3 rounded bg-black/10 animate-pulse w-16" />
    </div>
  </div>
);

const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "animate-pulse bg-transparent rounded-xl border border-black/5",
      className,
    )}
  />
);

const GridCardSkeleton = () => (
  <div className="bg-transparent rounded-2xl border border-black/5 overflow-hidden shadow-none flex flex-col">
    <div className="aspect-[4/3] bg-black/[0.06] animate-pulse" />
    <div className="p-3.5 flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <Shimmer className="h-3.5 w-2/3" />
        <Shimmer className="h-3.5 w-12" />
      </div>
      <Shimmer className="h-2.5 w-full" />
      <Shimmer className="h-2.5 w-3/4" />
      <div className="flex gap-1.5 mt-1">
        <Shimmer className="h-4 w-14 rounded-full" />
        <Shimmer className="h-4 w-16 rounded-full" />
      </div>
    </div>
    <div className="px-3.5 py-2.5 border-t border-black/5 flex items-center justify-between">
      <Shimmer className="h-2.5 w-16" />
      <Shimmer className="h-4 w-8 rounded-full" />
    </div>
  </div>
);

const ListRowSkeleton = () => (
  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/[0.05] last:border-0">
    <Shimmer className="w-4 h-4 rounded flex-shrink-0" />
    <Shimmer className="w-12 h-12 rounded-xl flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-1.5">
      <Shimmer className="h-3 w-1/3" />
      <Shimmer className="h-2.5 w-1/2 hidden sm:block" />
    </div>
    <Shimmer className="h-3.5 w-14 flex-shrink-0" />
    <Shimmer className="h-3 w-14 hidden sm:block flex-shrink-0" />
    <Shimmer className="w-8 h-4 rounded-full flex-shrink-0" />
  </div>
);

// ─── Icon Picker ─────────────────────────────────────────────────────────────

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3 p-3 bg-brand-secondary/40 rounded-2xl border border-black/5">
      <div className="w-10 h-10 rounded-xl bg-white border border-brand-primary/30 flex items-center justify-center flex-shrink-0 shadow-sm text-brand-accent">
        {renderCategoryIcon(value, 20)}
      </div>
      <div>
        <p className="b4 font-bold text-text-primary">
          {ICON_OPTIONS.find((o) => o.icon === value)?.label ?? "Icon"}
        </p>
        <p className="b5 text-text-secondary">Selected icon</p>
      </div>
    </div>
    <div
      className="overflow-y-auto custom-scrollbar"
      style={{ maxHeight: 220 }}
    >
      <div className="grid grid-cols-6 gap-2 px-0.5 pt-1 pb-1">
        {ICON_OPTIONS.map((opt) => (
          <button
            key={opt.icon}
            onClick={() => onChange(opt.icon)}
            title={opt.label}
            type="button"
            className={cn(
              "w-full aspect-square rounded-xl flex items-center justify-center transition-all border",
              value === opt.icon
                ? "bg-brand-accent/10 border-brand-accent text-brand-accent shadow-sm scale-105"
                : "bg-transparent border-black/[0.08] text-text-secondary hover:border-brand-primary hover:text-brand-accent",
            )}
          >
            {React.cloneElement(opt.component as React.ReactElement, {
              size: 18,
            })}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ─── Sub-components ──────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ title: string; required?: boolean }> = ({
  title,
  required,
}) => (
  <div className="flex items-center gap-2 mb-3">
    <h4 className="b5 font-bold text-text-secondary uppercase tracking-widest">
      {title}
    </h4>
    {required && (
      <span className="text-[9px] px-1.5 py-0.5 uppercase font-bold rounded-full border border-brand-accent/30 text-brand-accent bg-brand-accent/5">
        Required
      </span>
    )}
  </div>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block b5 font-bold text-text-secondary uppercase tracking-widest mb-1.5">
    {children}
  </label>
);

const Divider = () => <div className="w-full h-px bg-black/8" />;

// ─── Main component ──────────────────────────────────────────────────────────

const MenuCategoryManagement = () => {
  const {
    categories,
    items,
    isLoading,
    actionError,
    saveCategory,
    deleteCategory,
    saveItem,
    deleteItems,
    toggleAvailability,
    updateCategoryOrder,
    uploadImage,
  } = useMenuManagement();

  const { items: inventoryItems } = useInventoryManagement();

  const [activeCatId, setActiveCatId] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAvail, setFilterAvail] = useState<FilterAvail>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const [catModal, setCatModal] = useState<null | "new" | "edit">(null);
  const [catDraft, setCatDraft] = useState<Partial<Category>>({
    name: "",
    icon: "flame",
  });

  const [originalItem, setOriginalItem] = useState<MenuItem | null>(null);
  const [draftItem, setDraftItem] = useState<MenuItem | null>(null);
  const [isLinkDropdownOpen, setIsLinkDropdownOpen] = useState(false);

  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(
    null,
  );

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: "category" | "items" | null;
    categoryId?: string;
  }>({ isOpen: false, type: null });

  const [cropModalImage, setCropModalImage] = useState<string | null>(null);
  const [imageNativeSize, setImageNativeSize] = useState({ w: 1, h: 1 });
  const [cropScale, setCropScale] = useState(1);
  const [cropPan, setCropPan] = useState({ x: 0, y: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const dragStartCrop = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const CROP_CONTAINER_SIZE = 320;

  useEffect(() => {
    if (categories.length > 0 && !activeCatId) {
      setActiveCatId(categories[0].id);
    }
  }, [categories, activeCatId]);

  const handleCategoryChange = (id: string) => {
    setActiveCatId(id);
    setSearchQuery("");
    setFilterAvail("all");
    setSelectedItems([]);
    setSidebarOpen(false);
  };

  const activeCat =
    categories.find((c) => c.id === activeCatId) ?? categories[0];
  const isEmptyMenu =
    !isLoading && categories.length === 0 && items.length === 0;
  const visibleItems = items.filter((i) => {
    if (i.categoryId !== activeCatId) return false;
    if (
      searchQuery &&
      !i.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !i.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (filterAvail === "avail" && !i.isAvailable) return false;
    if (filterAvail === "unavail" && i.isAvailable) return false;
    return true;
  });

  const totalCount = items.filter((i) => i.categoryId === activeCatId).length;
  const availCount = items.filter(
    (i) => i.categoryId === activeCatId && i.isAvailable,
  ).length;

  const hasChanges = JSON.stringify(originalItem) !== JSON.stringify(draftItem);
  const requiresImage = !!draftItem?.id?.startsWith("item_");
  const isValidDraft =
    draftItem?.name?.trim() !== "" &&
    draftItem?.price?.trim() !== "" &&
    (!requiresImage || !!draftItem?.image) &&
    draftItem?.sizes.every(
      (s) => s.name.trim() !== "" && s.price.trim() !== "",
    ) &&
    (!draftItem?.addonsEnabled ||
      draftItem?.addons.every(
        (a) => a.name.trim() !== "" && a.price.trim() !== "",
      ));

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

  useEffect(() => {
    setCropPan((prev) => ({
      x: Math.max(-maxPanX, Math.min(maxPanX, prev.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, prev.y)),
    }));
  }, [cropScale, maxPanX, maxPanY]);

  useEffect(() => {
    const handler = () => {
      if (isLinkDropdownOpen) setIsLinkDropdownOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isLinkDropdownOpen]);

  const handleDragStartCategory = (e: React.DragEvent, id: string) => {
    setDraggedCategoryId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOverCategory = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleDropCategory = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedCategoryId || draggedCategoryId === targetId) return;
    const newCats = [...categories];
    const draggedIdx = newCats.findIndex((c) => c.id === draggedCategoryId);
    const targetIdx = newCats.findIndex((c) => c.id === targetId);
    const [draggedCat] = newCats.splice(draggedIdx, 1);
    newCats.splice(targetIdx, 0, draggedCat);
    await updateCategoryOrder(newCats);
    setDraggedCategoryId(null);
  };

  const openNewCatModal = () => {
    setLocalError(null);
    setCatDraft({ name: "", icon: "flame" });
    setCatModal("new");
  };
  const handleAddCategoryClick = () => {
    openNewCatModal();
  };
  const openEditCatModal = (cat: Category) => {
    setLocalError(null);
    setCatDraft({ ...cat });
    setCatModal("edit");
  };

  const handleSaveCategory = async () => {
    if (!catDraft.name?.trim()) return;
    setLocalError(null);
    setIsLocalLoading(true);
    const isNew = catModal === "new";
    const saved = await saveCategory(catDraft, isNew);
    if (saved) {
      if (isNew) setActiveCatId(saved.id);
      setCatModal(null);
    } else {
      setLocalError(
        "Unable to save category. Please check your tenant access.",
      );
    }
    setIsLocalLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    setLocalError(null);
    setIsLocalLoading(true);
    const ok = await deleteCategory(id);
    if (ok) {
      const remaining = categories.filter((c) => c.id !== id);
      setActiveCatId(remaining.length ? remaining[0].id : "");
      setCatModal(null);
    } else {
      setLocalError("Unable to delete category.");
    }
    setIsLocalLoading(false);
  };

  const toggleSelection = (id: string) =>
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  const deleteSelectedItems = async () => {
    await deleteItems(selectedItems);
    setSelectedItems([]);
  };

  const handleOpenModal = (item: MenuItem) => {
    setLocalError(null);
    setOriginalItem(item);
    setDraftItem(JSON.parse(JSON.stringify({ ...item, recipe: item.recipe || [] })));
  };
  const handleCloseModal = () => {
    setLocalError(null);
    setOriginalItem(null);
    setDraftItem(null);
  };
  const handleSaveItem = async () => {
    if (!draftItem || !isValidDraft) return;
    setLocalError(null);
    setIsLocalLoading(true);

    let finalImage = draftItem.image;
    if (draftItem.image && draftItem.image.startsWith("data:image")) {
      const res = await fetch(draftItem.image);
      const blob = await res.blob();
      const fileName = `${draftItem.id}-${Date.now()}.jpg`;
      const uploadedUrl = await uploadImage(blob, fileName);
      if (uploadedUrl) {
        finalImage = uploadedUrl;
      } else {
        setLocalError("Image upload failed. Please try again.");
        setIsLocalLoading(false);
        return;
      }
    }

    const savedItem = await saveItem({ ...draftItem, image: finalImage });
    if (savedItem) {
      handleCloseModal();
    } else {
      setLocalError(
        "Unable to save item. Please check required fields and tenant access.",
      );
    }
    setIsLocalLoading(false);
  };

  const handleCreateNewItem = () => {
    if (!activeCatId) return;
    handleOpenModal({
      id: `item_${Date.now()}`,
      categoryId: activeCatId,
      name: "",
      description: "",
      price: "",
      isAvailable: true,
      addonsEnabled: false,
      addons: [],
      sizes: [],
      recipe: [],
    });
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
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) callback(val);
  };

  const toggleItemAvailability = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) await toggleAvailability(id, item.isAvailable);
  };

  const toggleRowExpand = (id: string) =>
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );

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

  const confirmImageCrop = () => {
    if (!cropModalImage) return;
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const outScale = canvas.width / CROP_CONTAINER_SIZE;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.translate(cropPan.x * outScale, cropPan.y * outScale);
      ctx.scale(cropScale, cropScale);
      const drawW = renderedWidth * outScale;
      const drawH = renderedHeight * outScale;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      updateDraft("image", canvas.toDataURL("image/jpeg", 0.9));
      setCropModalImage(null);
    };
    img.src = cropModalImage;
  };

  const handleCropMouseDown = (e: React.MouseEvent) => {
    setIsDraggingCrop(true);
    dragStartCrop.current = {
      x: e.clientX - cropPan.x,
      y: e.clientY - cropPan.y,
    };
  };
  const handleCropMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCrop) return;
    setCropPan({
      x: Math.max(
        -maxPanX,
        Math.min(maxPanX, e.clientX - dragStartCrop.current.x),
      ),
      y: Math.max(
        -maxPanY,
        Math.min(maxPanY, e.clientY - dragStartCrop.current.y),
      ),
    });
  };
  const handleCropMouseUp = () => setIsDraggingCrop(false);

  const dropdownOptions = items
    .filter((i) => i.id !== draftItem?.id)
    .map((i) => ({ label: `${i.name} (₱${i.price})`, value: i.id }));

  return (
    <div className="w-full">
      {/* ── Main View Toggle ────────────────────────────────────────────── */}
      {isEmptyMenu ? (
        <div className="font-inter relative flex w-full min-h-[700px] bg-gradient-to-br from-[#FFF8EE] via-transparent to-[#FFF1F3] p-4 md:p-0">
          <div className="flex-1 flex items-center justify-center px-4 py-8 md:px-8 md:py-12">
            <div className="w-full max-w-5xl rounded-[36px] border border-black/10 ring-1 ring-black/5 bg-gradient-to-br from-white/95 via-white/85 to-[#FFF7EC] shadow-[0_32px_100px_rgba(0,0,0,0.12)] overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-accent/8 px-3 py-1 text-brand-accent b5 font-bold mb-6">
                    <FolderPlus size={14} />
                    Your menu is empty
                  </div>
                  <h2 className="text-[34px] md:text-[46px] lg:text-[52px] font-bold leading-[1.05] tracking-tight text-text-primary max-w-2xl">
                    Start by creating your first category.
                  </h2>
                  <p className="mt-5 b2 text-text-secondary max-w-xl leading-relaxed">
                    Add categories like meals, drinks, or desserts first, then
                    place items inside them to build your menu. Once you add
                    your first category, the full management interface will
                    appear here.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      onClick={handleAddCategoryClick}
                      className="h-12 px-6 rounded-[16px] bg-brand-accent hover:bg-brand-accent/90 border-brand-accent text-white"
                      leftIcon={<Plus size={16} />}
                    >
                      Add Category
                    </Button>
                    <div className="flex items-center gap-2 rounded-[16px] border border-black/8 bg-white/75 px-4 py-3 text-text-secondary">
                      <ImageIcon size={16} className="opacity-70" />
                      <span className="b4">
                        Categories and items appear here after setup.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative min-h-[320px] lg:min-h-full p-8 md:p-10 bg-gradient-to-br from-[#FFF0D6] via-[#FFE9EF] to-[#F7F0FF] flex items-center justify-center">
                  <div className="absolute top-8 right-8 w-28 h-28 rounded-full bg-white/35 blur-2xl" />
                  <div className="absolute bottom-10 left-10 w-36 h-36 rounded-full bg-brand-accent/10 blur-3xl" />
                  <div className="relative w-full max-w-[360px] rounded-[30px] border border-white/80 bg-white/80 backdrop-blur-sm shadow-[0_18px_50px_rgba(0,0,0,0.08)] p-6 md:p-7">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                        <FolderPlus size={24} />
                      </div>
                      <div>
                        <p className="b3 font-bold text-text-primary">
                          Ready for your menu
                        </p>
                        <p className="b5 text-text-secondary">
                          Your categories and items will live here.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {[
                        "Add a category",
                        "Add menu items",
                        "Organize and publish",
                      ].map((step, idx) => (
                        <div
                          key={step}
                          className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/70 px-4 py-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center b5 font-bold">
                            {idx + 1}
                          </div>
                          <span className="b4 text-text-primary font-medium">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="font-inter relative flex w-full flex-col md:flex-row gap-6 min-h-[700px] bg-gradient-to-br from-[#FFF8EE] via-transparent to-[#FFF1F3] p-4 md:p-0">
          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="w-full md:w-[290px] flex-shrink-0 flex flex-col gap-4 bg-white/70 backdrop-blur-sm rounded-[24px] border border-white/70 shadow-sm p-4 md:p-5">
            <div className="flex flex-col gap-3">
              <div>
                <p className="b3 font-bold text-text-primary">Categories</p>
                <p className="b5 text-text-secondary mt-0.5">
                  Organize menu groups and keep the active set in view.
                </p>
              </div>
              <Button
                variant="primary"
                className="w-full bg-brand-accent hover:bg-brand-accent/90 border-brand-accent"
                leftIcon={<Plus size={18} />}
                onClick={openNewCatModal}
              >
                New
              </Button>
            </div>

            <SearchFilterBar
              onSearch={(val) => {}}
              placeholder="Search categories"
              supportiveText=""
              className="mb-0 [&_input]:!h-[41px] [&_input]:!text-sm [&_input]:!rounded-xl"
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-1">
              {isLoading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <CategorySkeleton key={`skeleton-${idx}`} />
                  ))
                : categories.map((cat) => {
                    const catCount = items.filter(
                      (i) => i.categoryId === cat.id,
                    ).length;
                    const isActive = cat.id === activeCatId;
                    return (
                      <div
                        key={cat.id}
                        draggable
                        onDragStart={(e) => handleDragStartCategory(e, cat.id)}
                        onDragOver={handleDragOverCategory}
                        onDrop={(e) => handleDropCategory(e, cat.id)}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={cn(
                          "group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 border bg-transparent",
                          isActive
                            ? "bg-white shadow-md border-white/60 scale-[1.02]"
                            : "hover:bg-white/40 border-transparent",
                          draggedCategoryId === cat.id &&
                            "opacity-50 border-dashed border-brand-accent border-2",
                        )}
                      >
                        <div className="cursor-grab text-text-secondary/65 hover:text-text-primary/80 active:cursor-grabbing flex-shrink-0">
                          <GripVertical size={16} />
                        </div>
                        <div
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                            isActive
                              ? "bg-brand-secondary/70 text-brand-accent shadow-sm"
                              : "bg-black/6 text-text-secondary group-hover:bg-brand-secondary/60 group-hover:text-brand-accent",
                          )}
                        >
                          {renderCategoryIcon(cat.icon, 17)}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className={cn(
                              "b2 font-bold transition-colors truncate",
                              isActive
                                ? "text-text-primary"
                                : "text-text-primary/80",
                            )}
                          >
                            {cat.name}
                          </span>
                          <span className="b5 text-text-secondary mt-0.5">
                            {catCount} item{catCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col min-w-0 bg-white/50 backdrop-blur-sm rounded-[24px] overflow-hidden border border-white/60 shadow-sm">
            {/* header bar */}
            <div className="relative overflow-hidden flex-shrink-0 border-b border-[#ffd08a]/30">
              <div className="pointer-events-none absolute -top-16 -right-10 w-52 h-52 rounded-full bg-brand-accent/[0.06]" />
              <div className="pointer-events-none absolute -bottom-10 right-28 w-40 h-40 rounded-full bg-brand-primary/[0.10]" />
              <div
                className="relative z-10 flex items-center gap-0 px-6 md:px-8 py-5"
                style={{
                  background:
                    "linear-gradient(135deg, #FFF3DA 0%, #FFE8EC 100%)",
                }}
              >
                {activeCat && (
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-[54px] h-[54px] rounded-[18px] bg-brand-secondary/70 border border-brand-primary/30 flex items-center justify-center flex-shrink-0 text-brand-accent shadow-sm">
                      {renderCategoryIcon(activeCat.icon, 24)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[28px] font-bold text-text-primary leading-tight truncate tracking-tight">
                        {activeCat.name}
                      </p>
                    </div>
                  </div>
                )}
                <div className="w-px h-10 bg-black/[0.08] mx-5 flex-shrink-0 hidden sm:block" />
                <div className="flex items-center gap-2 flex-shrink-0">
                  {activeCat && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditCatModal(activeCat)}
                        title="Edit category"
                        className="w-9 h-9 rounded-[11px] border border-black/[0.09] bg-white/80 hover:bg-white text-text-secondary hover:text-text-primary"
                      >
                        <Edit2 size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            type: "category",
                            categoryId: activeCat.id,
                          })
                        }
                        title="Delete category"
                        className="w-9 h-9 rounded-[11px] border border-black/[0.09] bg-white/80 hover:bg-red-50 hover:text-warning-primary hover:border-warning-primary/20 text-text-secondary"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="primary"
                    onClick={handleCreateNewItem}
                    className="h-9 px-4 rounded-[11px] bg-brand-accent hover:bg-brand-accent/90 border-brand-accent text-white flex-shrink-0"
                    leftIcon={<Plus size={15} />}
                  >
                    Add Item
                  </Button>
                </div>
              </div>
            </div>

            {/* toolbar */}
            <div className="flex-shrink-0 px-4 lg:px-6 py-3 border-b border-black/[0.05] bg-white/30 flex flex-col gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-80 flex-shrink-0">
                  <SearchFilterBar
                    onSearch={(val) => setSearchQuery(val)}
                    placeholder="Search items…"
                    supportiveText=""
                    className="mb-0 [&_input]:!h-[36px] [&_input]:!text-[13px] [&_input]:!rounded-xl"
                  />
                </div>
                <div className="w-px h-5 bg-black/[0.08] flex-shrink-0 hidden sm:block" />
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  {(
                    [
                      { key: "all", label: "All" },
                      { key: "avail", label: "Available" },
                      { key: "unavail", label: "Unavailable" },
                    ] as { key: FilterAvail; label: string }[]
                  ).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFilterAvail(key)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full b4 font-medium border transition-all",
                        filterAvail === key
                          ? "bg-brand-accent text-white border-brand-accent shadow-sm"
                          : "bg-white/60 text-text-secondary border-black/12 hover:border-black/22 hover:text-text-primary",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 border border-black/[0.09] rounded-[10px] overflow-hidden flex-shrink-0 ml-auto">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "w-8 h-[30px] flex items-center justify-center transition-all",
                      viewMode === "grid"
                        ? "bg-brand-accent/10 text-brand-accent"
                        : "text-text-secondary hover:text-text-primary bg-transparent",
                    )}
                    title="Grid view"
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "w-8 h-[30px] flex items-center justify-center transition-all",
                      viewMode === "list"
                        ? "bg-brand-accent/10 text-brand-accent"
                        : "text-text-secondary hover:text-text-primary bg-transparent",
                    )}
                    title="List view"
                  >
                    <ListIcon size={14} />
                  </button>
                </div>
              </div>

              {selectedItems.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-white/60 rounded-2xl border border-black/5 animate-in slide-in-from-top-2 duration-200">
                  <span className="b4 text-text-secondary flex-1">
                    <span className="font-bold text-text-primary">
                      {selectedItems.length}
                    </span>{" "}
                    item{selectedItems.length > 1 ? "s" : ""} selected
                  </span>
                  <button
                    onClick={() => setSelectedItems([])}
                    className="b4 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Deselect
                  </button>
                  <div className="w-px h-4 bg-black/10" />
                  <button
                    onClick={() =>
                      setDeleteConfirm({ isOpen: true, type: "items" })
                    }
                    className="b4 font-medium text-brand-accent hover:text-brand-accent/80 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}
            </div>

            {/* item Area */}
            <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 custom-scrollbar bg-white/25">
              {isLoading ? (
                viewMode === "grid" ? (
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <GridCardSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-black/[0.07] overflow-hidden bg-transparent shadow-none">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <ListRowSkeleton key={i} />
                    ))}
                  </div>
                )
              ) : visibleItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-text-secondary/60">
                  <div className="w-16 h-16 rounded-2xl bg-black/4 flex items-center justify-center mb-3">
                    <ImageIcon size={28} className="opacity-40" />
                  </div>
                  <p className="b3 font-bold">
                    {searchQuery ? "No results found" : "No items yet"}
                  </p>
                  <p className="b5 mt-1">
                    {searchQuery
                      ? "Try a different search term."
                      : "Click 'Add Item' to get started."}
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleItems.map((item) => (
                    <GridCard
                      key={item.id}
                      item={item}
                      selected={selectedItems.includes(item.id)}
                      onSelect={() => toggleSelection(item.id)}
                      onClick={() => handleOpenModal(item)}
                      onToggleAvail={() => toggleItemAvailability(item.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-black/[0.07] overflow-hidden bg-transparent shadow-none">
                  <div className="hidden sm:grid sm:grid-cols-[32px_56px_1fr_90px_90px_70px] gap-3 px-4 py-3 border-b border-black/[0.06] bg-transparent">
                    <div />
                    <div />
                    {["Item", "Price", "Sizes", "Status"].map((h) => (
                      <div
                        key={h}
                        className="b5 text-text-secondary uppercase tracking-wider font-bold"
                      >
                        {h}
                      </div>
                    ))}
                  </div>
                  {visibleItems.map((item) => (
                    <CollapsibleTableRow
                      key={item.id}
                      item={item}
                      selected={selectedItems.includes(item.id)}
                      onSelect={() => toggleSelection(item.id)}
                      onClick={() => handleOpenModal(item)}
                      onToggleAvail={() => toggleItemAvailability(item.id)}
                      expanded={expandedRows.includes(item.id)}
                      onToggleExpand={() => toggleRowExpand(item.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── GLOBAL MODALS (Always rendered to support animations) ───────── */}

      {/* item modal */}
      {draftItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 modal-overlay">
          <div className="bg-bg-primary rounded-[28px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-white/50 overflow-hidden modal-panel">
            <div className="bg-white px-6 py-4 flex-shrink-0 flex items-center gap-3 border-b border-black/[0.06]">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed size={18} className="text-brand-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="b3 font-bold text-text-primary truncate">
                  {originalItem?.name
                    ? `Edit: ${originalItem.name}`
                    : "New Item"}
                </p>
                <p className="b5 text-text-secondary">
                  {activeCat?.name} category
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-xl bg-black/5 hover:bg-black/10 transition-colors text-text-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-6">
              <section className="flex flex-col gap-4">
                <SectionLabel title="Item Information" required />
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <div
                      className={cn(
                        "w-36 h-36 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative shadow-inner transition-all",
                        draftItem.image
                          ? "border-0"
                          : "border-2 border-dashed border-black/15 hover:border-brand-accent bg-transparent hover:bg-transparent",
                      )}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {draftItem.image ? (
                        <img
                          src={draftItem.image}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          alt="item"
                        />
                      ) : (
                        <>
                          <ImageIcon
                            size={24}
                            className="text-black/20 group-hover:text-brand-accent transition-colors mb-1"
                          />
                          <span className="b5 font-bold text-text-secondary uppercase text-center px-2">
                            Upload Image
                          </span>
                        </>
                      )}
                      {draftItem.image && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <ImageIcon
                            size={20}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      )}
                    </div>
                    <p className="b5 text-text-secondary/50 text-center uppercase tracking-wide">
                      Max 5MB
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png"
                      onChange={handleImageSelect}
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-3 w-full">
                    <div>
                      <FieldLabel>
                        Item Name <span className="text-brand-accent">*</span>
                      </FieldLabel>
                      <Input
                        value={draftItem.name}
                        onChange={(e) => updateDraft("name", e.target.value)}
                        placeholder="e.g. Chicken Adobo"
                        className="bg-white !py-2.5 b2 font-bold"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <FieldLabel>Description</FieldLabel>
                        <span className="b5 text-black/30">
                          {draftItem.description.length}/150
                        </span>
                      </div>
                      <textarea
                        value={draftItem.description}
                        onChange={(e) => {
                          if (e.target.value.length <= 150)
                            updateDraft("description", e.target.value);
                        }}
                        placeholder="Brief description"
                        className="w-full bg-white border-2 border-[#E5E5E5] rounded-[14px] p-2.5 b4 focus:border-brand-accent outline-none resize-none h-[76px] custom-scrollbar placeholder:text-text-secondary/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>
                      Price (₱) <span className="text-brand-accent">*</span>
                    </FieldLabel>
                    <Input
                      value={draftItem.price}
                      onChange={(e) =>
                        handleNumberInput(e, (val) => updateDraft("price", val))
                      }
                      inputMode="decimal"
                      placeholder="0.00"
                      className="bg-white !py-2.5 b2 font-bold"
                    />
                  </div>
                  <div>
                    <FieldLabel>Availability</FieldLabel>
                    <div className="flex items-center h-[46px] gap-2.5">
                      <Toggle
                        isOn={draftItem.isAvailable}
                        onChange={(val) => updateDraft("isAvailable", val)}
                        variant="accent"
                      />
                      <span
                        className={cn(
                          "b4 font-medium",
                          draftItem.isAvailable
                            ? "text-success-primary"
                            : "text-text-secondary",
                        )}
                      >
                        {draftItem.isAvailable ? "Available" : "Hidden"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <Divider />

              <section>
                <SectionLabel title="Size Options" />
                <div className="space-y-2">
                  {draftItem.sizes.map((size, index) => (
                    <div
                      key={size.id}
                      className="flex items-start gap-2 p-3.5 bg-transparent rounded-2xl border border-black/5 shadow-none"
                    >
                      <div className="flex-1 flex flex-col gap-2">
                        <Input
                          value={size.name}
                          onChange={(e) => {
                            const ns = [...draftItem.sizes];
                            ns[index].name = e.target.value;
                            updateDraft("sizes", ns);
                          }}
                          placeholder="Size Name"
                          className="!py-2 b4"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            value={size.description}
                            onChange={(e) => {
                              const ns = [...draftItem.sizes];
                              ns[index].description = e.target.value;
                              updateDraft("sizes", ns);
                            }}
                            placeholder="Description (optional)"
                            className="!py-2 flex-1 b4"
                          />
                          <div className="relative w-full sm:w-28 flex-shrink-0">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary b4">
                              ₱
                            </span>
                            <Input
                              value={size.price}
                              onChange={(e) => {
                                const ns = [...draftItem.sizes];
                                const val = e.target.value;
                                if (
                                  val === "" ||
                                  /^[0-9]*\.?[0-9]*$/.test(val)
                                ) {
                                  ns[index].price = val;
                                  updateDraft("sizes", ns);
                                }
                              }}
                              inputMode="decimal"
                              placeholder="0.00"
                              className="!py-2 w-full pl-7 b4"
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
                        className="p-2 text-text-secondary hover:bg-brand-accent/10 hover:text-brand-accent rounded-xl transition-colors mt-0.5"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  <button
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
                    className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-black/15 rounded-2xl text-text-secondary hover:border-brand-accent hover:text-brand-accent hover:bg-brand-accent/5 transition-all b4 font-medium"
                  >
                    <Plus size={14} /> Add Size
                  </button>
                </div>
              </section>

              <Divider />

              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <SectionLabel title="Add-ons" />
                    <span className="text-[9px] px-1.5 py-0.5 uppercase font-bold rounded-full border border-black/10 text-text-secondary bg-black/3 -mt-3">
                      Optional
                    </span>
                  </div>
                  <Toggle
                    isOn={draftItem.addonsEnabled}
                    onChange={(val) => updateDraft("addonsEnabled", val)}
                    variant="accent"
                  />
                </div>

                {draftItem.addonsEnabled && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    {draftItem.addons.map((addon, index) => (
                      <div
                        key={addon.id}
                        className="flex items-start gap-2 p-3.5 bg-transparent rounded-2xl border border-black/5 shadow-none"
                      >
                        <div className="flex-1 flex flex-col gap-2">
                          <Input
                            value={addon.name}
                            onChange={(e) => {
                              const na = [...draftItem.addons];
                              na[index].name = e.target.value;
                              updateDraft("addons", na);
                            }}
                            placeholder="Add-on Name"
                            className="!py-2 b4"
                          />
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                              value={addon.description}
                              onChange={(e) => {
                                const na = [...draftItem.addons];
                                na[index].description = e.target.value;
                                updateDraft("addons", na);
                              }}
                              placeholder="Description (optional)"
                              className="!py-2 flex-1 b4"
                            />
                            <div className="relative w-full sm:w-28 flex-shrink-0">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary b4">
                                +₱
                              </span>
                              <Input
                                value={addon.price}
                                onChange={(e) => {
                                  const na = [...draftItem.addons];
                                  const val = e.target.value;
                                  if (
                                    val === "" ||
                                    /^[0-9]*\.?[0-9]*$/.test(val)
                                  ) {
                                    na[index].price = val;
                                    updateDraft("addons", na);
                                  }
                                }}
                                inputMode="decimal"
                                placeholder="0.00"
                                className="!py-2 w-full pl-8 b4"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            updateDraft(
                              "addons",
                              draftItem.addons.filter((m) => m.id !== addon.id),
                            )
                          }
                          className="p-2 text-text-secondary hover:bg-brand-accent/10 hover:text-brand-accent rounded-xl transition-colors mt-0.5"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <button
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
                        className="flex-1 flex items-center justify-center gap-2 py-3 border border-dashed border-black/15 rounded-2xl text-text-secondary hover:border-brand-accent hover:text-brand-accent hover:bg-brand-accent/5 transition-all b4 font-medium"
                      >
                        <Plus size={14} /> Create New
                      </button>

                      <div
                        className="flex-1 relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            setIsLinkDropdownOpen(!isLinkDropdownOpen)
                          }
                          className={cn(
                            "w-full flex items-center justify-center gap-2 py-3 border border-dashed rounded-2xl transition-all b4 font-medium",
                            isLinkDropdownOpen
                              ? "border-brand-accent text-brand-accent bg-brand-accent/5"
                              : "border-black/15 text-text-secondary hover:border-brand-accent hover:text-brand-accent hover:bg-brand-accent/5",
                          )}
                        >
                          From Menu
                          <ChevronDown
                            size={14}
                            className={cn(
                              "transition-transform",
                              isLinkDropdownOpen && "rotate-180",
                            )}
                          />
                        </button>
                        {isLinkDropdownOpen && (
                          <div className="absolute bottom-[calc(100%+6px)] left-0 z-50 bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden w-full animate-in fade-in zoom-in-95 duration-200">
                            <ul className="max-h-[200px] overflow-y-auto custom-scrollbar">
                              {dropdownOptions.length === 0 ? (
                                <li className="px-4 py-3 b4 text-text-secondary text-center">
                                  No items available
                                </li>
                              ) : (
                                dropdownOptions.map((option) => (
                                  <li
                                    key={option.value}
                                    onClick={() => {
                                      const si = items.find(
                                        (x) => x.id === option.value,
                                      );
                                      if (si)
                                        updateDraft("addons", [
                                          ...draftItem.addons,
                                          {
                                            id: `addon_${Date.now()}`,
                                            itemId: si.id,
                                            name: si.name,
                                            description: si.description,
                                            price: si.price,
                                          },
                                        ]);
                                      setIsLinkDropdownOpen(false);
                                    }}
                                    className="px-4 py-2.5 b4 cursor-pointer hover:bg-brand-secondary/30 text-text-primary border-b border-black/5 last:border-0 transition-colors"
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
              </section>

              <Divider />

              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <SectionLabel title="Recipe / Ingredients" />
                    <span className="text-[9px] px-1.5 py-0.5 uppercase font-bold rounded-full border border-black/10 text-text-secondary bg-black/3 -mt-3">
                      Optional
                    </span>
                  </div>
                </div>

                <div className="space-y-3 animate-in fade-in duration-200">
                  {draftItem.recipe?.map((ing, index) => (
                    <div
                      key={ing.inventory_item_id}
                      className="flex items-start gap-2 p-3.5 bg-transparent rounded-2xl border border-black/5 shadow-none"
                    >
                      <div className="flex-1 flex flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                          <p className="b4 font-bold text-text-primary mb-1">{ing.name}</p>
                          <p className="b5 text-text-secondary uppercase">Unit: {ing.unit_type}</p>
                        </div>
                        <div className="flex flex-col">
                          <label className="b5 text-text-secondary uppercase mb-1">Required Qty</label>
                          <Input
                            type="number"
                            value={ing.quantity_required}
                            onChange={(e) => {
                              const nr = [...draftItem.recipe!];
                              nr[index].quantity_required = parseFloat(e.target.value) || 0;
                              updateDraft("recipe", nr);
                            }}
                            className="!py-2 w-full sm:w-28 b4"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          updateDraft(
                            "recipe",
                            draftItem.recipe!.filter((r) => r.inventory_item_id !== ing.inventory_item_id),
                          )
                        }
                        className="p-2 text-text-secondary hover:bg-brand-accent/10 hover:text-brand-accent rounded-xl transition-colors mt-4"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}

                  <div className="relative">
                    <select
                      className="w-full bg-white border border-dashed border-black/15 rounded-2xl p-3 b4 text-text-secondary hover:border-brand-accent focus:border-brand-accent outline-none appearance-none"
                      onChange={(e) => {
                        if (!e.target.value) return;
                        const invItem = inventoryItems.find((i) => i.id === e.target.value);
                        if (invItem && !draftItem.recipe?.find((r) => r.inventory_item_id === invItem.id)) {
                          updateDraft("recipe", [
                            ...(draftItem.recipe || []),
                            {
                              inventory_item_id: invItem.id,
                              quantity_required: 1,
                              name: invItem.name,
                              unit_type: invItem.unit_type,
                            },
                          ]);
                        }
                        e.target.value = "";
                      }}
                    >
                      <option value="">+ Add Ingredient...</option>
                      {inventoryItems.map((inv) => (
                        <option key={inv.id} value={inv.id} disabled={!!draftItem.recipe?.find((r) => r.inventory_item_id === inv.id)}>
                          {inv.name} ({inv.unit_type})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                  </div>
                </div>
              </section>
            </div>

            <div className="p-4 border-t-2 border-black/5 flex items-center justify-end gap-3 flex-shrink-0 bg-white">
              {(localError || actionError) && (
                <div className="mr-auto rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {localError || actionError}
                </div>
              )}
              {hasChanges && (
                <div className="flex flex-col text-left mr-auto">
                  <span className="b4 font-bold text-text-primary">
                    Unsaved changes
                  </span>
                  <span className="b5 text-text-secondary">
                    You modified this item.
                  </span>
                </div>
              )}
              {hasChanges && (
                <Button
                  variant="ghost"
                  onClick={() =>
                    setDraftItem(JSON.parse(JSON.stringify(originalItem)))
                  }
                  className="text-text-secondary hover:bg-black/5 b4"
                >
                  Discard
                </Button>
              )}
              <Button variant="ghost" onClick={handleCloseModal} className="b4">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveItem}
                disabled={!hasChanges || !isValidDraft || isLocalLoading}
                className={cn(
                  "b4 bg-brand-accent hover:bg-brand-accent/90 border-brand-accent text-white",
                  (!hasChanges || !isValidDraft || isLocalLoading) &&
                    "opacity-50 pointer-events-none",
                )}
              >
                {isLocalLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Category modal ───────────────────────────────────────────────── */}
      {catModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-text-primary/40 backdrop-blur-sm p-4 modal-overlay">
          <div className="bg-white rounded-2xl md:rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden modal-panel flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 flex items-center justify-between border-b border-black/[0.05] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <FolderPlus size={18} />
                </div>
                <h2 className="b2 font-bold">
                  {catModal === "new" ? "New Category" : "Edit Category"}
                </h2>
              </div>
              <button
                onClick={() => setCatModal(null)}
                className="p-2 rounded-xl text-text-secondary hover:bg-black/5 hover:text-text-primary transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5"
              style={{ minHeight: 0 }}
            >
              {(localError || actionError) && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {localError || actionError}
                </div>
              )}
              <div>
                <FieldLabel>
                  Category Name <span className="text-brand-accent">*</span>
                </FieldLabel>
                <Input
                  value={catDraft.name ?? ""}
                  onChange={(e) =>
                    setCatDraft({ ...catDraft, name: e.target.value })
                  }
                  placeholder="e.g. Appetizers"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && catDraft.name?.trim())
                      handleSaveCategory();
                  }}
                  autoFocus
                  className="bg-white b2"
                />
              </div>

              <div>
                <FieldLabel>Icon</FieldLabel>
                <div className="rounded-2xl border border-black/[0.07] p-3 bg-transparent">
                  <IconPicker
                    value={catDraft.icon ?? "flame"}
                    onChange={(icon) => setCatDraft({ ...catDraft, icon })}
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-black/[0.05] flex justify-end gap-2 flex-shrink-0 bg-black/[0.01]">
              <Button
                variant="ghost"
                onClick={() => setCatModal(null)}
                className="b4"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveCategory}
                disabled={!catDraft.name?.trim() || isLocalLoading}
                className="b4 bg-brand-accent hover:bg-brand-accent/90 border-brand-accent text-white"
              >
                {isLocalLoading
                  ? "Saving..."
                  : catModal === "new"
                    ? "Create Category"
                    : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Crop modal ───────────────────────────────────────────────────── */}
      {cropModalImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 modal-overlay select-none">
          <div className="bg-bg-primary rounded-2xl md:rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden modal-panel flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 flex items-center justify-between border-b border-black/[0.05] flex-shrink-0">
              <h2 className="b2 font-bold">Adjust Image</h2>
              <button
                onClick={() => setCropModalImage(null)}
                className="p-2 rounded-xl text-text-secondary hover:bg-black/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex flex-col gap-5">
              <p className="b4 text-text-secondary">
                Drag to reposition, use slider to zoom.
              </p>
              <div
                className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mx-auto rounded-2xl overflow-hidden bg-black/5 cursor-move shadow-inner group"
                onMouseDown={handleCropMouseDown}
                onMouseMove={handleCropMouseMove}
                onMouseUp={handleCropMouseUp}
                onMouseLeave={handleCropMouseUp}
              >
                <img
                  src={cropModalImage}
                  style={{
                    width: `${renderedWidth}px`,
                    height: `${renderedHeight}px`,
                    transform: `translate(${cropPan.x}px, ${cropPan.y}px) scale(${cropScale})`,
                    transition: isDraggingCrop
                      ? "none"
                      : "transform 0.1s ease-out",
                  }}
                  className="max-w-none origin-center pointer-events-none absolute"
                  alt="Crop preview"
                />
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white/40" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 bg-transparent p-3 rounded-2xl border border-white/40 max-w-[320px] mx-auto w-full">
                <ZoomOut
                  size={16}
                  className="text-text-secondary flex-shrink-0"
                />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={cropScale}
                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                  className="flex-1 accent-brand-accent"
                />
                <ZoomIn
                  size={16}
                  className="text-text-secondary flex-shrink-0"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setCropModalImage(null)}
                  className="b4"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmImageCrop}
                  className="b4 bg-brand-accent hover:bg-brand-accent/90 border-brand-accent text-white"
                >
                  Confirm & Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Global Confirmation Modal ────────────────────────────────────── */}
      <ActionConfirmationModal
        isOpen={deleteConfirm.isOpen}
        action="delete"
        title={
          deleteConfirm.type === "category" ? "Delete Category" : "Delete Items"
        }
        message={
          deleteConfirm.type === "category"
            ? "Are you sure you want to delete this category and all its items? This cannot be undone."
            : `Are you sure you want to delete ${selectedItems.length} item(s)? This cannot be undone.`
        }
        onClose={() => setDeleteConfirm({ isOpen: false, type: null })}
        onConfirm={async () => {
          if (deleteConfirm.type === "category" && deleteConfirm.categoryId) {
            await handleDeleteCategory(deleteConfirm.categoryId);
          } else if (deleteConfirm.type === "items") {
            await deleteSelectedItems();
          }
          setDeleteConfirm({ isOpen: false, type: null });
        }}
        saving={isLocalLoading}
      />

      {/* ── CSS Animations ─────────────────────────────────────────────── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar{width:5px}
          .custom-scrollbar::-webkit-scrollbar-track{background:transparent}
          .custom-scrollbar::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.08);border-radius:10px}
          .custom-scrollbar:hover::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.18)}

          /* ── Modal overlay: soft fade ──────────────────────────────── */
          @keyframes modal-overlay-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }

          /* ── Modal panel: rise + scale from slightly below center ──── */
          @keyframes modal-panel-in {
            from {
              opacity: 0;
              transform: translateY(32px) scale(0.94);
            }
            to {
              opacity: 1;
              transform: translateY(0px) scale(1);
            }
          }

          .modal-overlay {
            animation: modal-overlay-in 0.2s ease forwards;
          }

          .modal-panel {
            animation: modal-panel-in 0.35s cubic-bezier(0.22, 0.8, 0.4, 1) forwards;
          }
        `,
        }}
      />
    </div>
  );
};

// ─── Grid Card ───────────────────────────────────────────────────────────────

interface CardProps {
  item: MenuItem;
  selected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onToggleAvail: () => void;
}

const GridCard: React.FC<CardProps> = ({
  item,
  selected,
  onSelect,
  onClick,
  onToggleAvail,
}) => (
  <div
    onClick={onClick}
    className={cn(
      "bg-transparent rounded-2xl border overflow-hidden shadow-none hover:shadow-none transition-all cursor-pointer group flex flex-col relative",
      selected
        ? "border-brand-accent/60 ring-2 ring-brand-accent/15"
        : "border-black/[0.12] hover:border-brand-accent/40",
    )}
  >
    <div
      className="absolute top-2.5 left-2.5 z-20 bg-transparent rounded-[6px] shadow-none"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <Checkbox checked={selected} onChange={onSelect} />
    </div>
    <div className="aspect-[4/3] bg-black/5 flex items-center justify-center relative overflow-hidden">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center">
            <ImageIcon size={20} className="text-black/25" />
          </div>
        </div>
      )}
      {!item.isAvailable && (
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center backdrop-blur-[2px]">
          <span className="text-white text-[10px] font-bold bg-black/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Unavailable
          </span>
        </div>
      )}
    </div>
    <div className="p-3.5 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="b4 font-bold text-text-primary group-hover:text-brand-accent transition-colors leading-tight line-clamp-1">
          {item.name}
        </h4>
        <span className="b4 font-bold text-brand-accent flex-shrink-0">
          ₱{item.price}
        </span>
      </div>
      <p className="b5 text-text-secondary line-clamp-2 mt-auto">
        {item.description}
      </p>
      {(item.sizes.length > 0 ||
        (item.addonsEnabled && item.addons.length > 0)) && (
        <div className="flex gap-1 mt-2.5 flex-wrap">
          {item.sizes.length > 0 && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-brand-secondary/50 border border-brand-primary/20 text-text-secondary font-medium">
              {item.sizes.length} size{item.sizes.length > 1 ? "s" : ""}
            </span>
          )}
          {item.addonsEnabled && item.addons.length > 0 && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-brand-accent/8 border border-brand-accent/20 text-brand-accent font-medium">
              {item.addons.length} add-on{item.addons.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </div>
    <div
      className="px-3.5 py-2.5 border-t border-black/5 flex items-center justify-between"
      onClick={(e) => {
        e.stopPropagation();
        onToggleAvail();
      }}
    >
      <span className="b5 text-text-secondary">
        {item.isAvailable ? "Available" : "Unavailable"}
      </span>
      <button
        className={cn(
          "relative transition-colors rounded-full border-none flex-shrink-0",
          item.isAvailable ? "bg-success-primary" : "bg-black/20",
        )}
        style={{ width: 32, height: 18 }}
        aria-pressed={item.isAvailable}
      >
        <span
          className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all"
          style={{ left: item.isAvailable ? "calc(100% - 16px)" : 2 }}
        />
      </button>
    </div>
  </div>
);

// ─── Collapsible Table Row ────────────────────────────────────────────────────

interface TableRowProps extends CardProps {
  expanded: boolean;
  onToggleExpand: () => void;
}

const CollapsibleTableRow: React.FC<TableRowProps> = ({
  item,
  selected,
  onSelect,
  onClick,
  onToggleAvail,
  expanded,
  onToggleExpand,
}) => (
  <div
    className={cn(
      "border-b border-black/[0.05] last:border-0",
      selected && "bg-brand-accent/4",
    )}
  >
    <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-black/[0.02] transition-colors group">
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="flex items-center justify-center flex-shrink-0"
      >
        <Checkbox checked={selected} onChange={onSelect} />
      </div>
      <div className="w-12 h-12 rounded-xl bg-black/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon size={16} className="text-black/20" />
        )}
      </div>
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
        <p className="b4 font-bold text-text-primary group-hover:text-brand-accent transition-colors truncate">
          {item.name}
        </p>
        <p className="b5 text-text-secondary truncate hidden sm:block">
          {item.description || "—"}
        </p>
      </div>
      <div className="b4 font-bold text-brand-accent flex-shrink-0">
        ₱{item.price}
      </div>
      <div className="hidden sm:block b5 text-text-secondary flex-shrink-0 w-20">
        {item.sizes.length ? (
          `${item.sizes.length} size${item.sizes.length > 1 ? "s" : ""}`
        ) : (
          <span className="text-black/20">—</span>
        )}
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggleAvail();
        }}
        className="flex items-center flex-shrink-0"
      >
        <button
          className={cn(
            "relative transition-colors rounded-full border-none flex-shrink-0",
            item.isAvailable ? "bg-success-primary" : "bg-black/20",
          )}
          style={{ width: 32, height: 18 }}
          aria-pressed={item.isAvailable}
        >
          <span
            className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all"
            style={{ left: item.isAvailable ? "calc(100% - 16px)" : 2 }}
          />
        </button>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpand();
        }}
        className="sm:hidden p-1.5 rounded-lg hover:bg-black/5 text-text-secondary transition-colors flex-shrink-0"
      >
        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
    </div>

    {expanded && (
      <div className="sm:hidden px-4 pb-3.5 pt-1 border-t border-black/5 bg-black/[0.01] flex flex-col gap-2 animate-in slide-in-from-top-1 duration-150">
        {item.description && (
          <p className="b5 text-text-secondary">{item.description}</p>
        )}
        <div className="flex gap-3 flex-wrap">
          {item.sizes.length > 0 && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-brand-secondary/50 border border-brand-primary/20 text-text-secondary font-medium">
              {item.sizes.length} size{item.sizes.length > 1 ? "s" : ""}
            </span>
          )}
          {item.addonsEnabled && item.addons.length > 0 && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-brand-accent/8 border border-brand-accent/20 text-brand-accent font-medium">
              {item.addons.length} add-on{item.addons.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          onClick={onClick}
          className="mt-1 flex items-center gap-1.5 text-brand-accent b5 font-bold hover:underline"
        >
          <Edit2 size={12} /> Edit item
        </button>
      </div>
    )}
  </div>
);

export default MenuCategoryManagement;
