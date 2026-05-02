"use client";

import React, { useState } from "react";
import {
  GripVertical,
  Plus,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Save,
  Trash2,
  ChevronRight,
  Search,
} from "lucide-react";

/**
 * menucategorymanagement.tsx
 *
 * core admin interface for managing the kiosk menu.
 * handles category reordering, item details, and ai sync status.
 */

interface Category {
  id: string;
  name: string;
}

const MenuCategoryManagement = () => {
  // state for category navigator
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Sizzling" },
    { id: "2", name: "Drinks" },
    { id: "3", name: "Desserts" },
    { id: "4", name: "Breakfast" },
  ]);

  // state for item configuration card
  const [itemName, setItemName] = useState("Chicken Adobo");
  const [price, setPrice] = useState("500.00");
  const [description, setDescription] = useState(
    "Slow-cooked in vinegar, soy, & garlic",
  );
  const [isAvailable, setIsAvailable] = useState(true);
  const [aiSynced, setAiSynced] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("1");

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 md:p-8 font-inter">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* category navigator molecule */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5 kds-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold tracking-widest text-[#707070] uppercase">
                Categories
              </h3>
              <button className="p-1.5 bg-[#FFC670]/20 text-[#9A6200] rounded-lg hover:bg-[#FFC670]/40 transition-colors">
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                    selectedCategory === cat.id
                      ? "bg-[#FFF9EF] border-[#FFC670] shadow-sm"
                      : "border-transparent hover:bg-gray-50 text-[#707070]"
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <GripVertical
                    size={16}
                    className="text-gray-300 cursor-grab active:cursor-grabbing"
                  />
                  <span className="b2 flex-1">{cat.name}</span>
                  {selectedCategory === cat.id && (
                    <ChevronRight size={16} className="text-[#FFC670]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#101828] rounded-[32px] p-6 text-white overflow-hidden relative group">
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">
                Quick Tip
              </p>
              <p className="text-sm font-medium">
                Drag categories to reorder how they appear on the kiosk screen.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <Search size={80} />
            </div>
          </div>
        </aside>

        {/* main item configuration card molecule */}
        <main className="lg:col-span-9 space-y-6">
          <div className="bg-white rounded-[40px] shadow-sm border border-black/5 overflow-hidden kds-slide-up">
            {/* header section */}
            <div className="bg-brand-secondary p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <h2 className="h2 text-[#101828]">Item Configuration</h2>
                <p className="b1 text-[#101828]/60">
                  Configure how this item appears to your customers.
                </p>
              </div>

              {/* ai sync status atom */}
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-full border-2 ${
                  aiSynced
                    ? "bg-[#E0FAD6] border-[#1FAD66] text-[#1FAD66]"
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {aiSynced ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Sparkles size={18} className="animate-pulse" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {aiSynced ? "AI Synced" : "Syncing to Gemini..."}
                </span>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* left column: details */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#707070] uppercase tracking-widest px-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full p-4 bg-[#F9F9F9] border border-transparent focus:border-[#FFC670] focus:bg-white rounded-2xl outline-none transition-all b2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#707070] uppercase tracking-widest px-1">
                      Price (₱)
                    </label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-4 bg-[#F9F9F9] border border-transparent focus:border-[#FFC670] focus:bg-white rounded-2xl outline-none transition-all b2 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#707070] uppercase tracking-widest px-1">
                      Category
                    </label>
                    <select
                      className="w-full p-4 bg-[#F9F9F9] border border-transparent focus:border-[#FFC670] focus:bg-white rounded-2xl outline-none transition-all b2 appearance-none"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#707070] uppercase tracking-widest px-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 p-4 bg-[#F9F9F9] border border-transparent focus:border-[#FFC670] focus:bg-white rounded-2xl outline-none transition-all b1 resize-none"
                  />
                </div>
              </div>

              {/* right column: image and settings */}
              <div className="space-y-8">
                {/* image upload placeholder atom */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#707070] uppercase tracking-widest px-1">
                    Item Media
                  </label>
                  <div className="aspect-square w-full bg-[#FFF9EF] border-2 border-dashed border-[#FFC670]/40 rounded-[32px] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-[#FFC670]/5 transition-colors">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#FFC670] group-hover:scale-110 transition-transform">
                      <ImageIcon size={32} />
                    </div>
                    <div className="text-center">
                      <p className="b2 text-[#9A6200]">Click to upload image</p>
                      <p className="b5 text-[#707070]">
                        Recommended: 800x800px PNG
                      </p>
                    </div>
                  </div>
                </div>

                {/* availability toggle atom */}
                <div className="p-6 bg-[#F9F9F9] rounded-3xl flex items-center justify-between border border-black/5">
                  <div>
                    <p className="b2 text-[#2D2D2D]">Availability Status</p>
                    <p className="b4 text-[#707070]">
                      {isAvailable ? "Visible on Kiosk" : "Hidden from Menu"}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`w-14 h-8 rounded-full relative transition-colors p-1 ${isAvailable ? "bg-[#1FAD66]" : "bg-gray-300"}`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full transition-transform transform ${isAvailable ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* action footer */}
            <div className="px-8 py-6 border-t border-black/5 bg-[#F9F9F9]/50 flex flex-wrap gap-4 items-center justify-between">
              <button className="flex items-center gap-2 px-6 py-3 text-[#EC1313] font-semibold hover:bg-[#FFF0F0] rounded-2xl transition-colors">
                <Trash2 size={18} />
                <span>Delete Item</span>
              </button>

              <div className="flex gap-4">
                <button className="px-8 py-3 b3 text-[#707070] hover:bg-gray-100 rounded-full transition-colors">
                  Discard
                </button>
                <button className="flex items-center gap-2 px-10 py-3 bg-[#FF5269] text-white font-bold rounded-full shadow-lg shadow-[#FF5269]/20 hover:scale-[1.02] active:scale-95 transition-all">
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>

          {/* nested modifier molecule preview */}
          <div className="bg-white rounded-[32px] p-8 border border-black/5 kds-slide-up animation-delay-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold tracking-widest text-[#707070] uppercase">
                Modifier Groups
              </h3>
              <button className="b4 text-[#FF5269] font-bold">
                + Create New Group
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-[#FFC670]/30 bg-[#FFF9EF]/50 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="b2">Size Options</p>
                  <p className="b5 text-[#707070]">2 items • Required</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-black/5">
                    <GripVertical size={14} className="text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="p-4 border border-black/5 rounded-2xl flex items-center justify-between opacity-60">
                <div>
                  <p className="b2">Add-ons</p>
                  <p className="b5 text-[#707070]">4 items • Optional</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <GripVertical size={14} className="text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MenuCategoryManagement;
