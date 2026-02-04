import {
  LucideIcon,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Pill,
  List,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const items: SidebarItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    icon: Users,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    href: "/admin/orders",
  },
  {
    icon: List,
    label: "Categories",
    href: "/admin/categories",
  },
  {
    icon: Pill,
    label: "Medicines",
    href: "/admin/medicines",
  },
  {
    icon: MessageSquare,
    label: "Reviews",
    href: "/admin/reviews",
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-64 border-r border-black/10 bg-white dark:border-white/10 dark:bg-black",
        className,
      )}
    >
      <div className="flex h-16 items-center px-6 border-b border-black/10 dark:border-white/10">
        <span className="text-lg font-bold">MediStore Admin</span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
