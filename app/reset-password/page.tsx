import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FAF9F5] dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 backdrop-blur-xl">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded-lg mb-3 w-3/4 mx-auto"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full mt-3"></div>
          <div className="space-y-5 mt-8">
            <div className="space-y-2">
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded-lg w-1/3"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded-lg w-1/3"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
            <div className="h-10 bg-slate-300 dark:bg-slate-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
