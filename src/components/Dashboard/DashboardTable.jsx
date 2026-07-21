import { recentComplaints } from '../../data/dashboardData'

const statusStyles = {
  مكتمل: 'bg-emerald-500/20 text-emerald-300',
  'قيد المتابعة': 'bg-amber-500/20 text-amber-300',
  مفتوح: 'bg-sky-500/20 text-sky-300',
  'قيد المعالجة': 'bg-violet-500/20 text-violet-300'
}

function DashboardTable() {
  return (
    <section className="rounded-2xl border border-white/5 bg-[#101922] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-100">آخر الشكاوى</h2>
        <button className="rounded-lg border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-300 transition hover:bg-emerald-500/10">
          عرض الكل
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-right text-xs text-slate-300">
          <thead>
            <tr className="border-b border-white/5 text-slate-400">
              <th className="px-3 py-2 font-medium">رقم الشكوى</th>
              <th className="px-3 py-2 font-medium">المنطقة</th>
              <th className="px-3 py-2 font-medium">الحالة</th>
              <th className="px-3 py-2 font-medium">تاريخ الإضافة</th>
              <th className="px-3 py-2 font-medium">تاريخ الإغلاق</th>
            </tr>
          </thead>
          <tbody>
            {recentComplaints.map((item) => (
              <tr key={item.id} className="border-b border-white/5 last:border-b-0">
                <td className="px-3 py-3 text-slate-200">{item.id}</td>
                <td className="px-3 py-3">{item.subject}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 ${statusStyles[item.status] || 'bg-white/10 text-slate-300'}`}>
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