import { ChevronDown, Search } from "lucide-react";
import { complaintStatusOptions } from "../../data/complaintsData";

// شريط فلاتر الشكاوى الموحّدة
// كل الفلاتر ترسل للـ API كـ query params
// الفئات ووحدات العمل تأتي من الـ API لأن الفلترة تتم بالمعرف (id)
function UnifiedComplaintsFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  workUnitFilter,
  setWorkUnitFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  categories,
  workUnits,
  resultsCount,
}) {
  const selectClass =
    "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pr-3 pl-8 text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white";

  const dateClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white";

  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">
      {/* عدد النتائج */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {resultsCount} شكاوى موحّدة
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* البحث */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              strokeWidth={1.8}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالعنوان أو الموقع..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* الحالة */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selectClass}
          >
            {complaintStatusOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="dark:bg-[#121b24]"
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>

        {/* الفئة */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={selectClass}
          >
            <option value="" className="dark:bg-[#121b24]">
              كل الفئات
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
                className="dark:bg-[#121b24]"
              >
                {category.name}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>

        {/* وحدة العمل */}
        <div className="relative">
          <select
            value={workUnitFilter}
            onChange={(e) => setWorkUnitFilter(e.target.value)}
            className={selectClass}
          >
            <option value="" className="dark:bg-[#121b24]">
              كل وحدات العمل
            </option>

            {workUnits.map((unit) => (
              <option
                key={unit.id}
                value={unit.id}
                className="dark:bg-[#121b24]"
              >
                {unit.name}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>

        {/* من تاريخ */}
        <div>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            title="من تاريخ"
            className={dateClass}
          />
        </div>

        {/* إلى تاريخ */}
        <div>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            title="إلى تاريخ"
            className={dateClass}
          />
        </div>
      </div>
    </section>
  );
}

export default UnifiedComplaintsFilters;
