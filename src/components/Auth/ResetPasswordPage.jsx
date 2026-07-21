import LogoSection from './LogoSection'
import ResetPasswordFormSection from './ResetPasswordFormSection'

function ResetPasswordPage() {
  return (
    <div className="flex h-screen w-full bg-white" dir="rtl">
      <LogoSection message="نسيت كلمة السر" />
      <ResetPasswordFormSection />
    </div>
  )
}

export default ResetPasswordPage
