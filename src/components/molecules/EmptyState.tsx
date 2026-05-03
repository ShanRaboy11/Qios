import React from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/atoms/Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title = "No results found",
  description = "We couldn't find anything matching your search criteria.",
  actionLabel = "Clear Filters",
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
        <SearchX size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {onAction && (
        <Button variant="accent" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
