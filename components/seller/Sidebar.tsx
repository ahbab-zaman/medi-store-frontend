"use client";

import {
  LucideIcon,
  LayoutDashboard,
  ShoppingCart,
  Pill,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const items: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/seller/dashboard" },
  { icon: Pill, label: "Medicines", href: "/seller/medicines" },
  { icon: ShoppingCart, label: "Orders", href: "/seller/orders" },
];

export function Sidebar({ className, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay (Mobile only) */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed z-30 flex h-screen flex-col border-r border-black/10 dark:border-white/10 bg-white dark:bg-black/40 backdrop-blur-xl transition-all duration-300",
          "lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] via-transparent to-purple-500/[0.02] pointer-events-none" />

        {/* Logo + Close button */}
        <div className="relative flex items-center justify-between p-4 sm:p-6 lg:p-8">
          <Link
            href="/seller/dashboard"
            className="group flex items-center gap-3"
          >
            <span className="lg:text-xl text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
              Seller Panel
            </span>
          </Link>

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-2 text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 space-y-1 px-3 sm:px-4 lg:px-5 pb-4">
          {items.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300",
                  isActive
                    ? "bg-[#B8865D] text-white shadow-lg shadow-blue-600/20"
                    : "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white",
                )}
                style={{
                  animation: `slideInLeft 0.4s ease-out ${index * 0.05}s both`,
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-white shadow-lg shadow-white/50" />
                )}

                {/* Icon container */}
                <div
                  className={cn(
                    "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 group-hover:bg-black/10 dark:group-hover:bg-white/10 group-hover:scale-105",
                  )}
                >
                  <item.icon
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    strokeWidth={2.5}
                  />
                </div>

                {/* Label */}
                <span className={isActive ? "font-semibold" : "font-medium"}>
                  {item.label}
                </span>

                {/* Active glow */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-blue-400 opacity-10 blur-xl" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom divider */}
        <div className="relative p-4 sm:p-6">
          <div className="h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
        </div>

        <style jsx>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </aside>
    </>
  );
}
