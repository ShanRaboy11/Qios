import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Toggle } from "@/components/atoms/Toggle";
import { Badge } from "@/components/atoms/Badges";
import { Plus, Lock } from "lucide-react";

export default function HomePage() {
  const icon = <Plus className="w-4 h-4" strokeWidth={2.5} />;
  const badgeIcon = <Plus className="w-3 h-3" />;

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
    </main>
  );
}
