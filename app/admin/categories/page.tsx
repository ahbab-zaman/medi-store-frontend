"use client";

import {
  useAdminCategories,
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
} from "@/hooks";
import { Trash2, Edit, Plus, X, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const { mutate: createCategory, isPending: isCreating } =
    useAdminCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } =
    useAdminUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } =
    useAdminDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Validate form
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name || name.trim().length < 2) {
      toast.error("Invalid category name", {
        description: "Category name must be at least 2 characters",
      });
      return;
    }

    const payload = {
      name,
      description: description || undefined,
    };

    if (editingCategory) {
      updateCategory(
        { id: editingCategory.id, payload },
        {
          onSuccess: () => closeModal(),
        },
      );
    } else {
      createCategory(payload, {
        onSuccess: () => closeModal(),
      });
    }
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:bg-black/90 hover:scale-105 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/[.04]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-64" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-16 rounded-lg" />
                    </td>
                  </tr>
                ))
              : categories?.map((category: any) => (
                  <tr
                    key={category.id}
                    className="hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <td className="px-6 py-4 font-medium text-black dark:text-white">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-black/70 dark:text-white/70">
                      {category.description || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          disabled={isDeleting}
                          className="rounded-lg p-2 text-black/70 hover:bg-black/10 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category.id)}
                          disabled={isDeleting || deletingId === category.id}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
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
                  defaultValue={editingCategory?.description}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-2 outline-none transition-colors focus:border-black/30 disabled:opacity-50 dark:border-white/10 dark:focus:border-white/30 min-h-[100px]"
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
                  className="flex-1 rounded-xl bg-black px-4 py-2 font-medium text-white transition-all hover:bg-black/90 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90 flex items-center justify-center gap-2"
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
  );
}
