import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ServiceRequestPagination({
  currentPage,
  lastPage,
  onPageChange,
}) {
  if (lastPage <= 1) return null;

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        الصفحة {currentPage} من {lastPage}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#111c26] dark:text-slate-300 dark:hover:bg-white/5"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white">
          {currentPage}
        </span>

        <button
          type="button"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#111c26] dark:text-slate-300 dark:hover:bg-white/5"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default ServiceRequestPagination;