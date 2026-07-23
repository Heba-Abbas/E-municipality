import { Outlet } from 'react-router-dom'
import DashboardSidebar from './DashboardSidebar'
import DashboardTopbar from './DashboardTopbar'

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 transition-colors duration-300 dark:bg-[#111a22] dark:text-slate-100" dir="rtl">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <DashboardSidebar />

        <main className="flex-1 px-3 py-3 lg:px-4 lg:py-4">
          <DashboardTopbar />
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout