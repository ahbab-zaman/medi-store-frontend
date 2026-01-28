"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "@/services/auth.service";

type Role = "CUSTOMER" | "SELLER";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Backend register expects a User-like payload; keep it minimal & extendable.
      await registerUser({ name, email, password, role });
      router.push("/login");
    } catch (err: any) {
      const message =
        err?.message ||
        err?.error?.message ||
        err?.data?.message ||
        "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Join Medi-Store as a Customer or Seller.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:focus:border-white/30"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:focus:border-white/30"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:focus:border-white/30"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:focus:border-white/30"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="SELLER">Seller</option>
            </select>
          </div>

          {error ? (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-sm text-black/60 dark:text-white/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-black dark:text-white"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
