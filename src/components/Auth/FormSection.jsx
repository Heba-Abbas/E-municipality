import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "اسم المستخدم أو البريد الإلكتروني مطلوب";
    }

    if (!formData.password.trim()) {
      newErrors.password = "كلمة السر مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة السر يجب أن تكون 6 أحرف على الأقل";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login",
        {
          login: formData.email.trim(),
          password: formData.password,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login Success:", response.data);

      // الـ API يرجع البيانات داخل data
      const loginData = response.data.data;

      const token = loginData.token;
      const user = loginData.user;

      // حفظ التوكن
      localStorage.setItem("token", token);

      // حفظ بيانات المستخدم
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Token:", token);
      console.log("User:", user);

      // الانتقال إلى لوحة التحكم
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response:", error.response.data);

        // أخطاء Validation من Laravel
        if (error.response.status === 422) {
          setErrors(error.response.data.errors || {});
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