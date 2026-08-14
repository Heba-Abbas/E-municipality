import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { getGovernorates } from "../../services/municipalitiesApi";

const initialForm = {
  name: "",
  address: "",
  phone: "",
  email: "",
  governorate_id: "",
};

function MunicipalityModal({
  isOpen,
  mode = "create",
  municipality = null,
  isSubmitting,
  onClose,
  onSubmit,
  errors = {},
}) {
  const [form, setForm] = useState(initialForm);
  const [governorates, setGovernorates] = useState([]);
  const [isGovLoading, setIsGovLoading] = useState(false);

  const getError = (field) => {
    const val = errors && errors[field];
    if (!val) return null;
    return Array.isArray(val) ? val[0] : val;
  };

  useEffect(() => {
    if (mode === "edit" && municipality) {
      setForm({
        name: municipality.name || "",
        address: municipality.address || "",
        phone: municipality.phone || "",
        email: municipality.email || "",
        governorate_id:
          municipality.governorate_id || municipality.governorate?.id || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [mode, municipality, isOpen]);

  // جلب المحافظات عند فتح النموذج
  useEffect(() => {
    const load = async () => {
      try {
        setIsGovLoading(true);
        const res = await getGovernorates();
        if (res && res.success) {
          setGovernorates(res.data || []);
        } else {
          setGovernorates([]);
        }
      } catch (err) {
        console.error("Get Governorates Error:", err);
        setGovernorates([]);
      } finally {
        setIsGovLoading(false);
      }
    };

    if (isOpen) load();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f1821]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              {mode === "edit" ? "تعديل البلدية" : "إضافة بلدية"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {mode === "edit"
                ? "تعديل بيانات البلدية"
                : "إضافة بلدية جديدة إلى النظام"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 p-6 sm:grid-cols-2">

            {/* الاسم */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                اسم البلدية
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="أدخل اسم البلدية"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500"
              />
                {getError('name') && <p className="mt-1.5 text-xs text-red-500">{getError('name')}</p>}
            </div>

            {/* الهاتف */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                رقم الهاتف
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="أدخل رقم الهاتف"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500"
              />
              {getError('phone') && <p className="mt-1.5 text-xs text-red-500">{getError('phone')}</p>}
            </div>

            {/* البريد */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                البريد الإلكتروني
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="example@municipality.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500"
              />
              {getError('email') && <p className="mt-1.5 text-xs text-red-500">{getError('email')}</p>}
            </div>

            {/* العنوان */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                العنوان
              </label>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="أدخل عنوان البلدية"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500"
              />
              {getError('address') && <p className="mt-1.5 text-xs text-red-500">{getError('address')}</p>}
            </div>

            {/* المحافظة */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                المحافظة
              </label>

              <select
                name="governorate_id"
                value={form.governorate_id}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500"
              >
                <option value="">اختر المحافظة</option>
                {isGovLoading ? (
                  <option value="">جارٍ التحميل...</option>
                ) : (
                  governorates.map((g) => (
                    <option key={g.id} value={g.id} className="dark:bg-[#121b24]">
                      {g.name}
                    </option>
                  ))
                )}
              </select>

              {getError('governorate_id') && (
                <p className="mt-1.5 text-xs text-red-500">{getError('governorate_id')}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:hover:bg-[#17212b]"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {mode === "edit" ? "حفظ التعديلات" : "إضافة البلدية"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MunicipalityModal;