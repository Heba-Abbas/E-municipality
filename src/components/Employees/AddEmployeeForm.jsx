import { useState } from "react";
import { X, Plus } from "lucide-react";
import { employeeFilters } from "../../data/EmployeesData";

function AddEmployeeForm({ onClose, onAddEmployee }) {
  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    phone: "",
    email: "",
    municipalityId: "",
    hireDate: "",
    role: "",
    status: "مفعل",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    }

    if (!formData.nationalId.trim()) {
      newErrors.nationalId = "الرقم الوطني مطلوب";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    }

    if (!formData.municipalityId) {
      newErrors.municipalityId = "البلدية مطلوبة";
    }

    if (!formData.hireDate) {
      newErrors.hireDate = "تاريخ التوظيف مطلوب";
    }

    if (!formData.role) {
      newErrors.role = "الدور الوظيفي مطلوب";
    }

    if (!formData.status) {
      newErrors.status = "الحالة مطلوبة";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newEmployee = {
      id: Date.now(),
      jobTd: `EMP-${String(Date.now()).slice(-3)}`,
      ...formData,
    };

    onAddEmployee(newEmployee);
    onClose();
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500";

  const selectClass =
    "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-[#121b24] dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f1821]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              إضافة موظف جديد
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              أدخل بيانات الموظف الجديد
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 dark:border-white/10 dark:bg-[#121b24] dark:text-slate-400 dark:hover:bg-[#17212b]"
            title="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">

          <div className="grid gap-5 md:grid-cols-2">

            {/* الاسم الكامل */}
            <div>
              <label htmlFor="fullName" className={labelClass}>
                الاسم الكامل
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="أدخل الاسم الكامل"
                className={inputClass}
              />

              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* الرقم الوطني */}
            <div>
              <label htmlFor="nationalId" className={labelClass}>
                الرقم الوطني
              </label>

              <input
                id="nationalId"
                name="nationalId"
                type="text"
                value={formData.nationalId}
                onChange={handleChange}
                placeholder="أدخل الرقم الوطني"
                className={inputClass}
              />

              {errors.nationalId && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.nationalId}
                </p>
              )}
            </div>

            {/* رقم الهاتف */}
            <div>
              <label htmlFor="phone" className={labelClass}>
                رقم الهاتف
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="أدخل رقم الهاتف"
                className={inputClass}
              />

              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className={labelClass}>
                البريد الإلكتروني
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className={inputClass}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* البلدية */}
            <div>
              <label htmlFor="municipalityId" className={labelClass}>
                البلدية
              </label>

              <select
                id="municipalityId"
                name="municipalityId"
                value={formData.municipalityId}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="" className="dark:bg-[#121b24]">
                  اختر البلدية
                </option>

                <option value="MUN-001" className="dark:bg-[#121b24]">
                  MUN-001
                </option>

                <option value="MUN-002" className="dark:bg-[#121b24]">
                  MUN-002
                </option>

                <option value="MUN-003" className="dark:bg-[#121b24]">
                  MUN-003
                </option>

                <option value="MUN-004" className="dark:bg-[#121b24]">
                  MUN-004
                </option>

                <option value="MUN-005" className="dark:bg-[#121b24]">
                  MUN-005
                </option>

                <option value="MUN-006" className="dark:bg-[#121b24]">
                  MUN-006
                </option>
              </select>

              {errors.municipalityId && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.municipalityId}
                </p>
              )}
            </div>

            {/* تاريخ التوظيف */}
            <div>
              <label htmlFor="hireDate" className={labelClass}>
                تاريخ التوظيف
              </label>

              <input
                id="hireDate"
                name="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={handleChange}
                className={inputClass}
              />

              {errors.hireDate && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.hireDate}
                </p>
              )}
            </div>

            {/* الدور الوظيفي */}
            <div>
              <label htmlFor="role" className={labelClass}>
                الدور الوظيفي
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="" className="dark:bg-[#121b24]">
                  اختر الدور الوظيفي
                </option>

                {employeeFilters.rolesOptions.map((role) => (
                  <option
                    key={role}
                    value={role}
                    className="dark:bg-[#121b24]"
                  >
                    {role}
                  </option>
                ))}
              </select>

              {errors.role && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.role}
                </p>
              )}
            </div>

            {/* الحالة */}
            <div>
              <label htmlFor="status" className={labelClass}>
                الحالة
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={selectClass}
              >
                {employeeFilters.statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="dark:bg-[#121b24]"
                  >
                    {status}
                  </option>
                ))}
              </select>

              {errors.status && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.status}
                </p>
              )}
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-start dark:border-white/10">

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#121b24] dark:text-slate-200 dark:hover:bg-[#17212b]"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-600"
            >
              <Plus size={18} />
              إضافة الموظف
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployeeForm;