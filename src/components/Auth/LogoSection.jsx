import logo from '../../assets/logo.png'

function LogoSection({ message = 'أهلا بكم، الرجاء تسجيل الدخول' }) {
  return (
    <div className="hidden lg:flex w-full lg:w-1/2 h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex-col items-center justify-start border-r-4 border-blue-400 px-4 py-14">
      {/* Welcome Text */}
      <div className="text-center mb-14 mt-6 max-w-xs">
        <p className="text-gray-600 text-sm leading-relaxed font-medium">
          {message}
        </p>
      </div>

      {/* Logo */}
      <div className="flex flex-1 items-start justify-center pt-4">
        <img 
          src={logo} 
          alt="Municipality Emblem" 
          className="w-[92%] max-w-[460px] aspect-square object-contain"
        />
      </div>
    </div>
  )
}

export default LogoSection
