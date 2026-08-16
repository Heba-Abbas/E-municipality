import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";

import ComplaintsTabs from "../components/Complaints/ComplaintsTabs";
import ComplaintReportsTable from "../components/Complaints/ComplaintReportsTable";
import { getComplaintReports } from "../services/complaintsApi";
import { getErrorMessage } from "../utils/complaintsUtils";

function ComplaintReportsPage() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // 
  // GET /api/technical-office/complaint-reports
  // ==========================================

  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getComplaintReports();

      if (!response.success) {
        throw new Error(response.message || "Failed to load reports");
      }

      setReports(response.data?.items || []);
    } catch (err) {
      console.error("Get Complaint Reports Error:", err);

      setError(getErrorMessage(err, "حدث خطأ أثناء جلب البلاغات"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleView = (id) => {
    navigate(`/dashboard/complaints/reports/${id}`);
  };

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* الهيدر والتبويبات */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* العنوان */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <AlertTriangle className="h-5 w-5" strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                البلاغات الواردة
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {reports.length} بلاغات بانتظار مراجعة المكتب الفني 
               
              </p>
            </div>
          </div>

          {/* التبويبات */}
          <ComplaintsTabs reportsCount={reports.length} />
        </div>
      </section>

      {/* رسالة الخطأ */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      {/* الجدول */}
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:p-5">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        ) : (
          <ComplaintReportsTable reports={reports} onView={handleView} />
        )}
      </section>
    </div>
  );
}

export default ComplaintReportsPage;
