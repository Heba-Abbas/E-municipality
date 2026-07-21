import LogoSection from './LogoSection'
import FormSection from './FormSection'

function LoginPage() {
  return (
    <div className="flex h-screen w-full bg-white" dir="rtl">
      {/* Logo Section - Left Side (Desktop Only) */}
      <LogoSection />

      {/* Form Section - Right Side / Full Width on Mobile */}
      <FormSection />
    </div>
  )
}

export default LoginPage
