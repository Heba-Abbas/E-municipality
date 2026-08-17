/*
|--------------------------------------------------------------------------
| Get logged in user
|--------------------------------------------------------------------------
*/

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user')

    if (!user) {
      return null
    }

    return JSON.parse(user)
  } catch (error) {
    console.error('Failed to parse logged in user:', error)
    return null
  }
}


/*
|--------------------------------------------------------------------------
| Get current role
|--------------------------------------------------------------------------
|
| Login response:
|
| data.user.roles = ["system_admin"]
|
*/

export const getCurrentRole = () => {
  const user = getCurrentUser()

  if (!user) {
    return null
  }

  // roles عبارة عن array
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    return user.roles[0]
  }

  return null
}


/*
|--------------------------------------------------------------------------
| Check role
|--------------------------------------------------------------------------
*/

export const hasRole = (role) => {
  const currentRole = getCurrentRole()

  return currentRole === role
}


/*
|--------------------------------------------------------------------------
| Check multiple roles
|--------------------------------------------------------------------------
*/

export const hasAnyRole = (roles = []) => {
  const currentRole = getCurrentRole()

  if (!currentRole) {
    return false
  }

  return roles.includes(currentRole)
}


/*
|--------------------------------------------------------------------------
| Filter items by role
|--------------------------------------------------------------------------
|
| يستخدم فقط إذا احتجناه بمكان آخر.
|
*/

export const filterItemsByRole = (items = [], role = getCurrentRole()) => {
  if (!role) {
    return []
  }

  return items
    .map((item) => {
      // عنده children
      if (Array.isArray(item.children)) {
        const visibleChildren = item.children.filter((child) =>
          child.allowedRoles?.includes(role)
        )

        if (visibleChildren.length === 0) {
          return null
        }

        return {
          ...item,
          children: visibleChildren,
        }
      }

      // عنصر عادي
      if (item.allowedRoles?.includes(role)) {
        return item
      }

      return null
    })
    .filter(Boolean)
}


/*
|--------------------------------------------------------------------------
| Dashboard permissions
|--------------------------------------------------------------------------
*/

export const canAccessDashboard = () => {
  return hasAnyRole([
    'mayor',
    'technical_office',
    'municipality_admin',
  ])
}


export const canViewDashboardCards = () => {
  return hasAnyRole([
    'mayor',
    'technical_office',
    'municipality_admin',
  ])
}


export const canViewDashboardPerDay = () => {
  return hasAnyRole([
    'mayor',
    'technical_office',
    'municipality_admin',
  ])
}


export const canViewDashboardDistribution = () => {
  return hasRole('technical_office')
}


export const canViewRecentComplaints = () => {
  return hasRole('technical_office')
}


export const canViewDashboardFilters = () => {
  return hasRole('technical_office')
}