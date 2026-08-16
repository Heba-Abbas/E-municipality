import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import FormHeader from "./FormHeader";
import EmailInput from "./EmailInput";
import Button from "./Button";

function VerifyEmailFormSection() {
  const [formData, setFormData] = useState({
    code: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const nextErrors = {};

    const code = formData.code.trim();

    if (!code) {
      nextErrors.code = "الرمز مطلوب";
    } else if (!/^\d{4}$/.test(code)) {
      nextErrors.code = "رمز التحقق يجب أن يتكون من 4 أرقام";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const email = localStorage.getItem("reset_email");

    if (!email) {
      alert("لم يتم العثور على البريد الإلكتروني");
      navigate("/reset-password");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const otp = formData.code.trim();

      const response = await api.post(
        "/auth/verify-reset-otp",
        {
          email: email,
          otp: otp,
        }
      );

      console.log("Verification Success:", response.data);

      if (response.data.success) {
        // حفظ البيانات لاستخدامها في صفحة تغيير كلمة السر
        localStorage.setItem("reset_email", email);
        localStorage.setItem("reset_otp", otp);

        // الانتقال إلى صفحة كلمة السر الجديدة
        navigate("/new-password");
      }
    } catch (error) {
      console.error("Verification Error:", error);

      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;

        setErrors({
          code:
            apiErrors.otp?.[0] ||
            apiErrors.code?.[0] ||
            "رمز التحقق غير صحيح",
        });
      } else {
        alert(
          error.response?.data?.message ||
            "رمز التحقق غير صحيح"
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
        <FormHeader title="تحقق من بريدك الإلكتروني" />

        <div className="mb-8">
          <EmailInput
            value={formData.code}
            onChange={(value) =>
              setFormData({
                code: value,
              })
            }
            error={errors.code}
            label="اكتب الرمز"
            placeholder="أدخل رمز التحقق المكون من 4 أرقام"
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

export default VerifyEmailFormSection;