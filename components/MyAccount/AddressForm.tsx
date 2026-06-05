"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface AddressFormData {
  name: string;
  firstname: string;
  lastname: string;
  address_1: string;
  address_2: string;
  road: string;
  area: string;
  landmark: string;
  latitude: string;
  longitude: string;
  mobile_country_code: string;
  mobile: string;
  default: number;
}

interface Props {
  initial?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function buildFormState(initial: Partial<AddressFormData>): AddressFormData {
  return {
    name: initial.name ?? "",
    firstname: initial.firstname ?? "",
    lastname: initial.lastname ?? "",
    address_1: initial.address_1 ?? "",
    address_2: initial.address_2 ?? "",
    road: initial.road ?? "",
    area: initial.area ?? "",
    landmark: initial.landmark ?? "",
    latitude: initial.latitude ?? "",
    longitude: initial.longitude ?? "",
    mobile_country_code: initial.mobile_country_code ?? "880",
    mobile: (initial.mobile ?? "").replace(/\D/g, ""),
    default: initial.default ?? 0,
  };
}

/**
 * Validates a Bangladesh mobile number.
 * BD numbers: 01[3-9]XXXXXXXX — 11 digits total (local format).
 * After stripping the leading 0, the stored value is 10 digits: 1[3-9]XXXXXXXX.
 */
function validateBDMobile(number: string): string | null {
  const digits = number.replace(/\D/g, "");
  // Accept both 10-digit (country-code stripped) and 11-digit (with leading 0) formats
  const normalized =
    digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;

  if (normalized.length === 0) return "Mobile number is required.";
  if (!/^1[3-9]\d{8}$/.test(normalized))
    return "Enter a valid Bangladeshi mobile number (e.g. 01712345678).";
  return null;
}

const inputCls =
  "w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/60 px-3.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-colors focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/20 dark:focus:ring-indigo-500/20 disabled:opacity-60";

/* ─── Map Picker ─────────────────────────────────────────────────────────── */

interface MapPickerProps {
  lat: string;
  lng: string;
  onChange: (lat: string, lng: string) => void;
}

function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);

  // Default to Dhaka, Bangladesh
  const defaultLat = lat ? parseFloat(lat) : 23.8103;
  const defaultLng = lng ? parseFloat(lng) : 90.4125;

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = (window as any).L;
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="14" r="10" fill="#6366f1" stroke="white" stroke-width="2"/>
            <circle cx="16" cy="14" r="4" fill="white"/>
            <path d="M16 24 L16 32" stroke="#6366f1" stroke-width="2"/>
          </svg>
        </div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([defaultLat, defaultLng], {
        icon,
        draggable: true,
      }).addTo(map);
      markerRef.current = marker;

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChange(pos.lat.toFixed(8), pos.lng.toFixed(8));
      });

      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        onChange(e.latlng.lat.toFixed(8), e.latlng.lng.toFixed(8));
      });

      setMapReady(true);
    };
    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!markerRef.current || !lat || !lng) return;
    markerRef.current.setLatLng([parseFloat(lat), parseFloat(lng)]);
    mapInstanceRef.current?.setView([parseFloat(lat), parseFloat(lng)], 15);
  }, [lat, lng]);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(
          pos.coords.latitude.toFixed(8),
          pos.coords.longitude.toFixed(8),
        );
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true },
    );
  };

  return (
    <div className="space-y-3">
      <div
        className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700"
        style={{ height: 280 }}
      >
        <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} className="animate-bounce" />
              Loading map...
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          className="absolute bottom-3 right-3 z-[1000] inline-flex items-center gap-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 shadow-md transition hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
        >
          <Navigation size={13} className={locating ? "animate-spin" : ""} />
          {locating ? "Locating..." : "Use my location"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
            Latitude
          </label>
          <input
            value={lat}
            onChange={(e) => onChange(e.target.value, lng)}
            placeholder="e.g. 23.8103"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
            Longitude
          </label>
          <input
            value={lng}
            onChange={(e) => onChange(lat, e.target.value)}
            placeholder="e.g. 90.4125"
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Bangladesh PhoneInput ──────────────────────────────────────────────── */
function PhoneInput({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string | null;
}) {
  return (
    <div>
      <div
        className={`flex h-11 overflow-hidden rounded-xl border bg-gray-50/80 dark:bg-gray-800/60 transition-colors focus-within:ring-2 ${
          error
            ? "border-red-400 dark:border-red-500 focus-within:ring-red-400/20"
            : "border-gray-200 dark:border-gray-700 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 focus-within:ring-indigo-400/20"
        }`}
      >
        {/* Bangladesh country prefix — fixed, non-editable */}
        <div className="flex items-center gap-1.5 border-r border-gray-200 dark:border-gray-700 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 select-none whitespace-nowrap">
          🇧🇩 <span>+880</span>
        </div>
        <input
          type="tel"
          value={value}
          onChange={(e) => {
            // Only allow digits; strip any accidental country-code prefix
            const raw = e.target.value.replace(/\D/g, "").replace(/^880/, "");
            onChange(raw);
          }}
          placeholder={placeholder}
          maxLength={11}
          className="flex-1 bg-transparent px-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none"
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

/* ─── Main AddressForm ───────────────────────────────────────────────────── */

export function AddressForm({
  initial = {},
  onSubmit,
  loading,
  submitLabel = "Save Address",
}: Props) {
  const [form, setForm] = useState<AddressFormData>(() =>
    buildFormState(initial),
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoneChange = (raw: string) => {
    setForm((prev) => ({
      ...prev,
      mobile_country_code: "880",
      mobile: raw,
    }));
    // Clear error on change so the user gets live feedback
    if (phoneError) setPhoneError(validateBDMobile(raw));
  };

  const handleMapChange = (lat: string, lng: string) => {
    setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone before submission
    const err = validateBDMobile(form.mobile);
    if (err) {
      setPhoneError(err);
      return;
    }
    setPhoneError(null);

    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ── Address Label ── */}
      <section className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Address Label
        </p>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
            Address Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Home, Work, Parents"
            className={inputCls}
          />
        </div>
      </section>

      {/* ── Personal Info ── */}
      <section className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Personal Info
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              required
              className={inputCls}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            value={form.mobile}
            onChange={handlePhoneChange}
            placeholder="01712345678"
            error={phoneError}
          />
        </div>
      </section>

      {/* ── Address Details ── */}
      <section className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Address Details
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              Building / Villa <span className="text-red-500">*</span>
            </label>
            <input
              name="address_1"
              value={form.address_1}
              onChange={handleChange}
              required
              placeholder="Building or villa name"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              Address 2 <span className="text-red-500">*</span>
            </label>
            <input
              name="address_2"
              value={form.address_2}
              onChange={handleChange}
              required
              placeholder="Flat, floor, apartment no."
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              Road <span className="text-red-500">*</span>
            </label>
            <input
              name="road"
              value={form.road}
              onChange={handleChange}
              required
              placeholder="Road number or name"
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* ── Location (Map) ── */}
      <section className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Pin Location
        </p>
        <MapPicker
          lat={form.latitude}
          lng={form.longitude}
          onChange={handleMapChange}
        />
      </section>

      {/* ── Default Address Toggle ── */}
      <section className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Set as default address
            </p>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
              This address will be pre-selected at checkout.
            </p>
          </div>
          <div className="flex flex-shrink-0 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
            {([0, 1] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, default: val }))}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                  form.default === val
                    ? "bg-gray-600 text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {val === 1 ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Submit ── */}
      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={loading}
          className="min-w-[180px] rounded-xl bg-gray-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
