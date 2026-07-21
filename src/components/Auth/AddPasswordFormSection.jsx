import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormHeader from './FormHeader'
import PasswordInput from './PasswordInput'
import Button from './Button'

function AddPasswordFormSection() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();
  const validateForm = () => {
    const nextErrors = {}

    if (!formData.password.trim()) {
      nextErrors.password = 'كلمة السر الجديدة مطلوبة'
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'تأكيد كلمة السر مطلوب'
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'كلمتا السر غير متطابقتين'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // TODO:
    // Connect Add Password API here.
    // Expected Request:
    // {
    //   password: string,
    //   confirmPassword: string
    // }
    //
    // Expected Success Response:
    // {
    //   message: string,
    //   success: boolean
    // }
    //
    // Expected Validation Error:
    // {
    //   message: string,
    //   errors?: {
    //     password?: string,
    //     confirmPassword?: string
    //   }
    // }

    setTimeout(() => {
      setIsLoading(false)
      console.log('Add password submitted:', formData)
    }, 1000)
  }

  return (
    <div className="w-full lg:w-1/2 h-screen bg-white flex flex-col items-center justify-center px-4 py-8 lg:px-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <FormHeader title="إضافة كلمة سر جديدة" />

        <div className="mb-6">
          <PasswordInput
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            error={errors.password}
            label="كلمة السر الجديدة"
          />
        </div>

        <div className="mb-8">
          <PasswordInput
            value={formData.confirmPassword}
            onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
            error={errors.confirmPassword}
            label="تأكيد كلمة السر"
          />
        </div>

        <Button type="submit" isLoading={isLoading} isDisabled={isLoading}>
          تأكيد
        </Button>
      </form>
    </div>
  )
}

export default AddPasswordFormSection