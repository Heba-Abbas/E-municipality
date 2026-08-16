import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Image as ImageIcon, Loader2, Map, X } from "lucide-react";

import ComplaintStatusBadge from "../components/Complaints/ComplaintStatusBadge";
import DetailField from "../components/Complaints/DetailField";
import RejectComplaintModal from "../components/Complaints/RejectComplaintModal";
import {
  createUnifiedComplaint,
  getComplaintReport,
  getSimilarComplaints,
  mergeComplaintReport,
  rejectComplaintReport,
} from "../services/complaintsApi";
import { formatDateTime, getErrorMessage } from "../utils/complaintsUtils";

function ComplaintReportDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [similarComplaints, setSimilarComplaints] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // ==========================================
  // جلب الشكاوى المشابهة
  // GET /technical-office/complaint-reports/{id}
  // GET /technical-office/complaint-reports/{id}/similar
  // ==========================================

  const loadReport = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getComplaintReport(id);

      if (!response.success) {
        throw new Error(response.message || "Failed to load report");
      }

      setReport(response.data);

      // الشكاوى المشابهة تأتي من نقطة منفصلة
      try {
        const similarResponse = await getSimilarComplaints(id);

        if (similarResponse.success) {
          setSimilarComplaints(similarResponse.data || []);
        }
      } catch (similarError) {
        // فشل الشكاوى المشابهة لا يمنع عرض البلاغ
        console.error("Get Similar Complaints Error:", similarError);
      }
    } catch (err) {
      console.error("Get Complaint Report Error:", err);

      setError(getErrorMessage(err, "حدث خطأ أثناء جلب البلاغ"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [id]);

  // ==========================================
  // توحيد البلاغ كشكوى جديدة
  // ==========================================

  const handleCreateUnified = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await createUnifiedComplaint(id);

      if (!response.success) {
        throw new Error(response.message || "Operation failed");
      }

      setSuccessMsg("تم توحيد البلاغ كشكوى جديدة بنجاح");

      navigate("/dashboard/complaints/unified");
    } catch (err) {
      console.error("Create Unified Error:", err);

      setError(getErrorMessage(err, "حدث خطأ أثناء توحيد البلاغ"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // دمج البلاغ مع شكوى موحّدة موجودة
  // ==========================================

  const handleMerge = async (complaintId) => {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await mergeComplaintReport(id, complaintId);

      if (!response.success) {
        throw new Error(response.message || "Operation failed");
      }

      setSuccessMsg("تم دمج البلاغ مع الشكوى بنجاح");

      navigate("/dashboard/complaints/reports");
    } catch (err) {
      console.error("Merge Report Error:", err);

      setError(getErrorMessage(err, "حدث خطأ أثناء الدمج"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // رفض البلاغ
  // ==========================================

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await rejectComplaintReport(id);

      if (!response.success) {
        throw new Error(response.message || "Operation failed");
      }

      setIsRejectOpen(false);

      navigate("/dashboard/complaints/reports");
    } catch (err) {
      console.error("Reject Report Error:", err);

      setError(getErrorMessage(err, "حدث خطأ أثناء رفض البلاغ"));

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

  if (!report) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-md dark:border-white/5 dark:bg-[#0f1821]">
        <p className="text-slate-500 dark:text-slate-400">
          {error || "البلاغ غير موجود"}
        </p>

        <button
          type="button"
          onClick={() => navigate("/dashboard/complaints/reports")}
          className="mt-4 inline-flex h-[46px] items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-medium text-white transition hover:bg-emerald-600"
        >
          العودة لقائمة الشكاوي
        </button>
      </section>
    );
  }

  const images = report.images || [];

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* الهيدر */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/complaints/reports")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
              تفاصيل البلاغ {report.id}
            </h1>

            <div className="mt-2">
              <ComplaintStatusBadge
                status={report.status?.key}
                name={report.status?.name}
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

      {/* تفاصيل البلاغ */}
      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:p-6">
        {/* الفئة وتاريخ الإرسال */}
        <div className="grid gap-4 border-b border-slate-200 pb-5 sm:grid-cols-2 dark:border-white/10">
          <DetailField label="الفئة" value={report.category?.name} />

          <DetailField
            label="تاريخ الإرسال"
            value={formatDateTime(report.submitted_at)}
          />
        </div>

        {/* الوصف */}
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
            الوصف
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {report.description || "-"}
          </p>
        </div>

        {/* الموقع */}
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
            الموقع
          </h2>

          <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/5 dark:bg-[#121b24]">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {report.text_location || "-"}
              </p>

              {report.latitude && report.longitude && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {report.latitude}, {report.longitude}
                </p>
              )}
            </div>

            <Map
              className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500"
              strokeWidth={1.8}
            />
          </div>
        </div>

        {/* الصور المرفقة */}
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
            الصور المرفقة ({images.length})
          </h2>

          {images.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              لا توجد صور مرفقة
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-3">
              {images.map((image) => (
                <a
                  key={image.id}
                  href={image.view_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-24 w-28 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/5 dark:bg-[#121b24]"
                >
                  {image.view_url ? (
                    <img
                      src={image.view_url}
                      alt={image.original_name || "صورة البلاغ"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon
                      className="h-6 w-6 text-slate-400 dark:text-slate-500"
                      strokeWidth={1.8}
                    />
                  )}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* شكاوى مشابهة محتملة */}
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
            شكاوى مشابهة محتملة (كشف تلقائي)
          </h2>

          {similarComplaints.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              لا توجد شكاوى مشابهة
            </p>
          ) : (
            <div className="mt-2 space-y-3">
              {similarComplaints.map((similar) => (
                <div
                  key={similar.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-[#121b24]"
                >
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {similar.title || `شكوى ${similar.id}`}
                      {similar.distance_meters != null &&
                        ` — ≈ ${similar.distance_meters} متر`}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {similar.category?.name} · {similar.text_location}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMerge(similar.id)}
                    disabled={isSubmitting}
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-[#0f1821] dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    دمج بهذه
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* الإجراءات */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row dark:border-white/10">
          <button
            type="button"
            onClick={handleCreateUnified}
            disabled={isSubmitting}
            className="inline-flex h-[46px] items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "جاري التنفيذ..." : "توحيد كشكوى جديدة"}
          </button>

          <button
            type="button"
            onClick={() => setIsRejectOpen(true)}
            disabled={isSubmitting}
            className="inline-flex h-[46px] items-center justify-center rounded-xl bg-red-400 px-6 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            رفض البلاغ
          </button>
        </div>
      </section>

      {/* نافذة الرفض */}
      <RejectComplaintModal
        isOpen={isRejectOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleReject}
      />
    </div>
  );
}

export default ComplaintReportDetailsPage;
