"use client";

import {
  useAdminCategories,
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
} from "@/hooks";
import { Trash2, Edit, Plus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useState } from "react";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const { mutate: createCategory } = useAdminCreateCategory();
  const { mutate: updateCategory } = useAdminUpdateCategory();
  const { mutate: deleteCategory } = useAdminDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (editingCategory) {
      updateCategory(
        { id: editingCategory.id, formData },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/[.04]"
              >
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </div>
              </div>
            ))
          : categories?.map((category: any) => (
              <div
                key={category.id}
                className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/[.04]"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    {category.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                    >
                      <Edit className="mx-auto h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 rounded-lg border border-red-600/20 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-400/20 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="mx-auto h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#0a0a0a]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
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
                  className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-2 outline-none focus:border-black/30 dark:border-white/10 dark:focus:border-white/30"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  required={!editingCategory}
                  className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-2 outline-none focus:border-black/30 dark:border-white/10 dark:focus:border-white/30"
                />
                {editingCategory && (
                  <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                    Leave empty to keep current image
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-black/10 px-4 py-2 font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
