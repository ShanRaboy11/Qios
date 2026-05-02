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
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MenuCategoryManagement.tsx
 *
 * Core admin builder interface for managing the kiosk menu.
 * Transforms the customer-facing item UI into an editable admin canvas.
 */

interface Category {
  id: string;
  name: string;
}

interface Modifier {
  id: string;
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

const MenuCategoryManagement = () => {
  // state for category navigator
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Sizzling" },
    { id: "2", name: "Drinks" },
    { id: "3", name: "Desserts" },
    { id: "4", name: "Breakfast" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("1");

  // state for item configuration card
  const [itemName, setItemName] = useState("Chicken Adobo");
  const [price, setPrice] = useState("500.00");
  const [description, setDescription] = useState(
    "Slow-cooked in vinegar, soy, & garlic"
  );
  
  const [isAvailable, setIsAvailable] = useState(true);
  const [aiSynced, setAiSynced] = useState(true);
  const [isBestseller, setIsBestseller] = useState(true);
  const [specialInstructionsEnabled, setSpecialInstructionsEnabled] = useState(true);

  const [modifiers, setModifiers] = useState<Modifier[]>([
    { id: "m1", name: "Extra Rice", description: "Pan-fried crispy tofu cubes", price: "35.00" },
    { id: "m2", name: "French Fries", description: "Pan-fried crispy tofu cubes", price: "35.00" },
    { id: "m3", name: "Spaghetti", description: "Pan-fried crispy tofu cubes", price: "35.00" },
    { id: "m4", name: "Drinks", description: "Pan-fried crispy tofu cubes", price: "35.00" },
  ]);

  const [sizes, setSizes] = useState<Size[]>([
    { id: "s1", name: "Regular", description: "Gentle kick, great for sensitive palates", price: "Free" },
    { id: "s2", name: "Large", description: "Gentle kick, great for sensitive palates", price: "Free" },
  ]);

  return (
    <div className="min-h-screen bg-bg-primary p-4 md:p-8 font-inter">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Navigator */}
        <aside className="lg:col-span-4 flex flex-col flex-shrink-0 border-4 border-white rounded-[32px] md:rounded-[40px] bg-white/30 backdrop-blur-md h-[85vh] shadow-xl overflow-hidden">
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
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-300",
                    selectedCategory === cat.id
                      ? "bg-white shadow-md border border-white/60 transform scale-[1.02]"
                      : "hover:bg-white/40 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab text-text-secondary/50 hover:text-text-primary active:cursor-grabbing">
                      <GripVertical size={16} />
                    </div>
                    <span className={cn(
                      "b2 font-bold transition-colors",
                      selectedCategory === cat.id ? "text-text-primary" : "text-text-primary/80"
                    )}>
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

        {/* Main Panel - Item Configuration Builder */}
        <main className="lg:col-span-8 flex flex-col min-w-0">
          <div className="bg-bg-primary border-4 border-white rounded-[32px] md:rounded-[40px] shadow-xl overflow-hidden flex flex-col h-[85vh] relative">
            
            {/* Header - The Yellow Banner Builder */}
            <div className="bg-brand-secondary p-6 md:p-8 flex-shrink-0 relative flex flex-col gap-6">
              
              <div className="flex justify-between items-start">
                <button onClick={() => setIsBestseller(!isBestseller)} className="group outline-none" title="Toggle Bestseller Badge">
                  <Badge 
                    color={isBestseller ? "accent" : "primary"} 
                    variant={isBestseller ? "solid" : "subtle"} 
                    shape="rounded"
                    className="uppercase font-bold transition-all group-hover:scale-105"
                  >
                    Bestseller
                  </Badge>
                </button>

                <Badge 
                  color={aiSynced ? "success" : "secondary"} 
                  variant="solid" 
                  shape="pill"
                  leftIcon={aiSynced ? <CheckCircle2 size={14} /> : <Sparkles size={14} className="animate-pulse" />}
                  className="shadow-sm"
                >
                  {aiSynced ? "AI Synced" : "Syncing to Gemini..."}
                </Badge>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-6 w-full">
                <div className="flex flex-col gap-1 flex-1 w-full max-w-lg mt-2">
                  <Input
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Item Name"
                    className="!text-3xl md:!text-[38px] leading-none font-figtree font-bold !bg-transparent !border-transparent !p-0 !h-auto focus:!border-white/50 focus:!bg-white/20 transition-all placeholder:text-black/20 text-text-primary"
                  />
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description (e.g. ingredients)"
                    className="!text-sm md:!text-base font-inter !bg-transparent !border-transparent !p-0 mt-2 !h-auto focus:!border-white/50 focus:!bg-white/20 transition-all placeholder:text-black/20 text-text-primary/80"
                  />
                </div>

                {/* Image Upload Placeholder */}
                <button className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-dashed border-black/10 bg-white/40 hover:bg-white/60 transition-all flex flex-col items-center justify-center gap-2 text-black/40 hover:text-brand-primary flex-shrink-0 group shadow-inner">
                  <ImageIcon size={32} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Upload Image</span>
                </button>
              </div>
            </div>

            {/* Body - Options & Modifiers Builder */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-bg-primary pb-32 custom-scrollbar">
              
              {/* Price & Availability Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-black/10">
                <div className="flex items-center gap-1">
                  <span className="text-brand-accent h3 font-bold">₱</span>
                  <Input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="!text-2xl font-bold !text-brand-accent !bg-transparent !border-transparent !px-2 !py-0 !w-32 focus:!border-brand-accent/30 focus:!bg-white"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Available</span>
                  <Toggle isOn={isAvailable} onChange={setIsAvailable} variant="accent" />
                </div>
              </div>

              {/* Modifiers Builder Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <h4 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Modifiers</h4>
                  <Badge color="warning" variant="outline" shape="pill" className="!text-[10px] uppercase font-bold border-warning-primary/30">Choose any</Badge>
                </div>
                
                <div className="space-y-3">
                  {modifiers.map((mod, index) => (
                    <div key={mod.id} className="flex items-start md:items-center gap-3 p-3 bg-white rounded-2xl border border-black/5 hover:border-black/10 transition-colors group shadow-sm">
                      <div className="cursor-grab text-black/20 hover:text-black/40 pt-2 md:pt-0 pl-1">
                        <GripVertical size={16} />
                      </div>
                      <div className="w-5 h-5 rounded flex-shrink-0 border-2 border-brand-primary mt-2 md:mt-0" />
                      
                      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full min-w-0">
                        <div className="flex flex-col flex-1 gap-1 min-w-0">
                          <Input 
                            value={mod.name} 
                            onChange={(e) => {
                              const newMods = [...modifiers]; newMods[index].name = e.target.value; setModifiers(newMods);
                            }} 
                            placeholder="Modifier Name" 
                            className="!bg-transparent !border-transparent !p-0 !h-auto !font-bold focus:!bg-gray-50 focus:!p-1 transition-all" 
                          />
                          <Input 
                            value={mod.description} 
                            onChange={(e) => {
                              const newMods = [...modifiers]; newMods[index].description = e.target.value; setModifiers(newMods);
                            }} 
                            placeholder="Sub-description (optional)" 
                            className="!bg-transparent !border-transparent !p-0 !h-auto !text-xs !text-text-secondary focus:!bg-gray-50 focus:!p-1 transition-all" 
                          />
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0 self-end md:self-auto">
                          <span className="text-brand-accent font-bold text-sm">+₱</span>
                          <Input 
                            value={mod.price} 
                            onChange={(e) => {
                              const newMods = [...modifiers]; newMods[index].price = e.target.value; setModifiers(newMods);
                            }} 
                            placeholder="0.00" 
                            className="!bg-transparent !border-transparent !p-0 !h-auto !w-16 !font-bold !text-brand-accent focus:!bg-gray-50 focus:!p-1 text-right transition-all" 
                          />
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setModifiers(modifiers.filter(m => m.id !== mod.id))} 
                        className="text-error-primary/30 hover:text-error-primary p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Modifier"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    onClick={() => setModifiers([...modifiers, {id: Date.now().toString(), name: "New Modifier", description: "", price: "0.00"}])} 
                    className="w-full border border-dashed border-black/10 hover:border-brand-primary hover:bg-brand-primary/5 text-text-secondary hover:text-brand-primary rounded-2xl py-3"
                  >
                    <Plus size={16} className="mr-2" /> Add Modifier
                  </Button>
                </div>
              </div>

              <div className="w-full h-px bg-black/10 my-8" />

              {/* Sizes Builder Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <h4 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Size</h4>
                  <Badge color="error" variant="outline" shape="pill" className="!text-[10px] uppercase font-bold border-warning-primary/30">Required</Badge>
                </div>
                
                <div className="space-y-3">
                  {sizes.map((size, index) => (
                    <div key={size.id} className="flex items-start md:items-center gap-3 p-3 bg-white rounded-2xl border border-black/5 hover:border-black/10 transition-colors group shadow-sm">
                      <div className="cursor-grab text-black/20 hover:text-black/40 pt-2 md:pt-0 pl-1">
                        <GripVertical size={16} />
                      </div>
                      <div className="w-5 h-5 rounded-full flex-shrink-0 border-2 border-brand-primary mt-2 md:mt-0 flex items-center justify-center">
                        {index === 1 && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
                      </div>
                      
                      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full min-w-0">
                        <div className="flex flex-col flex-1 gap-1 min-w-0">
                          <Input 
                            value={size.name} 
                            onChange={(e) => {
                              const newSizes = [...sizes]; newSizes[index].name = e.target.value; setSizes(newSizes);
                            }} 
                            placeholder="Size Name" 
                            className="!bg-transparent !border-transparent !p-0 !h-auto !font-bold focus:!bg-gray-50 focus:!p-1 transition-all" 
                          />
                          <Input 
                            value={size.description} 
                            onChange={(e) => {
                              const newSizes = [...sizes]; newSizes[index].description = e.target.value; setSizes(newSizes);
                            }} 
                            placeholder="Sub-description (optional)" 
                            className="!bg-transparent !border-transparent !p-0 !h-auto !text-xs !text-text-secondary focus:!bg-gray-50 focus:!p-1 transition-all" 
                          />
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0 self-end md:self-auto">
                          <Input 
                            value={size.price} 
                            onChange={(e) => {
                              const newSizes = [...sizes]; newSizes[index].price = e.target.value; setSizes(newSizes);
                            }} 
                            placeholder="Free" 
                            className={cn(
                              "!bg-transparent !border-transparent !p-0 !h-auto !w-20 !font-bold focus:!bg-gray-50 focus:!p-1 text-right transition-all",
                              size.price.toLowerCase() === "free" ? "!text-success-primary" : "!text-brand-accent"
                            )} 
                          />
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setSizes(sizes.filter(s => s.id !== size.id))} 
                        className="text-error-primary/30 hover:text-error-primary p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Size"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    onClick={() => setSizes([...sizes, {id: Date.now().toString(), name: "New Size", description: "", price: "Free"}])} 
                    className="w-full border border-dashed border-black/10 hover:border-brand-primary hover:bg-brand-primary/5 text-text-secondary hover:text-brand-primary rounded-2xl py-3"
                  >
                    <Plus size={16} className="mr-2" /> Add Size
                  </Button>
                </div>
              </div>

              <div className="w-full h-px bg-black/10 my-8" />

              {/* Special Instructions Setup */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Special Instructions</h4>
                  <Toggle isOn={specialInstructionsEnabled} onChange={setSpecialInstructionsEnabled} variant="primary" />
                </div>
                {specialInstructionsEnabled && (
                  <div className="w-full min-h-[100px] bg-white rounded-[20px] border border-black/5 shadow-sm p-4 text-text-secondary/50 text-sm italic">
                    e.g., less sauce, extra spicy (Visual preview for the customer)
                  </div>
                )}
              </div>

            </div>

            {/* Sticky Action Footer */}
            <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 bg-bg-primary/90 backdrop-blur-md border-t border-white flex justify-center">
              <Button variant="accent" size="lg" className="w-full max-w-sm rounded-full font-bold shadow-xl">
                Save Item Configuration
              </Button>
            </div>

          </div>
        </main>
      </div>
      
      {/* scrollbar styling matching other pages */}
      <style dangerouslySetInnerHTML={{__html: `
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
      `}} />
    </div>
  );
};

export default MenuCategoryManagement;
