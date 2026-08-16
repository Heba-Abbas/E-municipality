import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  Loader2,
} from "lucide-react";

import ServiceTypesHeader from "../components/ServiceTypes/ServiceTypesHeader";
import ServiceTypeForm from "../components/ServiceTypes/ServiceTypeForm";
import ServiceVersionForm from "../components/ServiceTypes/ServiceVersionForm";
import ServiceTypeTable from "./../components/ServiceTypes/ServiceTypesTable";

import { getServiceTypes } from "../services/serviceTypesApi";

function ServiceTypesPage() {
  // =====================================================
  // إضافة نوع معاملة
  // =====================================================

  const [showForm, setShowForm] = useState(false);

  const [createdServiceType, setCreatedServiceType] =
    useState(null);

  // =====================================================
  // أنواع المعاملات
  // =====================================================

  const [serviceTypes, setServiceTypes] =
    useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const [currentPage, setCurrentPage] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // إضافة معاملة
  // =====================================================

  const handleAddServiceType = () => {
    setCreatedServiceType(null);
    setShowForm(true);
  };

  // =====================================================
  // بعد إنشاء نوع المعاملة
  // =====================================================

  const handleServiceTypeCreated = (
    serviceType
  ) => {
    console.log(
      "Service Type Data:",
      serviceType
    );

    setCreatedServiceType(serviceType);
  };

  // =====================================================
  // بعد إنشاء النسخة
  // =====================================================

  const handleVersionCreated = (version) => {
    console.log(
      "Service Version Data:",
      version
    );

    alert(
      "تم إنشاء المعاملة والنسخة بنجاح"
    );

    setCreatedServiceType(null);
    setShowForm(false);

    // إعادة جلب البيانات حتى تظهر المعاملة
    // الجديدة مباشرة في الجدول
    loadServiceTypes();
  };

  // =====================================================
  // إلغاء
  // =====================================================

  const handleCancel = () => {
    setCreatedServiceType(null);
    setShowForm(false);
  };

  // =====================================================
  // جلب أنواع المعاملات
  // =====================================================

  const loadServiceTypes = useCallback(
    async () => {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await getServiceTypes(
            currentPage
          );

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "تعذر جلب أنواع المعاملات"
          );
        }

        // -------------------------------------------------
        // البيانات
        // -------------------------------------------------

        setServiceTypes(
          response.data?.items || []
        );

        // -------------------------------------------------
        // Pagination
        // -------------------------------------------------

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
          "Get Service Types Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "حدث خطأ أثناء جلب أنواع المعاملات"
        );

        setServiceTypes([]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage]
  );

  // =====================================================
  // تحميل البيانات عند فتح الصفحة
  // =====================================================

  useEffect(() => {
    loadServiceTypes();
  }, [loadServiceTypes]);

  return (
    <div
      className="space-y-4 lg:space-y-5"
      dir="rtl"
    >
      {/* =================================================
          Header
      ================================================= */}

      <ServiceTypesHeader
        onAdd={handleAddServiceType}
      />

      {/* =================================================
          Error
      ================================================= */}

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

      {/* =================================================
          Create Service Type
      ================================================= */}

      {showForm &&
        !createdServiceType && (
          <ServiceTypeForm
            onSuccess={
              handleServiceTypeCreated
            }
            onCancel={handleCancel}
          />
        )}

      {/* =================================================
          Create Version
      ================================================= */}

      {createdServiceType && (
        <ServiceVersionForm
          serviceType={createdServiceType}
          onSuccess={handleVersionCreated}
        />
      )}

      {/* =================================================
          Service Types Table
      ================================================= */}

      {!showForm &&
        !createdServiceType && (
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:p-5">
            {/* Header داخل الجدول */}

            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  أنواع المعاملات
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  إدارة أنواع المعاملات والنسخ الفعالة
                </p>
              </div>

              {!isLoading && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-300">
                  {pagination.total || 0} معاملة
                </div>
              )}
            </div>

            {/* Loading */}

            {isLoading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />

                  جاري تحميل أنواع المعاملات...
                </div>
              </div>
            ) : (
              <>
                <ServiceTypeTable
                  serviceTypes={serviceTypes}
                />

                {/* =================================================
                    Pagination
                ================================================= */}

                {pagination.last_page > 1 && (
                  <div className="mt-5 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={
                        currentPage === 1
                      }
                      onClick={() =>
                        setCurrentPage(
                          (prev) =>
                            Math.max(
                              1,
                              prev - 1
                            )
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#111c26] dark:text-slate-300 dark:hover:bg-white/5"
                    >
                      السابق
                    </button>

                    <span className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white">
                      {currentPage}
                    </span>

                    <button
                      type="button"
                      disabled={
                        currentPage ===
                        pagination.last_page
                      }
                      onClick={() =>
                        setCurrentPage(
                          (prev) =>
                            Math.min(
                              pagination.last_page,
                              prev + 1
                            )
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#111c26] dark:text-slate-300 dark:hover:bg-white/5"
                    >
                      التالي
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
    </div>
  );
}

export default ServiceTypesPage;