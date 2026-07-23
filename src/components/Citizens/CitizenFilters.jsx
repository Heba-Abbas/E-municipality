import React from "react";
import { Calendar, ChevronDown, Filter, RotateCcw, Search } from "lucide-react";
import FieldLabel from "./FieldLabel";
import { citizenFilters } from "../../data/citizensData";

function CitizenFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  municipalityFilter,
  setMunicipalityFilter,
  cityFilter,
  setCityFilter,
  onResetFilters,
}) {
  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-lg">
      <div className="flex flex-wrap items-end gap-3">
        {/* البحث */}
        <div className="min-w-[320px] flex-1">
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
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pr-10 pl-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* الحالة الاجتماعية */}
        <div className="w-[160px]">
          <FieldLabel>الحالة الاجتماعية</FieldLabel>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-3 pr-3 pl-8 text-sm text-slate-800 outline-none dark:border-white/10 dark:bg-[#121b24] dark:text-white"
            >
              {citizenFilters.statusOptions.map((option) => (
                <option key={option} className="dark:bg-[#121b24]">{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* البلدية */}
        <div className="w-[160px]">
          <FieldLabel>البلدية</FieldLabel>
          <div className="relative">
            <select
              value={municipalityFilter}
              onChange={(e) => setMunicipalityFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-3 pr-3 pl-8 text-sm text-slate-800 outline-none dark:border-white/10 dark:bg-[#121b24] dark:text-white"
            >
              {citizenFilters.municipalityOptions.map((option) => (
                <option key={option} className="dark:bg-[#121b24]">{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* الموقع الحالي */}
        <div className="w-[170px]">
          <FieldLabel>الموقع الحالي</FieldLabel>
          <div className="relative">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-3 pr-3 pl-8 text-sm text-slate-800 outline-none dark:border-white/10 dark:bg-[#121b24] dark:text-white"
            >
              {citizenFilters.cityOptions.map((option) => (
                <option key={option} className="dark:bg-[#121b24]">{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* التاريخ */}
        <div className="w-[170px]">
          <FieldLabel>تاريخ</FieldLabel>
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="date"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pr-10 pl-3 text-sm text-slate-800 outline-none dark:border-white/10 dark:bg-[#121b24] dark:text-white"
            />
          </div>
        </div>

        {/* زر التصفية */}
        <button
          type="button"
          className="flex h-[46px] items-center gap-2 rounded-lg bg-emerald-600 px-6 text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <Filter size={18} />
          تصفية
        </button>

        {/* زر مسح الفلاتر */}
        <button
          type="button"
          onClick={onResetFilters}
          className="flex h-[46px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-6 text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:hover:bg-[#17212b]"
        >
          <RotateCcw size={18} />
          مسح الفلاتر
        </button>
      </div>
    </section>
  );
}

export default CitizenFilters;