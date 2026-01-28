"use client";

import { useAuth } from "@/hooks";
import { Role } from "@/types";
import {
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  Loader2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

function roleDashboard(role?: Role) {
  if (role === Role.ADMIN) return "/admin/dashboard";
  if (role === Role.SELLER) return "/seller/dashboard";
  return "/customer/dashboard";
}

export default function UserDropdown() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <Loader2 className="h-5 w-5 animate-spin text-black/50 dark:text-white/50" />
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-black hover:text-black/70 dark:text-white dark:hover:text-white/70"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-x-2 rounded-full border border-black/5 bg-black/5 py-1.5 px-3 transition-colors hover:bg-black/10 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 dark:bg-white/10">
          <UserIcon size={14} className="text-black dark:text-white" />
        </div>
        <span className="text-sm font-medium text-black dark:text-white hidden sm:block">
          {user.name}
        </span>
        <ChevronDown
          size={14}
          className={`text-black/50 dark:text-white/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-black/5 bg-white p-2 shadow-xl shadow-black/5 ring-1 ring-black/5 focus:outline-none dark:border-white/5 dark:bg-gray-900">
          <div className="px-3 py-2 border-b border-black/5 dark:border-white/5 mb-1">
            <p className="truncate text-sm font-medium text-black dark:text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-black/50 dark:text-white/50">
              {user.email}
            </p>
          </div>

          <Link
            href={roleDashboard(user.role)}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-x-2 rounded-xl px-3 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>

          <Link
            href="/my-account"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-x-2 rounded-xl px-3 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <UserIcon size={16} />
            My Account
          </Link>

          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-x-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
