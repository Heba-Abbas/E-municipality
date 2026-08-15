import { Plus, FileText } from "lucide-react";

function ServiceTypesHeader({ onAdd }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* العنوان */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <FileText
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
              المعاملات
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              إنشاء نوع معاملة وإضافة نسخة وحقولها
            </p>
          </div>
        </div>

        {/* زر الإضافة */}
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <Plus
            className="h-5 w-5"
            strokeWidth={2}
          />

          إضافة معاملة
        </button>

      </div>
    </section>
  );
}

export default ServiceTypesHeader;