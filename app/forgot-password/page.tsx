"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to send reset link.");
      }

      toast.success(
        "If the email exists, a reset link has been sent. Check your inbox.",
      );
      setEmail("");
      router.push("/login");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Could not send reset email.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FAF9F5] dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 text-center">
          Forgot Password
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 text-center">
          Enter your email and we’ll send you a secure link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-[#81604a]/40 outline-none transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-[#81604a] hover:bg-[#6f503c] dark:bg-[#96735c] dark:hover:bg-[#81604a] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10 transition-all duration-200"
          >
            {isSubmitting ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
