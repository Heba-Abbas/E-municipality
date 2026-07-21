import LogoSection from './LogoSection'
import AddPasswordFormSection from './AddPasswordFormSection'

function AddPasswordPage() {
  return (
    <div className="flex h-screen w-full bg-white" dir="rtl">
      <LogoSection message="نسيت كلمة السر" />
      <AddPasswordFormSection />
    </div>
  )
}

export default AddPasswordPage