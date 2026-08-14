import React, { useEffect, useState } from "react";
import { X, ShieldCheck, Save, Loader2 } from "lucide-react";
import { translatePermissionName } from "../../utils/permissionUtils";

function RoleModal({
  isOpen,
  mode = "add",
  role = null,
  permissions = [],
  isLoading = false,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && role) {
      setName(role.name || "");

      const rolePermissionIds = permissions
        .filter((permission) =>
          (role.permissions || []).some(
            (rolePermission) =>
              typeof rolePermission === "string"
                ? rolePermission === permission.name
                : rolePermission.id === permission.id ||
                  rolePermission.name === permission.name
          )
        )
        .map((permission) => String(permission.id));

      setSelectedPermissions(rolePermissionIds);
    } else {
      setName("");
      setSelectedPermissions([]);
    }
  }, [isOpen, mode, role, permissions]);

  if (!isOpen) {
    return null;
  }

  const togglePermission = (permissionId) => {
    const id = String(permissionId);

    setSelectedPermissions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSubmit = (event) => {
  event.preventDefault();

  if (!name.trim()) {
    return;
  }

  const selectedPermissionNames = permissions
    .filter((permission) =>
      selectedPermissions.includes(String(permission.id))
    )
    .map((permission) => permission.name);

  onSubmit({
    name: name.trim(),
    permissions: selectedPermissionNames,
  });
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/5 dark:bg-[#0f1821]"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                {mode === "edit" ? "تعديل الدور" : "إضافة دور"}
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {mode === "edit"
                  ? "تعديل اسم الدور والأذونات المرتبطة به"
                  : "إضافة دور جديد للنظام"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            {/* Role name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                اسم الدور
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="مثال: مدير القسم"
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {/* Permissions */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  الأذونات
                </label>

                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {selectedPermissions.length} محدد
                </span>
              </div>

              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {permissions.map((permission) => {
                  const selected = selectedPermissions.includes(
                    String(permission.id)
                  );

                  return (
                    <button
                      key={permission.id}
                      type="button"
                      disabled={isLoading}
                      onClick={() => togglePermission(permission.id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-right transition ${
                        selected
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-300 dark:hover:bg-[#14202b]"
                      }`}
                    >
                      <span className="text-sm">
  {translatePermissionName(permission.name) ||
    permission.name}
</span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                          selected
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {selected && (
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            className="h-3.5 w-3.5"
                          >
                            <path
                              d="M4 10.5L8 14L16 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-start gap-3 border-t border-slate-100 px-6 py-4 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_18px_rgba(16,185,129,0.18)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {mode === "edit" ? "حفظ التعديلات" : "إضافة الدور"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoleModal;