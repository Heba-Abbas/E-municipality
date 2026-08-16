import React from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Layers3,
  CalendarDays,
} from "lucide-react";

function ServiceTypeTable({
  serviceTypes = [],
}) {
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "ar-SY"
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#0d151d]">
      <table className="w-full min-w-[1000px] text-right text-sm text-slate-600 dark:text-slate-300">
        {/* =====================================================
            Header
        ===================================================== */}

        <thead className="bg-slate-50 text-[13px] font-semibold text-slate-700 dark:bg-[#111c26] dark:text-slate-300">
          <tr className="border-b border-slate-200 dark:border-white/10">
            <th className="w-14 px-4 py-4 text-center">
              #
            </th>

            <th className="px-4 py-4">
              نوع المعاملة
            </th>

            <th className="px-4 py-4">
              البلدية
            </th>

            <th className="px-4 py-4">
              الوصف
            </th>

            <th className="px-4 py-4 text-center">
              النسخة
            </th>

            <th className="px-4 py-4 text-center">
              عدد الحقول
            </th>

            <th className="px-4 py-4 text-center">
              الحالة
            </th>

            <th className="px-4 py-4">
              تاريخ الإنشاء
            </th>
          </tr>
        </thead>

        {/* =====================================================
            Body
        ===================================================== */}

        <tbody>
          {serviceTypes.map((serviceType) => {
            const activeVersion =
              serviceType.active_version;

            const fields =
              activeVersion?.fields || [];

            return (
              <tr
                key={serviceType.id}
                className="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50/80 dark:border-white/5 dark:bg-[#0d151d] dark:hover:bg-[#14202b]"
              >
                {/* ID */}

                <td className="px-4 py-4 text-center font-medium text-slate-700 dark:text-slate-200">
                  {serviceType.id}
                </td>

                {/* اسم المعاملة */}

                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <FileText
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </div>

                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {serviceType.name || "-"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        #{serviceType.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* البلدية */}

                <td className="px-4 py-4">
                  <span className="text-slate-700 dark:text-slate-300">
                    {serviceType.municipality?.name ||
                      "-"}
                  </span>
                </td>

                {/* الوصف */}

                <td className="max-w-[280px] px-4 py-4">
                  <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {serviceType.description || "-"}
                  </p>
                </td>

                {/* النسخة */}

                <td className="px-4 py-4 text-center">
                  {activeVersion ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-300">
                      <Layers3
                        className="h-3.5 w-3.5"
                        strokeWidth={1.8}
                      />

                      v
                      {activeVersion.version_number}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      لا توجد
                    </span>
                  )}
                </td>

                {/* عدد الحقول */}

                <td className="px-4 py-4 text-center">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {fields.length}
                  </span>
                </td>

                {/* الحالة */}

                <td className="px-4 py-4 text-center">
                  {serviceType.is_active ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                      <CheckCircle2
                        className="h-3.5 w-3.5"
                        strokeWidth={1.8}
                      />

                      فعالة
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800 dark:bg-red-500/20 dark:text-red-300">
                      <XCircle
                        className="h-3.5 w-3.5"
                        strokeWidth={1.8}
                      />

                      غير فعالة
                    </span>
                  )}
                </td>

                {/* تاريخ الإنشاء */}

                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <CalendarDays
                      className="h-4 w-4 text-slate-400 dark:text-slate-500"
                      strokeWidth={1.8}
                    />

                    {formatDate(
                      serviceType.created_at
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {/* Empty State */}

          {serviceTypes.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
              >
                لا توجد أنواع معاملات حالياً
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceTypeTable;