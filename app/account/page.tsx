"use client";

import Link from "next/link";
import {
  User,
  Lock,
  MapPin,
  ShoppingBag,
  Heart,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const quickLinks = [
  {
    href: "/account/edit",
    icon: User,
    title: "Edit Profile",
    desc: "Update your personal information",
  },
  {
    href: "/account/password",
    icon: Lock,
    title: "Change Password",
    desc: "Keep your account secure",
  },
  {
    href: "/account/address",
    icon: MapPin,
    title: "Address Book",
    desc: "Manage your delivery addresses",
  },
  {
    href: "/account/orders",
    icon: ShoppingBag,
    title: "My Orders",
    desc: "Track and view your orders",
  },
  {
    href: "/account/wishlist",
    icon: Heart,
    title: "Wishlist",
    desc: "Products you have saved",
  },
];

export default function AccountDashboard() {
  const user = useAuthStore((s) => s.user);
  const fullName = user?.name?.trim() || "User";
  const firstName = fullName.split(" ")[0] || "User";

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm dark:shadow-black/20">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Welcome back, {firstName}!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Here&apos;s an overview of your account.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-black/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Account Details
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              label: "Full Name",
              value: user?.name || "-",
            },
            { label: "Email", value: user?.email || "-" },
            { label: "Phone", value: user?.contactNumber || "-" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {label}
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-black/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Quick Links
          </h3>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {quickLinks.map(({ href, icon: Icon, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                <Icon size={18} className="text-gray-700 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {desc}
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
