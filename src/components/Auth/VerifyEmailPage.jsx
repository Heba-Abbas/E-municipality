import LogoSection from './LogoSection'
import VerifyEmailFormSection from './VerifyEmailFormSection'

function VerifyEmailPage() {
  return (
    <div className="flex h-screen w-full bg-white" dir="rtl">
      <LogoSection message="نسيت كلمة السر" />
      <VerifyEmailFormSection />
    </div>
  )
}

export default VerifyEmailPage
