import React from "react";
import { ChevronDown } from "lucide-react";

const pageSizeOptions = [10, 25, 50];

function PaginationButton({ children, active = false, disabled = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex min-w-9 items-center justify-center rounded-lg border px-3 py-2 transition",
        active
          ? "border-emerald-500/40 bg-emerald-50 text-emerald-700 font-semibold dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#111c26] dark:text-slate-300 dark:hover:bg-white/5",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function CitizenPagination({
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  totalPages,
  pageNumbers,
}) {
  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-white/5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
        <div className="relative">
          <select
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
            className="appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-right text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-200 dark:focus:border-emerald-500/40"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option} className="dark:bg-[#111c26]">
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            strokeWidth={2}
          />
        </div>
        <span>عدد الصفوف في الصفحة</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
        >
          ‹
        </PaginationButton>

        {pageNumbers.map((page) =>
          typeof page === "number" ? (
            <PaginationButton
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PaginationButton>
          ) : (
            <span key={page} className="px-2 text-slate-400 dark:text-slate-500">
              ...
            </span>
          )
        )}

        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((value) => Math.min(totalPages, value + 1))
          }
        >
          ›
        </PaginationButton>
      </div>
    </div>
  );
}

export default CitizenPagination;