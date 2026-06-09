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
  // isVisible drives the CSS transition (false = hidden/translated down, true = shown/translated up)
  const [isVisible, setIsVisible] = useState(false);
  // isClosing prevents double-triggers during the exit animation
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Limit to max 5 or available stock
  const maxQuantity = Math.min(5, maxStock);
  const quantities = Array.from({ length: maxQuantity }, (_, i) => i + 1);

  // Trigger enter animation on next frame after mount
  useEffect(() => {
    const enterFrame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(enterFrame);
  }, []);

  // Click-outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setIsVisible(false); // trigger exit transition
    // Wait for transition to finish (300ms) before unmounting
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSelect = (quantity: number) => {
    if (isClosing) return;
    setIsClosing(true);
    setIsVisible(false); // trigger exit transition
    setTimeout(() => {
      onSelect(quantity);
    }, 250);
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        transform: isVisible ? "scaleY(1)" : "scaleY(0)",
        opacity: isVisible ? 1 : 0,
        transformOrigin: "bottom center",
        transition:
          "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 250ms ease",
      }}
      className="absolute right-0 bottom-full z-50 overflow-hidden rounded-t-xl mb-1 bg-red-500 shadow-lg border border-red-400 w-9.5"
    >
      <div className="flex flex-col">
        {quantities.map((qty, index) => (
          <button
            key={qty}
            onClick={() => handleSelect(qty)}
            style={{
              transitionDelay: isVisible ? `${index * 40}ms` : "0ms",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "scaleY(1)" : "scaleY(0.6)",
              transition: `opacity 260ms ease ${index * 40}ms, transform 260ms ease ${index * 40}ms`,
            }}
            className="w-full py-1.5 text-center text-[13px] font-bold text-white transition-colors hover:bg-red-600 active:bg-red-700"
          >
            {qty}
          </button>
        ))}
      </div>
    </div>
  );
}
