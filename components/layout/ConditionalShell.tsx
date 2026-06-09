"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <div className="min-h-dvh bg-white text-black dark:bg-black dark:text-white font-sans">
      {!isAdminRoute && <Header />}
      <main className={isAdminRoute ? "w-full" : "w-full"}>{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
