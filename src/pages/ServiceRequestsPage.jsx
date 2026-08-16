import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  CalendarDays,
  Loader2,
  X,
} from "lucide-react";

import ServiceRequestsHeader from "../components/ServiceRequests/ServiceRequestsHeader";
import ServiceRequestsTable from "../components/ServiceRequests/ServiceRequestsTable";
import ServiceRequestDetailsModal from "../components/ServiceRequests/ServiceRequestDetailsModal";
import ServiceRequestPagination from "../components/ServiceRequests/ServiceRequestPagination";

function ServiceRequestsPage({
  title,
  description,
  role,
  listRequests,
  getRequestById,
  openAttachment,
  startReview,
  forwardRequest,
  rejectRequest,
  approveAndIssue,
}) {
  const [requests, setRequests] = useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isActionLoading, setIsActionLoading] =
    useState(false);

  const [error, setError] = useState("");

  /*
  =========================================================
  نافذة تحديد expires_at لرئيس البلدية
  =========================================================
  */

  const [showApproveModal, setShowApproveModal] =
    useState(false);

  const [approveRequestId, setApproveRequestId] =
    useState(null);

  const [expiresAt, setExpiresAt] = useState("");

  /*
  =========================================================
  جلب الطلبات
  =========================================================
  */

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await listRequests(currentPage);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "تعذر جلب الطلبات"
        );
      }

      setRequests(
        response.data?.items || []
      );

      setPagination(
        response.data?.pagination || {
          current_page: currentPage,
          last_page: 1,
          per_page: 15,
          total: 0,
        }
      );
    } catch (err) {
      console.error(
        "Service Requests Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "حدث خطأ أثناء جلب طلبات الخدمة"
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, listRequests]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  /*
  =========================================================
  عرض تفاصيل الطلب
  =========================================================
  */

  const handleView = async (requestId) => {
    try {
      setIsActionLoading(true);
      setError("");

      const response =
        await getRequestById(requestId);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "تعذر جلب تفاصيل الطلب"
        );
      }

      setSelectedRequest(response.data);
    } catch (err) {
      console.error(
        "Get Request Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "تعذر عرض تفاصيل الطلب"
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  /*
  =========================================================
  تنفيذ العمليات العادية
  =========================================================

  يستخدم مع:

  - بدء المراجعة
  - الإرسال للمكتب الهندسي
  - الرفض
  - الإرسال لرئيس البلدية
  =========================================================
  */

  const executeAction = async (
    action,
    requestId
  ) => {
    if (!action) return;

    try {
      setIsActionLoading(true);
      setError("");

      const response =
        await action(requestId);

      if (
        response &&
        response.success === false
      ) {
        throw new Error(
          response.message ||
            "فشلت العملية"
        );
      }

      /*
      =====================================================
      بعد نجاح العملية نعيد جلب البيانات
      للعمليات العادية فقط.
      =====================================================
      */

      await loadRequests();

      if (
        selectedRequest?.id === requestId
      ) {
        setSelectedRequest(null);
      }
    } catch (err) {
      console.error(
        "Service Request Action Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "حدث خطأ أثناء تنفيذ العملية"
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  /*
  =========================================================
  فتح نافذة الموافقة والإصدار
  =========================================================
  */

  const handleOpenApproveModal = (requestId) => {
    setApproveRequestId(requestId);
    setExpiresAt("");
    setError("");
    setShowApproveModal(true);
  };

  /*
  =========================================================
  إغلاق نافذة الموافقة
  =========================================================
  */

  const handleCloseApproveModal = () => {
    if (isActionLoading) return;

    setShowApproveModal(false);
    setApproveRequestId(null);
    setExpiresAt("");
  };

  /*
  =========================================================
  تنفيذ approve-and-issue
  =========================================================
  */

  const handleApproveAndIssue = async () => {
    if (!approveRequestId) {
      setError("رقم طلب الخدمة غير موجود");
      return;
    }

    if (!expiresAt) {
      setError(
        "يرجى تحديد تاريخ انتهاء الوثيقة"
      );

      return;
    }

    try {
      setIsActionLoading(true);
      setError("");

      /*
      =====================================================
      إرسال التاريخ بصيغة YYYY-MM-DD
      =====================================================
      */

      const response =
        await approveAndIssue(
          approveRequestId,
          expiresAt
        );

      if (
        response &&
        response.success === false
      ) {
        throw new Error(
          response.message ||
            "فشلت عملية الموافقة وإصدار الوثيقة"
        );
      }

      /*
      =====================================================
      IMPORTANT
      =====================================================

      الـ API يرجع الطلب الكامل بعد الموافقة:

      response.data = {
        id,
        citizen,
        service_type,
        data,
        current_status,
        attachments,
        submitted_at,
        document,
        created_at,
        updated_at
      }

      لا نعيد loadRequests هنا.

      السبب:
      GET /mayor/service-requests غالباً يعرض فقط
      الطلبات التي بانتظار موافقة رئيس البلدية.

      لذلك لو عملنا loadRequests() بعد الموافقة
      سيختفي الطلب من الجدول.

      بدلاً من ذلك نضع response.data مكان الطلب
      القديم مباشرة.
      =====================================================
      */

      const approvedRequest = response?.data;

      if (approvedRequest?.id) {
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === approvedRequest.id
              ? approvedRequest
              : request
          )
        );

        /*
        ===================================================
        إذا كانت نافذة تفاصيل الطلب مفتوحة،
        نحدثها أيضاً بالبيانات الجديدة.

        وبذلك تظهر document مباشرة.
        ===================================================
        */

        if (
          selectedRequest?.id ===
          approvedRequest.id
        ) {
          setSelectedRequest(
            approvedRequest
          );
        }
      }

      /*
      =====================================================
      إغلاق نافذة الموافقة
      =====================================================
      */

      setShowApproveModal(false);
      setApproveRequestId(null);
      setExpiresAt("");
    } catch (err) {
      console.error(
        "Approve And Issue Error:",
        err
      );

      /*
      =====================================================
      عرض أخطاء Laravel الحقيقية
      =====================================================
      */

      const validationErrors =
        err.response?.data?.errors;

      if (
        validationErrors &&
        typeof validationErrors === "object"
      ) {
        const firstError =
          Object.values(
            validationErrors
          )?.[0];

        if (Array.isArray(firstError)) {
          setError(firstError[0]);
        } else if (firstError) {
          setError(String(firstError));
        } else {
          setError(
            err.response?.data?.message ||
              "حدث خطأ أثناء إصدار الوثيقة"
          );
        }
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "حدث خطأ أثناء إصدار الوثيقة"
        );
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  /*
  =========================================================
  فتح المرفق
  =========================================================
  */

  const handleAttachment = async (
    attachmentId
  ) => {
    if (!selectedRequest) return;

    try {
      setIsActionLoading(true);
      setError("");

      await openAttachment(
        selectedRequest.id,
        attachmentId
      );
    } catch (err) {
      console.error(
        "Attachment Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "تعذر فتح المرفق"
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  /*
  =========================================================
  تاريخ اليوم
  =========================================================
  */

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <div
      className="space-y-4 lg:space-y-5"
      dir="rtl"
    >
      <ServiceRequestsHeader
        title={title}
        description={description}
        totalCount={pagination.total}
      />

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div className="flex-1">
            {error}
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-xs font-medium hover:underline"
          >
            إغلاق
          </button>
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:p-5">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        ) : (
          <>
            <ServiceRequestsTable
              requests={requests}
              role={role}
              onView={handleView}
              onStartReview={(id) =>
                executeAction(
                  startReview,
                  id
                )
              }
              onForward={(id) =>
                executeAction(
                  forwardRequest,
                  id
                )
              }
              onReject={(id) =>
                executeAction(
                  rejectRequest,
                  id
                )
              }
              onApproveAndIssue={
                handleOpenApproveModal
              }
            />

            <ServiceRequestPagination
              currentPage={
                pagination.current_page
              }
              lastPage={
                pagination.last_page
              }
              onPageChange={
                setCurrentPage
              }
            />
          </>
        )}
      </section>

      {selectedRequest && (
        <ServiceRequestDetailsModal
          request={selectedRequest}
          onClose={() =>
            setSelectedRequest(null)
          }
          onOpenAttachment={
            handleAttachment
          }
        />
      )}

      {/* =====================================================
          نافذة تحديد تاريخ انتهاء وثيقة الخدمة
      ===================================================== */}

      {showApproveModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/5 dark:bg-[#0f1821]"
            dir="rtl"
          >
            {/* Header */}

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  الموافقة وإصدار الوثيقة
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  حدد تاريخ انتهاء صلاحية وثيقة الخدمة
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseApproveModal
                }
                disabled={
                  isActionLoading
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Date */}

            <div className="space-y-2">
              <label
                htmlFor="expires_at"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                تاريخ انتهاء الوثيقة
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                <input
                  id="expires_at"
                  type="date"
                  value={expiresAt}
                  min={getTodayDate()}
                  onChange={(event) => {
                    setExpiresAt(
                      event.target.value
                    );

                    if (event.target.value) {
                      setError("");
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-[#111c26] dark:text-slate-100"
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                سيتم إرسال التاريخ إلى الخادم
                بصيغة YYYY-MM-DD.
              </p>
            </div>

            {/* Buttons */}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={
                  handleApproveAndIssue
                }
                disabled={
                  isActionLoading ||
                  !expiresAt
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isActionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    <span>
                      جاري الإصدار...
                    </span>
                  </>
                ) : (
                  "موافقة وإصدار"
                )}
              </button>

              <button
                type="button"
                onClick={
                  handleCloseApproveModal
                }
                disabled={
                  isActionLoading
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#111c26] dark:text-slate-300 dark:hover:bg-white/5"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {isActionLoading &&
        !showApproveModal && (
          <div className="fixed bottom-5 left-5 z-[60] flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-xl dark:border-white/10 dark:bg-[#111c26] dark:text-slate-200">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />

            <span>
              جاري تنفيذ العملية...
            </span>
          </div>
        )}
    </div>
  );
}

export default ServiceRequestsPage;