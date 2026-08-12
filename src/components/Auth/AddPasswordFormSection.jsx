import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import FormHeader from "./FormHeader";
import PasswordInput from "./PasswordInput";
import Button from "./Button";

function AddPasswordFormSection() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.password.trim()) {
      nextErrors.password = "كلمة السر الجديدة مطلوبة";
    } else if (formData.password.length < 8) {
      nextErrors.password =
        "كلمة السر يجب أن تكون 8 أحرف على الأقل";
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword =
        "تأكيد كلمة السر مطلوب";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      nextErrors.confirmPassword =
        "كلمتا السر غير متطابقتين";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const email = localStorage.getItem("reset_email");
    const otp = localStorage.getItem("reset_otp");

    if (!email) {
      alert("لم يتم العثور على البريد الإلكتروني.");
      navigate("/reset-password");
      return;
    }

    if (!otp) {
      alert(
        "انتهت جلسة التحقق، يرجى إدخال رمز التحقق مرة أخرى."
      );
      navigate("/verify-email");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/reset-password",
        {
          email: email,
          otp: otp,
          password: formData.password,
          password_confirmation:
            formData.confirmPassword,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Reset Password Success:",
        response.data
      );

      if (response.data.success) {
        // حذف بيانات عملية إعادة التعيين
        localStorage.removeItem("reset_email");
        localStorage.removeItem("reset_otp");
        localStorage.removeItem("verified_email");

        alert(
          response.data.message ||
            "تم تغيير كلمة السر بنجاح"
        );

        // العودة إلى تسجيل الدخول
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "Reset Password Error:",
        error
      );

      if (error.response?.data?.errors) {
        const apiErrors =
          error.response.data.errors;

        setErrors({
          password:
            apiErrors.password?.[0] || "",
          confirmPassword:
            apiErrors.password_confirmation?.[0] ||
            apiErrors.confirmPassword?.[0] ||
            "",
        });

        // في حال كان الـ OTP غير صالح
        if (apiErrors.otp) {
          alert(apiErrors.otp[0]);
        }
      } else {
        alert(
          error.response?.data?.message ||
            "حدث خطأ أثناء تغيير كلمة السر"
        );
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
        <FormHeader title="إضافة كلمة سر جديدة" />

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
            label="كلمة السر الجديدة"
          />
        </div>

        <div className="mb-8">
          <PasswordInput
            value={formData.confirmPassword}
            onChange={(value) =>
              setFormData({
                ...formData,
                confirmPassword: value,
              })
            }
            error={errors.confirmPassword}
            label="تأكيد كلمة السر"
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          تأكيد
        </Button>
      </form>
    </div>
  );
}

export default AddPasswordFormSection;