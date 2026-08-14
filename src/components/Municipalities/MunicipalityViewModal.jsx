import React from "react";
import { Building2, Mail, MapPin, Phone, X } from "lucide-react";

function MunicipalityViewModal({
  isOpen,
  municipality,
  isLoading,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f1821]">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                تفاصيل البلدية
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                معلومات البلدية
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <LoaderIcon />
            </div>
          ) : municipality ? (
            <div className="grid gap-4 sm:grid-cols-2">

              <InfoItem
                icon={<Building2 />}
                label="اسم البلدية"
                value={municipality.name}
              />

              <InfoItem
                icon={<Phone />}
                label="رقم الهاتف"
                value={municipality.phone}
              />

              <InfoItem
                icon={<Mail />}
                label="البريد الإلكتروني"
                value={municipality.email}
              />

              <InfoItem
                icon={<MapPin />}
                label="العنوان"
                value={municipality.address}
              />

              <div className="sm:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-[#121b24]">
                  <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    الحالة
                  </p>

                  <span
                    className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
                      municipality.status
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300"
                    }`}
                  >
                    {municipality.status ? "مفعل" : "غير مفعل"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="py-10 text-center text-slate-500 dark:text-slate-400">
              لا توجد بيانات
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function LoaderIcon() {
  return (
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-[#121b24]">
      <div className="mb-3 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
        {React.cloneElement(icon, {
          className: "h-4 w-4",
        })}

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>

      <p className="break-words text-sm font-medium text-slate-800 dark:text-slate-100">
        {value || "-"}
      </p>
    </div>
  );
}

export default MunicipalityViewModal;