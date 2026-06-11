"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Ban,
  CheckCircle,
  Search,
  Shield,
  Trash2,
  Users,
} from "lucide-react";

import {
  useAdminDeleteUser,
  useAdminUpdateUserBanStatus,
  useAdminUpdateUserRole,
  useAdminUsers,
} from "@/hooks";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

type UserRole = "ADMIN" | "SELLER" | "CUSTOMER";
type UserStatusFilter = "ALL" | "ACTIVE" | "BANNED";
type UserSort = "name" | "email" | "role" | "status";

type UserItem = {
  id: string;
  name?: string;
  email?: string;
  role: UserRole;
  isBanned?: boolean;
};

type CollectionResponse<T> = {
  data?: T[];
};

const roleLabel: Record<UserRole, string> = {
  ADMIN: "Admin",
  SELLER: "Seller",
  CUSTOMER: "Customer",
};

const roleColor: Record<UserRole, string> = {
  ADMIN:
    "border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-900/30 dark:bg-purple-900/30 dark:text-purple-300",
  SELLER:
    "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-900/30 dark:bg-blue-900/30 dark:text-blue-300",
  CUSTOMER:
    "border-green-200 bg-green-100 text-green-800 dark:border-green-900/30 dark:bg-green-900/30 dark:text-green-300",
};

const statCardBase =
  "relative overflow-hidden rounded-2xl border bg-white/80 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-white/[.04] sm:p-6";

