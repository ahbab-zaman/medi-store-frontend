"use client";
import { useState, useEffect } from "react";
import { User, Mail, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks";
import { toast } from "react-hot-toast";
import axios from "axios";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parsePhoneNumber(contactNumber?: string | null): string {
  if (!contactNumber) return "";
  const digits = contactNumber.replace(/\D/g, "");
  if (digits.startsWith("880") && digits.length > 3) {
    return digits.slice(3);
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return digits.slice(1);
  }
  return digits;
}

function validateBDMobile(number: string): string | null {
  const digits = number.replace(/\D/g, "");
  const normalized =
    digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;

  if (normalized.length === 0) return null; // Optional contact number
  if (!/^1[3-9]\d{8}$/.test(normalized)) {
    return "Enter a valid Bangladeshi mobile number (e.g. 01712345678).";
  }
  return null;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------------------------------------------------------------------------
// Bangladesh PhoneInput matching AddressForm.tsx pattern
// ---------------------------------------------------------------------------
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
        <div className="flex items-center gap-1.5 border-r border-gray-200 dark:border-gray-700 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 select-none whitespace-nowrap">
          🇧🇩 <span>+880</span>
        </div>
        <input
          type="tel"
          value={value}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "").replace(/^880/, "");
            onChange(raw);
          }}
          placeholder={placeholder}
          maxLength={11}
          className="flex-1 bg-transparent px-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none"
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-['DM_Sans',sans-serif]">{error}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared input / label classes (mirrors your global .input / .label)
// ---------------------------------------------------------------------------
const inputCls = `
  w-full px-4 py-2.5 rounded-xl
  bg-gray-50 dark:bg-gray-800/60
  border border-gray-200 dark:border-gray-700
  text-gray-900 dark:text-gray-100
  text-sm font-['DM_Sans',sans-serif]
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
  dark:focus:border-indigo-500
  transition-all duration-200
`;

const labelCls = `
  block mb-1.5 text-xs font-semibold tracking-wide
  text-gray-500 dark:text-gray-400 uppercase
  font-['DM_Sans',sans-serif]
`;

const btnPrimary = `
  inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
  bg-gray-600 hover:bg-gray-500 active:bg-gray-700
  text-white text-sm font-semibold
  font-['DM_Sans',sans-serif]
  shadow-md shadow-gray-500/20
  focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2
  dark:focus:ring-offset-gray-900
  disabled:opacity-60 disabled:cursor-not-allowed
  transition-all duration-200
`;

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function EditProfilePage() {
  const { user, updateProfile, isUpdatingProfile } = useAuth();
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    address: "",
  });

  // Pre-populate fields once user details are loaded
  useEffect(() => {
    if (user) {
      const fullName = user.name || "";
      const spaceIndex = fullName.trim().indexOf(" ");
      const fname = spaceIndex !== -1 ? fullName.substring(0, spaceIndex) : fullName;
      const lname = spaceIndex !== -1 ? fullName.substring(spaceIndex + 1) : "";

      setForm({
        firstname: fname,
        lastname: lname,
        email: user.email || "",
        telephone: parsePhoneNumber(user.contactNumber),
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccess(false);
  };

  const handlePhoneChange = (telephone: string) => {
    setForm((prev) => ({ ...prev, telephone }));
    setErrors((prev) => ({ ...prev, telephone: "" }));
    setSuccess(false);
  };

  const validate = () => {
    const newErrors = {
      firstname: "",
      lastname: "",
      email: "",
      telephone: "",
      address: "",
    };
    let isValid = true;

    if (!form.firstname.trim()) {
      newErrors.firstname = "First name is required.";
      isValid = false;
    }
    if (!form.lastname.trim()) {
      newErrors.lastname = "Last name is required.";
      isValid = false;
    }
    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
      isValid = false;
    } else if (!validateEmail(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    const phoneError = validateBDMobile(form.telephone);
    if (phoneError) {
      newErrors.telephone = phoneError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSuccess(false);
    try {
      const name = `${form.firstname.trim()} ${form.lastname.trim()}`.trim();
      const contactNumber = form.telephone ? `+880${form.telephone}` : "";

      await updateProfile({
        name,
        email: form.email.trim(),
        contactNumber: contactNumber || undefined,
        address: form.address.trim() || undefined,
      });

      setSuccess(true);
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "Failed to update profile.";
        if (message.toLowerCase().includes("email")) {
          setErrors((prev) => ({ ...prev, email: message }));
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div
      className="
        bg-white dark:bg-gray-900
        rounded-2xl
        border border-gray-100 dark:border-gray-800
        shadow-sm dark:shadow-black/20
        overflow-hidden
      "
    >
      {/* ── Header ── */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-gray-600 dark:text-gray-400 animate-pulse">
          <User size={16} />
        </span>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg font-['DM_Sans',sans-serif] leading-tight">
            Edit Profile
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-['DM_Sans',sans-serif]">
            Update your personal information
          </p>
        </div>
      </div>

      {/* ── Success banner ── */}
      {success && (
        <div className="mx-6 mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 px-4 py-3">
          <CheckCircle2
            size={18}
            className="text-emerald-500 dark:text-emerald-400 shrink-0"
          />
          <p className="text-sm text-emerald-700 dark:text-emerald-400 font-['DM_Sans',sans-serif]">
            Your profile details have been updated successfully.
          </p>
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
        {/* Row: First / Last name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstname" className={labelCls}>
              First Name
            </label>
            <input
              id="firstname"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              required
              placeholder="John"
              className={`${inputCls} ${
                errors.firstname
                  ? "border-red-400 dark:border-red-500 focus:ring-red-500/30 focus:border-red-400"
                  : ""
              }`}
            />
            {errors.firstname && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-['DM_Sans',sans-serif]">
                {errors.firstname}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="lastname" className={labelCls}>
              Last Name
            </label>
            <input
              id="lastname"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              required
              placeholder="Doe"
              className={`${inputCls} ${
                errors.lastname
                  ? "border-red-400 dark:border-red-500 focus:ring-red-500/30 focus:border-red-400"
                  : ""
              }`}
            />
            {errors.lastname && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-['DM_Sans',sans-serif]">
                {errors.lastname}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelCls}>
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              <Mail size={16} />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className={`${inputCls} pl-9 ${
                errors.email
                  ? "border-red-400 dark:border-red-500 focus:ring-red-500/30 focus:border-red-400"
                  : ""
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-['DM_Sans',sans-serif]">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className={labelCls}>Phone Number</label>
          <PhoneInput
            value={form.telephone}
            onChange={handlePhoneChange}
            placeholder="1712345678"
            error={errors.telephone}
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className={labelCls}>
            Address
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 pointer-events-none">
              <MapPin size={16} />
            </span>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className={`${inputCls} pl-9 pt-2 resize-none`}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isUpdatingProfile}
            className={btnPrimary}
          >
            {isUpdatingProfile ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
