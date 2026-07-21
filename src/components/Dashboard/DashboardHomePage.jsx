import { dashboardStats } from '../../data/dashboardData'
import DashboardCharts from './DashboardCharts'
import DashboardTable from './DashboardTable'
import StatCard from './StatCard'
import { ChevronDown, Calendar, Download } from 'lucide-react'

function DashboardHomePage() {
  return (
    <div className="space-y-3 lg:space-y-4">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardStats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="rounded-2xl border border-white/5 bg-[#101922] p-3 shadow-[0_10px_24px_rgba(0,0,0,0.18)] lg:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          
          <div className="flex flex-wrap items-center gap-2">
            
            <button className="flex min-w-[190px] items-center justify-between gap-4 rounded-lg border border-white/5 bg-[#121b23]/40 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/5">
              <span>الكل</span>
              <ChevronDown className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
            </button>

            <button className="flex min-w-[160px] items-center  gap-4 rounded-lg border border-white/5 bg-[#121b23]/40 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/5">
              <Calendar className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
              <span>من تاريخ</span>
            </button>

            <button className="flex min-w-[160px] items-center  gap-4 rounded-lg border border-white/5 bg-[#121b23]/40 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/5">
              <Calendar className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
              <span>إلى تاريخ</span>
            </button>
            
            <button className="flex items-center min-w-[130px] gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20">
              <Download className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
              <span>تصدير</span>
            </button>
          </div>
        </div>
      </section>

      <DashboardCharts />
      <DashboardTable />
    </div>
  )
}

export default DashboardHomePage