"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, MapPin } from "lucide-react";
import { AddressForm, AddressFormData } from "@/components/MyAccount/AddressForm";

/* ─── Skeleton stub ──────────────────────────────────────────────────────── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800 ${className ?? ""}`}
    />
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function EditAddressPage({
  params,
}: {
  params: { id: string };
}) {
  const [loading, setLoading] = useState(false);
  const [fetchLoading] = useState(false); // set to true to preview skeleton state

  // Pre-fill with mock data for UI preview — replace with real API fetch
  const [initial] = useState<Partial<AddressFormData>>({
    name: "Home",
    firstname: "Sarah",
    lastname: "Johnson",
    address_1: "Marina Crown Tower",
    address_2: "Apartment 2104",
    road: "Marina Walk",
    area: "1",
    landmark: "Next to Dubai Marina Mall",
    latitude: "25.0812",
    longitude: "55.1428",
    mobile_country_code: "971",
    mobile: "501234567",
    default: 1,
  });

  const handleSubmit = async (_data: AddressFormData) => {
    setLoading(true);
    // TODO: wire up API call
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
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
        {fetchLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <AddressForm
            initial={initial}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Update Address"
          />
        )}
      </div>
    </div>
  );
}
