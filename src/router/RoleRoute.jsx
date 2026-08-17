import { Navigate, useLocation } from 'react-router-dom'

import {
  getCurrentRole,
  getFirstAllowedRoute,
  canAccessRoute,
} from '../data/dashboardData'

function RoleRoute({ children }) {
  const location = useLocation()

  const role = getCurrentRole()

  /*
   * لا يوجد مستخدم
   */
  if (!role) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  /*
   * هل يملك صلاحية الوصول لهذا الـ URL؟
   */
  const allowed = canAccessRoute(
    role,
    location.pathname
  )

  /*
   * إذا الصفحة غير مسموحة:
   *
   * نرسله لأول صفحة مسموحة له
   */
  if (!allowed) {
    const firstRoute =
      getFirstAllowedRoute(role)

    /*
     * منع loop
     */
    if (
      location.pathname !== firstRoute
    ) {
      return (
        <Navigate
          to={firstRoute}
          replace
        />
      )
    }
  }

  return children
}

export default RoleRoute