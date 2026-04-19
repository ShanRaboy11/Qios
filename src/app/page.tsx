"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { Badge } from "@/components/atoms/Badge";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Radio } from "@/components/atoms/Radio";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { FeatureToggle } from "@/components/molecules/FeatureToggle";
import { FormField } from "@/components/molecules/FormField";
import { ContactNumberInput } from "@/components/molecules/ContactNumber";
import { Dropdown } from "@/components/molecules/Dropdown";
import { StepperBar } from "@/components/molecules/StepperBar";
import { OrderHeader } from "@/components/molecules/OrderHeader";
import { EditableItemList } from "@/components/molecules/EditableItem";
import { PriceSummary } from "@/components/molecules/PriceSummary";
import { SearchFilterBar } from "@/components/molecules/SearchFilterBar";
import { ModifierRow } from "@/components/molecules/ModifierRow";
import { UserItem } from "@/components/molecules/UserItem";
import { ActivityItem } from "@/components/molecules/EmployeeActivity";
import { ChatBubble } from "@/components/molecules/ChatBubble";
import { ItemCustomization } from "@/components/molecules/OrderCustomization";
import { KPICard } from "@/components/molecules/KPICard";
import { InsightLink } from "@/components/molecules/InsightLink";
import MenuCatalog, { MenuItemData } from "@/components/organisms/MenuCatalog";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import TenantManagement from "@/components/organisms/TenantManagement"; 
import {
  Plus,
  Lock,
  Calendar,
  Mail,
  User,
  Package,
  Settings,
  ChevronRight,
} from "lucide-react";
import React, { useState } from "react";

export default function HomePage() {
  const icon = <Plus className="w-4 h-4" strokeWidth={2.5} />;
  const badgeIcon = <Plus className="w-3 h-3" />;
  const fruitOptions = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
  ];
  const [showFilters, setShowFilters] = useState(false);
  const businessSteps = [
    { id: 1, label: "Business Information", icon: <User size={20} /> },
    { id: 2, label: "Authentication Credentials", icon: <Lock size={20} /> },
    { id: 3, label: "Subscription Package", icon: <Package size={20} /> },
    { id: 4, label: "Feature Configuration", icon: <Settings size={20} /> },
  ];
  const users = [
    { name: "Juan dela Cruz", id: "USR-10001", variant: "primary" as const },
    { name: "Juan dela Cruz", id: "USR-10001", variant: "purple" as const },
    { name: "Juan dela Cruz", id: "USR-10001", variant: "green" as const },
    { name: "Juan dela Cruz", id: "USR-10001", variant: "blue" as const },
  ];
  const activities = [
    {
      employeeName: "Maria",
      action: "Completed Order",
      orderId: "8821",
      timestamp: "Just now",
      status: "completed" as const,
    },
    {
      employeeName: "Maria",
      action: "Processing Order",
      orderId: "8821",
      timestamp: "Just now",
      status: "processing" as const,
    },
    {
      employeeName: "Maria",
      action: "Cancelled Order",
      orderId: "8821",
      timestamp: "Just now",
      status: "cancelled" as const,
    },
  ];
  const foodItems = [
    {
      id: "1",
      name: "Pad Thai Noodles",
      customization: "Extra Spicy",
      price: 100,
      quantity: 1,
      badgeColorType: "error",
    },
    {
      id: "2",
      name: "Green Curry Bowl",
      customization: "Gluten - Free",
      price: 100,
      quantity: 1,
      badgeColorType: "success",
    },
    {
      id: "3",
      name: "Mango Sticky Rice",
      customization: "Extra Coconut Drizzle",
      price: 100,
      quantity: 1,
      badgeColorType: "secondary",
    },
  ];

  const MOCK_DATA: MenuItemData[] = Array(10).fill(null).map((_, i) => ({
  id: `${i}`,
  name: "Spicy seasoned seafood noodles",
  price: 2.29,
  category: "Snacks",
  available: true,
  imageUrl: "https://placehold.co/150x136",
}));

