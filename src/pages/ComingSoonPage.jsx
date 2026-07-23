function ComingSoonPage({ title }) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-right shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#101922] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">هذه الصفحة قيد التجهيز.</p>
    </div>
  )
}

export default ComingSoonPage