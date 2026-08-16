import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Loader2 } from "lucide-react";

import ManagerComplaintsTable from "../components/Complaints/ManagerComplaintsTable";
import { getDepartmentComplaints } from "../services/complaintsApi";
import { getErrorMessage } from "../utils/complaintsUtils";

function DepartmentComplaintsPage() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET /api/department-manager/complaints
  
  // ==========================================

  const loadComplaints = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getDepartmentComplaints();

      if (!response.success) {
        throw new Error(response.message || "Failed to load complaints");
      }

      setComplaints(response.data?.items || []);
    } catch (err) {
      console.error("Get Department Complaints Error:", err);

      setError(getErrorMessage(err, "حدث خطأ أثناء جلب شكاوى القسم"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleView = (id) => {
    navigate(`/dashboard/complaints/department/${id}`);
  };

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* الهيدر */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <ClipboardList className="h-5 w-5" strokeWidth={1.8} />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
              شكاوى قسمي
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {complaints.length} شكاوى مسندة لوحدتك
            </p>
          </div>
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
          <ManagerComplaintsTable
            complaints={complaints}
            onView={handleView}
          />
        )}
      </section>
    </div>
  );
}

export default DepartmentComplaintsPage;
