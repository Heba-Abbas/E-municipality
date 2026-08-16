import React from "react";
import {
  Eye,
  FileCheck,
  FileText,
  Forward,
  X,
} from "lucide-react";

import ServiceRequestStatusBadge from "./ServiceRequestStatusBadge";

function ActionButton({
  title,
  onClick,
  disabled = false,
  className = "",
  children,
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
        disabled
          ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-white/5 dark:bg-white/5 dark:text-slate-600"
          : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

/*
=========================================================
تحديد حالة المراجعة للمكتب الفني
=========================================================
*/

const isTechnicalReviewStatus = (status) => {
  if (!status) return false;

  const code = String(status.code || "").toLowerCase();
  const nameAr = String(status.name_ar || "").trim();

  const reviewCodes = [
    "in_review",
    "under_review",
    "reviewing",
    "in-review",
    "under-review",
  ];

  return (
    reviewCodes.includes(code) ||
    nameAr.includes("قيد المراجعة") ||
    nameAr.includes("قيد المراجعه")
  );
};

/*
=========================================================
حالة نهائية مع إصدار الوثيقة
=========================================================
*/

const isApprovedAndDocumentIssued = (status) => {
  if (!status) return false;

  return (
    status.code === "approved_and_document_issued"
  );
};

function ServiceRequestsTable({
  requests,
  role,
  onView,
  onStartReview,
  onForward,
  onReject,
  onApproveAndIssue,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#0d151d]">
      <table className="w-full min-w-[1000px] text-right text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 text-[13px] font-semibold text-slate-700 dark:bg-[#111c26] dark:text-slate-300">
          <tr className="border-b border-slate-200 dark:border-white/10">
            <th className="w-14 px-4 py-4 text-center">
              #
            </th>

            <th className="px-4 py-4">
              المواطن
            </th>

            <th className="px-4 py-4">
              الرقم الوطني
            </th>

            <th className="px-4 py-4">
              نوع الخدمة
            </th>

            <th className="px-4 py-4">
              البلدية
            </th>

            <th className="px-4 py-4">
              تاريخ الإرسال
            </th>

            <th className="px-4 py-4">
              الحالة
            </th>

            <th className="w-52 px-4 py-4 text-center">
              الإجراءات
            </th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => {
            const statusCode =
              request.current_status?.code;

            const technicalReviewing =
              isTechnicalReviewStatus(
                request.current_status
              );

            const documentIssued =
              isApprovedAndDocumentIssued(
                request.current_status
              );

            return (
              <tr
                key={request.id}
                className="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50/80 dark:border-white/5 dark:bg-[#0d151d] dark:hover:bg-[#14202b]"
              >
                {/* رقم الطلب */}

                <td className="px-4 py-4 text-center font-medium text-slate-700 dark:text-slate-200">
                  {request.id}
                </td>

                {/* المواطن */}

                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {request.citizen?.full_name || "-"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      طلب #{request.id}
                    </p>
                  </div>
                </td>

                {/* الرقم الوطني */}

                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {request.citizen?.national_id || "-"}
                </td>

                {/* نوع الخدمة */}

                <td className="px-4 py-4 font-medium text-slate-800 dark:text-slate-200">
                  {request.service_type?.name || "-"}
                </td>

                {/* البلدية */}

                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {request.service_type?.municipality?.name || "-"}
                </td>

                {/* تاريخ الإرسال */}

                <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                  {request.submitted_at
                    ? new Date(
                        request.submitted_at
                      ).toLocaleDateString("ar-SY")
                    : "-"}
                </td>

                {/* الحالة */}

                <td className="px-4 py-4">
                  <div className="flex flex-col items-start gap-1.5">
                    <ServiceRequestStatusBadge
                      status={request.current_status}
                    />

                    {/* رقم الوثيقة بعد الإصدار */}

                    {documentIssued &&
                      request.document?.document_number && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {request.document.document_number}
                        </span>
                      )}
                  </div>
                </td>

                {/* الإجراءات */}

                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">

                    {/* =================================================
                        عرض الطلب
                        يبقى موجود دائماً
                    ================================================= */}

                    <ActionButton
                      title="عرض الطلب"
                      onClick={() =>
                        onView(request.id)
                      }
                      className="border border-sky-500/30 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
                    >
                      <Eye
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </ActionButton>

                    {/* =================================================
                        المكتب الفني
                    ================================================= */}

                    {role === "technical" && (
                      <>

                        {/* الطلب جديد */}

                        {statusCode === "submitted" && (
                          <ActionButton
                            title="بدء المراجعة"
                            onClick={() =>
                              onStartReview(request.id)
                            }
                            className="border border-amber-500/30 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                          >
                            <FileText
                              className="h-4 w-4"
                              strokeWidth={1.8}
                            />
                          </ActionButton>
                        )}

                        {/* قيد المراجعة */}

                        {technicalReviewing && (
                          <>
                            <ActionButton
                              title="إرسال للمكتب الهندسي"
                              onClick={() =>
                                onForward(request.id)
                              }
                              className="border border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                            >
                              <Forward
                                className="h-4 w-4"
                                strokeWidth={1.8}
                              />
                            </ActionButton>

                            <ActionButton
                              title="رفض الطلب"
                              onClick={() =>
                                onReject(request.id)
                              }
                              className="border border-red-500/30 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                            >
                              <X
                                className="h-4 w-4"
                                strokeWidth={1.8}
                              />
                            </ActionButton>
                          </>
                        )}

                        {/* حماية إضافية */}

                        {statusCode !== "submitted" &&
                          !technicalReviewing &&
                          statusCode &&
                          statusCode !==
                            "pending_engineering_approval" &&
                          statusCode !==
                            "pending_mayor_approval" &&
                          statusCode !== "rejected" &&
                          statusCode !== "approved" &&
                          statusCode !==
                            "approved_and_document_issued" && (
                            <>
                              <ActionButton
                                title="إرسال للمكتب الهندسي"
                                onClick={() =>
                                  onForward(request.id)
                                }
                                className="border border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                              >
                                <Forward
                                  className="h-4 w-4"
                                  strokeWidth={1.8}
                                />
                              </ActionButton>

                              <ActionButton
                                title="رفض الطلب"
                                onClick={() =>
                                  onReject(request.id)
                                }
                                className="border border-red-500/30 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                              >
                                <X
                                  className="h-4 w-4"
                                  strokeWidth={1.8}
                                />
                              </ActionButton>
                            </>
                          )}
                      </>
                    )}

                    {/* =================================================
                        المكتب الهندسي
                    ================================================= */}

                    {role === "engineering" &&
                      statusCode ===
                        "pending_engineering_approval" && (
                        <>
                          <ActionButton
                            title="إرسال لرئيس البلدية"
                            onClick={() =>
                              onForward(request.id)
                            }
                            className="border border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                          >
                            <Forward
                              className="h-4 w-4"
                              strokeWidth={1.8}
                            />
                          </ActionButton>

                          <ActionButton
                            title="رفض الطلب"
                            onClick={() =>
                              onReject(request.id)
                            }
                            className="border border-red-500/30 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                          >
                            <X
                              className="h-4 w-4"
                              strokeWidth={1.8}
                            />
                          </ActionButton>
                        </>
                      )}

                    {/* =================================================
                        رئيس البلدية
                    ================================================= */}

                    {role === "mayor" &&
                      statusCode ===
                        "pending_mayor_approval" && (
                        <>
                          <ActionButton
                            title="الموافقة وإصدار الوثيقة"
                            onClick={() =>
                              onApproveAndIssue(request.id)
                            }
                            className="border border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                          >
                            <FileCheck
                              className="h-4 w-4"
                              strokeWidth={1.8}
                            />
                          </ActionButton>

                          <ActionButton
                            title="رفض الطلب"
                            onClick={() =>
                              onReject(request.id)
                            }
                            className="border border-red-500/30 bg-red-50 text-red-700 hover:bg-red-500/10 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                          >
                            <X
                              className="h-4 w-4"
                              strokeWidth={1.8}
                            />
                          </ActionButton>
                        </>
                      )}

                    {/* =================================================
                        الطلب تمت الموافقة عليه وإصدار الوثيقة
                        
                        لا توجد إجراءات إضافية.
                        يبقى فقط زر عرض الطلب.
                    ================================================= */}

                    {role === "mayor" &&
                      documentIssued &&
                      request.document && (
                        <span
                          title="تم إصدار وثيقة الخدمة"
                          className="inline-flex h-9 items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-50 px-2.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                        >
                          <FileCheck
                            className="h-4 w-4"
                            strokeWidth={1.8}
                          />

                          تم الإصدار
                        </span>
                      )}
                  </div>
                </td>
              </tr>
            );
          })}

          {requests.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
              >
                لا توجد طلبات خدمة حالياً
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceRequestsTable;