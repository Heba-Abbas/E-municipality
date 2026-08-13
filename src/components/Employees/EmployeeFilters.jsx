import React from "react";
import {
  Calendar,
  ChevronDown,
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";

import FieldLabel from "./FieldLabel";
import { employeeFilters } from "../../data/employeesData";

function EmployeeFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  hireDateFilter,
  setHireDateFilter,
  onResetFilters,
}) {
  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">
      <div className="grid gap-3 lg:grid-cols-5 lg:items-end">

        {/* البحث */}
        <div className="lg:col-span-2">
          <FieldLabel>بحث</FieldLabel>

          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              strokeWidth={1.8}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو الرقم الوطني أو الهاتف..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* الحالة */}
        <div>
          <FieldLabel>الحالة</FieldLabel>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pr-3 pl-8 text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white"
            >
              {employeeFilters.statusOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="dark:bg-[#121b24]"
                >
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* الدور */}
        <div>
          <FieldLabel>الدور</FieldLabel>

          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pr-3 pl-8 text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white"
            >
              {employeeFilters.rolesOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="dark:bg-[#121b24]"
                >
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* تاريخ التوظيف */}
        <div>
          <FieldLabel>تاريخ التوظيف</FieldLabel>

          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

            <input
              type="date"
              value={hireDateFilter}
              onChange={(e) => setHireDateFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white"
            />
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex flex-wrap items-center justify-start gap-3 pt-2 lg:col-span-5">

          {/* زر التصفية */}
          <button
            type="button"
            className="flex h-[46px] items-center gap-2 rounded-xl bg-emerald-500 px-5 text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            <Filter size={18} />
            تصفية
          </button>

          {/* زر مسح الفلاتر */}
          <button
            type="button"
            onClick={onResetFilters}
            className="flex h-[46px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:hover:bg-[#17212b]"
          >
            <RotateCcw size={18} />
            مسح الفلاتر
          </button>
        </div>
      </div>
    </section>
  );
}

export default EmployeeFilters;