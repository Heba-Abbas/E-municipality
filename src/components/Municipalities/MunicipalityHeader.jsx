import React from "react";
import { Building2, Plus } from "lucide-react";

function MunicipalityHeader({
  totalRows,
  onAdd,
  governorates = [],
  selectedGovernorate = "",
  onGovernorateChange = () => {},
  isGovLoading = false,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* العنوان + زر الإضافة */}
        <div className="flex items-center gap-3">
          

          <div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
              البلديات
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              إدارة البلديات ومعلوماتها
            </p>
          </div>
        </div>

        {/* عدد البلديات */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">
            <select
              value={selectedGovernorate}
              onChange={(e) => onGovernorateChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none dark:bg-[#121b24] dark:text-white"
            >
              <option value="">كل المحافظات</option>
              {isGovLoading ? (
                <option value="">جارٍ التحميل...</option>
              ) : (
                governorates.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              إضافة بلدية
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default MunicipalityHeader;