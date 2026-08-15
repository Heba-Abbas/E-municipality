import { useState,useEffect } from "react";
import { Loader2, X } from "lucide-react";
import {getMunicipalities, createServiceType,} from "./../../services/serviceTypesApi";

function ServiceTypeForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    municipality_id: "",
    name: "",
    description: "",
    document_template_key: "",
    is_active: true,
  });
 const [municipalities, setMunicipalities] = useState([]);

const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      const payload = {
        municipality_id: Number(formData.municipality_id),
        name: formData.name.trim(),
        description: formData.description.trim(),
        document_template_key:
          formData.document_template_key.trim(),
        is_active: formData.is_active,
      };

      const response = await createServiceType(payload);

      console.log(
        "Service Type Created Successfully:",
        response
      );

      if (!response.success) {
        throw new Error(
          response.message || "فشل إنشاء نوع المعاملة"
        );
      }

      onSuccess(response.data);

    } catch (err) {
      console.error("Create Service Type Error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "حدث خطأ أثناء إنشاء المعاملة"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

useEffect(() => {
  const loadMunicipalities = async () => {
    try {
      setLoadingMunicipalities(true);

      const response = await getMunicipalities();

      console.log("Municipalities Response:", response);

      if (response.success) {
        setMunicipalities(response.data || []);
      }
    } catch (error) {
      console.error("Get Municipalities Error:", error);
    } finally {
      setLoadingMunicipalities(false);
    }
  };

  loadMunicipalities();
}, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            إضافة معاملة
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            أدخل البيانات الأساسية للمعاملة
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 md:grid-cols-2"
      >

        {/* البلدية */}
       <div>
  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
    البلدية
  </label>

  <select
  name="municipality_id"
  value={formData.municipality_id}
  onChange={handleChange}
  disabled={loadingMunicipalities}
  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#111c26] dark:text-slate-200"
>
  <option value="">
    {loadingMunicipalities
      ? "جاري تحميل البلديات..."
      : "اختر البلدية"}
  </option>

  {municipalities.map((municipality) => (
    <option
      key={municipality.id}
      value={municipality.id}
    >
      {municipality.name}
    </option>
  ))}
</select>
</div>
        {/* الاسم */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            اسم المعاملة
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="مثال: Building Permit"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white"
          />
        </div>

        {/* الوصف */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            الوصف
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="وصف المعاملة..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white"
          />
        </div>

        {/* Document Template Key */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            مفتاح قالب المستند
          </label>

          <input
            type="text"
            name="document_template_key"
            value={formData.document_template_key}
            onChange={handleChange}
            required
            placeholder="building_permit"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white"
          />
        </div>

        {/* الحالة */}
        <div className="flex items-end">
          <label className="flex h-[46px] w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 dark:border-white/10 dark:bg-[#121b24]">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 accent-emerald-500"
            />

            <span className="text-sm text-slate-700 dark:text-slate-300">
              المعاملة مفعّلة
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-start gap-3 pt-2 md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            إنشاء المعاملة
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="h-[46px] rounded-xl border border-slate-200 bg-white px-6 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:hover:bg-[#17212b]"
          >
            إلغاء
          </button>
        </div>

      </form>
    </section>
  );
}

export default ServiceTypeForm;