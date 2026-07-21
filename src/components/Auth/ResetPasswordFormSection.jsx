import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import FormHeader from './FormHeader'
import EmailInput from './EmailInput'
import Button from './Button'

function ResetPasswordFormSection() {
  const [formData, setFormData] = useState({ email: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const validateForm = () => {
    const nextErrors = {}

    if (!formData.email.trim()) {
      nextErrors.email = 'البريد الالكتروني مطلوب'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
  event.preventDefault()

  if (!validateForm()) {
    return
  }

  setIsLoading(true)

  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/auth/forgot-password',
      {
        email: formData.email,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log(response.data)

    // نحفظ الإيميل إذا احتجناه في الصفحة التالية
    localStorage.setItem('reset_email', formData.email)

    // الانتقال لصفحة التحقق
    navigate('/verify-email')

  } catch (error) {
    console.error(error)

    if (error.response?.data?.errors) {
      setErrors(error.response.data.errors)
    } else {
      alert(error.response?.data?.message || 'حدث خطأ، حاول مرة أخرى')
    }
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="w-full lg:w-1/2 h-screen bg-white flex flex-col items-center justify-center px-4 py-8 lg:px-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <FormHeader title="إعادة تعيين كلمة السر" />

        <div className="mb-8">
          <EmailInput
            value={formData.email}
            onChange={(value) => setFormData({ email: value })}
            error={errors.email}
            label="البريد الالكتروني"
            placeholder="أدخل بريدك الالكتروني"
          />
        </div>

        <Button type="submit" isLoading={isLoading} isDisabled={isLoading}>
          تأكيد
        </Button>
      </form>
    </div>
  )
}

export default ResetPasswordFormSection
