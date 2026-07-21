import { useState } from 'react'
import FormHeader from './FormHeader'
import EmailInput from './EmailInput'
import PasswordInput from './PasswordInput'
import Button from './Button'
import ForgotPasswordLink from './ForgotPasswordLink'
import axios from "axios"
import { useNavigate } from "react-router-dom";

function FormSection() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate();
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'اسم المستخدم أو البريد الالكتروني مطلوب'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'كلمة السر مطلوبة'
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة السر يجب أن تكون 6 أحرف على الأقل'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Submit
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/auth/login",
      {
        email: formData.email,
        password: formData.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Login Success:", response.data);

    // حفظ التوكن
    localStorage.setItem("token", response.data.token);

    // حفظ بيانات المستخدم إذا كانت موجودة
    if (response.data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
    }

    // الانتقال إلى لوحة التحكم
    navigate("/dashboard");

  } catch (error) {
    console.error(error);

    if (error.response?.data?.errors) {
      setErrors(error.response.data.errors);
    } else {
      alert(error.response?.data?.message || "فشل تسجيل الدخول");
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="w-full lg:w-1/2 h-screen bg-white flex flex-col items-center justify-center px-4 py-8 lg:px-12">
      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md"
      >
        {/* Header */}
        <FormHeader />

        {/* Email Input */}
        <div className="mb-6">
          <EmailInput
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            error={errors.email}
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <PasswordInput
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
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

        {/* Forgot Password Link */}
        <ForgotPasswordLink />
      </form>
    </div>
  )
}

export default FormSection
