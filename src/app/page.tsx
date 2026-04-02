import { Button } from "@/components/atoms/Button";
import { Plus } from "lucide-react";

export default function HomePage() {
  const icon = <Plus className="w-4 h-4" strokeWidth={2.5} />;

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
    </main>
  );
}
