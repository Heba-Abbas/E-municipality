import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import FormHeader from "./FormHeader";
import EmailInput from "./EmailInput";
import Button from "./Button";

function ResetPasswordFormSection() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "البريد الإلكتروني مطلوب";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const email = formData.email.trim();

      const response = await api.post(
        "/auth/forgot-password",
        {
          email: email,
        }
      );

      console.log("Forgot Password Response:", response.data);

      
      if (response.data.success) {
        localStorage.setItem("reset_email", email);

        navigate("/verify-email");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(
          error.response?.data?.message ||
            "حدث خطأ، حاول مرة أخرى"
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
        <FormHeader title="إعادة تعيين كلمة السر" />

        <div className="mb-8">
          <EmailInput
            value={formData.email}
            onChange={(value) =>
              setFormData({
                email: value,
              })
            }
            error={errors.email}
            label="البريد الإلكتروني"
            placeholder="أدخل بريدك الإلكتروني"
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

export default ResetPasswordFormSection;