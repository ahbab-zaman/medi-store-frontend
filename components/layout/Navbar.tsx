import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Medi-Store
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium hover:bg-black/[.04] dark:hover:bg-white/[.08]"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}

