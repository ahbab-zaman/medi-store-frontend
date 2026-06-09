"use client";

import {
  LucideIcon,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Pill,
  List,
  MessageSquare,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import Image from "next/image";

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
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: List, label: "Categories", href: "/admin/categories" },
  { icon: Pill, label: "Medicines", href: "/admin/medicines" },
  { icon: MessageSquare, label: "Reviews", href: "/admin/reviews" },
];

export function Sidebar({ className, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* ─── Mobile backdrop ─────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />

      {/* ─── Sidebar panel ───────────────────────────── */}
      <aside
        className={cn(
          // Layout
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col",
          // Width – always 256 px (w-64); on lg it becomes part of normal flow
          "w-64",
          // Visuals
          "border-r border-black/10 dark:border-white/[0.08]",
          "bg-white dark:bg-zinc-900",
          // Slide-in behaviour
          "transition-transform duration-300 ease-in-out",
          "lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        {/* Decorative gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#B8865D]/[0.04] via-transparent to-purple-500/[0.02]" />

        {/* ── Logo + close button ────────────────────── */}
        <div className="relative flex items-center justify-between px-5 py-5 border-b border-black/[0.06] dark:border-white/[0.06]">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5"
            onClick={onClose}
          >
            {/* Pill icon badge */}
            <Link
              href="/"
              title="Go to MediStore website"
              className="group flex items-center gap-2.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                src="/medicine-symbol (1).png"
                alt="MediStore"
                width={32}
                height={32}
                className="object-contain transition-transform duration-200 group-hover:scale-110"
              />
              <span className="text-base font-extrabold tracking-tight text-[#B8865D] dark:text-[#d4a574]">
                MediStore
              </span>
            </Link>
          </Link>

          {/* Close button – mobile only */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden rounded-lg p-1.5 text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Navigation ─────────────────────────────── */}
        <nav className="relative flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-black/30 dark:text-white/30">
            Navigation
          </p>

          {items.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{ animationDelay: `${index * 40}ms` }}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "animate-[slideInLeft_0.3s_ease-out_both]",
                  isActive
                    ? "bg-[#B8865D] text-white shadow-md shadow-[#B8865D]/30"
                    : "text-black/65 dark:text-white/65 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-black dark:hover:text-white",
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-white/60" />
                )}

                {/* Icon */}
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-black/[0.05] dark:bg-white/[0.05] text-black/50 dark:text-white/50 group-hover:bg-black/[0.08] dark:group-hover:bg-white/[0.08] group-hover:text-black/80 dark:group-hover:text-white/80",
                  )}
                >
                  <item.icon className="h-4 w-4" strokeWidth={2.5} />
                </span>

                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Footer divider ──────────────────────────── */}
        <div className="px-3 py-4 border-t border-black/[0.06] dark:border-white/[0.06] space-y-3">
          {/* Back to Website link */}
          <Link
            href="/"
            onClick={onClose}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-black/65 dark:text-white/65 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-black dark:hover:text-white"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.05] dark:bg-white/[0.05] transition-all duration-200 group-hover:bg-[#B8865D]/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/medicine-symbol (1).png"
                alt="MediStore logo"
                className="h-5 w-5 object-contain opacity-60 group-hover:opacity-90 transition-opacity"
              />
            </span>
            <span className="truncate">Back to Website</span>
          </Link>

          <p className="text-[10px] text-black/30 dark:text-white/30 text-center">
            MediStore © {new Date().getFullYear()}
          </p>
        </div>

        <style>{`
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-12px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </aside>
    </>
  );
}
