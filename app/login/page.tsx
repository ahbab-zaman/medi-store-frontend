"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks";

function roleHome(role?: string) {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "SELLER") return "/seller/dashboard";
  return "/customer/dashboard";
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = useMemo(() => searchParams.get("next") ?? "", [searchParams]);

  const { login, isLoading, user, loginError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already authenticated and user data is available
  if (user) {
    const target = next || roleHome(user.role);
    router.replace(target);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      // useAuth hook updates the store. We just need to handle redirection
      // response.data.user has the user info
      const role = response.data?.user?.role;
      router.push(next || roleHome(role));
    } catch (err: any) {
      // Error handling is managed by useAuth hook notifications for generic errors
      // But we can check for specific "already logged in" case if needed.
      // useAuth onError shows notification.

      const message = err?.message || err?.data?.message || "";
      if (
        typeof message === "string" &&
        message.includes("already logged in")
      ) {
        // If already logged in, redirect based on whatever role we can surmise or default
        // Or just let the user effect above handle it next render?
        // Refreshing page or just redirecting to default dashboard might be safest
        router.push("/customer/dashboard");
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/4">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Login to your Medi-Store account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

          {loginError ? (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              {(loginError as any)?.message || "Login failed"}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-sm text-black/60 dark:text-white/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-black dark:text-white"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
