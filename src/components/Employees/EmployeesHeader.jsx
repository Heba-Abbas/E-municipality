import React from "react";
import { Plus } from "lucide-react";

function EmployeesHeader({ totalRows, activeCount, pendingCount }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:px-5 lg:py-5">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[auto_1fr] lg:items-start lg:gap-6">
        <div className="flex flex-col items-end gap-4 text-right lg:justify-self-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold leading-tight text-slate-800 dark:text-white lg:text-[2.1rem]">
             الموظفين
            </h1>
          </div>

          <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-500 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.25)] transition hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400">
            <Plus className="h-4 w-4" strokeWidth={2.4} />
            <span>إضافة موظف جديد</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default EmployeesHeader;