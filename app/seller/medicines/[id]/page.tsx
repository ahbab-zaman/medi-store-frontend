"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { useUpdateMedicine, useMedicine } from "@/hooks/useMedicines";
import { useCategories } from "@/hooks/useCategories";
import { Loader2, Upload, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { getImageUrl } from "@/utils/image-url";

const medicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0.001, "Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  expiryDate: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

export default function EditMedicinePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: medicineResponse, isLoading: isLoadingMedicine } =
    useMedicine(id);
  const medicine = medicineResponse?.data;
  const { mutate: updateMedicine, isPending: isUpdating } = useUpdateMedicine();
  const { data: categories } = useCategories();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(medicineSchema),
  });

  // Pre-fill form data
  useEffect(() => {
    if (medicine) {
      reset({
        name: medicine.name,
        description: medicine.description,
        price: medicine.price,
        stock: medicine.stock,
        manufacturer: medicine.manufacturer,
        categoryId: medicine.categoryId,
        expiryDate: medicine.expiryDate
          ? new Date(medicine.expiryDate).toISOString().split("T")[0]
          : undefined,
      });
      if (medicine.imageUrl) {
        setImagePreview(getImageUrl(medicine.imageUrl));
      }
    }
  }, [medicine, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("manufacturer", data.manufacturer);
    formData.append("categoryId", data.categoryId);
    if (data.expiryDate) {
      formData.append("expiryDate", data.expiryDate);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Wrap the call to handle the ID requirement for the hook
    // The hook in `useUpdateMedicine` likely expects `{ id, payload }` or just FormData if customized.
    // Let's verify standard pattern. Usually `useMutation` takes one argument.
    // If I passed `formData` directly in create, here I probably need to pass `id` too.
    // Assuming the service `updateMedicine(id, formData)` signature.
    // So the mutation function needs to be called with `{ id, formData }`.

    updateMedicine(
      { id, data: formData },
      {
        onSuccess: () => {
          router.push("/seller/medicines");
        },
      },
    );
  };

  if (isLoadingMedicine) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/seller/medicines"
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Medicines
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Medicine</h1>
        <p className="text-sm text-gray-500">
          Update product details and stock.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Medicine Name
              </label>
              <input
                {...register("name")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Category
              </label>
              <select
                {...register("categoryId")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none bg-white"
                disabled={!categories?.data}
              >
                <option value="">
                  {categories?.data
                    ? "Select Category"
                    : "Loading categories..."}
                </option>
                {categories?.data?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Manufacturer
              </label>
              <input
                {...register("manufacturer")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
              />
              {errors.manufacturer && (
                <p className="text-xs text-red-500">
                  {errors.manufacturer.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Expiry Date
              </label>
              <input
                type="date"
                {...register("expiryDate")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Price (BHD)
              </label>
              <input
                type="number"
                step="0.001"
                {...register("price")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
              />
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Stock Level
              </label>
              <input
                type="number"
                {...register("stock")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
              />
              {errors.stock && (
                <p className="text-xs text-red-500">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Product Image
            </label>
            <div className="flex items-center gap-6">
              {imagePreview && (
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-1 top-1 rounded-full bg-white/80 p-1 text-gray-700 hover:bg-white hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                <Upload className="mb-2 h-6 w-6 text-gray-400" />
                <span className="text-xs text-gray-500">Change</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/seller/medicines"
              className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
