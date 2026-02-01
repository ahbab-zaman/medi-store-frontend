"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface QuantitySelectorProps {
  maxStock: number;
  onSelect: (quantity: number) => void;
  onClose: () => void;
}

export function QuantitySelector({
  maxStock,
  onSelect,
  onClose,
}: QuantitySelectorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Limit to max 5 or available stock
  const maxQuantity = Math.min(5, maxStock);
  const quantities = Array.from({ length: maxQuantity }, (_, i) => i + 1);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSelect = (quantity: number) => {
    onSelect(quantity);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 z-50 w-32 rounded-lg bg-white shadow-lg border border-gray-200 py-1 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
        Select Quantity
      </div>
      <div className="max-h-48 overflow-y-auto">
        {quantities.map((qty) => (
          <button
            key={qty}
            onClick={() => handleSelect(qty)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between group"
          >
            <span className="font-medium text-gray-900">{qty}</span>
            <span className="text-xs text-gray-400 group-hover:text-gray-600">
              {qty === 1 ? "item" : "items"}
            </span>
          </button>
        ))}
      </div>
      {maxStock < 5 && (
        <div className="px-3 py-2 text-xs text-amber-600 border-t border-gray-100">
          Only {maxStock} available
        </div>
      )}
    </div>
  );
}
