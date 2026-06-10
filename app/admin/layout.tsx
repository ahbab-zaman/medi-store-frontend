"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "./favicon.ico";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-zinc-950">
      {/* ─── Sidebar ─────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="w-64 shrink-0"
      />

      {/* ─── Right column (header + scrollable content) ─── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="rounded-xl p-2 text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            href="/"
            title="Go to MediStore website"
            className="group flex items-center gap-2.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              src={logo}
              alt="MediStore"
              width={32}
              height={32}
              className="object-contain transition-transform duration-200 group-hover:scale-110"
            />
            <span className="text-base font-extrabold tracking-tight text-[#B8865D] dark:text-[#d4a574]">
              MediStore
            </span>
          </Link>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
