"use client";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

// ---------------------------------------------------------------------------
// Shared class strings (mirrors your global .input / .label / .btn-primary)
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
export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ password: "", confirm: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return;
    if (form.password.length < 6) return;
    setLoading(true);
    // TODO: wire up updatePassword from useAuthStore
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setForm({ password: "", confirm: "" });
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
          <ShieldCheck size={16} />
        </span>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg font-['DM_Sans',sans-serif] leading-tight">
            Change Password
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-['DM_Sans',sans-serif]">
            Choose a strong, unique password
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5 max-w-md">
        {/* New password */}
        <div>
          <label className={labelCls}>New Password</label>
          <div className="relative">
            <input
              name="password"
              type={show ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength={6}
              className={`${inputCls} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="
                absolute right-4 top-1/2 -translate-y-1/2
                text-gray-400 dark:text-gray-500
                hover:text-gray-600 dark:hover:text-gray-300
                transition-colors duration-150
              "
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Strength bar — visual only, purely decorative */}
          {form.password.length > 0 && (
            <div className="mt-2 flex gap-1">
              {[...Array(4)].map((_, i) => {
                const strength =
                  form.password.length >= 12
                    ? 4
                    : form.password.length >= 9
                      ? 3
                      : form.password.length >= 6
                        ? 2
                        : 1;
                return (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i < strength
                        ? strength === 1
                          ? "bg-red-400"
                          : strength === 2
                            ? "bg-amber-400"
                            : strength === 3
                              ? "bg-blue-400"
                              : "bg-emerald-400"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className={labelCls}>Confirm Password</label>
          <input
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className={inputCls}
          />
          {/* Mismatch hint */}
          {form.confirm.length > 0 && form.password !== form.confirm && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-['DM_Sans',sans-serif]">
              Passwords do not match
            </p>
          )}
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
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
