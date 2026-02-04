"use client";

import { useAuth } from "@/hooks";
import { Loader2, Mail, Phone, MapPin, User, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditProfileModal from "@/components/MyAccount/EditProfileModal";

export default function MyAccountPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-[#FAF8F5]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            My Account
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage your profile and settings
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="bg-gray-50 px-6 py-8 dark:bg-gray-800/50">
            <div className="flex items-center gap-x-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#DED6CD]">
                <span className="text-2xl font-bold">
                  {user.name?.toUpperCase()?.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {user.name}
                </h2>
                <div className="mt-1 flex items-center gap-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Shield size={14} />
                  <span className="capitalize">{user.role?.toLowerCase()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-8 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Email Address
              </label>
              <div className="flex items-center gap-x-3 text-gray-900 dark:text-gray-100">
                <Mail size={18} className="text-gray-400" />
                {user.email}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Contact Number
              </label>
              <div className="flex items-center gap-x-3 text-gray-900 dark:text-gray-100">
                <Phone size={18} className="text-gray-400" />
                {user.contactNumber || "Not provided"}
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Address
              </label>
              <div className="flex items-center gap-x-3 text-gray-900 dark:text-gray-100">
                <MapPin size={18} className="text-gray-400" />
                {user.address || "Not provided"}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
            <button
              className="text-sm font-medium text-[#212121] hover:text-[#DED6CD] dark:text-blue-400"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
        />
      </div>
    </div>
  );
}
