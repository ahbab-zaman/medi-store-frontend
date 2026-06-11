"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Edit,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  X,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  useAdminCategories,
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
} from "@/hooks";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/Skeleton";
import { getImageUrl } from "@/utils/image-url";
import { cn } from "@/utils/cn";

type CategorySort = "name" | "newest" | "oldest" | "products-high" | "products-low";
type CategoryImageFilter = "ALL" | "WITH_IMAGE" | "WITHOUT_IMAGE";

type CategoryItem = {
  id: string;
  name: string;
  image?: string | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    medicines?: number;
  };
};

type CollectionResponse<T> = {
  data?: T[];
};

const statCardBase =
  "relative overflow-hidden rounded-2xl border bg-white/80 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-white/[.04] sm:p-6";

export default function AdminCategoriesPage() {
  const { data: categoriesRes, isLoading } = useAdminCategories();
  const categories = useMemo(
    () => ((categoriesRes as CollectionResponse<CategoryItem>)?.data ?? []) as CategoryItem[],
    [categoriesRes],
  );
  const { mutate: createCategory, isPending: isCreating } =
    useAdminCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } =
    useAdminUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } =
    useAdminDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFilter, setImageFilter] =
    useState<CategoryImageFilter>("ALL");
  const [sortBy, setSortBy] = useState<CategorySort>("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return [...categories]
      .filter((category) => {
        const matchesSearch =
          !term ||
          category.name?.toLowerCase().includes(term) ||
          category.description?.toLowerCase().includes(term);

        const matchesImageFilter =
          imageFilter === "ALL"
            ? true
            : imageFilter === "WITH_IMAGE"
              ? !!category.image
              : !category.image;

        return matchesSearch && matchesImageFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
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
          case "products-high":
            return (b._count?.medicines || 0) - (a._count?.medicines || 0);
          case "products-low":
            return (a._count?.medicines || 0) - (b._count?.medicines || 0);
          case "name":
          default:
            return (a.name || "").localeCompare(b.name || "");
        }
      });
  }, [categories, imageFilter, searchTerm, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / itemsPerPage),
  );
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const stats = useMemo(() => {
    const total = categories.length;
    const withImage = categories.filter((category) => !!category.image).length;
    const withoutImage = total - withImage;
    const totalMedicines = categories.reduce(
      (acc, category) => acc + (category._count?.medicines || 0),
      0,
    );

    return { total, withImage, withoutImage, totalMedicines };
  }, [categories]);

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteCategory(deletingId, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;

    if (!name || name.trim().length < 2) {
      toast.error("Invalid category name", {
        description: "Category name must be at least 2 characters",
      });
      return;
    }

    if (editingCategory) {
      updateCategory(
        { id: editingCategory.id, payload: formData },
        {
          onSuccess: () => closeModal(),
        },
      );
    } else {
      createCategory(formData, {
        onSuccess: () => closeModal(),
      });
    }
  };

  const openEditModal = (category: CategoryItem) => {
    setEditingCategory(category);
    setImagePreview(category.image ? getImageUrl(category.image) : null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-2xl space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-400 sm:text-3xl lg:text-4xl">
            Manage Categories
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60 sm:text-base">
            Search, sort, and manage the category catalog.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className={cn(statCardBase, "border-blue-200/70 dark:border-blue-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Total Categories
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.total}
            </p>
          </div>
          <div className={cn(statCardBase, "border-green-200/70 dark:border-green-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              With Image
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.withImage}
            </p>
          </div>
          <div className={cn(statCardBase, "border-amber-200/70 dark:border-amber-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Without Image
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.withoutImage}
            </p>
          </div>
          <div className={cn(statCardBase, "border-purple-200/70 dark:border-purple-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Medicines
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.totalMedicines}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/[.04] sm:rounded-3xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
                  Category Library
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                  Filter by image availability and sort the catalog.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="relative xl:min-w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search name or description"
                    className="h-10 rounded-full border-black/10 bg-white pl-9 text-sm dark:border-white/10 dark:bg-white/[.04]"
                  />
                </div>

                <select
                  value={imageFilter}
                  onChange={(e) =>
                    setImageFilter(e.target.value as CategoryImageFilter)
                  }
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="ALL">All images</option>
                  <option value="WITH_IMAGE">With image</option>
                  <option value="WITHOUT_IMAGE">Without image</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as CategorySort)}
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="name">Sort by name</option>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="products-high">Most medicines</option>
                  <option value="products-low">Fewest medicines</option>
                </select>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-black px-4 text-sm font-medium text-white transition-all hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </button>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              <ArrowUpDown className="h-4 w-4" />
              <span>{filteredCategories.length} categories shown</span>
            </div>

            {isLoading ? (
              <div className="space-y-3 md:hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/[.03]"
                  >
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="mt-3 h-4 w-28" />
                    <Skeleton className="mt-2 h-4 w-full" />
                    <div className="mt-4 flex gap-2">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 bg-white/50 px-6 py-12 text-center dark:border-white/10 dark:bg-white/[.03]">
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  No categories match your filters.
                </p>
                <p className="mt-2 text-sm text-black/55 dark:text-white/55">
                  Try changing the search or image filter.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {paginatedCategories.map((category) => (
                    <div
                      key={category.id}
                      className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/10 dark:bg-white/[.03] dark:hover:bg-white/[.05]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
                          {category.image ? (
                            <img
                              src={getImageUrl(category.image)}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-black/40 dark:text-white/40">
                              <ImagePlus className="h-5 w-5" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-900 dark:text-white">
                                {category.name}
                              </p>
                              <p className="mt-1 line-clamp-2 text-sm text-black/55 dark:text-white/55">
                                {category.description || "No description"}
                              </p>
                            </div>
                            <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-black/60 dark:bg-white/5 dark:text-white/60">
                              {category._count?.medicines || 0} meds
                            </span>
                          </div>

                          <div className="mt-4 flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(category)}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-black/70 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
                              aria-label={`Edit ${category.name}`}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(category.id)}
                              disabled={isDeleting || deletingId === category.id}
                              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                              aria-label={`Delete ${category.name}`}
                              title="Delete"
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
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-black/5 dark:bg-white/5">
                      <tr>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Image
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Name
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Description
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Medicines
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 dark:divide-white/10">
                      {paginatedCategories.map((category) => (
                        <tr
                          key={category.id}
                          className="bg-white/60 transition-colors hover:bg-black/[.03] dark:bg-transparent dark:hover:bg-white/[.04]"
                        >
                          <td className="px-6 py-4">
                            {category.image ? (
                              <img
                                src={getImageUrl(category.image)}
                                alt={category.name}
                                className="h-10 w-10 rounded-lg bg-gray-100 object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 text-black/40 dark:bg-white/5 dark:text-white/40">
                                <ImagePlus className="h-5 w-5" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </td>
                          <td className="px-6 py-4 text-black/70 dark:text-white/70">
                            {category.description || "-"}
                          </td>
                          <td className="px-6 py-4 text-black/70 dark:text-white/70">
                            {category._count?.medicines || 0}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(category)}
                                disabled={isDeleting}
                                className="rounded-lg p-2 text-black/70 transition-colors hover:bg-black/10 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                                title="Edit"
                                aria-label={`Edit ${category.name}`}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(category.id)}
                                disabled={isDeleting || deletingId === category.id}
                                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                                title="Delete"
                                aria-label={`Delete ${category.name}`}
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

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-black/55 dark:text-white/55">
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
              </>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-200 rounded-2xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0a0a0a]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>
                <button
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="rounded-lg p-2 transition-colors hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category Image
                  </label>
                  <div className="group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-black/20 bg-black/5 transition-colors hover:bg-black/10 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-black/50 dark:text-white/50">
                        <ImagePlus className="h-8 w-8" />
                        <span className="text-sm font-medium">
                          Upload Image
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingCategory?.name}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-2 outline-none transition-colors focus:border-black/30 disabled:opacity-50 dark:border-white/10 dark:focus:border-white/30"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingCategory?.description ?? undefined}
                    disabled={isSubmitting}
                    className="min-h-[100px] w-full rounded-lg border border-black/10 bg-transparent px-4 py-2 outline-none transition-colors focus:border-black/30 disabled:opacity-50 dark:border-white/10 dark:focus:border-white/30"
                    placeholder="Enter category description (optional)"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl border border-black/10 px-4 py-2 font-medium transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 font-medium text-white transition-all hover:bg-black/90 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {editingCategory ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>{editingCategory ? "Update" : "Create"}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmationDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={confirmDelete}
          title="Delete Category"
          description="Are you sure you want to delete this category? This action cannot be undone."
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
