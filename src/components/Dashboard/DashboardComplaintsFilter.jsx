import { ChevronDown, RotateCcw } from "lucide-react";


function DashboardComplaintsFilter({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  periodLabel,
}) {
  const boxClass =
    "flex min-w-[160px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-white/5 dark:bg-[#121b23]/40 dark:text-slate-300 dark:hover:bg-white/5";

  const isIncomplete = (dateFrom && !dateTo) || (!dateFrom && dateTo);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#101922] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)] lg:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/*  (الكل) — قائمة، مابتعمل شي */}
          <button className="flex min-w-[190px] items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-white/5 dark:bg-[#121b23]/40 dark:text-slate-300 dark:hover:bg-white/5">
            <span>الكل</span>
            <ChevronDown className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
          </button>

          {/* من تاريخ  */}
          <label className={boxClass}>
            <span className="shrink-0 text-slate-500 dark:text-slate-400">
              من
            </span>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-700 outline-none dark:text-slate-200"
            />
          </label>

          {/* إلى تاريخ ـ  */}
          <label className={boxClass}>
            <span className="shrink-0 text-slate-500 dark:text-slate-400">
              إلى
            </span>

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-700 outline-none dark:text-slate-200"
            />
          </label>

          {/* مسح التاريخين — يظهر فقط عند وجود قيمة */}
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50 dark:border-white/5 dark:bg-[#121b23]/40 dark:text-slate-300 dark:hover:bg-white/5"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.8} />
              <span>مسح</span>
            </button>
          )}

        </div>

      
        {periodLabel && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {periodLabel}
          </p>
        )}
      </div>

      {/* لو بعت بدون تاريخين*/}
      {isIncomplete && (
        <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400">
          الرجاء اختيار التاريخين معاً حتى تُطبّق الفترة
        </p>
      )}
    </section>
  );
}

export default DashboardComplaintsFilter;
