import React from "react";
import { FileText } from "lucide-react";

function ServiceRequestsHeader({
  title,
  description,
  totalCount,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-right">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
          {title}
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-300">
        <FileText
          className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
          strokeWidth={1.8}
        />

        <span>
          {totalCount.toLocaleString("en-US")} طلب
        </span>
      </div>
    </div>
  );
}

export default ServiceRequestsHeader;