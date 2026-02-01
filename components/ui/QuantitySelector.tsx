"use client";

import { useState, useRef, useEffect } from "react";

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
      className={`absolute right-0 bottom-0 left-0 z-50 overflow-hidden rounded-t-md bg-[#AA383A] transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-50" : "h-0"
      }`}
    >
      <div className="flex flex-col">
        {quantities.map((qty) => (
          <button
            key={qty}
            onClick={() => handleSelect(qty)}
            className="w-full py-2 text-center text-[15px] font-semibold text-white transition hover:bg-[#C95467]"
          >
            {qty}
          </button>
        ))}
      </div>
    </div>
  );
}
