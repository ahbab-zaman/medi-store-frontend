"use client";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { changePassword } from "@/services/auth.service";
import axios from "axios";

// ---------------------------------------------------------------------------
// Shared class strings (mirrors global .input / .label / .btn-primary)
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
  shadow-md shadow-indigo-500/20
  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2
  dark:focus:ring-offset-gray-900
  disabled:opacity-60 disabled:cursor-not-allowed
  transition-all duration-200
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  if (pw.length >= 12) return 4;
  if (pw.length >= 9) return 3;
  if (pw.length >= 6) return 2;
  return 1;
}

const strengthMeta = {
  0: { label: "", color: "" },
  1: { label: "Weak", color: "text-red-500 dark:text-red-400" },
  2: { label: "Fair", color: "text-amber-500 dark:text-amber-400" },
  3: { label: "Good", color: "text-blue-500 dark:text-blue-400" },
  4: { label: "Strong", color: "text-emerald-500 dark:text-emerald-400" },
} as const;

const strengthBarColor: Record<number, string> = {
  1: "bg-red-400",
  2: "bg-amber-400",
  3: "bg-blue-400",
  4: "bg-emerald-400",
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });

  const strength = getStrength(form.newPassword);
  const { label: strengthLabel, color: strengthColor } = strengthMeta[strength];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "newPassword") setErrors((prev) => ({ ...prev, confirm: "" }));
    setSuccess(false);
  };

  const validate = () => {
    const newErrors = { currentPassword: "", newPassword: "", confirm: "" };
    let valid = true;

    if (!form.currentPassword) {
      newErrors.currentPassword = "Current password is required.";
      valid = false;
    }
    if (!form.newPassword || form.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters.";
      valid = false;
    }
    if (form.newPassword && form.newPassword === form.currentPassword) {
      newErrors.newPassword =
        "New password must be different from current password.";
      valid = false;
    }
    if (!form.confirm) {
      newErrors.confirm = "Please confirm your new password.";
      valid = false;
    } else if (form.newPassword !== form.confirm) {
      newErrors.confirm = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess(false);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success("Password changed successfully!");
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message || "Failed to change password.";
        // Surface the specific backend error to the right field
        if (
          message.toLowerCase().includes("current") ||
          message.toLowerCase().includes("incorrect")
        ) {
          setErrors((prev) => ({ ...prev, currentPassword: message }));
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
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
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-gray-600 dark:text-gray-400">
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

      {/* ── Success banner ── */}
      {success && (
        <div className="mx-6 mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 px-4 py-3">
          <CheckCircle2
            size={18}
            className="text-emerald-500 dark:text-emerald-400 shrink-0"
          />
          <p className="text-sm text-emerald-700 dark:text-emerald-400 font-['DM_Sans',sans-serif]">
            Your password has been updated successfully.
          </p>
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5 max-w-md" noValidate>
        {/* Current password */}
        <div>
          <label htmlFor="currentPassword" className={labelCls}>
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showCurrent ? "text" : "password"}
              value={form.currentPassword}
              onChange={handleChange}
              required
              placeholder="Enter current password"
              className={`${inputCls} pr-12 ${
                errors.currentPassword
                  ? "border-red-400 dark:border-red-500 focus:ring-red-500/30 focus:border-red-400"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              aria-label={showCurrent ? "Hide current password" : "Show current password"}
              className="
                absolute right-4 top-1/2 -translate-y-1/2
                text-gray-400 dark:text-gray-500
                hover:text-gray-600 dark:hover:text-gray-300
                transition-colors duration-150
              "
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-['DM_Sans',sans-serif]">
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* New password */}
        <div>
          <label htmlFor="newPassword" className={labelCls}>
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNew ? "text" : "password"}
              value={form.newPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength={6}
              className={`${inputCls} pr-12 ${
                errors.newPassword
                  ? "border-red-400 dark:border-red-500 focus:ring-red-500/30 focus:border-red-400"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              aria-label={showNew ? "Hide new password" : "Show new password"}
              className="
                absolute right-4 top-1/2 -translate-y-1/2
                text-gray-400 dark:text-gray-500
                hover:text-gray-600 dark:hover:text-gray-300
                transition-colors duration-150
              "
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Strength bar */}
          {form.newPassword.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      level <= strength
                        ? (strengthBarColor[strength] ?? "bg-gray-200")
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              {strengthLabel && (
                <p className={`text-[11px] font-medium font-['DM_Sans',sans-serif] ${strengthColor}`}>
                  {strengthLabel}
                </p>
              )}
            </div>
          )}

          {errors.newPassword && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-['DM_Sans',sans-serif]">
              {errors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirm" className={labelCls}>
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm"
              name="confirm"
              type={showConfirm ? "text" : "password"}
              value={form.confirm}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className={`${inputCls} pr-12 ${
                errors.confirm
                  ? "border-red-400 dark:border-red-500 focus:ring-red-500/30 focus:border-red-400"
                  : form.confirm && form.confirm === form.newPassword
                  ? "border-emerald-400 dark:border-emerald-600 focus:ring-emerald-500/30"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              className="
                absolute right-4 top-1/2 -translate-y-1/2
                text-gray-400 dark:text-gray-500
                hover:text-gray-600 dark:hover:text-gray-300
                transition-colors duration-150
              "
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Match / mismatch feedback */}
          {form.confirm.length > 0 && form.newPassword === form.confirm && !errors.confirm && (
            <p className="mt-1.5 text-xs text-emerald-500 dark:text-emerald-400 font-['DM_Sans',sans-serif] flex items-center gap-1">
              <CheckCircle2 size={12} /> Passwords match
            </p>
          )}
          {errors.confirm && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-['DM_Sans',sans-serif]">
              {errors.confirm}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            id="change-password-submit"
            type="submit"
            disabled={loading}
            className={btnPrimary}
          >
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
                Updating…
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
