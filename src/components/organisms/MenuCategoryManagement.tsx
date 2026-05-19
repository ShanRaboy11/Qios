"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { Badge } from "@/components/atoms/Badge";
import { Checkbox } from "@/components/atoms/Checkbox";
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

// ─── Types ──────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Addon {
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
  addonsEnabled: boolean;
  addons: Addon[];
  sizes: Size[];
  image?: string;
}

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

// ─── Mock data ───────────────────────────────────────────────────────────────

const INITIAL_CATEGORIES: Category[] = [
  { id: "1", name: "Sizzling", icon: "flame" },
  { id: "2", name: "Drinks", icon: "coffee" },
  { id: "3", name: "Desserts", icon: "ice-cream" },
  { id: "4", name: "Breakfast", icon: "egg" },
];

const INITIAL_ITEMS: MenuItem[] = [
  {
    id: "item_1",
    categoryId: "1",
    name: "Chicken Adobo",
    description: "Slow-cooked in vinegar, soy, & garlic",
    price: "500.00",
    isAvailable: true,
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
    isAvailable: false,
    addonsEnabled: false,
    addons: [],
    sizes: [],
  },
  {
    id: "item_4",
    categoryId: "1",
    name: "Pork Sinigang",
    description: "Sour tamarind broth with tender pork",
    price: "420.00",
    isAvailable: true,
    addonsEnabled: false,
    addons: [],
    sizes: [],
  },
  {
    id: "item_5",
    categoryId: "3",
    name: "Leche Flan",
    description: "Classic steamed caramel custard",
    price: "120.00",
    isAvailable: true,
    addonsEnabled: false,
    addons: [],
    sizes: [],
  },
  {
    id: "item_6",
    categoryId: "4",
    name: "Tapsilog",
    description: "Cured beef, egg & garlic rice",
    price: "195.00",
    isAvailable: true,
    addonsEnabled: false,
    addons: [],
    sizes: [
      { id: "s5", name: "Solo", description: "", price: "0.00" },
      { id: "s6", name: "Family", description: "", price: "250.00" },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const uid = () => `_${Math.random().toString(36).slice(2, 8)}`;

// ─── Skeleton components ──────────────────────────────────────────────────────

const Shimmer = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-black/[0.07] rounded-xl", className)} />
);

const GridCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm flex flex-col">
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
    {/* Selected preview */}
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

    {/* Grid — fixed: added px-1 inside the scroll area so icons aren't clipped on the right */}
    <div
      className="overflow-y-auto custom-scrollbar"
      style={{ maxHeight: 220 }}
    >
      {/* px-0.5 ensures the focus ring / scale on selected icon is not clipped */}
      <div className="grid grid-cols-6 gap-2 px-0.5 pb-1">
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
                : "bg-white/60 border-black/[0.08] text-text-secondary hover:bg-brand-secondary/50 hover:border-brand-primary hover:text-brand-accent",
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
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [items, setItems] = useState<MenuItem[]>(INITIAL_ITEMS);
  const [activeCatId, setActiveCatId] = useState<string>("1");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const [cropModalImage, setCropModalImage] = useState<string | null>(null);
  const [imageNativeSize, setImageNativeSize] = useState({ w: 1, h: 1 });
  const [cropScale, setCropScale] = useState(1);
  const [cropPan, setCropPan] = useState({ x: 0, y: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const dragStartCrop = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const CROP_CONTAINER_SIZE = 320;

  // Simulate loading state
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  // Reset loading when category changes
  const handleCategoryChange = (id: string) => {
    setActiveCatId(id);
    setSearchQuery("");
    setFilterAvail("all");
    setSelectedItems([]);
    setSidebarOpen(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const activeCat =
    categories.find((c) => c.id === activeCatId) ?? categories[0];
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

  // Category handlers
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

  const openNewCatModal = () => {
    setCatDraft({ name: "", icon: "flame" });
    setCatModal("new");
  };
  const openEditCatModal = (cat: Category) => {
    setCatDraft({ ...cat });
    setCatModal("edit");
  };

  const handleSaveCategory = () => {
    if (!catDraft.name?.trim()) return;
    if (catModal === "new") {
      const nc: Category = {
        id: `cat_${Date.now()}`,
        name: catDraft.name.trim(),
        icon: catDraft.icon ?? "flame",
      };
      setCategories([...categories, nc]);
      setActiveCatId(nc.id);
    } else {
      setCategories(
        categories.map((c) =>
          c.id === catDraft.id
            ? {
                ...c,
                name: catDraft.name!.trim(),
                icon: catDraft.icon ?? c.icon,
              }
            : c,
        ),
      );
    }
    setCatModal(null);
  };

  const handleDeleteCategory = (id: string) => {
    const remaining = categories.filter((c) => c.id !== id);
    setCategories(remaining);
    setItems((prev) => prev.filter((i) => i.categoryId !== id));
    setActiveCatId(remaining.length ? remaining[0].id : "");
    setCatModal(null);
  };

  const toggleSelection = (id: string) =>
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  const deleteSelectedItems = () => {
    setItems((prev) => prev.filter((i) => !selectedItems.includes(i.id)));
    setSelectedItems([]);
  };

  const handleOpenModal = (item: MenuItem) => {
    setOriginalItem(item);
    setDraftItem(JSON.parse(JSON.stringify(item)));
  };
  const handleCloseModal = () => {
    setOriginalItem(null);
    setDraftItem(null);
  };
  const handleSaveItem = () => {
    if (!draftItem || !isValidDraft) return;
    const exists = items.some((i) => i.id === draftItem.id);
    setItems(
      exists
        ? items.map((i) => (i.id === draftItem.id ? draftItem : i))
        : [...items, draftItem],
    );
    handleCloseModal();
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

  const toggleItemAvailability = (id: string) =>
    setItems(
      items.map((i) =>
        i.id === id ? { ...i, isAvailable: !i.isAvailable } : i,
      ),
    );

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
    <div className="font-inter relative flex w-full h-full min-h-screen bg-bg-primary">
      {/* ── Mobile sidebar overlay ──────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] z-40 flex flex-col bg-bg-primary transition-transform duration-300 border-r border-black/[0.06]",
          "lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0",
          sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full",
        )}
      >
        <div className="lg:hidden p-3 border-b border-black/[0.06] flex items-center justify-between flex-shrink-0">
          <p className="b3 font-bold text-text-primary">Categories</p>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-black/5 text-text-secondary"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-4 flex-shrink-0">
          <Button
            variant="primary"
            className="w-full bg-brand-accent hover:bg-brand-accent/90 border-brand-accent"
            leftIcon={<Plus size={18} />}
            onClick={openNewCatModal}
          >
            New Category
          </Button>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={16} className="text-text-secondary" />
            </div>
            <Input
              placeholder="Search categories"
              className="pl-11 !py-2.5 rounded-xl !bg-white/60 !border-white/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar flex flex-col gap-2">
          {categories.map((cat) => {
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
                  "group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 border",
                  isActive
                    ? "bg-white shadow-md border-white/60 scale-[1.02]"
                    : "hover:bg-white/40 border-transparent",
                  draggedCategoryId === cat.id &&
                    "opacity-50 border-dashed border-brand-accent border-2",
                )}
              >
                <div className="cursor-grab text-text-secondary/40 hover:text-text-primary/60 active:cursor-grabbing flex-shrink-0">
                  <GripVertical size={16} />
                </div>
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                    isActive
                      ? "bg-brand-accent text-white shadow-sm"
                      : "bg-black/6 text-text-secondary group-hover:bg-brand-secondary/60 group-hover:text-brand-accent",
                  )}
                >
                  {renderCategoryIcon(cat.icon, 17)}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className={cn(
                      "b2 font-bold transition-colors truncate",
                      isActive ? "text-text-primary" : "text-text-primary/80",
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

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Header bar — glassmorphism ─────────────────────────────────── */}
        <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-black/[0.06] px-4 lg:px-6 py-3.5 flex items-center gap-3">
          {/* Mobile: sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-black/5 text-text-secondary flex-shrink-0"
          >
            <Filter size={18} />
          </button>

          {/* Mobile category display — name + counts */}
          {activeCat && (
            <div className="flex items-center gap-2.5 lg:hidden flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-brand-accent text-white flex items-center justify-center flex-shrink-0">
                {renderCategoryIcon(activeCat.icon, 16)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="b3 font-bold text-text-primary truncate leading-tight">
                  {activeCat.name}
                </span>
                <span className="b5 text-text-secondary leading-tight">
                  {totalCount} items · {availCount} available
                </span>
              </div>
            </div>
          )}

          {/* Desktop: full category header */}
          {activeCat && (
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-brand-accent text-white flex items-center justify-center shadow-sm flex-shrink-0">
                {renderCategoryIcon(activeCat.icon, 20)}
              </div>
              <div>
                <p className="b2 font-bold text-text-primary leading-tight">
                  {activeCat.name}
                </p>
                <p className="b5 text-text-secondary">
                  {totalCount} items · {availCount} available
                </p>
              </div>
            </div>
          )}

          {activeCat && (
            <button
              onClick={() => openEditCatModal(activeCat)}
              className="p-2 rounded-xl hover:bg-black/5 text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
              title="Edit category"
            >
              <Edit2 size={15} />
            </button>
          )}

          {/* Search */}
          <div className="relative flex-1 max-w-xs ml-auto hidden sm:block">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items…"
              className="pl-9 !py-2.5 rounded-xl !bg-black/4 b4 w-full border-transparent"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5 bg-black/5 p-1 rounded-xl flex-shrink-0">
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === mode
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary",
                )}
              >
                {mode === "grid" ? (
                  <LayoutGrid size={17} />
                ) : (
                  <ListIcon size={17} />
                )}
              </button>
            ))}
          </div>

          {/* Add item */}
          <Button
            variant="primary"
            onClick={handleCreateNewItem}
            className="flex-shrink-0 b4 !py-2.5 !px-4 bg-brand-accent hover:bg-brand-accent/90 border-brand-accent"
            leftIcon={<Plus size={16} />}
          >
            <span className="hidden sm:inline">Add Item</span>
          </Button>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden px-4 pt-3 flex-shrink-0">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items…"
              className="pl-9 !py-2.5 rounded-xl !bg-white b4 w-full"
            />
          </div>
        </div>

        {/* Filter chips + bulk bar */}
        <div className="flex-shrink-0 px-4 lg:px-6 pt-3 pb-2 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="b5 text-text-secondary flex-shrink-0">
              Filter:
            </span>
            {(
              [
                { key: "all", label: `All (${totalCount})` },
                { key: "avail", label: `Available (${availCount})` },
                {
                  key: "unavail",
                  label: `Unavailable (${totalCount - availCount})`,
                },
              ] as { key: FilterAvail; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterAvail(key)}
                className={cn(
                  "px-3 py-1.5 rounded-full b5 font-medium border transition-all",
                  filterAvail === key
                    ? key === "unavail"
                      ? "bg-brand-accent text-white border-brand-accent"
                      : "bg-text-primary text-white border-text-primary"
                    : "bg-white/60 text-text-secondary border-black/10 hover:border-black/20 hover:text-text-primary",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {selectedItems.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-2xl border border-black/5 shadow-sm animate-in slide-in-from-top-2 duration-200">
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
                onClick={deleteSelectedItems}
                className="b4 font-medium text-brand-accent hover:text-brand-accent/80 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Item grid/list */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-8 custom-scrollbar">
          {isLoading ? (
            viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <GridCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-black/[0.07] overflow-hidden bg-white shadow-sm">
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
            <div className="rounded-2xl border border-black/[0.07] overflow-hidden bg-white shadow-sm">
              <div className="hidden sm:grid sm:grid-cols-[32px_56px_1fr_90px_90px_70px] gap-3 px-4 py-3 border-b border-black/[0.06] bg-black/[0.02]">
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

      {/* ── Item modal ─────────────────────────────────────────────────────── */}
      {draftItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-bg-primary rounded-[28px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-white/50 animate-in zoom-in-95 duration-300 overflow-hidden">
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
                          : "border-2 border-dashed border-black/15 hover:border-brand-accent bg-white/60 hover:bg-white/80",
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
                      className="flex items-start gap-2 p-3.5 bg-white/80 rounded-2xl border border-black/5 shadow-sm"
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
                        className="flex items-start gap-2 p-3.5 bg-white/80 rounded-2xl border border-black/5 shadow-sm"
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
            </div>

            <div className="p-4 border-t-2 border-black/5 flex items-center justify-end gap-3 flex-shrink-0 bg-white">
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
                disabled={!hasChanges || !isValidDraft}
                className={cn(
                  "b4 bg-brand-accent hover:bg-brand-accent/90 border-brand-accent text-white",
                  (!hasChanges || !isValidDraft) &&
                    "opacity-50 pointer-events-none",
                )}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Category modal ───────────────────────────────────────────────── */}
      {catModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-text-primary/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl md:rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
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

            {/*
              ── Icon picker fix ───────────────────────────────────────────
              Added overflow-hidden to the scroll container and px-0.5 inside
              the grid so the selected icon's scale(1.05) isn't clipped.
              Also gave the modal body overflow-y-auto with a min-height so
              the picker grid is fully visible without the modal cropping it.
            */}
            <div
              className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5"
              style={{ minHeight: 0 }}
            >
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
                {/* Wrapper: no overflow-hidden so the scale ring isn't clipped */}
                <div className="rounded-2xl border border-black/[0.07] p-3 bg-bg-primary/60">
                  <IconPicker
                    value={catDraft.icon ?? "flame"}
                    onChange={(icon) => setCatDraft({ ...catDraft, icon })}
                  />
                </div>
              </div>

              {catModal === "edit" && catDraft.id && (
                <div className="pt-3 border-t border-black/[0.06]">
                  <button
                    onClick={() => {
                      if (
                        confirm(`Delete "${catDraft.name}" and all its items?`)
                      )
                        handleDeleteCategory(catDraft.id!);
                    }}
                    className="flex items-center gap-2 b4 text-brand-accent hover:bg-brand-accent/8 px-3 py-2 rounded-xl transition-colors"
                  >
                    <Trash2 size={14} /> Delete category & all items
                  </button>
                </div>
              )}
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
                disabled={!catDraft.name?.trim()}
                className="b4 bg-brand-accent hover:bg-brand-accent/90 border-brand-accent text-white"
              >
                {catModal === "new" ? "Create Category" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Crop modal ───────────────────────────────────────────────────── */}
      {cropModalImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
          <div className="bg-bg-primary rounded-2xl md:rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
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
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-2xl border border-white max-w-[320px] mx-auto w-full">
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar{width:5px}
          .custom-scrollbar::-webkit-scrollbar-track{background:transparent}
          .custom-scrollbar::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.08);border-radius:10px}
          .custom-scrollbar:hover::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.18)}
          @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
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
      "bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col relative",
      selected
        ? "border-brand-accent/50 ring-2 ring-brand-accent/15"
        : "border-black/5 hover:border-brand-accent/30",
    )}
  >
    <div
      className="absolute top-2.5 left-2.5 z-20 bg-white rounded-[6px] shadow-sm"
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