export default function AdminUsersPage() {
  const { data: usersRes, isLoading } = useAdminUsers();
  const users = useMemo(
    () => ((usersRes as CollectionResponse<UserItem>)?.data ?? []) as UserItem[],
    [usersRes],
  );
  const { mutate: updateBanStatus } = useAdminUpdateUserBanStatus();
  const { mutate: updateRole } = useAdminUpdateUserRole();
  const { mutate: deleteUser } = useAdminDeleteUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("ALL");
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");
  const [sortBy, setSortBy] = useState<UserSort>("name");
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null,
  );

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return [...users]
      .filter((user) => {
        const matchesSearch =
          !term ||
          user.name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.role?.toLowerCase().includes(term);

        const matchesStatus =
          statusFilter === "ALL"
            ? true
            : statusFilter === "ACTIVE"
              ? !user.isBanned
              : !!user.isBanned;

        const matchesRole =
          roleFilter === "ALL" ? true : user.role === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "email":
            return (a.email || "").localeCompare(b.email || "");
          case "role":
            return a.role.localeCompare(b.role);
          case "status":
            return Number(a.isBanned) - Number(b.isBanned);
          case "name":
          default:
            return (a.name || "").localeCompare(b.name || "");
        }
      });
  }, [roleFilter, searchTerm, sortBy, statusFilter, users]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((user) => !user.isBanned).length;
    const banned = users.filter((user) => user.isBanned).length;
    const admins = users.filter((user) => user.role === "ADMIN").length;

    return { total, active, banned, admins };
  }, [users]);

  const handleBanStatus = (userId: string, isBanned: boolean) => {
    updateBanStatus({ userId, isBanned });
  };

  const handleRoleChange = (
    userId: string,
    role: "ADMIN" | "SELLER" | "CUSTOMER",
  ) => {
    updateRole({ userId, role });
  };

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
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-2xl space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-400 sm:text-3xl lg:text-4xl">
            Manage Users
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60 sm:text-base">
            Search, filter, and manage user access from one place.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <div className={cn(statCardBase, "border-blue-200/70 dark:border-blue-900/40")}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Total Users
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {stats.total}
            </p>
          </div>

          <div className={cn(statCardBase, "border-green-200/70 dark:border-green-900/40")}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Active
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {stats.active}
            </p>
          </div>

          <div className={cn(statCardBase, "border-red-200/70 dark:border-red-900/40")}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <Ban className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Banned
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {stats.banned}
            </p>
          </div>

          <div className={cn(statCardBase, "border-purple-200/70 dark:border-purple-900/40")}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <Shield className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Admins
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {stats.admins}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/[.04] sm:rounded-3xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
                  User Directory
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                  Filter by role or status, then update user access.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="relative xl:min-w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name, email, or role"
                    className="h-10 rounded-full border-black/10 bg-white pl-9 text-sm dark:border-white/10 dark:bg-white/[.04]"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(e.target.value as "ALL" | UserRole)
                  }
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="ALL">All roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SELLER">Seller</option>
                  <option value="CUSTOMER">Customer</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as UserStatusFilter)
                  }
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="ALL">All statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="BANNED">Banned</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as UserSort)}
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="name">Sort by name</option>
                  <option value="email">Sort by email</option>
                  <option value="role">Sort by role</option>
                  <option value="status">Sort by status</option>
                </select>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              <ArrowUpDown className="h-4 w-4" />
              <span>{filteredUsers.length} users shown</span>
            </div>

            {isLoading ? (
              <div className="space-y-3 md:hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/[.03]"
                  >
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="mt-3 h-4 w-44" />
                    <div className="mt-4 flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <Skeleton className="mt-4 h-9 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 bg-white/50 px-6 py-12 text-center dark:border-white/10 dark:bg-white/[.03]">
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  No users match your filters.
                </p>
                <p className="mt-2 text-sm text-black/55 dark:text-white/55">
                  Try clearing the search or widening the status and role filters.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/10 dark:bg-white/[.03] dark:hover:bg-white/[.05]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900 dark:text-white">
                            {user.name || "Unknown"}
                          </p>
                          <p className="mt-1 truncate text-sm text-black/55 dark:text-white/55">
                            {user.email || "No email"}
                          </p>
                        </div>

                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                            roleColor[user.role],
                          )}
                        >
                          {roleLabel[user.role]}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                            user.isBanned
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                          )}
                        >
                          {user.isBanned ? "Banned" : "Active"}
                        </span>

                        <div className="flex items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user.id,
                                e.target.value as UserRole,
                              )
                            }
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-xs font-medium outline-none",
                              roleColor[user.role],
                            )}
                            aria-label={`Change role for ${user.name || "user"}`}
                          >
                            <option value="CUSTOMER">Customer</option>
                            <option value="SELLER">Seller</option>
                            <option value="ADMIN">Admin</option>
                          </select>

                          <button
                            onClick={() => handleDelete(user.id)}
                            className="rounded-full border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                            title="Delete User"
                            aria-label={`Delete ${user.name || "user"}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <button
                          onClick={() =>
                            handleBanStatus(user.id, !user.isBanned)
                          }
                          className={cn(
                            "inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                            user.isBanned
                              ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
                              : "bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10",
                          )}
                          title={user.isBanned ? "Unban User" : "Ban User"}
                          aria-label={user.isBanned ? "Unban user" : "Ban user"}
                        >
                          {user.isBanned ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Ban className="h-4 w-4" />
                          )}
                          {user.isBanned ? "Unban user" : "Ban user"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 md:block">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-black/5 dark:bg-white/5">
                      <tr>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Name
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Email
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Role
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Status
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 dark:divide-white/10">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="bg-white/60 transition-colors hover:bg-black/[.03] dark:bg-transparent dark:hover:bg-white/[.04]"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {user.name || "Unknown"}
                          </td>
                          <td className="px-6 py-4 text-black/70 dark:text-white/70">
                            {user.email || "No email"}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  user.id,
                                  e.target.value as UserRole,
                                )
                              }
                              className={cn(
                                "rounded-full border px-3 py-1.5 text-xs font-medium outline-none",
                                roleColor[user.role],
                              )}
                              aria-label={`Change role for ${user.name || "user"}`}
                            >
                              <option value="CUSTOMER">Customer</option>
                              <option value="SELLER">Seller</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                                user.isBanned
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                              )}
                            >
                              {user.isBanned ? "Banned" : "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleBanStatus(user.id, !user.isBanned)
                                }
                                className={cn(
                                  "rounded-lg p-2 transition-colors",
                                  user.isBanned
                                    ? "text-green-700 hover:bg-green-50 dark:text-green-300 dark:hover:bg-green-900/20"
                                    : "text-black/70 hover:bg-black/10 dark:text-white/70 dark:hover:bg-white/10",
                                )}
                                title={user.isBanned ? "Unban User" : "Ban User"}
                                aria-label={
                                  user.isBanned ? "Unban user" : "Ban user"
                                }
                              >
                                {user.isBanned ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Ban className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                                title="Delete User"
                                aria-label={`Delete ${user.name || "user"}`}
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
              </>
            )}
          </div>
        </div>
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
