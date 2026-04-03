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
import {
  Plus,
  Lock,
  Calendar,
  Mail,
  User,
  Package,
  Settings,
} from "lucide-react";

export default function HomePage() {
  const icon = <Plus className="w-4 h-4" strokeWidth={2.5} />;
  const badgeIcon = <Plus className="w-3 h-3" />;
  const fruitOptions = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
  ];
  const businessSteps = [
    { id: 1, label: "Business Information", icon: <User size={20} /> },
    { id: 2, label: "Authentication Credentials", icon: <Lock size={20} /> },
    { id: 3, label: "Subscription Package", icon: <Package size={20} /> },
    { id: 4, label: "Feature Configuration", icon: <Settings size={20} /> },
  ];

  return (
    <main className="flex min-h-screen bg-white p-10 flex-col items-center">
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

        {/* Badges with Icons (Bottom Left Figma Reference) */}
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
          {/* Change children to label prop to avoid nesting errors */}
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
          {/* Change children to label prop here too */}
          <Checkbox label="Accept terms" />

          <Checkbox label="Subscribe" variant="accent" />

          <Checkbox label="Partial" indeterminate />
        </div>

        {/* Row 4: Complex Grid */}
        <div className="flex gap-10 items-center p-6 border border-dashed border-purple-200 rounded-lg max-w-4xl">
          <Checkbox defaultChecked={false} />
          <Checkbox defaultChecked={true} />

          {/* Replicate specific Figma colors */}
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
          leftIcon={<Calendar size={20} />} // Matches your Figma icon
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
    </main>
  );
}
