import React from "react";
import { Plus } from "lucide-react";

function CitizenHeader({ totalRows, activeCount, pendingCount }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:px-5 lg:py-5">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[auto_1fr] lg:items-start lg:gap-6">
        <div className="flex flex-col items-end gap-4 text-right lg:justify-self-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold leading-tight text-slate-800 dark:text-white lg:text-[2.1rem]">
              المواطنين
            </h1>
          </div>

          <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-500 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.25)] transition hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400">
            <Plus className="h-4 w-4" strokeWidth={2.4} />
            <span>إضافة مواطن جديد</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-self-end">
          <div className="w-[126px] rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-right shadow-[0_10px_24px_rgba(16,185,129,0.08)] dark:border-emerald-400/15 dark:bg-emerald-500/5">
            <p className="text-xs text-emerald-700 dark:text-emerald-200/80">إجمالي المواطنين</p>
            <p className="mt-2 text-2xl font-bold text-emerald-500 dark:text-emerald-300">
              {totalRows.toLocaleString("en-US")}
            </p>
          </div>
          <div className="w-[126px] rounded-2xl border border-white/5 bg-[#FFFFFF] px-4 py-3 text-right shadow-[0_10px_24px_rgba(0,0,0,0.12)] dark:border-white/5 dark:bg-white/5">
            <p className="text-xs text-slate-700 dark:text-emerald-200/80">المفعّلون</p>
            <p className="mt-2 text-2xl font-bold text-slate-400 dark:text-emerald-300">
              {activeCount.toLocaleString("en-US")}
            </p>
          </div>
          <div className="w-[126px] rounded-2xl border border-white/5 bg-[#FFFFFF] px-4 py-3 text-right shadow-[0_10px_24px_rgba(0,0,0,0.12)] dark:border-white/5 dark:bg-white/5">
            <p className="text-xs text-slate-700 dark:text-emerald-200/80">المجمدون</p>
            <p className="mt-2 text-2xl font-bold text-slate-400 dark:text-emerald-300">
              {pendingCount.toLocaleString("en-US")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CitizenHeader;