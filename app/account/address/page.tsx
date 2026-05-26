"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface Address {
  address_id: string;
  firstname: string;
  lastname: string;
  address_1: string;
  address_2?: string;
  flat?: string;
  road?: string;
  city: string;
  postcode?: string;
  zone?: string;
  country: string;
  mobile?: string;
  mobile_country_code?: string;
  default: number;
}

/* ─── Skeleton stub ──────────────────────────────────────────────────────── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800 ${className ?? ""}`}
    />
  );
}

/* ─── ConfirmDialog inline stub (replace with the real component) ────────── */
function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-950/45 backdrop-blur-sm"
        onClick={() => !loading && onCancel()}
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {description}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 ${
              tone === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Mock data ──────────────────────────────────────────────────────────── */
const MOCK_ADDRESSES: Address[] = [
  {
    address_id: "1",
    firstname: "Sarah",
    lastname: "Johnson",
    address_1: "Marina Crown Tower",
    address_2: "Apartment 2104",
    flat: "2104",
    city: "Dubai",
    postcode: "00000",
    zone: "Dubai Marina",
    country: "United Arab Emirates",
    mobile: "501234567",
    mobile_country_code: "971",
    default: 1,
  },
  {
    address_id: "2",
    firstname: "Sarah",
    lastname: "Johnson",
    address_1: "Business Central Tower A",
    flat: "3402",
    city: "Dubai",
    zone: "Business Bay",
    country: "United Arab Emirates",
    mobile: "501234567",
    mobile_country_code: "971",
    default: 0,
  },
  {
    address_id: "3",
    firstname: "James",
    lastname: "Johnson",
    address_1: "Villa 12, Street 32",
    city: "Dubai",
    zone: "Jumeirah",
    country: "United Arab Emirates",
    default: 0,
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [loading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const defaultAddress = addresses.find((addr) => addr.default == 1) ?? null;
  const otherAddresses = addresses.filter(
    (addr) => addr.address_id !== defaultAddress?.address_id,
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setAddresses((prev) => prev.filter((a) => a.address_id !== deleteId));
    setDeleteId(null);
    setDeleteLoading(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm dark:shadow-black/20">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Address Book
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your saved delivery addresses.
          </p>
        </div>
        <Link
          href="/account/address/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:hover:bg-gray-600"
        >
          <Plus size={16} />
          Add Address
        </Link>
      </div>

      {/* Body */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <MapPin size={24} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              No addresses yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Add an address so checkout is faster next time.
            </p>
            <Link
              href="/account/address/add"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:hover:bg-gray-600"
            >
              <Plus size={16} />
              Add Address
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Default address */}
            {defaultAddress && (
              <section className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Default address
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    This address will be used first at checkout.
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo-300/40 dark:border-indigo-700/40 bg-indigo-50/60 dark:bg-indigo-950/20 p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-indigo-700 dark:text-indigo-300">
                          {defaultAddress.firstname} {defaultAddress.lastname}
                        </h3>
                        <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white">
                          Default
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <p>
                          {defaultAddress.address_1}
                          {defaultAddress.flat
                            ? `, Flat ${defaultAddress.flat}`
                            : ""}
                        </p>
                        {defaultAddress.address_2 && (
                          <p>{defaultAddress.address_2}</p>
                        )}
                        <p>
                          {defaultAddress.city}
                          {defaultAddress.postcode
                            ? ` ${defaultAddress.postcode}`
                            : ""}
                          {defaultAddress.zone
                            ? `, ${defaultAddress.zone}`
                            : ""}
                        </p>
                        <p>{defaultAddress.country}</p>
                        {defaultAddress.mobile && (
                          <p>
                            +{defaultAddress.mobile_country_code}{" "}
                            {defaultAddress.mobile}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 sm:items-end">
                      <Link
                        href={`/account/address/${defaultAddress.address_id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 dark:border-indigo-800/40 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(defaultAddress.address_id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-100 dark:border-red-900/30 px-3 py-2 text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Other addresses */}
            {otherAddresses.length > 0 && (
              <section className="space-y-3">
                {defaultAddress && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Other addresses
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Your additional saved delivery addresses.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {otherAddresses.map((addr) => (
                    <div
                      key={addr.address_id}
                      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 transition-colors hover:border-gray-300 dark:hover:border-gray-600"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {addr.firstname} {addr.lastname}
                            </h3>
                          </div>

                          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <p>
                              {addr.address_1}
                              {addr.flat ? `, Flat ${addr.flat}` : ""}
                            </p>
                            {addr.address_2 && <p>{addr.address_2}</p>}
                            <p>
                              {addr.city}
                              {addr.postcode ? ` ${addr.postcode}` : ""}
                              {addr.zone ? `, ${addr.zone}` : ""}
                            </p>
                            <p>{addr.country}</p>
                            {addr.mobile && (
                              <p>
                                +{addr.mobile_country_code} {addr.mobile}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 sm:items-end">
                          <Link
                            href={`/account/address/${addr.address_id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(addr.address_id)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-100 dark:border-red-900/30 px-3 py-2 text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete address?"
        description="This address will be removed from your account. You can add it again later if needed."
        confirmLabel="Delete"
        cancelLabel="Keep"
        tone="danger"
        loading={deleteLoading}
        onCancel={() => !deleteLoading && setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
