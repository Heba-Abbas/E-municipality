import React from "react";
import {
  Building2,
  Edit3,
  Eye,
  Power,
  PowerOff,
} from "lucide-react";

import MunicipalityActions from "./MunicipalityActions";

function MunicipalitiesTable({
  municipalities,
  totalFilteredCount,
  onView,
  onEdit,
  onToggleStatus,
}) {
  return (
    <div>
      {/* عنوان الجدول */}
      <div className="mb-4 flex items-center justify-between gap-3 text-right">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            قائمة البلديات
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-300">
          <Building2
            className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
            strokeWidth={1.8}
          />

          <span>
            {Number(totalFilteredCount || 0).toLocaleString("en-US")} سجل
          </span>
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#0d151d]">
        <table className="w-full text-right text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 text-[13px] font-semibold text-slate-700 dark:bg-[#111c26] dark:text-slate-300">
            <tr className="border-b border-slate-200 dark:border-white/10">
              <th className="w-14 px-4 py-4 text-center">
                #
              </th>

              <th className="px-4 py-4">
                الاسم
              </th>

              <th className="px-4 py-4">
                العنوان
              </th>

              <th className="px-4 py-4">
                الهاتف
              </th>

              <th className="px-4 py-4">
                البريد الإلكتروني
              </th>

              <th className="px-4 py-4">
                الحالة
              </th>

              <th className="w-40 px-4 py-4 text-center">
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody>
            {municipalities.map((municipality) => (
              <tr
                key={municipality.id}
                className="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50/80 dark:border-white/5 dark:bg-[#0d151d] dark:hover:bg-[#14202b]"
              >
                <td className="px-4 py-4 text-center text-slate-700 dark:text-slate-200">
                  {municipality.id}
                </td>

                <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                  {municipality.name || "-"}
                </td>

                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {municipality.address || "-"}
                </td>

                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {municipality.phone || "-"}
                </td>

                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {municipality.email || "-"}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                      municipality.status
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300"
                    }`}
                  >
                    {municipality.status
                      ? "مفعل"
                      : "غير مفعل"}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">

                    {/* عرض */}
                    <MunicipalityActions
                      title="عرض"
                      onClick={() => onView(municipality.id)}
                      className="h-9 w-9 border border-sky-500/30 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
                    >
                      <Eye
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </MunicipalityActions>

                    {/* تعديل */}
                    <MunicipalityActions
                      title="تعديل"
                      onClick={() => onEdit(municipality)}
                      className="h-9 w-9 border border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                    >
                      <Edit3
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </MunicipalityActions>

                    {/* تفعيل / إلغاء تفعيل */}
                    <MunicipalityActions
                      title={
                        municipality.status
                          ? "إلغاء التفعيل"
                          : "تفعيل"
                      }
                      onClick={() =>
                        onToggleStatus(municipality)
                      }
                      className={
                        municipality.status
                          ? "h-9 w-9 border border-amber-500/30 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                          : "h-9 w-9 border border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                      }
                    >
                      {municipality.status ? (
                        <PowerOff
                          className="h-4 w-4"
                          strokeWidth={1.8}
                        />
                      ) : (
                        <Power
                          className="h-4 w-4"
                          strokeWidth={1.8}
                        />
                      )}
                    </MunicipalityActions>
                  </div>
                </td>
              </tr>
            ))}

            {municipalities.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  لا توجد بلديات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MunicipalitiesTable;