import React from "react";
import { Edit3, Eye, Trash2, Users2 } from "lucide-react";
import CitizenActions from "./CitizenActions";

const statusStyles = {
  مفعّل: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  مجمد: "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
};

function CitizensTable({ visibleCitizens, totalFilteredCount }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3 text-right">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            قائمة المواطنين
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-300">
          <Users2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
          <span>{totalFilteredCount.toLocaleString("en-US")} سجل</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#0d151d]">
        <table className="w-full text-right text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 text-[13px] font-semibold text-slate-700 dark:bg-[#111c26] dark:text-slate-300">
            <tr className="border-b border-slate-200 dark:border-white/10">
              <th className="w-14 px-4 py-4 text-center">#</th>
              <th className="px-4 py-4">الرقم الوطني</th>
              <th className="px-4 py-4">الاسم الكامل</th>
              <th className="px-4 py-4">الهاتف</th>
              <th className="px-4 py-4">الحالة الاجتماعية</th>
              <th className="px-4 py-4">البلدية</th>
              <th className="px-4 py-4">الموقع الحالي</th>
              <th className="px-4 py-4">تاريخ الميلاد</th>
              <th className="w-36 px-4 py-4 text-center">الإجراءات</th>
            </tr>
          </thead>

          <tbody>
            {visibleCitizens.map((citizen) => (
              <tr
                key={citizen.id}
                className="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50/80 dark:border-white/5 dark:bg-[#0d151d] dark:hover:bg-[#14202b]"
              >
                <td className="px-4 py-4 text-center text-slate-700 dark:text-slate-200">
                  {citizen.id}
                </td>

                <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                  {citizen.nationalId}
                </td>

                <td className="px-4 py-4 text-slate-800 dark:text-slate-200">
                  {citizen.fullName}
                </td>

                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {citizen.phone}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                      statusStyles[citizen.maritalStatus] || "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {citizen.maritalStatus}
                  </span>
                </td>

                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {citizen.municipality}
                </td>

                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {citizen.city}
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {citizen.birthDate}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <CitizenActions
                      title="عرض"
                      className="h-9 w-9 border border-sky-500/30 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
                    >
                      <Eye className="h-4 w-4" strokeWidth={1.8} />
                    </CitizenActions>

                    <CitizenActions
                      title="تعديل"
                      className="h-9 w-9 border border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                    >
                      <Edit3 className="h-4 w-4" strokeWidth={1.8} />
                    </CitizenActions>

                    <CitizenActions
                      title="حذف"
                      className="h-9 w-9 border border-red-500/30 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                    </CitizenActions>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CitizensTable;