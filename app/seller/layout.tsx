"use client";

import { Sidebar } from "@/components/seller/Sidebar";
import React, { useState } from "react";
import { Menu } from "lucide-react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-gray-50 dark:bg-black">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Mobile top bar */}
        <div className="mb-4 flex items-center lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="mx-auto">{children}</div>
      </main>
    </div>
  );
}
