import React from "react";
import { Plus } from "lucide-react";

function CitizenHeader({ totalRows, activeCount, pendingCount }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:px-6 lg:py-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3 text-right">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">المواطنين</h1>
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400">
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            <span>إضافة مواطن جديد</span>
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/80 px-4 py-3 text-right dark:border-emerald-500/15 dark:bg-emerald-500/5">
            <p className="text-xs text-emerald-800 dark:text-emerald-200/80">إجمالي المواطنين</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {totalRows.toLocaleString("en-US")}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right dark:border-white/5 dark:bg-white/5">
            <p className="text-xs text-slate-500 dark:text-slate-400">المفعّلون</p>
            <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
              {activeCount.toLocaleString("en-US")}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right dark:border-white/5 dark:bg-white/5">
            <p className="text-xs text-slate-500 dark:text-slate-400">المجمدون</p>
            <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
              {pendingCount.toLocaleString("en-US")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CitizenHeader;