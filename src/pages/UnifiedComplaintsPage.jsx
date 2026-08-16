import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Loader2 } from "lucide-react";

import ComplaintsTabs from "../components/Complaints/ComplaintsTabs";
import UnifiedComplaintsFilters from "../components/Complaints/UnifiedComplaintsFilters";
import UnifiedComplaintsTable from "../components/Complaints/UnifiedComplaintsTable";
import {
  getComplaintCategories,
  getUnifiedComplaints,
  getWorkUnits,
} from "../services/complaintsApi";
import { getErrorMessage } from "../utils/complaintsUtils";

function UnifiedComplaintsPage() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [workUnits, setWorkUnits] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  //
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [workUnitFilter, setWorkUnitFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ==========================================
  // جلب الفئات ووحدات العمل (لقوائم الفلاتر)
  // ==========================================

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [categoriesResponse, workUnitsResponse] = await Promise.all([
          getComplaintCategories(),
          getWorkUnits(),
        ]);

        if (categoriesResponse?.success) {
          setCategories(categoriesResponse.data || []);
        }

        if (workUnitsResponse?.success) {
          setWorkUnits(workUnitsResponse.data?.items || workUnitsResponse.data || []);
        }
      } catch (err) {
        // فشل قوائم الفلاتر لا يمنع عرض الجدول
        console.error("Get Filter Options Error:", err);
      }
    };

    loadFilterOptions();
  }, []);

  // ==========================================
  // 
  // GET /api/unified-complaints
  // ==========================================

  useEffect(() => {
  
    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");

        const filters = {};

        if (search.trim()) filters.search = search.trim();
        if (statusFilter) filters.status = statusFilter;
        if (categoryFilter) filters.category_id = categoryFilter;
        if (workUnitFilter) filters.work_unit_id = workUnitFilter;
        if (dateFrom) filters.date_from = dateFrom;
        if (dateTo) filters.date_to = dateTo;

        const response = await getUnifiedComplaints(filters);

        if (!response.success) {
          throw new Error(response.message || "Failed to load complaints");
        }

        setComplaints(response.data?.items || []);
      } catch (err) {
        console.error("Get Unified Complaints Error:", err);

        setError(getErrorMessage(err, "حدث خطأ أثناء جلب الشكاوى الموحّدة"));
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, statusFilter, categoryFilter, workUnitFilter, dateFrom, dateTo]);

  const handleView = (id) => {
    navigate(`/dashboard/complaints/unified/${id}`);
  };

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* الهيدر والتبويبات */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* العنوان */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <ClipboardList className="h-5 w-5" strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                الشكاوى الموحّدة
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                الشكاوى الناتجة عن توحيد البلاغات المتشابهة
              </p>
            </div>
          </div>

          {/* التبويبات */}
          <ComplaintsTabs unifiedCount={complaints.length} />
        </div>
      </section>

      {/* الفلاتر */}
      <UnifiedComplaintsFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        workUnitFilter={workUnitFilter}
        setWorkUnitFilter={setWorkUnitFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        categories={categories}
        workUnits={workUnits}
        resultsCount={complaints.length}
      />

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
          <UnifiedComplaintsTable
            complaints={complaints}
            onView={handleView}
          />
        )}
      </section>
    </div>
  );
}

export default UnifiedComplaintsPage;
