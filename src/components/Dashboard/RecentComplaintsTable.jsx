import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import ComplaintStatusBadge from "../Complaints/ComplaintStatusBadge";
import { formatDate, formatRelativeTime } from "../../utils/complaintsUtils";

// جدول "آخر الشكاوى" بلوحة التحكم
// ------------------------------------------
// GET /api/unified-complaints

function RecentComplaintsTable({ complaints, isLoading, error }) {
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#101922] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
      {/* رأس الجدول */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          آخر الشكاوى
        </h2>

        <button
          type="button"
          onClick={() => navigate("/dashboard/complaints/unified")}
          className="rounded-lg border border-emerald-500/40 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-transparent dark:text-emerald-300 dark:hover:bg-emerald-500/10"
        >
          عرض الكل
        </button>
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="flex min-h-[140px] items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-xs text-slate-600 dark:text-slate-300">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 dark:border-white/5 dark:text-slate-400">
                <th className="px-3 py-2 font-medium">رقم الشكوى</th>
                <th className="px-3 py-2 font-medium">المنطقة</th>
                <th className="px-3 py-2 font-medium">الحالة</th>
                <th className="px-3 py-2 font-medium">تاريخ الإضافة</th>
                <th className="px-3 py-2 font-medium">آخر تحديث</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">
                    {item.id}
                  </td>

                  <td className="px-3 py-3">{item.text_location || "-"}</td>

                  <td className="px-3 py-3">
                    <ComplaintStatusBadge
                      status={item.current_status?.key}
                      name={item.current_status?.name}
                    />
                  </td>

                  <td className="px-3 py-3">
                    {formatDate(item.submitted_at || item.created_at)}
                  </td>

                  <td className="px-3 py-3 text-slate-500 dark:text-slate-400">
                    {formatRelativeTime(item.updated_at)}
                  </td>
                </tr>
              ))}

              {complaints.length === 0 && !error && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-slate-500 dark:text-slate-400"
                  >
                    لا توجد شكاوى
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RecentComplaintsTable;