// Adding some items for other categories
const CATALOG_ITEMS: MenuItemData[] = [...MOCK_DATA,
    { id: "11", name: "Beef Pares Meal", price: 150, category: "Meal", available: true, imageUrl: "https://placehold.co/150x136" },
    { id: "12", name: "Vegan Salad", price: 120, category: "Vegan", available: true, imageUrl: "https://placehold.co/150x136" },
];

  return (
    <main className="flex min-h-screen bg-white flex-col items-center w-full overflow-x-hidden">
      <div className="px-10 py-10">
        <h1 className="h1 text-text-primary">Navbar</h1>
      </div>
      <Navbar variant="filled" />
      <div className="h-12" />
      <Navbar variant="transparent" />
      <section className="w-full p-6 md:p-10 bg-slate-50 mt-12">
        <h1 className="h1 text-text-primary mb-12">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col gap-6 w-full">
            <KPICard
              icon={<Lock size={24} />}
              type="sales"
              title="Total Sales"
              value="$48,988,078"
              percentageChange={35}
              color="primary"
            />
            <KPICard
              type="sales"
              title="Total Sales"
              value="$48,988,078"
              percentageChange={35}
              color="secondary"
            />
            <KPICard
              type="sales"
              title="Total Sales"
              value="$48,988,078"
              percentageChange={-35}
              color="accent"
            />
          </div>

          <div className="flex flex-col gap-6 w-full">
            <KPICard
              icon={<Lock size={24} />}
              type="profit"
              title="Profit"
              value="$8,458,798"
              percentageChange={35}
              variant="outlined"
              description="vs Last Month"
              onViewAll={() => console.log("View Profit Details")}
            />
            <KPICard
              type="profit"
              title="Profit"
              value="$8,458,798"
              percentageChange={-35}
              variant="outlined"
              description="vs Last Month"
              onViewAll={() => console.log("View Loss Details")}
            />
          </div>
        </div>

      {/*Menu Catalog Section*/}
        <div className="w-full mb-12">
          <MenuCatalog initialItems={CATALOG_ITEMS} />
        </div>

      {/* Tenant Management Directory */}
        <main className="min-h-screen bg-[#FFF7ED] py-16 px-6">
          <div className="max-w-[966px] mx-auto">
            <h1 className="text-[40px] font-bold text-gray-900 mb-12 leading-tight">
                Tenant Management Directory
            </h1>        
            <TenantManagement />
          </div>
        </main>

        <div className="w-full max-w-2xl bg-white border-2 border-[#E5E5E5] rounded-2xl p-6 flex flex-col gap-5">
          <InsightLink
            type="selling"
            title="Top Selling Products"
            color="primary"
          />
          <InsightLink
            icon={<Lock size={24} />}
            type="selling"
            title="Top Selling Products"
            options={["Today", "This Week", "This Month"]}
            selectedOption="Today"
            onOptionChange={(value) => console.log("Selected:", value)}
            color="primary"
          />
          <InsightLink
            icon={<Lock size={24} />}
            type="info"
            title="Overall Information"
            color="secondary"
          />
          <InsightLink
            type="stock"
            title="Low Stock Products"
            onViewAll={() => console.log("Low Stock")}
            color="accent"
          />
        </div>
      </section>
      <div className="w-full max-w-2xl mb-8">
        <h1 className="h1 text-text-primary mb-2">
          Buttons are used for links and CTA
        </h1>
        <p className="b1 text-text-secondary">
          Hover and click the buttons below to see their dynamic interaction
          states (Default -&gt; Hover -&gt; Active).
        </p>
      </div>
      <div className="border border-dashed border-purple-300 p-10 flex flex-col gap-10 w-full max-w-2xl rounded-2xl">
        {/* Pills */}
        <div>
          <h2 className="h3 text-text-primary mb-6">
            Pill Shape (`shape="pill"`)
          </h2>
          <div className="flex flex-col gap-6 items-start">
            <Button
              variant="primary"
              shape="pill"
              leftIcon={icon}
              rightIcon={icon}
            >
              Primary Button
            </Button>
            <Button
              variant="accent"
              shape="pill"
              leftIcon={icon}
              rightIcon={icon}
            >
              Accent Button
            </Button>
            <Button
              variant="outline"
              shape="pill"
              leftIcon={icon}
              rightIcon={icon}
            >
              Outline Button
            </Button>
            <Button
              variant="dark"
              shape="pill"
              leftIcon={icon}
              rightIcon={icon}
            >
              Dark Button
            </Button>
            <Button
              variant="warning"
              shape="pill"
              leftIcon={icon}
              rightIcon={icon}
            >
              Warning Button
            </Button>
            <Button
              variant="ghost"
              shape="pill"
              leftIcon={icon}
              rightIcon={icon}
            >
              Ghost Button
            </Button>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Rounded */}
        <div>
          <h2 className="h3 text-text-primary mb-6">
            Rounded Shape (`shape="rounded"`)
          </h2>
          <div className="flex flex-col gap-6 items-start">
            <Button
              variant="primary"
              shape="rounded"
              leftIcon={icon}
              rightIcon={icon}
            >
              Primary Button
            </Button>
            <Button
              variant="accent"
              shape="rounded"
              leftIcon={icon}
              rightIcon={icon}
            >
              Accent Button
            </Button>
            <Button
              variant="outline"
              shape="rounded"
              leftIcon={icon}
              rightIcon={icon}
            >
              Outline Button
            </Button>
            <Button
              variant="dark"
              shape="rounded"
              leftIcon={icon}
              rightIcon={icon}
            >
              Dark Button
            </Button>
            <Button
              variant="warning"
              shape="rounded"
              leftIcon={icon}
              rightIcon={icon}
            >
              Warning Button
            </Button>
            <Button
              variant="ghost"
              shape="rounded"
              leftIcon={icon}
              rightIcon={icon}
            >
              Ghost Button
            </Button>
            <div className="flex items-center gap-3">
              {/* The Stepper Minus Button */}
              <Button variant="warning" shape="rounded" size="icon">
                <Plus size={10} />
              </Button>

              <span className="b1 font-bold">1</span>

              {/* The Stepper Plus Button */}
              <Button variant="accent" shape="rounded" size="icon">
                <Plus size={10} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 max-w-4xl p-6">
        {/* Validated State */}
        <OrderHeader
          orderId="ORD-2847"
          tableName="Table 12"
          timestamp="Today, 7:34 PM"
          status="validated"
          statusLabel="Validated - ready for payment"
        />

        {/* Voided State */}
        <OrderHeader
          orderId="ORD-2847"
          tableName="Table 12"
          timestamp="Today, 7:34 PM"
          status="voided"
          statusLabel="Voided - order cancelled"
        />
      </div>
      <div className="max-w-md mx-auto">
        <OrderHeader
          orderId="2847"
          tableName="Table 12"
          timestamp="Today, 7:34 PM"
          status="validated"
          statusLabel="Validated - ready for payment"
        />
        {/*<EditableItemList items={foodItems} />*/}
        <PriceSummary subtotal={400} taxRate={0.085} />
      </div>
      <div className="w-full max-w-2xl mt-16 mb-8">
        <h1 className="h1 text-text-primary mb-2">Text Inputs</h1>
        <p className="b1 text-text-secondary">
          Below are the requested Text Input states: Inactive, Active, Error,
          Inactive (Center), and Active (Center).
        </p>
      </div>
      <div className="border border-dashed border-purple-300 p-10 flex flex-col gap-8 w-full max-w-sm rounded-[24px]">
        <Input placeholder="Email Address" />
        <Input
          defaultValue="Email Address"
          className="border-brand-primary shadow-[0_0_0_2px_rgba(255,198,112,0.15)]"
        />
        <Input defaultValue="Email Address" isError />
        <Input placeholder="Email Address" align="center" />
        <Input
          defaultValue="Email Address"
          align="center"
          className="border-brand-primary shadow-[0_0_0_2px_rgba(255,198,112,0.15)]"
        />
      </div>
      {/* Toggle Switches */}
      <div className="w-full max-w-2xl mt-16 mb-8">
        <h1 className="h1 text-text-primary mb-2">Toggle Switches</h1>
        <p className="b1 text-text-secondary">
          Try clicking these interactive toggle switches below! They perfectly
          map to your grid columns.
        </p>
      </div>
      <div className="border border-dashed border-purple-300 p-10 flex flex-col gap-10 w-full max-w-3xl rounded-[24px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center">
          <div className="flex flex-col gap-6 items-center">
            <h3 className="h4 text-text-primary mb-2">Default</h3>
            <div className="flex gap-4">
              <Toggle defaultIsOn={true} />
              <Toggle defaultIsOn={false} />
            </div>
            <div className="flex gap-4">
              <Toggle variant="accent" defaultIsOn={true} />
              <Toggle variant="accent" defaultIsOn={false} />
            </div>
          </div>

          <div className="flex flex-col gap-6 items-center">
            <h3 className="h4 text-text-primary mb-2">With Icon</h3>
            <div className="flex gap-4">
              <Toggle
                defaultIsOn={true}
                icon={<Lock className="w-3 h-3" strokeWidth={3} />}
              />
              <Toggle
                defaultIsOn={false}
                icon={<Lock className="w-3 h-3" strokeWidth={3} />}
              />
            </div>
            <div className="flex gap-4">
              <Toggle
                variant="accent"
                defaultIsOn={true}
                icon={<Lock className="w-3 h-3" strokeWidth={3} />}
              />
              <Toggle
                variant="accent"
                defaultIsOn={false}
                icon={<Lock className="w-3 h-3" strokeWidth={3} />}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 items-center">
            <h3 className="h4 text-text-primary mb-2">With Text</h3>
            <div className="flex gap-4">
              <Toggle defaultIsOn={true} showText />
              <Toggle defaultIsOn={false} showText />
            </div>
            <div className="flex gap-4">
              <Toggle variant="accent" defaultIsOn={true} showText />
              <Toggle variant="accent" defaultIsOn={false} showText />
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <SearchFilterBar onFilterClick={() => setShowFilters(!showFilters)} />

        {showFilters && (
          <div className="absolute right-0 mt-2 w-64 z-50">
            <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 b5 font-bold text-text-tertiary border-b border-[#E5E5E5]">
                FILTER BY STATUS
              </div>
              <button className="w-full text-left p-4 hover:bg-slate-50 b2">
                Active Tenants
              </button>
              <button className="w-full text-left p-4 hover:bg-slate-50 b2">
                Pending Approval
              </button>
              <button className="w-full text-left p-4 hover:bg-slate-50 b2 text-error">
                Suspended
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="w-full max-w-md flex flex-col gap-3 p-4 bg-white rounded-2xl border-2 border-[#E5E5E5]">
        <h3 className="h4 font-bold text-text-primary mb-1">
          Select Spiciness
        </h3>

        {/* Radio Group Example */}
        <ModifierRow
          type="radio"
          name="spiciness"
          title="Mild"
          description="Gentle kick, great for sensitive palates"
          priceTag="Free"
        />

        <ModifierRow
          type="radio"
          name="spiciness"
          title="Hot"
          description="A bold heat for spice lovers"
          priceTag="Free"
        />

        <div className="h-[1px] bg-[#E5E5E5] my-2" />

        <h3 className="h4 font-bold text-text-primary mb-1">Add-ons</h3>

        {/* Checkbox Group Example */}
        <ModifierRow
          type="checkbox"
          title="Extra Tofu"
          description="Pan-fried crispy tofu cubes"
          priceTag="+₱35.00"
        />
      </div>
      <section className="w-full p-6 bg-white rounded-2xl border-2 border-[#E5E5E5]">
        <h2 className="h2 mb-6">User</h2>

        {/* Responsive Grid: 1 column on mobile, 2 on tablet/small desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
          {users.map((user, index) => (
            <UserItem
              key={index}
              name={user.name}
              id={user.id}
              variant={user.variant}
            />
          ))}
        </div>
      </section>
      <section className="w-full max-w-xl p-6 bg-white rounded-2xl border-2 border-[#E5E5E5]">
        <h2 className="h2 mb-4">Employee Activity</h2>

        <div className="flex flex-col">
          {activities.map((item, index) => (
            <ActivityItem key={index} {...item} />
          ))}
        </div>
      </section>
      <section className="w-full h-full flex flex-col p-4 sm:p-6 bg-slate-50 overflow-y-auto">
        <ChatBubble
          role="system"
          message="hello system message"
          timestamp="7:20"
        />

        <ChatBubble
          role="customer"
          message="yes po opo im a customer heh"
          timestamp="7:20"
          isRead={true}
        />

        {/* Quick Tag Pills */}
        <div className="flex gap-2 mt-4">
          <span className="px-3 py-1 bg-white border border-[#E5E5E5] rounded-lg text-text-tertiary b5">
            Tags
          </span>
        </div>
      </section>
      <ItemCustomization
        name="Chicken Adobo"
        description="Slow-cooked in vinegar, soy, & garlic"
        price={145.0}
        badge="Bestseller"
        image="/images/adobo-bowl.png" // Path to your asset
      />
      {/* Badges Section */}
      <div className="w-full max-w-2xl mt-16 mb-8">
        <h1 className="h1 text-text-primary mb-2">Badges</h1>
        <p className="b1 text-text-secondary">
          Organizational tags using your brand colors. These include solid,
          subtle, and outline variants.
        </p>
      </div>
      <div className="border border-dashed border-purple-300 p-10 flex flex-col gap-12 w-full max-w-4xl rounded-[24px]">
        {/* Main Badge Grid */}
        <div className="grid grid-cols-4 gap-8">
          {["primary", "accent", "success", "error"].map((color) => (
            <div key={color} className="flex flex-col gap-4 items-center">
              <Badge color={color as any} variant="subtle">
                Text
              </Badge>
              <Badge color={color as any} variant="outline">
                Text
              </Badge>
              <Badge color={color as any} variant="solid">
                Text
              </Badge>
            </div>
          ))}
        </div>

        <hr className="border-gray-200" />

        {/* Badges with Icons */}
        <div className="flex flex-col gap-4 items-start">
          <h3 className="h4 text-text-primary mb-2">With Icons</h3>
          <div className="flex gap-4">
            <Badge
              color="error"
              variant="outline"
              leftIcon={badgeIcon}
              rightIcon={badgeIcon}
            >
              Text
            </Badge>
            <Badge
              color="success"
              variant="outline"
              leftIcon={badgeIcon}
              rightIcon={badgeIcon}
            >
              Text
            </Badge>
            <Badge
              color="primary"
              variant="outline"
              shape="rounded"
              leftIcon={badgeIcon}
              rightIcon={badgeIcon}
            >
              Text
            </Badge>
          </div>
        </div>
      </div>
      {/* Radios Section (Top Row) */}
      <div className="space-y-6">
        <h2 className="h1">Radios</h2>

        {/* Row 1: Default/Checked with Label */}
        <div className="flex gap-10 items-center p-6 border border-dashed border-purple-200 rounded-lg">
          <Radio name="demo" label="Selected" defaultChecked />
          <Radio name="demo" label="Unselected" />
          <Radio name="plan" label="Basic" />

          <Radio name="plan" label="Premium" variant="accent" />
        </div>

        {/* Row 2: Default/Checked NO Label */}
        <div className="flex gap-10 items-center p-6 border border-dashed border-purple-200 rounded-lg max-w-sm">
          <Radio name="no-label-demo" defaultChecked={false} />
          <Radio name="no-label-demo" defaultChecked={true} />
        </div>
      </div>
      <hr className="border-gray-200" />
      {/* Checkboxes Section */}
      <div className="space-y-6">
        <h2 className="h1">Checkboxes</h2>

        {/* Row 3: Default/Checked with Label */}
        <div className="flex gap-10 items-center p-6 border border-dashed border-purple-200 rounded-lg">
          <Checkbox label="Accept terms" />

          <Checkbox label="Subscribe" variant="accent" />

          <Checkbox label="Partial" indeterminate />
        </div>

        {/* Row 4: Complex Grid */}
        <div className="flex gap-10 items-center p-6 border border-dashed border-purple-200 rounded-lg max-w-4xl">
          <Checkbox defaultChecked={false} />
          <Checkbox defaultChecked={true} />

          <Checkbox
            defaultChecked={true}
            className="[&_span]:peer-checked:border-brand-secondary [&_span]:peer-checked:bg-brand-secondary"
          />

          <Checkbox indeterminate />

          <Checkbox
            indeterminate
            className="[&_span]:peer-indeterminate:border-brand-secondary [&_span]:peer-indeterminate:bg-brand-secondary"
          />
        </div>
      </div>
      <div className="p-10 space-y-4">
        <h2 className="h2">Steppers</h2>

        <QuantityStepper variant="accent" initialValue={1} />

        <QuantityStepper variant="primary" initialValue={5} />

        <QuantityStepper variant="outline" initialValue={1} />
      </div>
      <div className="max-w-md space-y-2">
        <FeatureToggle
          label="Authentication"
          description="Enable two-factor authentication for security"
          defaultChecked={true}
        />

        <FeatureToggle
          label="Push Notifications"
          description="Receive alerts for vehicle access events"
          defaultChecked={false}
        />

        {/* Disabled state for locked features */}
        <FeatureToggle
          label="Auto-Archive Logs"
          description="Requires Premium Subscription"
          disabled={true}
        />
      </div>
      <div className="p-10 space-y-10 max-w-xl">
        <h1 className="h1">Input Forms</h1>

        {/* Row 1: Inactive / Default */}
        <FormField
          label="Email Address"
          placeholder="Email Address"
          supportiveText="Supportive text"
          leftIcon={<Calendar size={20} />}
          rightIcon={<Calendar size={20} />}
        />

        {/* Row 2: Active (Focus state is automatic) */}
        <FormField
          label="Email Address"
          defaultValue="Email Address"
          supportiveText="Supportive text"
          leftIcon={<Calendar size={20} />}
          rightIcon={<Calendar size={20} />}
        />

        {/* Row 3: Error State */}
        <FormField
          label="Email Address"
          defaultValue="Email Address"
          isError={true}
          supportiveText="Supportive text"
          leftIcon={<Mail size={20} className="text-warning-primary" />}
          rightIcon={<Mail size={20} className="text-warning-primary" />}
        />
        <Dropdown
          label="Select Fruit"
          options={fruitOptions}
          supportiveText="Please choose one"
        />
        {/* Row 4: Password Field */}
        <FormField
          label="Password"
          type="password"
          placeholder="Enter your password"
        />
        {/* Row 5: Contact Number */}
        <ContactNumberInput
          label="Contact Number"
          supportiveText="Supportive text"
        />
      </div>
      ;
      <StepperBar steps={businessSteps} currentStep={2} />
      <Footer />
    </main>
  );
}
