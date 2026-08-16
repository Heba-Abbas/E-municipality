import React from "react";
import {
  FileText,
  X,
  User,
  Building2,
  CalendarDays,
  Paperclip,
  Download,
} from "lucide-react";

import ServiceRequestStatusBadge from "./ServiceRequestStatusBadge";

function ServiceRequestDetailsModal({
  request,
  onClose,
  onOpenAttachment,
}) {
  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/5 dark:bg-[#0f1821]"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              تفاصيل طلب الخدمة
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              رقم الطلب #{request.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-75px)] overflow-y-auto p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Citizen */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-[#111c26]">
              <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

                <h3 className="font-semibold text-slate-800 dark:text-white">
                  بيانات المواطن
                </h3>
              </div>

              <div className="space-y-3">
                <InfoRow
                  label="الاسم الكامل"
                  value={request.citizen?.full_name}
                />

                <InfoRow
                  label="الرقم الوطني"
                  value={request.citizen?.national_id}
                />
              </div>
            </section>

            {/* Service */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-[#111c26]">
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

                <h3 className="font-semibold text-slate-800 dark:text-white">
                  بيانات الخدمة
                </h3>
              </div>

              <div className="space-y-3">
                <InfoRow
                  label="نوع الخدمة"
                  value={request.service_type?.name}
                />

                <InfoRow
                  label="البلدية"
                  value={
                    request.service_type?.municipality?.name
                  }
                />

                <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2 last:border-0 dark:border-white/5">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    الحالة
                  </span>

                  <ServiceRequestStatusBadge
                    status={request.current_status}
                  />
                </div>
              </div>
            </section>

            {/* Request Data */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-2 dark:border-white/5 dark:bg-[#0d151d]">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

                <h3 className="font-semibold text-slate-800 dark:text-white">
                  بيانات الطلب
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(request.data || {}).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/5 dark:bg-[#111c26]"
                    >
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatFieldName(key)}
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                        {String(value ?? "-")}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Attachments */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-2 dark:border-white/5 dark:bg-[#0d151d]">
              <div className="mb-4 flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

                <h3 className="font-semibold text-slate-800 dark:text-white">
                  المرفقات
                </h3>
              </div>

              {request.attachments?.length ? (
                <div className="space-y-2">
                  {request.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/5 dark:bg-[#111c26]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                          <FileText className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                            {attachment.original_name}
                          </p>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatFileSize(
                              attachment.file_size
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onOpenAttachment(
                            attachment.id
                          )
                        }
                        className="flex shrink-0 items-center gap-2 rounded-lg border border-sky-500/30 bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700 transition hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
                      >
                        <Download className="h-4 w-4" />

                        <span>عرض</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  لا توجد مرفقات لهذا الطلب
                </p>
              )}
            </section>

            {/* Dates */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:col-span-2 dark:border-white/5 dark:bg-[#111c26]">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

                <h3 className="font-semibold text-slate-800 dark:text-white">
                  معلومات زمنية
                </h3>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoRow
                  label="تاريخ الإرسال"
                  value={formatDate(request.submitted_at)}
                />

                <InfoRow
                  label="آخر تحديث"
                  value={formatDate(request.updated_at)}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2 last:border-0 dark:border-white/5">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
        {value || "-"}
      </span>
    </div>
  );
}

function formatFieldName(key) {
  const names = {
    applicant_name: "اسم مقدم الطلب",
    property_area: "مساحة العقار",
    building_category: "تصنيف البناء",
    property_plan: "مخطط العقار",
  };

  return names[key] || key;
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleString("ar-SY");
}

function formatFileSize(bytes) {
  if (!bytes) return "-";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default ServiceRequestDetailsModal;