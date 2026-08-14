import { NavLink } from 'react-router-dom'
import { sidebarItems } from '../../data/dashboardData'
import { useTheme } from '../../context/ThemeContext'
import logoLight from '../../assets/logo dark mode 1.png'
import logoDark from '../../assets/logo light mode 1.png'

import { 
  LayoutDashboard, 
  Users, 
  Newspaper, 
  Calendar, 
  PanelsTopLeft,
  FileText, 
  BarChart3,
  Menu,
  Key,
  ClipboardList
} from 'lucide-react'

const iconMap = {
  dashboard: LayoutDashboard,
  users: Users,
  news: Newspaper,
  events: Calendar,
  reports: FileText,
  departments: BarChart3,
  services: PanelsTopLeft,
  roles: Key,
  logs: ClipboardList,
}

function DashboardSidebar() {
  const { darkMode } = useTheme()

  const logo = darkMode ? logoDark : logoLight

  return (
    <aside className="w-full border-b border-slate-200 bg-white transition-colors duration-300 dark:border-white/5 dark:bg-[#0c141b] lg:w-[228px] lg:border-b-0 lg:border-l lg:border-slate-200 dark:lg:border-white/5">
      <div className="flex h-full flex-col px-3 py-3 lg:px-3 lg:py-4">
        
        {/* صندوق اللوجو العلوي */}
        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-50/60 px-3 py-3 dark:border-emerald-500/15 dark:bg-emerald-500/5 lg:flex-col lg:justify-start lg:gap-4 lg:px-2 lg:py-4">
          <div className="flex items-center gap-3 lg:flex-col lg:gap-2">
            <img src={logo} alt="Municipality logo" className="h-25 w-25 object-contain opacity-90 dark:opacity-80" />
          </div>

          <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 lg:hidden">
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* روابط القائمة الجانبية */}
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:mt-6 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0">
          {sidebarItems.map((item) => {
            
            const IconComponent = iconMap[item.icon]

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  [
                    'flex min-w-[136px] items-center gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition-colors lg:min-w-0',
                    isActive
                      ? 'border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                      : 'border-slate-200/80 bg-slate-50/80 text-slate-700 hover:bg-slate-100 dark:border-white/5 dark:bg-[#121b23] dark:text-slate-200 dark:hover:bg-white/5'
                  ].join(' ')
                }
              >
                {/* لون الأيقونة */}
                <span className={item.label === 'لوحة التحكم' ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-600/90 dark:text-emerald-300/90'}>
                  {IconComponent && <IconComponent className="h-5 w-5" strokeWidth={1.8} />}
                </span>

                {/* نص العنصر */}
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default DashboardSidebar