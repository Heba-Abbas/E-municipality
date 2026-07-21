import { NavLink } from 'react-router-dom'
import { sidebarItems } from '../../data/dashboardData'
import logo from '../../assets/logo.png'


import { 
  LayoutDashboard, 
  Users, 
  Newspaper, 
  Calendar, 
  FileText, 
  BarChart3,
  Menu
} from 'lucide-react'


const iconMap = {
  dashboard: LayoutDashboard,
  users: Users,
  news: Newspaper,
  events: Calendar,
  reports: FileText,
  departments: BarChart3,
}

function DashboardSidebar() {
  return (
    <aside className="w-full border-b border-white/5 bg-[#0c141b] lg:w-[228px] lg:border-b-0 lg:border-l lg:border-white/5">
      <div className="flex h-full flex-col px-3 py-3 lg:px-3 lg:py-4">
        
        
        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-3 lg:flex-col lg:justify-start lg:gap-4 lg:px-2 lg:py-4">
          <div className="flex items-center gap-3 lg:flex-col lg:gap-2">
            <img src={logo} alt="Municipality logo" className="h-25 w-25 object-contain opacity-80" />
          </div>

          <button type="button" className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden">
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

      
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
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                      : 'border-white/5 bg-[#121b23] text-slate-200 hover:bg-white/5'
                  ].join(' ')
                }
              >
                
                <span className={item.label === 'لوحة التحكم' ? 'text-emerald-400' : 'text-emerald-300/90'}>
                  {IconComponent && <IconComponent className="h-5 w-5" strokeWidth={1.8} />}
                </span>

                
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