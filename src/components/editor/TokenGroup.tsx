"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenGroupProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function TokenGroup({
  title,
  description,
  defaultOpen = true,
  children,
  className,
}: TokenGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b border-[var(--border)] last:border-b-0", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[var(--accent)] transition-colors"
      >
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">{title}</p>
          {description && (
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{description}</p>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-2">{children}</div>
      )}
    </div>
  );
}
