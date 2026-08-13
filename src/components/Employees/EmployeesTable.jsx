import React from "react";
import { Edit3, Eye, Trash2, Users2 } from "lucide-react";
import EmployeesActions from "./EmployeeActions";

const statusStyles = {
  مفعل: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  مجمد: "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
};

function EmployeesTable({ visibleEmployees, totalFilteredCount }) {
  return (
    <div>
      {/* عنوان الجدول وعدد السجلات */}
      <div className="mb-4 flex items-center justify-between gap-3 text-right">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            قائمة الموظفين
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-300">
          <Users2
            className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
            strokeWidth={1.8}
          />

          <span>
            {totalFilteredCount.toLocaleString("en-US")} سجل
          </span>
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#0d151d]">
        <table className="w-full text-right text-sm text-slate-600 dark:text-slate-300">
          
          {/* رأس الجدول */}
          <thead className="bg-slate-50 text-[13px] font-semibold text-slate-700 dark:bg-[#111c26] dark:text-slate-300">
            <tr className="border-b border-slate-200 dark:border-white/10">
              <th className="w-14 px-4 py-4 text-center">
                #
              </th>

              <th className="px-4 py-4">
                الرقم الوظيفي
              </th>

              <th className="px-4 py-4">
                الاسم الكامل
              </th>

              <th className="px-4 py-4">
                الرقم الوطني
              </th>

              <th className="px-4 py-4">
                الهاتف
              </th>

              <th className="px-4 py-4">
                البريد الإلكتروني
              </th>

              <th className="px-4 py-4">
                الدور
              </th>

              <th className="px-4 py-4">
                تاريخ التوظيف
              </th>

              <th className="px-4 py-4">
                الحالة
              </th>

              <th className="w-36 px-4 py-4 text-center">
                الإجراءات
              </th>
            </tr>
          </thead>

          {/* بيانات الموظفين */}
          <tbody>
            {visibleEmployees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50/80 dark:border-white/5 dark:bg-[#0d151d] dark:hover:bg-[#14202b]"
              >
                {/* رقم التسلسل */}
                <td className="px-4 py-4 text-center text-slate-700 dark:text-slate-200">
                  {employee.id}
                </td>

                {/* الرقم الوظيفي */}
                <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                  {employee.jobTd}
                </td>

                {/* الاسم */}
                <td className="px-4 py-4 text-slate-800 dark:text-slate-200">
                  {employee.fullName}
                </td>

                {/* الرقم الوطني */}
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {employee.nationalId}
                </td>

                {/* الهاتف */}
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {employee.phone}
                </td>

                {/* البريد الإلكتروني */}
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {employee.email}
                </td>

                {/* الدور */}
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {employee.role}
                </td>

                {/* تاريخ التوظيف */}
                <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                  {employee.hireDate}
                </td>

                {/* الحالة */}
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                      statusStyles[employee.status] ||
                      "bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300"
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>

                {/* الإجراءات */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">

                    {/* عرض */}
                    <EmployeesActions
                      title="عرض"
                      className="h-9 w-9 border border-sky-500/30 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
                    >
                      <Eye
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </EmployeesActions>

                    {/* تعديل */}
                    <EmployeesActions
                      title="تعديل"
                      className="h-9 w-9 border border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                    >
                      <Edit3
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </EmployeesActions>

                    {/* حذف */}
                    <EmployeesActions
                      title="حذف"
                      className="h-9 w-9 border border-red-500/30 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                    >
                      <Trash2
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </EmployeesActions>

                  </div>
                </td>
              </tr>
            ))}

            {/* في حال عدم وجود نتائج */}
            {visibleEmployees.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  لا توجد بيانات موظفين مطابقة للبحث أو الفلاتر
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeesTable;