import React, { useMemo, useState } from "react";
import {
  KeyRound,
  Search,
} from "lucide-react";
import PermissionItem from "./PermissionItem";

function PermissionsPanel({
  role,
  permissions,
  onAddPermission,
  addingPermissionId,
  search = "",
  setSearch = () => {},
}) {

  const assignedPermissionNames = useMemo(() => {
    return new Set(
      (role?.permissions || []).map((permission) =>
        typeof permission === "string"
          ? permission
          : permission.name
      )
    );
  }, [role]);

  const filteredPermissions = useMemo(() => {
    const normalizedSearch = (search || "").trim().toLowerCase();

    if (!normalizedSearch) {
      return permissions;
    }

    return permissions.filter((permission) =>
      permission.name.toLowerCase().includes(normalizedSearch)
    );
  }, [permissions, search]);

  if (!role) {
    return (
      <section className="flex min-h-[500px] items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-white/5 dark:bg-[#0f1821]">
        <div className="text-center">
          <KeyRound className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />

          <p className="text-sm text-slate-500 dark:text-slate-400">
            اختر دوراً من القائمة لعرض الأذونات
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              أذونات الدور
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            إدارة الأذونات الخاصة بالدور المحدد
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          <span className="font-semibold">
            {role.permissions?.length || 0}
          </span>{" "}
          أذونات مفعلة
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <Search
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            strokeWidth={1.8}
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث عن إذن..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Permissions */}
      <div className="space-y-2.5">
        {filteredPermissions.map((permission) => {
          const assigned = assignedPermissionNames.has(
            permission.name
          );

          return (
            <PermissionItem
              key={permission.id}
              permission={permission}
              assigned={assigned}
              isLoading={
                addingPermissionId === permission.id
              }
              onAdd={onAddPermission}
            />
          );
        })}

        {filteredPermissions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            لا توجد أذونات مطابقة للبحث
          </div>
        )}
      </div>
    </section>
  );
}

export default PermissionsPanel;