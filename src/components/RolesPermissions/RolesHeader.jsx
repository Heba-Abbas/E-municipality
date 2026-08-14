import React from "react";
import { ShieldCheck, KeyRound } from "lucide-react";

function RolesHeader({ rolesCount, permissionsCount }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white lg:text-3xl">
            الأدوار والأذونات
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            إدارة أدوار النظام والأذونات المرتبطة بكل دور
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-300">
            <ShieldCheck
              className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
              strokeWidth={1.8}
            />

            <span>
              {rolesCount} أدوار
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-300">
            <KeyRound
              className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
              strokeWidth={1.8}
            />

            <span>
              {permissionsCount} أذونات
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RolesHeader;