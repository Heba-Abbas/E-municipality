import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormHeader from './FormHeader'
import EmailInput from './EmailInput'
import Button from './Button'

function VerifyEmailFormSection() {
  const [formData, setFormData] = useState({ code: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();
  const validateForm = () => {
    const nextErrors = {}

    if (!formData.code.trim()) {
      nextErrors.code = 'الرمز مطلوب'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const email = localStorage.getItem("reset_email");

    const response = await axios.post(
      "http://127.0.0.1:8000/api/auth/verify-reset-otp",
      {
        email: email,
        otp: formData.code,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Verification Success:", response.data);

    // إذا احتجنا الإيميل بالخطوة التالية
    localStorage.setItem("verified_email", email);

    // الانتقال إلى صفحة إعادة تعيين كلمة السر
    navigate("/new-password");

  } catch (error) {
    console.error(error);

    if (error.response?.data?.errors) {
      setErrors({
        code: error.response.data.errors.otp || error.response.data.errors.code,
      });
    } else {
      alert(error.response?.data?.message || "رمز التحقق غير صحيح");
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="w-full lg:w-1/2 h-screen bg-white flex flex-col items-center justify-center px-4 py-8 lg:px-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <FormHeader title="تحقق من بريدك الإلكتروني" />

        <div className="mb-8">
          <EmailInput
            value={formData.code}
            onChange={(value) => setFormData({ code: value })}
            error={errors.code}
            label="اكتب الرمز"
            placeholder=""
          />
        </div>

        <Button type="submit" isLoading={isLoading} isDisabled={isLoading}>
          تأكيد
        </Button>
      </form>
    </div>
  )
}

export default VerifyEmailFormSection
