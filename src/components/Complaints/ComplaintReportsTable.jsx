import { Eye } from "lucide-react";
import ComplaintStatusBadge from "./ComplaintStatusBadge";
import { formatDate } from "../../utils/complaintsUtils";

function ComplaintReportsTable({ reports, onView }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#0d151d]">
      <table className="w-full text-right text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 text-[13px] font-semibold text-slate-700 dark:bg-[#111c26] dark:text-slate-300">
          <tr className="border-b border-slate-200 dark:border-white/10">
            <th className="px-4 py-4">الرقم</th>
            <th className="px-4 py-4">التاريخ</th>
            <th className="px-4 py-4">الفئة</th>
            <th className="px-4 py-4">الموقع</th>
            <th className="px-4 py-4">الحالة</th>
            <th className="w-20 px-4 py-4 text-center">عرض</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report) => (
            <tr
              key={report.id}
              className="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50/80 dark:border-white/5 dark:bg-[#0d151d] dark:hover:bg-[#14202b]"
            >
              <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">
                {report.id}
              </td>

              <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                {formatDate(report.submitted_at)}
              </td>

              {/* الفئة الفرعية للبلاغ */}
              <td className="px-4 py-4 font-medium text-slate-800 dark:text-slate-200">
                {report.category?.name || report.title || "-"}
              </td>

              <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                {report.text_location || "-"}
              </td>

              {/* status وليس current_status */}
              <td className="px-4 py-4">
                <ComplaintStatusBadge
                  status={report.status?.key}
                  name={report.status?.name}
                />
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    title="عرض التفاصيل"
                    onClick={() => onView(report.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-50 text-sky-700 transition hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
                  >
                    <Eye className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {reports.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
              >
                لا توجد بلاغات
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintReportsTable;
