import { useState } from "react";
import { X, Plus } from "lucide-react";
import { citizenFilters } from "../../data/citizensData";

function AddCitizenForm({ onClose, onAddCitizen }) {
  const [formData, setFormData] = useState({
    nationalId: "",
    fullName: "",
    phone: "",
    email: "",
    birthPlace: "",
    birthDate: "",
    municipality: "",
    city: "",
    maritalStatus: "",
    citizenStats: "مفعل",
    fileName: "",
    fileSize: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب";
    if (!formData.nationalId.trim()) newErrors.nationalId = "الرقم الوطني مطلوب";
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    if (!formData.municipality) newErrors.municipality = "البلدية مطلوبة";
    if (!formData.city) newErrors.city = "الحي مطلوب";
    if (!formData.birthDate) newErrors.birthDate = "تاريخ الميلاد مطلوب";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newCitizen = {
      id: Date.now(),
      ...formData,
    };

    onAddCitizen(newCitizen);
    onClose();
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500";

  const selectClass =
    "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-[#121b24] dark:text-white";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f1821]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">إضافة مواطن جديد</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">أدخل بيانات المواطن الجديد</p>
          </div>

          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 dark:border-white/10 dark:bg-[#121b24] dark:text-slate-400 dark:hover:bg-[#17212b]" title="إغلاق">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="fullName" className={labelClass}>الاسم الكامل</label>
              <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} placeholder="أدخل الاسم الكامل" className={inputClass} />
              {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="nationalId" className={labelClass}>الرقم الوطني</label>
              <input id="nationalId" name="nationalId" type="text" value={formData.nationalId} onChange={handleChange} placeholder="أدخل الرقم الوطني" className={inputClass} />
              {errors.nationalId && <p className="mt-1.5 text-xs text-red-500">{errors.nationalId}</p>}
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>رقم الهاتف</label>
              <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="أدخل رقم الهاتف" className={inputClass} />
              {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>البريد الإلكتروني</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" className={inputClass} />
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="birthPlace" className={labelClass}>مكان الميلاد</label>
              <input id="birthPlace" name="birthPlace" type="text" value={formData.birthPlace} onChange={handleChange} placeholder="مكان الميلاد" className={inputClass} />
            </div>

            <div>
              <label htmlFor="birthDate" className={labelClass}>تاريخ الميلاد</label>
              <input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} className={inputClass} />
              {errors.birthDate && <p className="mt-1.5 text-xs text-red-500">{errors.birthDate}</p>}
            </div>

            <div>
              <label htmlFor="municipality" className={labelClass}>البلدية</label>
              <select id="municipality" name="municipality" value={formData.municipality} onChange={handleChange} className={selectClass}>
                <option value="">اختر البلدية</option>
                {citizenFilters.municipalityOptions.map((m) => (
                  <option key={m} value={m} className="dark:bg-[#121b24]">{m}</option>
                ))}
              </select>
              {errors.municipality && <p className="mt-1.5 text-xs text-red-500">{errors.municipality}</p>}
            </div>

            <div>
              <label htmlFor="city" className={labelClass}>الحي</label>
              <select id="city" name="city" value={formData.city} onChange={handleChange} className={selectClass}>
                <option value="">اختر الحي</option>
                {citizenFilters.cityOptions.map((c) => (
                  <option key={c} value={c} className="dark:bg-[#121b24]">{c}</option>
                ))}
              </select>
              {errors.city && <p className="mt-1.5 text-xs text-red-500">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="maritalStatus" className={labelClass}>الحالة الاجتماعية</label>
              <select id="maritalStatus" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={selectClass}>
                <option value="">اختر الحالة</option>
                {citizenFilters.statusOptions.filter(s => s !== 'الكل').map((s) => (
                  <option key={s} value={s} className="dark:bg-[#121b24]">{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="citizenStats" className={labelClass}>حالة السجل</label>
              <select id="citizenStats" name="citizenStats" value={formData.citizenStats} onChange={handleChange} className={selectClass}>
                <option value="مفعل">مفعل</option>
                <option value="مجمد">مجمد</option>
              </select>
            </div>

          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-start dark:border-white/10">
            <button type="button" onClick={onClose} className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#121b24] dark:text-slate-200 dark:hover:bg-[#17212b]">إلغاء</button>

            <button type="submit" className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-600">
              <Plus size={18} /> إضافة مواطن
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCitizenForm;
