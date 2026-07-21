import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function PasswordInput({
  value,
  onChange,
  error,
  label = 'كلمة السر',
  placeholder = '•••••••••'
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="w-full">
      {/* Label */}
      <label className="block text-right text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Input Field */}
      <div className={`relative flex items-center bg-gray-200 rounded-lg px-4 py-3 transition-all ${
        isFocused ? 'ring-2 ring-blue-400' : ''
      } ${error ? 'ring-2 ring-red-500' : ''}`}>
        {/* Eye Icon - Toggle Visibility */}
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="ml-3 focus:outline-none text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? (
            <Eye className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <EyeOff className="h-5 w-5" strokeWidth={1.5} />
          )}
        </button>

        {/* Input */}
        <input
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isVisible ? placeholder : '•••••••••'}
          className="flex-1 bg-transparent outline-none text-gray-700 text-sm placeholder-gray-400 text-right"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-right text-red-500 text-xs mt-2">
          {error}
        </p>
      )}
    </div>
  )
}

export default PasswordInput
