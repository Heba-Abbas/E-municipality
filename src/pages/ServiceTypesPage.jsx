import { useState } from "react";
import ServiceTypesHeader from "../components/ServiceTypes/ServiceTypesHeader";
import ServiceTypeForm from "../components/ServiceTypes/ServiceTypeForm";
import ServiceVersionForm from "../components/ServiceTypes/ServiceVersionForm";

function ServiceTypesPage() {
  const [showForm, setShowForm] = useState(false);
  const [createdServiceType, setCreatedServiceType] = useState(null);

  const handleAddServiceType = () => {
    setCreatedServiceType(null);
    setShowForm(true);
  };

  const handleServiceTypeCreated = (serviceType) => {
    console.log(
      "Service Type Data:",
      serviceType
    );

    setCreatedServiceType(serviceType);
  };

  const handleVersionCreated = (version) => {
    console.log(
      "Service Version Data:",
      version
    );

    alert("تم إنشاء المعاملة والنسخة بنجاح");

    setCreatedServiceType(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setCreatedServiceType(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4 lg:space-y-5">

      {/* Header */}
      <ServiceTypesHeader
        onAdd={handleAddServiceType}
      />

      {/* Create Service Type */}
      {showForm && !createdServiceType && (
        <ServiceTypeForm
          onSuccess={handleServiceTypeCreated}
          onCancel={handleCancel}
        />
      )}

      {/* Create Version */}
      {createdServiceType && (
        <ServiceVersionForm
          serviceType={createdServiceType}
          onSuccess={handleVersionCreated}
        />
      )}

      {/* Empty State */}
      {!showForm && !createdServiceType && (
        <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-md dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)]">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            لا توجد واجهة عرض لأن الـ API الحالي لا يوفر جلب أنواع المعاملات.
          </p>

          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            استخدم زر "إضافة معاملة" لإنشاء معاملة جديدة.
          </p>
        </section>
      )}

    </div>
  );
}

export default ServiceTypesPage;