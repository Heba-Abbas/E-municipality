import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { changeTemporaryPassword } from "../services/authApi";

function ChangeTemporaryPasswordPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // =====================================================
  // Change Input
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

    if (!formData.current_password.trim()) {
      newErrors.current_password =
        "كلمة المرور الحالية مطلوبة";
    }

    if (!formData.password.trim()) {
      newErrors.password =
        "كلمة المرور الجديدة مطلوبة";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "كلمة المرور يجب أن تكون 8 محارف على الأقل";
    }

    if (!formData.password_confirmation.trim()) {
      newErrors.password_confirmation =
        "تأكيد كلمة المرور مطلوب";
    } else if (
      formData.password !==
      formData.password_confirmation
    ) {
      newErrors.password_confirmation =
        "كلمة المرور غير متطابقة";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // Submit
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response =
        await changeTemporaryPassword(
          formData
        );

      console.log(
        "Change Password Response:",
        response
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "فشل تغيير كلمة المرور"
        );
      }

      // =================================================
      // انتهت إجبارية تغيير كلمة المرور
      // =================================================

      localStorage.setItem(
        "requires_password_change",
        "0"
      );

      localStorage.removeItem(
        "show_reset_button"
      );

      // =================================================
      // تحديث user إذا كان فيه الحقل
      // =================================================

      try {
        const rawUser =
          localStorage.getItem("user");

        if (rawUser) {
          const user = JSON.parse(rawUser);

          if (
            user &&
            typeof user === "object"
          ) {
            user.requires_password_change =
              false;

            localStorage.setItem(
              "user",
              JSON.stringify(user)
            );
            localStorage.removeItem(
  "show_reset_button"
);

window.dispatchEvent(
  new Event("passwordChanged")
);
          }
        }
      } catch (error) {
        console.error(
          "Failed to update local user:",
          error
        );
      }

      alert(
        "تم تغيير كلمة المرور بنجاح"
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Change Temporary Password Error:",
        error
      );

      // =================================================
      // Laravel 422
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
          "حدث خطأ أثناء تغيير كلمة المرور"
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

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-[#0b1219]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center justify-center">

        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#0f1821] sm:p-8">

          {/* Header */}

          <div className="mb-7 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <LockKeyhole
                size={26}
                strokeWidth={1.8}
              />
            </div>

            <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
              تغيير كلمة المرور
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              يجب تغيير كلمة المرور المؤقتة قبل استخدام النظام
            </p>

          </div>

          {/* Error */}

          {submitError && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>
                {submitError}
              </span>

            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Current Password */}

            <div>
              <label
                htmlFor="current_password"
                className={labelClass}
              >
                كلمة المرور الحالية
              </label>

              <input
                id="current_password"
                name="current_password"
                type="password"
                value={
                  formData.current_password
                }
                onChange={handleChange}
                placeholder="أدخل كلمة المرور المؤقتة"
                className={inputClass}
              />

              {errors.current_password && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.current_password}
                </p>
              )}
            </div>

            {/* New Password */}

            <div>
              <label
                htmlFor="password"
                className={labelClass}
              >
                كلمة المرور الجديدة
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور الجديدة"
                className={inputClass}
              />

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirmation */}

            <div>
              <label
                htmlFor="password_confirmation"
                className={labelClass}
              >
                تأكيد كلمة المرور الجديدة
              </label>

              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={
                  formData.password_confirmation
                }
                onChange={handleChange}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                className={inputClass}
              />

              {errors.password_confirmation && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            {/* Button */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  جاري تغيير كلمة المرور...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />

                  تغيير كلمة المرور
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangeTemporaryPasswordPage;