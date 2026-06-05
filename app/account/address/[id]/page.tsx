"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import { AddressForm, AddressFormData } from "@/components/MyAccount/AddressForm";
import { getAddressById, updateAddress, AddressApiRecord } from "@/services/address.service";

/* ─── Skeleton stub ──────────────────────────────────────────────────────── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800 ${className ?? ""}`}
    />
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function toFormData(addr: AddressApiRecord): Partial<AddressFormData> {
  return {
    name: addr.name,
    firstname: addr.firstname,
    lastname: addr.lastname,
    address_1: addr.address_1,
    address_2: addr.address_2,
    road: addr.road,
    area: addr.area,
    landmark: addr.landmark ?? "",
    latitude: addr.latitude ?? "",
    longitude: addr.longitude ?? "",
    mobile_country_code: addr.mobileCountryCode,
    mobile: addr.mobile,
    default: addr.isDefault ? 1 : 0,
  };
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function EditAddressPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Support both Next.js 15 async params and older sync params
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const { id } = resolvedParams;

  const router = useRouter();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [initial, setInitial] = useState<Partial<AddressFormData>>({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setFetchLoading(true);
    getAddressById(id)
      .then((res) => {
        if (res.data) {
          setInitial(toFormData(res.data));
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        setNotFound(true);
        toast.error("Address not found");
      })
      .finally(() => setFetchLoading(false));
  }, [id]);

  const handleSubmit = async (data: AddressFormData) => {
    setSubmitLoading(true);
    try {
      await updateAddress(id, {
        name: data.name,
        firstname: data.firstname,
        lastname: data.lastname,
        address_1: data.address_1,
        address_2: data.address_2,
        road: data.road,
        area: data.area,
        landmark: data.landmark || undefined,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
        mobile_country_code: data.mobile_country_code,
        mobile: data.mobile,
        default: data.default,
      });
      toast.success("Address updated successfully!");
      router.push("/account/address");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update address. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm dark:shadow-black/20">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 px-6 py-6 sm:px-8">
        <Link
          href="/account/address"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-gray-100 mb-4"
        >
          <ChevronLeft size={16} /> Back to Addresses
        </Link>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-600 dark:text-gray-400">
              <MapPin size={13} />
              Address Editor
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Update delivery notes, contact details, or location fields so
              future orders land in the right place.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8">
        {notFound ? (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <MapPin size={24} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Address not found
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              This address may have been deleted or doesn&apos;t exist.
            </p>
            <Link
              href="/account/address"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:hover:bg-gray-600"
            >
              Back to Address Book
            </Link>
          </div>
        ) : fetchLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <AddressForm
            initial={initial}
            onSubmit={handleSubmit}
            loading={submitLoading}
            submitLabel="Update Address"
          />
        )}
      </div>
    </div>
  );
}
