import { recentComplaints } from '../../data/dashboardData'

// ألوان الحالات المخصصة للوضع الفاتح والداكن لضمان تباين مريح للعين
const statusStyles = {
  مكتمل: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  'قيد المتابعة': 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  مفتوح: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300',
  'قيد المعالجة': 'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300'
}

function DashboardTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#101922] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
      
      {/* رأس الجدول وعنوانه */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">آخر الشكاوى</h2>
        <button className="rounded-lg border border-emerald-500/40 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-transparent dark:text-emerald-300 dark:hover:bg-emerald-500/10">
          عرض الكل
        </button>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-right text-xs text-slate-600 dark:text-slate-300">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 dark:border-white/5 dark:text-slate-400">
              <th className="px-3 py-2 font-medium">رقم الشكوى</th>
              <th className="px-3 py-2 font-medium">المنطقة</th>
              <th className="px-3 py-2 font-medium">الحالة</th>
              <th className="px-3 py-2 font-medium">تاريخ الإضافة</th>
              <th className="px-3 py-2 font-medium">تاريخ الإغلاق</th>
            </tr>
          </thead>
          <tbody>
            {recentComplaints.map((item) => (
              <tr 
                key={item.id} 
                className="border-b border-slate-100 hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/[0.02] transition-colors last:border-b-0"
              >
                <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{item.id}</td>
                <td className="px-3 py-3">{item.subject}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 font-medium ${statusStyles[item.status] || 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-3 py-3">{item.createdAt}</td>
                <td className="px-3 py-3">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default DashboardTable