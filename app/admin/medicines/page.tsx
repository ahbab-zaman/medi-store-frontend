"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowUpDown,
  Edit,
  Plus,
  Search,
  Store,
  Trash2,
} from "lucide-react";

import { useAdminMedicines, useDeleteAdminMedicine } from "@/hooks/useAdminMedicines";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { MedicineForm } from "@/components/seller/MedicineForm";
import { Input } from "@/components/ui/input";
import { Medicine } from "@/types";
import { getImageUrl } from "@/utils/image-url";
import bdtImage from "@/public/BDT.png";
import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/ui/Skeleton";

type MedicineSort = "name" | "newest" | "oldest" | "price-high" | "price-low" | "stock-high" | "stock-low";
type MedicineStockFilter = "ALL" | "IN_STOCK" | "OUT_OF_STOCK";

type MedicineItem = Medicine & {
  category?: {
    id: string;
    name: string;
  };
  seller?: {
    id: string;
    name?: string;
    email?: string;
  };
};

type CollectionResponse<T> = {
  data?: T[];
};

const statCardBase =
  "relative overflow-hidden rounded-2xl border bg-white/80 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-white/[.04] sm:p-6";

export default function AdminMedicinesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState<MedicineStockFilter>("ALL");
  const [sortBy, setSortBy] = useState<MedicineSort>("newest");
  const itemsPerPage = 8;

  const { data: medicinesRes, isLoading } = useAdminMedicines();
  const medicines = useMemo(
    () => ((medicinesRes as CollectionResponse<MedicineItem>)?.data ?? []) as MedicineItem[],
    [medicinesRes],
  );
  const { mutate: deleteMedicine } = useDeleteAdminMedicine();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<MedicineItem | null>(null);

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Map(
          medicines
            .filter((medicine) => medicine.category?.id && medicine.category?.name)
            .map((medicine) => [
              medicine.category!.id,
              medicine.category!,
            ]),
        ).values(),
      ),
    [medicines],
  );

  const filteredMedicines = useMemo(() => {
    const term = search.trim().toLowerCase();

    return [...medicines]
      .filter((medicine) => {
        const matchesSearch =
          !term ||
          medicine.name?.toLowerCase().includes(term) ||
          medicine.manufacturer?.toLowerCase().includes(term) ||
          medicine.seller?.name?.toLowerCase().includes(term) ||
          medicine.category?.name?.toLowerCase().includes(term);

        const matchesCategory =
          categoryFilter === "ALL" ? true : medicine.category?.id === categoryFilter;

        const matchesStock =
          stockFilter === "ALL"
            ? true
            : stockFilter === "IN_STOCK"
              ? medicine.stock > 0
              : medicine.stock <= 0;

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return (a.name || "").localeCompare(b.name || "");
          case "newest":
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            );
          case "oldest":
            return (
              new Date(a.createdAt || 0).getTime() -
              new Date(b.createdAt || 0).getTime()
            );
          case "price-high":
            return Number(b.price || 0) - Number(a.price || 0);
          case "price-low":
            return Number(a.price || 0) - Number(b.price || 0);
          case "stock-high":
            return Number(b.stock || 0) - Number(a.stock || 0);
          case "stock-low":
            return Number(a.stock || 0) - Number(b.stock || 0);
          default:
            return 0;
        }
      });
  }, [categoryFilter, medicines, search, sortBy, stockFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMedicines.length / itemsPerPage),
  );
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedMedicines = filteredMedicines.slice(startIndex, startIndex + itemsPerPage);

  const stats = useMemo(() => {
    const total = medicines.length;
    const inStock = medicines.filter((medicine) => medicine.stock > 0).length;
    const outOfStock = total - inStock;
    const categories = new Set(
      medicines.map((medicine) => medicine.category?.id).filter(Boolean),
    ).size;

    return { total, inStock, outOfStock, categories };
  }, [medicines]);

  const handleAddSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "medicines"] });
    setIsAddModalOpen(false);
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "medicines"] });
    setEditingMedicine(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMedicine(deleteId);
      setDeleteId(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const emptyState = !isLoading && filteredMedicines.length === 0;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-2xl space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-400 sm:text-3xl lg:text-4xl">
            All Medicines
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60 sm:text-base">
            Manage inventory, pricing, and product visibility.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className={cn(statCardBase, "border-blue-200/70 dark:border-blue-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Total Medicines
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.total}
            </p>
          </div>
          <div className={cn(statCardBase, "border-green-200/70 dark:border-green-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              In Stock
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.inStock}
            </p>
          </div>
          <div className={cn(statCardBase, "border-red-200/70 dark:border-red-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Out of Stock
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.outOfStock}
            </p>
          </div>
          <div className={cn(statCardBase, "border-purple-200/70 dark:border-purple-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Categories
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.categories}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/[.04] sm:rounded-3xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5" />

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
                  Medicine Catalog
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                  Search products, filter by category or stock, and sort by inventory metrics.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="relative xl:min-w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
                  <Input
                    type="text"
                    placeholder="Search medicines, sellers, or categories..."
                    className="h-10 rounded-full border-black/10 bg-white pl-9 text-sm dark:border-white/10 dark:bg-white/[.04]"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="ALL">All categories</option>
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <select
                  value={stockFilter}
                  onChange={(e) => {
                    setStockFilter(e.target.value as MedicineStockFilter);
                    setCurrentPage(1);
                  }}
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="ALL">All stock levels</option>
                  <option value="IN_STOCK">In stock</option>
                  <option value="OUT_OF_STOCK">Out of stock</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as MedicineSort);
                    setCurrentPage(1);
                  }}
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-high">Price high to low</option>
                  <option value="price-low">Price low to high</option>
                  <option value="stock-high">Stock high to low</option>
                  <option value="stock-low">Stock low to high</option>
                </select>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span>{filteredMedicines.length} medicines shown</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                <Plus className="h-4 w-4" />
                Add Medicine
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3 md:hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/[.03]"
                  >
                    <SkeletonBlock />
                  </div>
                ))}
              </div>
            ) : emptyState ? (
              <div className="rounded-2xl border border-dashed border-black/10 bg-white/50 px-6 py-12 text-center dark:border-white/10 dark:bg-white/[.03]">
                <div className="flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="h-8 w-8 text-gray-300" />
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    No medicines found.
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Add first medicine
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {paginatedMedicines.map((medicine) => (
                    <div
                      key={medicine.id}
                      className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/10 dark:bg-white/[.03] dark:hover:bg-white/[.05]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
                          {medicine.imageUrl ? (
                            <img
                              src={getImageUrl(medicine.imageUrl)}
                              alt={medicine.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                              No Img
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-900 dark:text-white">
                                {medicine.name}
                              </p>
                              <p className="mt-1 text-xs text-black/55 dark:text-white/55">
                                {medicine.manufacturer || "Unknown manufacturer"}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium",
                                medicine.stock > 0
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                              )}
                            >
                              {medicine.stock > 0 ? "Active" : "Out"}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div className="rounded-xl bg-black/[.03] px-3 py-2 dark:bg-white/[.05]">
                              <p className="text-xs text-black/45 dark:text-white/45">
                                Seller
                              </p>
                              <p className="mt-1 truncate font-medium text-gray-900 dark:text-white">
                                {medicine.seller?.name || "Unknown"}
                              </p>
                            </div>
                            <div className="rounded-xl bg-black/[.03] px-3 py-2 dark:bg-white/[.05]">
                              <p className="text-xs text-black/45 dark:text-white/45">
                                Category
                              </p>
                              <p className="mt-1 truncate font-medium text-gray-900 dark:text-white">
                                {medicine.category?.name || "-"}
                              </p>
                            </div>
                            <div className="rounded-xl bg-black/[.03] px-3 py-2 dark:bg-white/[.05]">
                              <p className="text-xs text-black/45 dark:text-white/45">
                                Price
                              </p>
                              <p className="mt-1 flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                                <Image
                                  src={bdtImage}
                                  width={12}
                                  height={12}
                                  alt="Bangladeshi Taka Symbol"
                                />
                                {medicine.price}
                              </p>
                            </div>
                            <div className="rounded-xl bg-black/[.03] px-3 py-2 dark:bg-white/[.05]">
                              <p className="text-xs text-black/45 dark:text-white/45">
                                Stock
                              </p>
                              <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                {medicine.stock}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center gap-2">
                            <button
                              onClick={() => setEditingMedicine(medicine)}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-black/70 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
                              title="Edit"
                              aria-label={`Edit ${medicine.name}`}
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteId(medicine.id)}
                              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                              title="Delete"
                              aria-label={`Delete ${medicine.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 md:block">
                  <table className="min-w-full border-collapse text-left text-sm text-gray-600">
                    <thead className="bg-black/5 text-xs font-semibold uppercase text-black/50 dark:bg-white/5 dark:text-white/50">
                      <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Seller</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 dark:divide-white/10">
                      {paginatedMedicines.map((medicine) => (
                        <tr
                          key={medicine.id}
                          className="bg-white/60 transition-colors hover:bg-black/[.03] dark:bg-transparent dark:hover:bg-white/[.04]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                                {medicine.imageUrl ? (
                                  <img
                                    src={getImageUrl(medicine.imageUrl)}
                                    alt={medicine.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                                    No Img
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-black dark:text-white">
                                  {medicine.name}
                                </div>
                                <div className="text-xs text-black/50 dark:text-white/50">
                                  {medicine.manufacturer}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Store className="h-3 w-3 text-gray-400" />
                              <span className="font-medium text-black/70 dark:text-white/70">
                                {medicine.seller?.name || "Unknown"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{medicine.category?.name || "-"}</td>
                          <td className="px-6 py-4 font-medium text-black dark:text-white">
                            <span className="flex items-center gap-1">
                              <Image
                                src={bdtImage}
                                width={12}
                                height={12}
                                alt="Bangladeshi Taka Symbol"
                              />
                              {medicine.price}
                            </span>
                          </td>
                          <td className="px-6 py-4">{medicine.stock}</td>
                          <td className="px-6 py-4">
                            {medicine.stock > 0 ? (
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                Out of Stock
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingMedicine(medicine)}
                                className="rounded p-1 text-black/50 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/5"
                                title="Edit"
                                aria-label={`Edit ${medicine.name}`}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteId(medicine.id)}
                                className="rounded p-1 text-black/50 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-white/50 dark:hover:bg-red-900/20"
                                title="Delete"
                                aria-label={`Delete ${medicine.name}`}
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

            {!isLoading && !emptyState && (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-black/50 dark:text-white/50">
                Page {activePage} of {totalPages}
              </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.max(1, Math.min(totalPages, p) - 1),
                      )
                    }
                    disabled={activePage === 1}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70 transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:hover:bg-white/5"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(totalPages, Math.min(totalPages, p) + 1),
                      )
                    }
                    disabled={activePage === totalPages}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70 transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:hover:bg-white/5"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Medicine"
          description="Fill in the details to list a new product."
          maxWidth="2xl"
        >
          <MedicineForm
            onSuccess={handleAddSuccess}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>

        <Modal
          isOpen={!!editingMedicine}
          onClose={() => setEditingMedicine(null)}
          title="Edit Medicine"
          description="Update product details and stock."
          maxWidth="2xl"
        >
          {editingMedicine && (
            <MedicineForm
              initialData={editingMedicine}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingMedicine(null)}
            />
          )}
        </Modal>

        <ConfirmationDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="Delete Medicine"
          description="Are you sure you want to delete this medicine? This action cannot be undone."
          onConfirm={handleDelete}
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </div>
  );
}

function SkeletonBlock() {
  return (
    <>
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="mt-3 h-4 w-28" />
      <Skeleton className="mt-2 h-4 w-full" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 w-full rounded-xl" />
        <Skeleton className="h-9 w-12 rounded-xl" />
      </div>
    </>
  );
}
