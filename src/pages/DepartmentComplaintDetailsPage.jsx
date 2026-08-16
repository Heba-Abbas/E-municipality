import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Check, Loader2, MapPin, X } from "lucide-react";

import ComplaintStatusBadge from "../components/Complaints/ComplaintStatusBadge";
import DetailField from "../components/Complaints/DetailField";
import ResolveComplaintModal from "../components/Complaints/ResolveComplaintModal";
import RejectComplaintModal from "../components/Complaints/RejectComplaintModal";
import {
  getDepartmentComplaint,
  rejectDepartmentComplaint,
  resolveDepartmentComplaint,
  startDepartmentComplaint,
} from "../services/complaintsApi";
import { formatRelativeTime, getErrorMessage } from "../utils/complaintsUtils";


const complaintSteps = [
  { key: "forwarded_to_department", label: "محوّلة" },
  { key: "in_progress", label: "قيد التنفيذ" },
  { key: "resolved", label: "محلولة" },
];

function DepartmentComplaintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // ==========================================
  // 
  // GET /api/department-manager/complaints/{id}
  // ==========================================

  const loadComplaint = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getDepartmentComplaint(id);

      if (!response.success) {
        throw new Error(response.message || "Failed to load complaint");
      }

      setComplaint(response.data);
    } catch (err) {
      console.error("Get Department Complaint Error:", err);

      setError(getErrorMessage(err, "حدث خطأ أثناء جلب الشكوى"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  // ==========================================
  // الإجراءات
  // ==========================================

  const handleStart = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await startDepartmentComplaint(id);

      if (!response.success) {
        throw new Error(response.message || "Operation failed");
      }

      setSuccessMsg("تم بدء تنفيذ الشكوى بنجاح");

      await loadComplaint();
    } catch (err) {
      console.error("Start Complaint Error:", err);

      setError(getErrorMessage(err, "حدث خطأ أثناء بدء التنفيذ"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveConfirm = async (note) => {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await resolveDepartmentComplaint(id, note);

      if (!response.success) {
        throw new Error(response.message || "Operation failed");
      }

      setIsResolveOpen(false);
      setSuccessMsg("تم تحديث الشكوى كمحلولة بنجاح");

      await loadComplaint();
    } catch (err) {
      console.error("Resolve Complaint Error:", err);

      setError(getErrorMessage(err, "حدث خطأ أثناء تحديث الشكوى"));

      setIsResolveOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await rejectDepartmentComplaint(id);

      if (!response.success) {
        throw new Error(response.message || "Operation failed");
      }

      setIsRejectOpen(false);
      setSuccessMsg("تم رفض الشكوى بنجاح");

      await loadComplaint();
    } catch (err) {
      console.error("Reject Complaint Error:", err);

      setError(getErrorMessage(err, "حدث خطأ أثناء رفض الشكوى"));

      setIsRejectOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-md dark:border-white/5 dark:bg-[#0f1821]">
        <p className="text-slate-500 dark:text-slate-400">
          {error || "الشكوى غير موجودة"}
        </p>

        <button
          type="button"
          onClick={() => navigate("/dashboard/complaints/department")}
          className="mt-4 inline-flex h-[46px] items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-medium text-white transition hover:bg-emerald-600"
        >
          العودة لقائمة شكاوى القسم
        </button>
      </section>
    );
  }

  const currentStatus = complaint.current_status?.key;

  
  const isForwarded = currentStatus === "forwarded_to_department";
  const isInProgress = currentStatus === "in_progress";
  const isFinished = currentStatus === "resolved" || currentStatus === "rejected";

  
  const statusHistory = (complaint.reports || [])
    .flatMap((report) => report.status_history || [])
    .filter((entry) => entry.is_public)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* الهيدر */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/complaints/department")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
              شكوى القسم {complaint.id}
            </h1>

            <div className="mt-2">
              <ComplaintStatusBadge
                status={currentStatus}
                name={complaint.current_status?.name}
              />
            </div>
          </div>
        </div>

        {/* شريط مراحل المعالجة */}
        <ComplaintSteps currentStatus={currentStatus} />
      </section>

      {/* الرسائل */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          <span>{successMsg}</span>

          <button
            type="button"
            onClick={() => setSuccessMsg("")}
            className="shrink-0 text-emerald-700 transition hover:opacity-70 dark:text-emerald-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* التفاصيل */}
      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:p-6">
        {/* الفئة وعدد البلاغات */}
        <div className="grid gap-4 border-b border-slate-200 pb-5 sm:grid-cols-2 dark:border-white/10">
          <DetailField label="الفئة" value={complaint.category?.name} />

          <DetailField
            label="بلاغات مرتبطة"
            value={String(complaint.reports_count ?? 0)}
          />
        </div>

        {/* الوصف الموحّد */}
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
            الوصف الموحّد
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {complaint.canonical_description || "-"}
          </p>
        </div>

        {/* الموقع */}
        {complaint.text_location && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/5 dark:bg-[#121b24]">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {complaint.text_location}
            </p>

            <MapPin
              className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500"
              strokeWidth={1.8}
            />
          </div>
        )}

        {/* سجل الحالة */}
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
            سجل الحالة
          </h2>

          {statusHistory.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              لا يوجد سجل حالة
            </p>
          ) : (
            <div className="mt-2 space-y-2">
              {statusHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/5 dark:bg-[#121b24]"
                >
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {entry.note || entry.to_status?.name || "-"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formatRelativeTime(entry.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* الإجراءات — تتغير حسب حالة الشكوى */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row dark:border-white/10">
          {isForwarded && (
            <button
              type="button"
              onClick={handleStart}
              disabled={isSubmitting}
              className="inline-flex h-[46px] items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "جاري التنفيذ..." : "بدء التنفيذ"}
            </button>
          )}

          {isInProgress && (
            <button
              type="button"
              onClick={() => setIsResolveOpen(true)}
              disabled={isSubmitting}
              className="inline-flex h-[46px] items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              تحديث كمحلولة
            </button>
          )}

          {!isFinished && (
            <button
              type="button"
              onClick={() => setIsRejectOpen(true)}
              disabled={isSubmitting}
              className="inline-flex h-[46px] items-center justify-center rounded-xl bg-red-400 px-6 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              رفض
            </button>
          )}

          {isFinished && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              لا توجد إجراءات متاحة على هذه الشكوى
            </p>
          )}
        </div>
      </section>

      {/* النوافذ */}
      <ResolveComplaintModal
        isOpen={isResolveOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsResolveOpen(false)}
        onConfirm={handleResolveConfirm}
      />

      <RejectComplaintModal
        isOpen={isRejectOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}


function ComplaintSteps({ currentStatus }) {

  const currentIndex = complaintSteps.findIndex(
    (step) => step.key === currentStatus
  );

  return (
    <div className="mt-5 flex items-center">
      {complaintSteps.map((step, index) => {
        const isDone = currentIndex > index;
        const isCurrent = currentIndex === index;

        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            {/* الدائرة والنص */}
            <div className="flex flex-col items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  isDone || isCurrent
                    ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500"
                    : "border-slate-300 bg-white dark:border-white/20 dark:bg-transparent"
                }`}
              >
                {isDone && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>

              <span
                className={`text-xs ${
                  isDone || isCurrent
                    ? "font-semibold text-slate-800 dark:text-white"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* الخط الواصل بين المراحل */}
            {index < complaintSteps.length - 1 && (
              <div
                className={`mx-2 -mt-6 h-0.5 flex-1 ${
                  isDone
                    ? "bg-emerald-600 dark:bg-emerald-500"
                    : "bg-slate-200 dark:bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DepartmentComplaintDetailsPage;
