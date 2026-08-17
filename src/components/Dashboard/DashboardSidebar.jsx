import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import {
  getCurrentRole,
  getSidebarItemsByRole,
} from '../../data/dashboardData'

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
  Landmark,
  ClipboardList,
  AlertTriangle,
  LogOut,
  Loader2,
  ChevronDown,
  ChevronUp,
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
  municipalities: Landmark,
  logs: ClipboardList,
  complaints: AlertTriangle,
  departmentComplaints: ClipboardList,
}

function DashboardSidebar() {
  const { darkMode } = useTheme()

  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [openSections, setOpenSections] = useState({})

  const navigate = useNavigate()

  const logo = darkMode ? logoDark : logoLight

  /*
   * الدور الحقيقي القادم من:
   *
   * localStorage.user.roles
   *
   * مثال:
   *
   * {
   *   "roles": ["system_admin"]
   * }
   */
  const role = getCurrentRole()

  /*
   * القائمة المسموحة لهذا الدور فقط
   */
  const visibleSidebarItems = getSidebarItemsByRole(role)

  const toggleSection = (path) => {
    setOpenSections((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  const handleLogout = async () => {
    if (isLoggingOut) return

    try {
      setIsLoggingOut(true)

      const token = localStorage.getItem('token')

      await fetch(
        'http://127.0.0.1:8000/api/auth/logout',
        {
          method: 'POST',

          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      )
    } catch (error) {
      console.error('Logout Error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      navigate('/login', {
        replace: true,
      })

      setIsLoggingOut(false)
    }
  }

  return (
    <aside
      className="
        w-full
        border-b
        border-slate-200
        bg-white
        transition-colors
        duration-300

        dark:border-white/5
        dark:bg-[#0c141b]

        lg:w-[228px]
        lg:border-b-0
        lg:border-l
        lg:border-slate-200
        dark:lg:border-white/5

        lg:sticky
        lg:top-4
        lg:self-start
        lg:h-[calc(100vh-2rem)]
      "
    >
      <div
        className="
          flex
          h-full
          flex-col
          overflow-y-auto
          px-3
          py-3

          lg:px-3
          lg:py-4
        "
      >

        {/* =====================================================
            LOGO
        ===================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-emerald-500/20
            bg-emerald-50/60
            px-3
            py-3

            dark:border-emerald-500/15
            dark:bg-emerald-500/5

            lg:flex-col
            lg:justify-start
            lg:gap-4
            lg:px-2
            lg:py-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3

              lg:flex-col
              lg:gap-2
            "
          >
            <img
              src={logo}
              alt="Municipality logo"
              className="
                h-25
                w-25
                object-contain
                opacity-90
                dark:opacity-80
              "
            />
          </div>

          <button
            type="button"
            className="
              rounded-lg
              border
              border-slate-200
              p-2
              text-slate-600
              transition
              hover:bg-slate-100

              dark:border-white/10
              dark:text-slate-300
              dark:hover:bg-white/5

              lg:hidden
            "
          >
            <Menu
              className="h-5 w-5"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <nav
          className="
            mt-3
            flex
            gap-2
            overflow-x-auto
            pb-2

            lg:mt-6
            lg:flex-col
            lg:gap-2
            lg:overflow-visible
            lg:pb-0
          "
        >

          {visibleSidebarItems.map((item) => {
            const IconComponent = iconMap[item.icon]

            /*
             * =================================================
             * SERVICES
             * =================================================
             */

            if (
              Array.isArray(item.children) &&
              item.children.length > 0
            ) {
              const isOpen = !!openSections[item.path]

              return (
                <div
                  key={item.path}
                  className="w-full"
                >

                  {/* الخدمات */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(item.path)
                    }
                    className={[
                      'flex w-full min-w-[136px] items-center justify-between rounded-xl border px-3 py-3 text-sm font-medium transition-colors lg:min-w-0',

                      isOpen
                        ? 'border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'border-slate-200/80 bg-slate-50/80 text-slate-700 hover:bg-slate-100 dark:border-white/5 dark:bg-[#121b23] dark:text-slate-200 dark:hover:bg-white/5',
                    ].join(' ')}
                  >

                    <div className="flex items-center gap-3">

                      <span className="text-emerald-600/90 dark:text-emerald-300/90">

                        {IconComponent && (
                          <IconComponent
                            className="h-5 w-5"
                            strokeWidth={1.8}
                          />
                        )}

                      </span>

                      <span>
                        {item.label}
                      </span>

                    </div>

                    <span
                      className={[
                        'text-slate-400 transition-transform duration-200',

                        isOpen
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : '',
                      ].join(' ')}
                    >

                      {isOpen ? (
                        <ChevronUp
                          className="h-4 w-4"
                          strokeWidth={1.8}
                        />
                      ) : (
                        <ChevronDown
                          className="h-4 w-4"
                          strokeWidth={1.8}
                        />
                      )}

                    </span>

                  </button>

                  {/* =================================================
                      SERVICE CHILDREN
                  ================================================= */}

                  {isOpen && (
                    <div
                      className="
                        mt-1
                        flex
                        flex-col
                        gap-0.5
                        pr-2
                      "
                    >

                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            [
                              'group flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200',

                              isActive
                                ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white',
                            ].join(' ')
                          }
                        >

                          <span
                            className="
                              ml-2
                              h-1.5
                              w-1.5
                              shrink-0
                              rounded-full
                              bg-slate-300
                              transition-all
                              group-hover:bg-emerald-500

                              dark:bg-slate-600
                              dark:group-hover:bg-emerald-400
                            "
                          />

                          <span>
                            {child.label}
                          </span>

                        </NavLink>
                      ))}

                    </div>
                  )}

                </div>
              )
            }

            /*
             * =================================================
             * NORMAL ITEMS
             * =================================================
             */

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
                      : 'border-slate-200/80 bg-slate-50/80 text-slate-700 hover:bg-slate-100 dark:border-white/5 dark:bg-[#121b23] dark:text-slate-200 dark:hover:bg-white/5',
                  ].join(' ')
                }
              >

                <span
                  className="
                    text-emerald-600/90
                    dark:text-emerald-300/90
                  "
                >

                  {IconComponent && (
                    <IconComponent
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  )}

                </span>

                <span>
                  {item.label}
                </span>

              </NavLink>
            )
          })}

        </nav>

        {/* =====================================================
            LOGOUT
        ===================================================== */}

        <div className="mt-auto pt-4">

          <div
            className="
              mb-4
              border-t
              border-slate-200
              dark:border-white/10
            "
          />

          <div className="h-9" />

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-3
              py-3
              text-sm
              font-medium
              text-red-700
              transition-colors
              hover:bg-red-100

              disabled:cursor-not-allowed
              disabled:opacity-60

              dark:border-red-500/10
              dark:bg-red-500/5
              dark:text-red-300
              dark:hover:bg-red-500/10
            "
          >

            {isLoggingOut ? (
              <Loader2
                className="h-5 w-5 animate-spin"
                strokeWidth={1.8}
              />
            ) : (
              <LogOut
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            )}

            <span>
              {isLoggingOut
                ? 'جاري تسجيل الخروج...'
                : 'تسجيل الخروج'}
            </span>

          </button>

        </div>

      </div>
    </aside>
  )
}

export default DashboardSidebar