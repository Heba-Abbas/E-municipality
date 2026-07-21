import { Loader } from 'lucide-react'

function Button({ 
  children, 
  onClick, 
  isLoading = false, 
  isDisabled = false, 
  variant = 'primary',
  type = 'button',
  className = ''
}) {
  const baseStyles = 'w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-green-900 hover:bg-green-800 active:bg-green-950 disabled:bg-gray-400 disabled:cursor-not-allowed',
    secondary: 'bg-gray-300 hover:bg-gray-400 text-gray-800 disabled:bg-gray-200',
    outline: 'border-2 border-green-900 text-green-900 hover:bg-green-50 disabled:border-gray-300 disabled:text-gray-400'
  }

  const isButtonDisabled = isDisabled || isLoading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isButtonDisabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading && <Loader className="h-5 w-5 animate-spin" />}
      {children}
    </button>
  )
}

export default Button
