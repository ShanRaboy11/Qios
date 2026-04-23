"use client";

import React, { useState } from "react";
import { StatCard } from "@/components/molecules/StatCard";
import { Dropdown } from "@/components/molecules/Dropdown";
import { Button } from "@/components/atoms/Button";
import { ThresholdRow } from "@/components/molecules/ThresholdRow";

export const GlobalThresholdView = () => {
  const [chickenLow, setChickenLow] = useState("500");
  const [chickenCrit, setChickenCrit] = useState("500");
  const [porkLow, setPorkLow] = useState("500");
  const [porkCrit, setPorkCrit] = useState("500");

  const [riceLow, setRiceLow] = useState("500");
  const [riceCrit, setRiceCrit] = useState("500");

  const [oilLow, setOilLow] = useState("500");
  const [oilCrit, setOilCrit] = useState("500");
  const [soyLow, setSoyLow] = useState("500");
  const [soyCrit, setSoyCrit] = useState("500");

  const [garlicLow, setGarlicLow] = useState("500");
  const [garlicCrit, setGarlicCrit] = useState("500");
  const [potatoLow, setPotatoLow] = useState("500");
  const [potatoCrit, setPotatoCrit] = useState("500");

  const unitOptions = [{ label: "Grams (g)", value: "g" }, { label: "Pieces (pcs)", value: "pcs" }, { label: "Milliliters (ml)", value: "ml" }];

  return (
    <div className="w-full flex flex-col gap-6 md:gap-10">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL STOCKS"
          value="48"
          subtext="Across 6 categories"
          variant="pink"
        />
        <StatCard
          title="CRITICAL LEVEL"
          value="3"
          subtext="Needs reorder now"
          variant="coral"
        />
        <StatCard
          title="LOW STOCKS"
          value="7"
          subtext="Below threshold"
          variant="yellow"
        />
        <StatCard
          title="SUFF. STOCKS"
          value="38"
          subtext="Within safe range"
          variant="green"
        />
      </div>

      {/* Threshold Settings Panel */}
      <div className="bg-white rounded-[24px] border border-[#E5E5E5] overflow-hidden">
        {/* Header */}
        <div className="bg-brand-primary/80 flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 gap-4">
          <h2 className="text-lg md:text-xl font-extrabold text-text-primary tracking-wide">
            THRESHOLD SETTINGS
          </h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:w-[160px]">
               <Dropdown
                label=""
                placeholder="All status"
                options={[
                  { label: "All status", value: "all" },
                  { label: "Critical", value: "critical" },
                  { label: "Low", value: "low" },
                ]}
                onSelect={() => {}}
                className="bg-[#FDD26E] h-[48px]"
              />
            </div>
           
            <Button variant="accent" size="md" shape="rounded" className="shrink-0 max-h-[48px]">
              + Add item
            </Button>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-6 px-6 py-4 border-b border-[#E5E5E5]">
              <span className="b5 font-bold text-text-secondary uppercase tracking-wider">INGREDIENTS</span>
              <span className="b5 font-bold text-text-secondary uppercase tracking-wider">UNIT</span>
              <span className="b5 font-bold text-brand-primary uppercase tracking-wider text-center">LOW</span>
              <span className="b5 font-bold text-brand-accent uppercase tracking-wider text-center">CRITICAL</span>
            </div>

            {/* Table Body */}
            <div className="px-6 flex flex-col">
              {/* Group 1: PROTEIN */}
              <div className="py-4 border-b border-[#E5E5E5] last:border-b-0">
                <h3 className="b5 font-bold text-text-secondary uppercase tracking-wider mb-0 text-left">PROTEIN</h3>
                <ThresholdRow
                  ingredientName="Chicken (whole)"
                  unitOptions={unitOptions}
                  onUnitSelect={() => {}}
                  lowValue={chickenLow}
                  onLowChange={setChickenLow}
                  criticalValue={chickenCrit}
                  onCriticalChange={setChickenCrit}
                  className="border-b-0 py-2"
                />
                <ThresholdRow
                  ingredientName="Pork belly"
                  unitOptions={unitOptions}
                  onUnitSelect={() => {}}
                  lowValue={porkLow}
                  onLowChange={setPorkLow}
                  criticalValue={porkCrit}
                  onCriticalChange={setPorkCrit}
                  className="border-b-0 py-2"
                />
              </div>

              {/* Group 2: STAPLE */}
              <div className="py-4 border-b border-[#E5E5E5] last:border-b-0">
                <h3 className="b5 font-bold text-text-secondary uppercase tracking-wider mb-0 text-left">STAPLE</h3>
                <ThresholdRow
                  ingredientName="White rice"
                  unitOptions={unitOptions}
                  onUnitSelect={() => {}}
                  lowValue={riceLow}
                  onLowChange={setRiceLow}
                  criticalValue={riceCrit}
                  onCriticalChange={setRiceCrit}
                  className="border-b-0 py-2"
                />
              </div>

               {/* Group 3: CONDIMENTS */}
               <div className="py-4 border-b border-[#E5E5E5] last:border-b-0">
                <h3 className="b5 font-bold text-text-secondary uppercase tracking-wider mb-0 text-left">CONDIMENTS</h3>
                <ThresholdRow
                  ingredientName="Cooking oil"
                  unitOptions={unitOptions}
                  onUnitSelect={() => {}}
                  lowValue={oilLow}
                  onLowChange={setOilLow}
                  criticalValue={oilCrit}
                  onCriticalChange={setOilCrit}
                  className="border-b-0 py-2"
                />
                 <ThresholdRow
                  ingredientName="Soy Sauce"
                  unitOptions={unitOptions}
                  onUnitSelect={() => {}}
                  lowValue={soyLow}
                  onLowChange={setSoyLow}
                  criticalValue={soyCrit}
                  onCriticalChange={setSoyCrit}
                  className="border-b-0 py-2"
                />
              </div>

               {/* Group 4: PRODUCE */}
               <div className="py-4 pb-8">
                <h3 className="b5 font-bold text-text-secondary uppercase tracking-wider mb-0 text-left">PRODUCE</h3>
                <ThresholdRow
                  ingredientName="Garlic"
                  unitOptions={unitOptions}
                  onUnitSelect={() => {}}
                  lowValue={garlicLow}
                  onLowChange={setGarlicLow}
                  criticalValue={garlicCrit}
                  onCriticalChange={setGarlicCrit}
                  className="border-b-0 py-2"
                />
                 <ThresholdRow
                  ingredientName="Sweet Potato"
                  unitOptions={unitOptions}
                  onUnitSelect={() => {}}
                  lowValue={potatoLow}
                  onLowChange={setPotatoLow}
                  criticalValue={potatoCrit}
                  onCriticalChange={setPotatoCrit}
                  className="border-b-0 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 md:p-6 border-t border-[#E5E5E5] flex flex-col md:flex-row justify-end gap-4 md:items-center bg-white rounded-b-[24px]">
          <Button variant="ghost" shape="rounded" size="md" className="text-brand-accent font-bold order-2 md:order-1">
            Reset to defaults
          </Button>
          <Button variant="accent" shape="rounded" size="md" className="order-1 md:order-2 w-full md:w-auto">
            Save thresholds
          </Button>
        </div>
      </div>
    </div>
  );
};
