"use client";

import React, { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { isValidHex, normalizeHex } from "@/lib/token-utils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = isFocused ? inputValue : value;

  const handleColorInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value;
      onChange(hex);
      setInputValue(hex);
    },
    [onChange]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setInputValue(raw);
      const normalized = raw.startsWith("#") ? raw : `#${raw}`;
      if (isValidHex(normalized)) {
        onChange(normalizeHex(normalized));
      }
    },
    [onChange]
  );

  const handleTextBlur = useCallback(() => {
    setIsFocused(false);
    const normalized = value.startsWith("#") ? value : `#${value}`;
    setInputValue(isValidHex(normalized) ? normalizeHex(normalized) : value);
  }, [value]);

  const handleTextFocus = useCallback(() => {
    setIsFocused(true);
    setInputValue(value);
  }, [value]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && (
        <span className="min-w-0 flex-1 truncate text-xs text-[var(--muted-foreground)]">
          {label}
        </span>
      )}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* native color picker hidden behind swatch */}
        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-[calc(var(--radius)-2px)] border border-[var(--border)] cursor-pointer shadow-sm">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: value }}
          />
          <input
            type="color"
            value={value.startsWith("#") ? value : `#${value}`}
            onChange={handleColorInput}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={label ? `Pick color for ${label}` : "Pick color"}
          />
        </div>
        {/* hex text input */}
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleTextChange}
          onFocus={handleTextFocus}
          onBlur={handleTextBlur}
          maxLength={7}
          spellCheck={false}
          className={cn(
            "h-6 w-20 rounded-[calc(var(--radius)-2px)] border border-[var(--input)] bg-transparent px-1.5 py-0 font-mono text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]",
            !isValidHex(displayValue.startsWith("#") ? displayValue : `#${displayValue}`) &&
              displayValue !== "" &&
              "ring-1 ring-[var(--destructive)]"
          )}
        />
      </div>
    </div>
  );
}
