export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-black/60 dark:text-white/60">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Medi-Store. All rights reserved.</p>
          <p className="text-black/50 dark:text-white/50">
            Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}

