function FormHeader({ title = 'تسجيل الدخول' }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 text-right">
        {title}
      </h1>
    </div>
  )
}

export default FormHeader
