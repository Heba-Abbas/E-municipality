import React from "react";
import {
  ShieldCheck,
  ChevronLeft,
  Pencil,
  Trash2,
} from "lucide-react";

const roleNames = {
  system_admin: "مدير النظام",
  municipality_admin: "مدير البلدية",
  mayor: "رئيس البلدية",
  technical_office: "المكتب الفني",
  engineering_office: "المكتب الهندسي",
  department_manager: "مدير القسم",
  field_inspector: "المفتش الميداني",
  citizen: "مواطن",
};

function getRoleName(role) {
  return roleNames[role.name] || role.name;
}

function RolesList({
  roles,
  selectedRole,
  onSelectRole,
  onEditRole,
  onDeleteRole,
  onAddRole,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="text-right">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            الأدوار
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            اختر دوراً لإدارة الأذونات الخاصة به
          </p>
        </div>

        <button
          type="button"
          onClick={onAddRole}
          className="shrink-0 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white shadow-[0_8px_18px_rgba(16,185,129,0.18)] transition hover:bg-emerald-600"
        >
          + إضافة
        </button>
      </div>

      <div className="space-y-2">
        {roles.map((role) => {
          const isSelected = selectedRole?.id === role.id;

          return (
            <div
              key={role.id}
              className={`group flex items-center gap-2 rounded-2xl border px-3 py-3 transition-all ${
                isSelected
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "border-slate-200 bg-white text-slate-700 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-300"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectRole(role)}
                className="flex min-w-0 flex-1 items-center gap-3 text-right"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isSelected
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400"
                  }`}
                >
                  <ShieldCheck
                    className="h-5 w-5"
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {getRoleName(role)}
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {role.permissions?.length || 0} أذونات
                  </p>
                </div>

                <ChevronLeft
                  className={`mr-auto h-4 w-4 shrink-0 ${
                    isSelected
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400"
                  }`}
                  strokeWidth={1.8}
                />
              </button>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEditRole(role)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                  title="تعديل"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteRole(role)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  title="حذف"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {roles.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            لا توجد أدوار حالياً
          </div>
        )}
      </div>
    </section>
  );
}

export default RolesList;