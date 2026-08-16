import { useEffect, useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";

import { getRoles } from "../../services/rolesPermissionsApi";
import { getMunicipalities } from "../../services/municipalitiesApi";
import { registerEmployee } from "../../services/employeesApi";

function AddEmployeeForm({ onClose, onAddEmployee }) {
  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    municipalityId: "",
    hireDate: "",
    role: "",
    status: "active",
  });

  const [roles, setRoles] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] =
    useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // =====================================================
  // جلب الأدوار والبلديات عند فتح الفورم
  // =====================================================

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setIsLoadingRoles(true);
        setIsLoadingMunicipalities(true);

        const [rolesResponse, municipalitiesResponse] =
          await Promise.all([
            getRoles(),
            getMunicipalities(),
          ]);

        // الأدوار
        if (rolesResponse?.success) {
          setRoles(rolesResponse.data || []);
        }

        // البلديات
        if (municipalitiesResponse?.success) {
          setMunicipalities(municipalitiesResponse.data || []);
        }
      } catch (error) {
        console.error("Load Add Employee Form Data Error:", error);

        setSubmitError(
          error.response?.data?.message ||
            "تعذر تحميل بيانات الأدوار والبلديات"
        );
      } finally {
        setIsLoadingRoles(false);
        setIsLoadingMunicipalities(false);
      }
    };

    loadFormData();
  }, []);

  // =====================================================
  // تغيير الحقول
  // =====================================================

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

    setSubmitError("");
  };

  // =====================================================
  // Validation
  // =====================================================

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

    // كلمة المرور
    if (!formData.password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "كلمة المرور يجب أن تكون 8 محارف على الأقل";
    }

    // تأكيد كلمة المرور
    if (!formData.password_confirmation.trim()) {
      newErrors.password_confirmation =
        "تأكيد كلمة المرور مطلوب";
    } else if (
      formData.password !== formData.password_confirmation
    ) {
      newErrors.password_confirmation =
        "تأكيد كلمة المرور غير مطابق";
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

  // =====================================================
  // إرسال الموظف للـ API
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // =================================================
      // Payload المطلوب من Backend
      // تم إضافة password_confirmation لحل خطأ 422
      // =================================================

      const payload = {
        full_name: formData.fullName.trim(),
        national_id: formData.nationalId.trim(),
        phone_number: formData.phone.trim(),
        email: formData.email.trim(),

        password: formData.password,

        // مهم جداً:
        // Laravel يتحقق أن هذه القيمة مطابقة لكلمة المرور
        password_confirmation:
          formData.password_confirmation,

        municipality_id: Number(formData.municipalityId),
        hire_date: formData.hireDate,
        role: formData.role,
        status: formData.status,
      };

      console.log("Register Employee Payload:", payload);

      const response = await registerEmployee(payload);

      console.log("Register Employee Success:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "فشل إنشاء حساب الموظف"
        );
      }

      // =================================================
      // أخذ الموظف الحقيقي من Backend
      // =================================================

      const createdUser = response?.data?.user;
      const employeeProfile = createdUser?.employee_profile;

      const newEmployee = {
        id: createdUser?.id,

        jobTd: employeeProfile?.id
          ? `EMP-${employeeProfile.id}`
          : "-",

        fullName:
          createdUser?.full_name ||
          formData.fullName,

        nationalId:
          employeeProfile?.national_id ||
          formData.nationalId,

        phone:
          createdUser?.phone_number ||
          formData.phone,

        email:
          createdUser?.email ||
          formData.email,

        municipalityId:
          employeeProfile?.municipality_id ||
          Number(formData.municipalityId),

        hireDate:
          employeeProfile?.hire_date ||
          formData.hireDate,

        role:
          createdUser?.roles?.[0] ||
          formData.role,

        status:
          employeeProfile?.status ||
          formData.status,
      };

      // =================================================
      // إرسال الموظف الحقيقي للصفحة الأب
      // حتى يظهر مباشرة بجدول الموظفين
      // =================================================

      if (onAddEmployee) {
        onAddEmployee(newEmployee);
      }

      onClose();
    } catch (error) {
      console.error(
        "Register Employee Error:",
        error
      );

      // =================================================
      // عرض أخطاء Laravel 422
      // =================================================

      const apiErrors =
        error.response?.data?.errors;

      if (
        apiErrors &&
        typeof apiErrors === "object"
      ) {
        const formattedErrors = {};

        Object.entries(apiErrors).forEach(
          ([field, messages]) => {
            formattedErrors[field] =
              Array.isArray(messages)
                ? messages[0]
                : messages;
          }
        );

        setErrors(formattedErrors);
      }

      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "حدث خطأ أثناء إضافة الموظف"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================================
  // Classes
  // =====================================================

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500";

  const selectClass =
    "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-[#121b24] dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f1821]">

        {/* =====================================================
            Header
        ===================================================== */}

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
            disabled={isSubmitting}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#121b24] dark:text-slate-400 dark:hover:bg-[#17212b]"
            title="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        {/* =====================================================
            Form
        ===================================================== */}

        <form onSubmit={handleSubmit} className="p-6">

          {/* API Error */}

          {submitError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {submitError}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">

            {/* الاسم الكامل */}

            <div>
              <label
                htmlFor="fullName"
                className={labelClass}
              >
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
              <label
                htmlFor="nationalId"
                className={labelClass}
              >
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

            {/* الهاتف */}

            <div>
              <label
                htmlFor="phone"
                className={labelClass}
              >
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

            {/* البريد */}

            <div>
              <label
                htmlFor="email"
                className={labelClass}
              >
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

            {/* كلمة المرور */}

            <div>
              <label
                htmlFor="password"
                className={labelClass}
              >
                كلمة المرور
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور"
                className={inputClass}
              />

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* =================================================
                تأكيد كلمة المرور
                تم إضافته لحل خطأ:
                The password field confirmation does not match.
            ================================================= */}

            <div>
              <label
                htmlFor="password_confirmation"
                className={labelClass}
              >
                تأكيد كلمة المرور
              </label>

              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="أعد إدخال كلمة المرور"
                className={inputClass}
              />

              {errors.password_confirmation && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            {/* البلدية */}

            <div>
              <label
                htmlFor="municipalityId"
                className={labelClass}
              >
                البلدية
              </label>

              <select
                id="municipalityId"
                name="municipalityId"
                value={formData.municipalityId}
                onChange={handleChange}
                disabled={isLoadingMunicipalities}
                className={selectClass}
              >
                <option
                  value=""
                  className="dark:bg-[#121b24]"
                >
                  {isLoadingMunicipalities
                    ? "جاري تحميل البلديات..."
                    : "اختر البلدية"}
                </option>

                {municipalities.map((municipality) => (
                  <option
                    key={municipality.id}
                    value={municipality.id}
                    className="dark:bg-[#121b24]"
                  >
                    {municipality.name}
                  </option>
                ))}
              </select>

              {errors.municipalityId && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.municipalityId}
                </p>
              )}
            </div>

            {/* تاريخ التوظيف */}

            <div>
              <label
                htmlFor="hireDate"
                className={labelClass}
              >
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

            {/* الدور */}

            <div>
              <label
                htmlFor="role"
                className={labelClass}
              >
                الدور الوظيفي
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isLoadingRoles}
                className={selectClass}
              >
                <option
                  value=""
                  className="dark:bg-[#121b24]"
                >
                  {isLoadingRoles
                    ? "جاري تحميل الأدوار..."
                    : "اختر الدور الوظيفي"}
                </option>

                {roles.map((role) => (
                  <option
                    key={role.id}
                    value={role.name}
                    className="dark:bg-[#121b24]"
                  >
                    {role.name}
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
              <label
                htmlFor="status"
                className={labelClass}
              >
                الحالة
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={selectClass}
              >
                <option
                  value="active"
                  className="dark:bg-[#121b24]"
                >
                  active
                </option>

                <option
                  value="suspended"
                  className="dark:bg-[#121b24]"
                >
                  suspended
                </option>

                <option
                  value="retired"
                  className="dark:bg-[#121b24]"
                >
                  retired
                </option>
              </select>

              {errors.status && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.status}
                </p>
              )}
            </div>
          </div>

          {/* =====================================================
              Buttons
          ===================================================== */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-start dark:border-white/10">

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#121b24] dark:text-slate-200 dark:hover:bg-[#17212b]"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Plus size={18} />

                  إضافة الموظف
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployeeForm;