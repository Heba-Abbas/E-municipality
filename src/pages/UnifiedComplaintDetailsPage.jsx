import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Loader2, X } from "lucide-react";

import ComplaintStatusBadge from "../components/Complaints/ComplaintStatusBadge";
import DetailField from "../components/Complaints/DetailField";
import AssignWorkUnitsModal from "../components/Complaints/AssignWorkUnitsModal";
import RejectComplaintModal from "../components/Complaints/RejectComplaintModal";
import {
  assignWorkUnits,
  getUnifiedComplaints,
  getWorkUnits,
  rejectUnifiedComplaint,
} from "../services/complaintsApi";
import { getErrorMessage } from "../utils/complaintsUtils";

function UnifiedComplaintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [workUnits, setWorkUnits] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // ==========================================
    

  const loadComplaint = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getUnifiedComplaints({ per_page: 50 });

      if (!response.success) {
        throw new Error(response.message || "Failed to load complaint");
      }

      const items = response.data?.items || [];
      const found = items.find((item) => String(item.id) === String(id));

      setComplaint(found || null);
    } catch (err) {
      console.error("Get Unified Complaint Error:", err);

      setError(getErrorMessage(err, "حدث خطأ أثناء جلب الشكوى"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  // جلب وحدات العمل لنافذة التعيين
  useEffect(() => {
    const loadWorkUnits = async () => {
      try {
        const response = await getWorkUnits();

        if (response?.success) {
          setWorkUnits(response.data?.items || response.data || []);
        }
      } catch (err) {
        console.error("Get Work Units Error:", err);
      }
    };

    loadWorkUnits();
  }, []);

  // ==========================================
  //
  // POST /technical-office/complaints/{id}/assign-work-units
  // ==========================================

  const handleAssignConfirm = async (workUnitIds, note) => {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await assignWorkUnits(id, workUnitIds, note);

      if (!response.success) {
        throw new Error(response.message || "Operation failed");
      }

      setIsAssignOpen(false);
      setSuccessMsg("تم إسناد الشكوى للقسم بنجاح");

      await loadComplaint();
    } catch (err) {
      console.error("Assign Work Units Error:", err);

      setError(getErrorMessage(err, "حدث خطأ أثناء إسناد الشكوى"));

      setIsAssignOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // رفض الشكوى الموحّدة
  // ==========================================

  const handleRejectConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await rejectUnifiedComplaint(id);

      if (!response.success) {
        throw new Error(response.message || "Operation failed");
      }

      setIsRejectOpen(false);
      setSuccessMsg("تم رفض الشكوى بنجاح");

      await loadComplaint();
    } catch (err) {
      console.error("Reject Unified Complaint Error:", err);

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
          onClick={() => navigate("/dashboard/complaints/unified")}
          className="mt-4 inline-flex h-[46px] items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-medium text-white transition hover:bg-emerald-600"
        >
          العودة لقائمة الشكاوى الموحّدة
        </button>
      </section>
    );
  }

  const assignedWorkUnits = complaint.work_units || [];

  const canReject = complaint.current_status?.key === "under_review";

  // البلاغات المرتبطة لا يرسلها الـ API حالياً بقائمة الشكاوى الموحّدة，
//بدي راجع هي النقطة  
  const relatedReports = complaint.reports || [];

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* الهيدر */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/complaints/unified")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
              الشكوى الموحّدة {complaint.id}
            </h1>

            <div className="mt-2">
              <ComplaintStatusBadge
                status={complaint.current_status?.key}
                name={complaint.current_status?.name}
              />
            </div>
          </div>
        </div>
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
            label="عدد البلاغات المرتبطة"
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
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/5 dark:bg-[#121b24]">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {complaint.text_location}
            </p>
          </div>
        )}

        {/* البلاغات المرتبطة — تظهر فقط عند إرسالها من الـ API */}
        {relatedReports.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
              البلاغات المرتبطة ({relatedReports.length})
            </h2>

            <div className="mt-2 space-y-2">
              {relatedReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/5 dark:bg-[#121b24]"
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {report.title || report.id}
                  </span>

                  <ComplaintStatusBadge
                    status={report.current_status?.key}
                    name={report.current_status?.name}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* وحدة العمل المسندة */}
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
            وحدة العمل المسندة
          </h2>

          {assignedWorkUnits.length > 0 ? (
            <div className="mt-2 space-y-2">
              {assignedWorkUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 dark:border-white/5 dark:bg-[#121b24] dark:text-slate-100"
                >
                  {unit.name}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              غير مسندة بعد — الإجراء التالي مطلوب ↓
            </div>
          )}
        </div>

        {/* الإجراءات */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row dark:border-white/10">
          <button
            type="button"
            onClick={() => setIsAssignOpen(true)}
            disabled={isSubmitting}
            className="inline-flex h-[46px] items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            تعيين وحدة عمل
          </button>

          {canReject && (
            <button
              type="button"
              onClick={() => setIsRejectOpen(true)}
              disabled={isSubmitting}
              className="inline-flex h-[46px] items-center justify-center rounded-xl bg-red-400 px-6 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              رفض الشكوى
            </button>
          )}
        </div>
      </section>

      {/* النوافذ */}
      <AssignWorkUnitsModal
        isOpen={isAssignOpen}
        workUnits={workUnits}
        isSubmitting={isSubmitting}
        onClose={() => setIsAssignOpen(false)}
        onConfirm={handleAssignConfirm}
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

export default UnifiedComplaintDetailsPage;
