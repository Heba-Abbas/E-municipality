import React from "react";
import { Check, Plus } from "lucide-react";
import { translatePermissionName } from "../../utils/permissionUtils";

function PermissionItem({
  permission,
  assigned,
  isLoading,
  onAdd,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border p-4 transition-colors ${
        assigned
          ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/20 dark:bg-emerald-500/5"
          : "border-slate-200 bg-white dark:border-white/5 dark:bg-[#111c26]"
      }`}
    >
      <div className="min-w-0 text-right">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {translatePermissionName(permission.name) || permission.name}
        </p>

        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Permission #{permission.id}
        </p>
      </div>

      {assigned ? (
        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <Check
            className="h-4 w-4"
            strokeWidth={2}
          />

          مضاف
        </div>
      ) : (
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onAdd(permission)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white shadow-[0_8px_18px_rgba(16,185,129,0.18)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus
            className="h-4 w-4"
            strokeWidth={2}
          />

          {isLoading ? "جاري الإضافة..." : "إضافة"}
        </button>
      )}
    </div>
  );
}

export default PermissionItem;