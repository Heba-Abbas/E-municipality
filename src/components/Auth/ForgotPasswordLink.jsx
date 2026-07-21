import { Link } from 'react-router-dom'

function ForgotPasswordLink({ to = '/forgot-password' }) {
  return (
    <div className="text-center mt-4">
      <Link
        to={to}
        className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors duration-200 focus:outline-none"
      >
        هل نسيت كلمة السر؟
      </Link>
    </div>
  )
}

export default ForgotPasswordLink
