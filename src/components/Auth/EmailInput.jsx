import { useState } from 'react'
import { Mail } from 'lucide-react'

function EmailInput({
  value,
  onChange,
  error,
  label = 'اسم / البريد الالكتروني',
  placeholder = 'ادخل اسمك أو بريدك الالكتروني'
}) {
  const [isFocused, setIsFocused] = useState(false)

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
        {/* Mail Icon */}
        <Mail className="h-5 w-5 text-gray-400 ml-3" strokeWidth={1.5} />

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
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

export default EmailInput
