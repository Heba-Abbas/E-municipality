import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import FormHeader from "./FormHeader";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import Button from "./Button";
import ForgotPasswordLink from "./ForgotPasswordLink";

function FormSection() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // Validation
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email =
        "اسم المستخدم أو البريد الإلكتروني مطلوب";
    }

    if (!formData.password.trim()) {
      newErrors.password = "كلمة السر مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "كلمة السر يجب أن تكون 6 أحرف على الأقل";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // Handle Submit
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await api.post(
        "/auth/login",
        {
          login: formData.email.trim(),
          password: formData.password,
        }
      );

      console.log("Login Success:", response.data);

      // =================================================
      // بيانات تسجيل الدخول
      // =================================================

      const loginData = response.data?.data;

      if (!loginData) {
        throw new Error(
          "استجابة تسجيل الدخول غير صحيحة"
        );
      }

      const token = loginData.token;
      const user = loginData.user;

      // =================================================
      // requires_password_change
      //
      // مهم:
      // هذه القيمة موجودة ضمن loginData حسب استجابة API
      // وليس بالضرورة ضمن user
      // =================================================

      const requiresPasswordChange =
        loginData.requires_password_change === true ||
        loginData.requires_password_change === 1 ||
        loginData.requires_password_change === "1";

      console.log(
        "Requires Password Change:",
        requiresPasswordChange
      );

      // =================================================
      // حفظ التوكن
      // =================================================

      localStorage.setItem("token", token);

      // =================================================
      // حفظ المستخدم
      // =================================================

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // =================================================
      // حفظ حالة تغيير كلمة المرور
      // =================================================

      localStorage.setItem(
        "requires_password_change",
        requiresPasswordChange ? "1" : "0"
      );

      // =================================================
      // تنظيف أي flag قديم
      // =================================================

      if (!requiresPasswordChange) {
        localStorage.removeItem(
          "show_reset_button"
        );
      }

      console.log("Token:", token);
      console.log("User:", user);
      console.log(
        "requires_password_change:",
        requiresPasswordChange
      );

      // =================================================
      // الانتقال إلى لوحة التحكم
      // =================================================

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        console.log(
          "Status:",
          error.response.status
        );

        console.log(
          "Response:",
          error.response.data
        );

        // Laravel Validation
        if (error.response.status === 422) {
          setErrors(
            error.response.data?.errors || {}
          );
        } else {
          alert(
            error.response.data?.message ||
              "فشل تسجيل الدخول"
          );
        }
      } else {
        alert("تعذر الاتصال بالخادم");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 h-screen bg-white flex flex-col items-center justify-center px-4 py-8 lg:px-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md"
      >
        <FormHeader />

        {/* Email Input */}
        <div className="mb-6">
          <EmailInput
            value={formData.email}
            onChange={(value) =>
              setFormData({
                ...formData,
                email: value,
              })
            }
            error={errors.email}
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <PasswordInput
            value={formData.password}
            onChange={(value) =>
              setFormData({
                ...formData,
                password: value,
              })
            }
            error={errors.password}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          تأكيد
        </Button>

        {/* Forgot Password */}
        <ForgotPasswordLink />
      </form>
    </div>
  );
}

export default FormSection;