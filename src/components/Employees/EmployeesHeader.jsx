import React from "react";
import { Plus } from "lucide-react";

function EmployeesHeader({
  totalRows,
  activeCount,
  pendingCount,
  onAddEmployee,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* العنوان */}
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
            الموظفين
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            إدارة الموظفين وبياناتهم
          </p>
        </div>

        {/* زر إضافة موظف */}
        <button
          type="button"
          onClick={onAddEmployee}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-emerald-500
            px-5
            text-sm
            font-medium
            text-white
            shadow-[0_10px_24px_rgba(16,185,129,0.22)]
            transition
            hover:bg-emerald-600
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500/30
          "
        >
          <Plus
            className="h-4 w-4"
            strokeWidth={2}
          />

          إضافة موظف
        </button>

      </div>
    </section>
  );
}

export default EmployeesHeader;