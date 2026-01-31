"use client";

import {
  useAdminUsers,
  useAdminUpdateUserBanStatus,
  useAdminUpdateUserRole,
  useAdminDeleteUser,
} from "@/hooks";
import { Trash2, Ban, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const { mutate: updateBanStatus } = useAdminUpdateUserBanStatus();
  const { mutate: updateRole } = useAdminUpdateUserRole();
  const { mutate: deleteUser } = useAdminDeleteUser();

  const handleBanStatus = (userId: string, isBanned: boolean) => {
    updateBanStatus({ userId, isBanned });
  };

  const handleRoleChange = (
    userId: string,
    role: "ADMIN" | "SELLER" | "CUSTOMER",
  ) => {
    updateRole({ userId, role });
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null,
  );

  const handleDelete = (userId: string) => {
    setDeleteConfirmation(userId);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteUser(deleteConfirmation);
      setDeleteConfirmation(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/[.04]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-16 rounded-lg" />
                    </td>
                  </tr>
                ))
              : users?.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user.id,
                            e.target.value as "ADMIN" | "SELLER" | "CUSTOMER",
                          )
                        }
                        className={cn(
                          "rounded-lg border px-2.5 py-1 text-xs font-medium outline-none",
                          user.role === "ADMIN" &&
                            "border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-900/30 dark:bg-purple-900/30 dark:text-purple-300",
                          user.role === "SELLER" &&
                            "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-900/30 dark:bg-blue-900/30 dark:text-blue-300",
                          user.role === "CUSTOMER" &&
                            "border-green-200 bg-green-100 text-green-800 dark:border-green-900/30 dark:bg-green-900/30 dark:text-green-300",
                        )}
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="SELLER">SELLER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {user.isBanned ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleBanStatus(user.id, !user.isBanned)
                          }
                          className="rounded-lg p-2 text-black/70 hover:bg-black/10 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                          title={user.isBanned ? "Unban User" : "Ban User"}
                        >
                          {user.isBanned ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Ban className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <ConfirmationDialog
        isOpen={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
}
