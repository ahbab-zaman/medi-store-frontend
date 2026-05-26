"use client";
import { useState } from "react";
import { Globe, ChevronDown, User, Mail, Phone } from "lucide-react";

// ---------------------------------------------------------------------------
// Minimal PhoneInput stand-in (replace with your real <PhoneInput /> later)
// ---------------------------------------------------------------------------
function PhoneInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none">
        <Globe size={16} />
      </span>
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-4 py-2.5 rounded-xl
          bg-gray-50 dark:bg-gray-800/60
          border border-gray-200 dark:border-gray-700
          text-gray-900 dark:text-gray-100
          text-sm font-['DM_Sans',sans-serif]
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
          dark:focus:border-indigo-500
          transition-all duration-200
        "
      />
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
  bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
  text-white text-sm font-semibold
  font-['DM_Sans',sans-serif]
  shadow-md shadow-indigo-500/20
  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2
  dark:focus:ring-offset-gray-900
  disabled:opacity-60 disabled:cursor-not-allowed
  transition-all duration-200
`;

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function EditProfilePage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    country_code: "+973",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoneChange = (fullPhone: string) => {
    setForm((prev) => ({ ...prev, telephone: fullPhone }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up updateAccountInfo from useAuthStore
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
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
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
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

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Row: First / Last name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>First Name</label>
            <input
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              required
              placeholder="John"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Last Name</label>
            <input
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              required
              placeholder="Doe"
              className={inputCls}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelCls}>Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              <Mail size={16} />
            </span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className={`${inputCls} pl-9`}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className={labelCls}>Phone Number</label>
          <PhoneInput
            value={`${form.country_code}${form.telephone}`}
            onChange={handlePhoneChange}
            placeholder="+973 1234 5678"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? (
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
