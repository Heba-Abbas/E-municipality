import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import MunicipalitiesHeader from "../components/Municipalities/MunicipalityHeader";
import MunicipalitiesTable from "../components/Municipalities/MunicipalitiesTable";
import MunicipalityModal from "../components/Municipalities/MunicipalityModal";
import MunicipalityViewModal from "../components/Municipalities/MunicipalityViewModal";

import {
  activateMunicipality,
  createMunicipality,
  deactivateMunicipality,
  getMunicipalities,
  getMunicipality,
  updateMunicipality,
  getGovernorates,
  getGovernorateMunicipalities,
} from "../services/municipalitiesApi";

function MunicipalitiesPage() {
  const [municipalities, setMunicipalities] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // إضافة / تعديل
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedMunicipality, setSelectedMunicipality] =
    useState(null);

  // عرض
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewMunicipality, setViewMunicipality] =
    useState(null);
  const [isViewLoading, setIsViewLoading] = useState(false);

  // ==========================================
  // جلب البلديات
  // ==========================================

  const [governorates, setGovernorates] = useState([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [isGovFilterLoading, setIsGovFilterLoading] = useState(false);

  const loadMunicipalities = async (govId = null) => {
    try {
      setIsLoading(true);
      setError("");

      let response;

      if (govId) {
        response = await getGovernorateMunicipalities(govId);
      } else {
        response = await getMunicipalities();
      }

      // Normalize different API shapes:
      // - Some endpoints return { success, data }
      // - Some endpoints return the array directly
      let data = [];

      if (response == null) {
        data = [];
      } else if (response.success === true) {
        data = response.data || [];
      } else if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else {
        // Unknown shape: throw to surface error
        throw new Error(response.message || "Failed to load municipalities");
      }

      setMunicipalities(data || []);
    } catch (err) {
      console.error("Get Municipalities Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "حدث خطأ أثناء جلب البلديات"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // load governorates for filter and initial municipalities
    const init = async () => {
      try {
        setIsGovFilterLoading(true);
        const res = await getGovernorates();
        // governorates endpoint may return either array or wrapped object
        if (!res) {
          setGovernorates([]);
        } else if (res.success === true) {
          setGovernorates(res.data || []);
        } else if (Array.isArray(res)) {
          setGovernorates(res || []);
        } else if (res.data && Array.isArray(res.data)) {
          setGovernorates(res.data || []);
        }
      } catch (err) {
        console.error("Get Governorates Error:", err);
      } finally {
        setIsGovFilterLoading(false);
      }
      await loadMunicipalities();
    };

    init();
  }, []);

  // ==========================================
  // فتح إضافة
  // ==========================================

  const handleAdd = () => {
    setFormMode("create");
    setSelectedMunicipality(null);
    setFormErrors({});
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // ==========================================
  // تغيير فلتر المحافظة
  // ==========================================

  const handleGovernorateFilter = async (govId) => {
    try {
      setSelectedGovernorate(govId);
      await loadMunicipalities(govId || null);
    } catch (err) {
      console.error("Governorate Filter Error:", err);
    }
  };

  // ==========================================
  // فتح تعديل
  // ==========================================

  const handleEdit = (municipality) => {
    setFormMode("edit");
    setSelectedMunicipality(municipality);
    setFormErrors({});
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // ==========================================
  // إضافة / تعديل
  // ==========================================

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError("");
      setFormErrors({});

      let response;

      if (formMode === "edit") {
        response = await updateMunicipality(
          selectedMunicipality.id,
          formData
        );
      } else {
        response = await createMunicipality(formData);
      }

      if (!(response.success === true || response.status === 201)) {
        throw new Error(
          response.message || "Operation failed"
        );
      }

      // success
      setSuccessMsg(response.message || "تمت العملية بنجاح");

      setIsFormOpen(false);
      setSelectedMunicipality(null);
      setFormErrors({});

      await loadMunicipalities();
    } catch (err) {
  console.error("Municipality Save Error:", err);
  console.error("Status:", err.response?.status);
  console.error("Response:", err.response?.data);
  console.error("Request:", err.config?.data);

  if (err.response?.status === 422) {
    setFormErrors(err.response.data?.errors || {});
    setError(
      err.response.data?.message ||
      "يوجد أخطاء في الحقول"
    );
  } else {
    setError(
      err.response?.data?.message ||
      err.message ||
      "حدث خطأ أثناء حفظ البيانات"
    );
  }
} finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // عرض البلدية
  // ==========================================

  const handleView = async (id) => {
    try {
      setIsViewOpen(true);
      setIsViewLoading(true);
      setViewMunicipality(null);
      setError("");

      const response = await getMunicipality(id);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to load municipality"
        );
      }

      setViewMunicipality(response.data);
    } catch (err) {
      console.error("Get Municipality Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "حدث خطأ أثناء جلب بيانات البلدية"
      );

      setIsViewOpen(false);
    } finally {
      setIsViewLoading(false);
    }
  };

  // ==========================================
  // تفعيل / إلغاء تفعيل
  // ==========================================

  const handleToggleStatus = async (municipality) => {
    try {
      setError("");

      let response;

      if (municipality.status) {
        response = await deactivateMunicipality(
          municipality.id
        );
      } else {
        response = await activateMunicipality(
          municipality.id
        );
      }

      if (!response.success) {
        throw new Error(
          response.message || "Status update failed"
        );
      }

      await loadMunicipalities();
    } catch (err) {
      console.error("Municipality Status Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "حدث خطأ أثناء تغيير حالة البلدية"
      );
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

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-4 lg:space-y-5">

      {/* Header */}
      <MunicipalitiesHeader
        totalRows={municipalities.length}
        onAdd={handleAdd}
        governorates={governorates}
        selectedGovernorate={selectedGovernorate}
        onGovernorateChange={handleGovernorateFilter}
        isGovLoading={isGovFilterLoading}
      />

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Success */}
      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          {successMsg}
        </div>
      )}

      {/* Table */}
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:p-5">

        <MunicipalitiesTable
          municipalities={municipalities}
          totalFilteredCount={municipalities.length}
          onView={handleView}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />

      </section>

      {/* Add / Edit Modal */}
      <MunicipalityModal
        isOpen={isFormOpen}
        mode={formMode}
        municipality={selectedMunicipality}
        isSubmitting={isSubmitting}
        errors={formErrors}
        onClose={() => {
          if (!isSubmitting) {
            setIsFormOpen(false);
            setSelectedMunicipality(null);
          }
        }}
        onSubmit={handleSubmit}
      />

      {/* View Modal */}
      <MunicipalityViewModal
        isOpen={isViewOpen}
        municipality={viewMunicipality}
        isLoading={isViewLoading}
        onClose={() => {
          setIsViewOpen(false);
          setViewMunicipality(null);
        }}
      />
    </div>
  );
}

export default MunicipalitiesPage;