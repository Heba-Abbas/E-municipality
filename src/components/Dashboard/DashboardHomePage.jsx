import { dashboardStats } from '../../data/dashboardData'
import DashboardCharts from './DashboardCharts'
import DashboardTable from './DashboardTable'
import StatCard from './StatCard'
import { ChevronDown, Calendar, Download } from 'lucide-react'

function DashboardHomePage() {
  return (
    <div className="space-y-3 lg:space-y-4">
      {/* 1. كروت الإحصائيات */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardStats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      {/* 2. شريط الفلاتر والتصدير */}
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#101922] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)] lg:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          
          <div className="flex flex-wrap items-center gap-2">
            
            {/* القائمة المنسدلة (الكل) */}
            <button className="flex min-w-[190px] items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-white/5 dark:bg-[#121b23]/40 dark:text-slate-300 dark:hover:bg-white/5">
              <span>الكل</span>
              <ChevronDown className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
            </button>

            {/* من تاريخ */}
            <button className="flex min-w-[160px] items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-white/5 dark:bg-[#121b23]/40 dark:text-slate-300 dark:hover:bg-white/5">
              <Calendar className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
              <span>من تاريخ</span>
            </button>

            {/* إلى تاريخ */}
            <button className="flex min-w-[160px] items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-white/5 dark:bg-[#121b23]/40 dark:text-slate-300 dark:hover:bg-white/5">
              <Calendar className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
              <span>إلى تاريخ</span>
            </button>
            
            {/* زر التصدير */}
            <button className="flex min-w-[130px] items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20">
              <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
              <span>تصدير</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. المخططات والجدول */}
      <DashboardCharts />
      <DashboardTable />
    </div>
  )
}

export default DashboardHomePage